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

// ============================================
// POST /api/voice - Clone a voice from audio
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

    // Save voiceId to the user's first avatar (or the most recently created one)
    const avatar = await prisma.avatar.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (avatar) {
      await prisma.avatar.update({
        where: { id: avatar.id },
        data: { voiceId },
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
