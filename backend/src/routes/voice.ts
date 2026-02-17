import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../prisma";
import {
  cloneVoice,
  listVoices,
  textToSpeech,
  ElevenLabsError,
} from "../services/elevenlabs";
import { extractAudioFromVideo } from "../services/audio-extractor";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const voiceRouter = new Hono<{ Variables: AuthVariables }>();

// Require authentication for all voice routes
voiceRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      401
    );
  }
  await next();
});

// Video/audio MIME types for detection
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"];
const AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/webm", "audio/ogg", "audio/mp4", "audio/x-m4a"];

function isVideoFile(file: File): boolean {
  if (VIDEO_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".webm") || name.endsWith(".mkv");
}

function isAudioFile(file: File): boolean {
  if (AUDIO_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".m4a") || name.endsWith(".ogg");
}

// ============================================
// POST /api/voice/clone-from-media
// One-step voice cloning: upload video OR audio -> auto-extract -> clone
// ============================================
voiceRouter.post("/clone-from-media", async (c) => {
  const user = c.get("user")!;

  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return c.json(
      { error: { message: "A media file is required", code: "INVALID_INPUT" } },
      400
    );
  }

  // Find or create avatar
  let avatar = await prisma.avatar.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!avatar) {
    avatar = await prisma.avatar.create({
      data: {
        userId: user.id,
        name: "Main Avatar",
        status: "pending",
        voiceStatus: "processing",
      },
    });
  } else {
    await prisma.avatar.update({
      where: { id: avatar.id },
      data: { voiceStatus: "processing" },
    });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let audioBuffer: Buffer;

    if (isVideoFile(file as File)) {
      console.log(`[Voice] Extracting audio from video (${file.type}, ${fileBuffer.length} bytes)`);
      audioBuffer = await extractAudioFromVideo(fileBuffer);
      console.log(`[Voice] Audio extracted: ${audioBuffer.length} bytes`);
    } else if (isAudioFile(file as File) || file.type === "audio/webm") {
      // Direct audio file or browser recording
      console.log(`[Voice] Using audio directly (${file.type}, ${fileBuffer.length} bytes)`);
      audioBuffer = fileBuffer;
    } else {
      // Try to extract audio anyway - FFmpeg can handle many formats
      console.log(`[Voice] Unknown type ${file.type}, attempting audio extraction`);
      try {
        audioBuffer = await extractAudioFromVideo(fileBuffer);
      } catch {
        await prisma.avatar.update({
          where: { id: avatar.id },
          data: { voiceStatus: "failed" },
        });
        return c.json(
          { error: { message: "Unsupported file format. Please upload a video (MP4, MOV) or audio file (MP3, WAV).", code: "INVALID_FORMAT" } },
          400
        );
      }
    }

    // Clone the voice via ElevenLabs
    const voiceName = `${user.name || "Creator"}_clone_${Date.now()}`;
    console.log(`[Voice] Cloning voice as "${voiceName}"`);
    const { voiceId } = await cloneVoice(voiceName, [audioBuffer]);
    console.log(`[Voice] Voice cloned successfully: ${voiceId}`);

    // Save voiceId to avatar
    const updatedAvatar = await prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        voiceId,
        voiceStatus: "ready",
      },
    });

    return c.json({
      data: {
        voiceId,
        avatarId: updatedAvatar.id,
        voiceStatus: "ready",
      },
    });
  } catch (error) {
    console.error("[Voice] Clone from media failed:", error);

    // Mark avatar voice as failed
    await prisma.avatar.update({
      where: { id: avatar.id },
      data: { voiceStatus: "failed" },
    }).catch(() => {});

    if (error instanceof ElevenLabsError) {
      return c.json(
        { error: { message: error.message, code: error.code } },
        (error.statusCode as 400) ?? 500
      );
    }

    return c.json(
      { error: { message: error instanceof Error ? error.message : "Voice cloning failed", code: "CLONE_FAILED" } },
      500
    );
  }
});

// ============================================
// GET /api/voice/status - Get voice clone status for current user
// ============================================
voiceRouter.get("/status", async (c) => {
  const user = c.get("user")!;

  const avatar = await prisma.avatar.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!avatar) {
    return c.json({
      data: { voiceStatus: "none", voiceId: null },
    });
  }

  return c.json({
    data: {
      voiceStatus: avatar.voiceStatus,
      voiceId: avatar.voiceId,
      avatarId: avatar.id,
    },
  });
});

// ============================================
// POST /api/voice - Clone a voice from audio (legacy)
// ============================================
voiceRouter.post("/", async (c) => {
  const user = c.get("user")!;

  const formData = await c.req.formData();
  const name = formData.get("name");
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return c.json(
      { error: { message: "name is required", code: "INVALID_INPUT" } },
      400
    );
  }

  const files = formData.getAll("files");
  if (files.length === 0) {
    return c.json(
      {
        error: {
          message: "At least one audio file is required",
          code: "INVALID_INPUT",
        },
      },
      400
    );
  }

  // Convert File/Blob objects to Buffers
  const audioBuffers: Buffer[] = [];
  for (const file of files) {
    if (typeof file === "string") {
      return c.json(
        { error: { message: "Invalid file upload", code: "INVALID_INPUT" } },
        400
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    audioBuffers.push(Buffer.from(arrayBuffer));
  }

  try {
    const { voiceId } = await cloneVoice(name.trim(), audioBuffers);

    const avatar = await prisma.avatar.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (avatar) {
      await prisma.avatar.update({
        where: { id: avatar.id },
        data: { voiceId, voiceStatus: "ready" },
      });
    }

    return c.json({ data: { voiceId } });
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      return c.json(
        { error: { message: error.message, code: error.code } },
        (error.statusCode as 400) ?? 500
      );
    }
    throw error;
  }
});

// ============================================
// GET /api/voice - List available voices
// ============================================
voiceRouter.get("/", async (c) => {
  try {
    const voices = await listVoices();
    return c.json({ data: voices });
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      return c.json(
        { error: { message: error.message, code: error.code } },
        (error.statusCode as 400) ?? 500
      );
    }
    throw error;
  }
});

// ============================================
// POST /api/voice/tts - Text to speech
// ============================================
const TtsRequestSchema = z.object({
  text: z.string().min(1, "text is required"),
  voiceId: z.string().min(1, "voiceId is required"),
});

voiceRouter.post("/tts", zValidator("json", TtsRequestSchema), async (c) => {
  const { text, voiceId } = c.req.valid("json");

  try {
    const audioBuffer = await textToSpeech(voiceId, text);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.length),
      },
    });
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      return c.json(
        { error: { message: error.message, code: error.code } },
        (error.statusCode as 400) ?? 500
      );
    }
    throw error;
  }
});

export { voiceRouter };
