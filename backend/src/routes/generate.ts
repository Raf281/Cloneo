import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { GenerateContentRequestSchema } from "../types";
import { generateScript } from "../services/openai";
import { textToVideo } from "../services/kling";
import type { ScriptPersona } from "../services/openai";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const generateRouter = new Hono<{ Variables: AuthVariables }>();

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
  zValidator("json", GenerateContentRequestSchema),
  async (c) => {
    const user = c.get("user")!;
    const { platform, topic, tone, generateVideo, videoPrompt } = c.req.valid("json");

    // Get user's persona for content style
    const persona = await prisma.persona.findFirst({
      where: { userId: user.id },
    });

    // Get user's ready avatar
    const avatar = await prisma.avatar.findFirst({
      where: { userId: user.id, status: "ready" },
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
        status: "draft",
        videoTaskId,
        videoStatus,
      },
    });

    return c.json({ data: content });
  }
);

export { generateRouter };
