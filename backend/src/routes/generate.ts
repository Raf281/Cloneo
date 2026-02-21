import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { GenerateContentRequestSchema } from "../types";
import { generateScript } from "../services/openai";
import { textToVideo } from "../services/kling";
import { textToSpeech } from "../services/elevenlabs";
import type { ScriptPersona } from "../services/openai";
import { randomUUID } from "crypto";
import { join } from "path";
import { mkdir } from "fs/promises";
import { generateRateLimit } from "../middleware/rate-limit";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const generateRouter = new Hono<{ Variables: AuthVariables }>();

// Audio files storage directory
const AUDIO_DIR = join(import.meta.dir, "../../uploads/audio");

// Ensure audio directory exists
mkdir(AUDIO_DIR, { recursive: true }).catch(() => {});

// Apply auth middleware to all routes - require authentication
generateRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// POST /api/generate - Generate new content using AI
generateRouter.post(
  "/",
  generateRateLimit,
  zValidator("json", GenerateContentRequestSchema),
  async (c) => {
    const user = c.get("user")!;
    const { platform, topic, tone, generateVideo, videoPrompt } = c.req.valid("json");

    // Get user's persona for content style
    const persona = await prisma.persona.findFirst({
      where: { userId: user.id },
    });

    // Get user's ready avatar (with voice info)
    const avatar = await prisma.avatar.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Parse persona fields from Prisma (topics and catchphrases are JSON strings in DB)
    const scriptPersona: ScriptPersona = {
      bio: persona?.bio ?? null,
      topics: persona?.topics ? (JSON.parse(persona.topics) as string[]) : null,
      style: persona?.style ?? null,
      catchphrases: persona?.catchphrases
        ? (JSON.parse(persona.catchphrases) as string[])
        : null,
      targetAudience: persona?.targetAudience ?? null,
    };

    let script: string;

    try {
      script = await generateScript({
        persona: scriptPersona,
        platform,
        topic: topic ?? undefined,
        tone: tone ?? undefined,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Script generation failed";
      return c.json(
        { error: { message, code: "GENERATION_FAILED" } },
        500
      );
    }

    const isVideoContent = platform !== "x_post";
    let videoTaskId: string | null = null;
    let videoStatus: string | null = null;
    let audioUrl: string | null = null;

    // Generate TTS voiceover if user has a cloned voice and it's video content
    if (isVideoContent && avatar?.voiceId && avatar.voiceStatus === "ready") {
      try {
        // Strip formatting markers from script for TTS
        const cleanScript = script
          .replace(/^(HOOK|HAUPTTEIL|CTA):\s*/gm, "")
          .replace(/\[.*?\]/g, "")
          .trim();

        console.log(`[Generate] Generating TTS with voice ${avatar.voiceId}`);
        const audioBuffer = await textToSpeech(avatar.voiceId, cleanScript);

        // Save audio file
        const audioFileName = `${randomUUID()}.mp3`;
        const audioFilePath = join(AUDIO_DIR, audioFileName);
        await Bun.write(audioFilePath, audioBuffer);

        // Build the audio URL (served via static files route)
        audioUrl = `/api/uploads/audio/${audioFileName}`;
        console.log(`[Generate] TTS audio saved: ${audioUrl} (${audioBuffer.length} bytes)`);
      } catch (err) {
        // Log but don't fail - script was generated successfully
        console.error("[Generate] TTS generation failed:", err);
      }
    }

    // Auto-start video generation if requested and it's a video platform
    if (generateVideo && isVideoContent) {
      try {
        // Use custom video prompt or generate from script
        const prompt = videoPrompt || `Create a dynamic social media video: ${script.substring(0, 500)}`;
        const result = await textToVideo(prompt, {
          duration: 5,
          aspectRatio: "9:16", // Vertical for Reels/TikTok
          mode: "std",
        });
        videoTaskId = result.taskId;
        videoStatus = "pending";
        console.log(`[Generate] Video generation started, taskId: ${videoTaskId}`);
      } catch (err) {
        // Log but don't fail - script was generated successfully
        console.error("[Generate] Video generation failed to start:", err);
        videoStatus = "failed";
      }
    }

    // Create the generated content record
    const content = await prisma.generatedContent.create({
      data: {
        userId: user.id,
        avatarId: avatar?.id || null,
        type: platform === "x_post" ? "text" : "video",
        platform,
        script,
        audioUrl,
        status: "draft",
        videoTaskId,
        videoStatus,
      },
    });

    return c.json({ data: content });
  }
);

export { generateRouter };
