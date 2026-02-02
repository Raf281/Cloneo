import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { GenerateContentRequestSchema } from "../types";

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

// Platform-specific configurations
const platformConfigs = {
  instagram_reel: {
    name: "Instagram Reel",
    maxLength: 2200,
    videoFormat: "vertical 9:16",
    duration: "15-90 seconds",
  },
  tiktok: {
    name: "TikTok",
    maxLength: 4000,
    videoFormat: "vertical 9:16",
    duration: "15-180 seconds",
  },
  x_post: {
    name: "X Post",
    maxLength: 280,
    videoFormat: null,
    duration: null,
  },
};

// Tone prompts for content generation
const tonePrompts = {
  motivierend: "inspirational and motivating, energetic and encouraging",
  informativ: "educational and informative, clear and factual",
  unterhaltsam: "entertaining and engaging, fun and light-hearted",
  provokant: "thought-provoking and bold, challenging common assumptions",
};

// POST /api/generate - Generate new content using AI
generateRouter.post(
  "/",
  zValidator("json", GenerateContentRequestSchema),
  async (c) => {
    const user = c.get("user")!;
    const { platform, topic, tone } = c.req.valid("json");

    // Get user's persona for content style
    const persona = await prisma.persona.findFirst({
      where: { userId: user.id },
    });

    // Get user's ready avatar
    const avatar = await prisma.avatar.findFirst({
      where: { userId: user.id, status: "ready" },
    });

    // Get platform config
    const platformConfig = platformConfigs[platform];

    // Build the prompt for AI generation
    const toneDescription = tone ? tonePrompts[tone] : "natural and authentic";

    // Generate script based on persona and platform
    let script = "";

    if (platform === "x_post") {
      // Generate text-only content for X
      script = generateTextContent({
        persona,
        topic,
        toneDescription,
        maxLength: platformConfig.maxLength,
      });
    } else {
      // Generate video script for Instagram/TikTok
      script = generateVideoScript({
        persona,
        topic,
        toneDescription,
        platform: platformConfig.name,
        duration: platformConfig.duration || "30 seconds",
      });
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
      },
    });

    return c.json({ data: content });
  }
);

// Helper function to generate text content (placeholder for AI integration)
function generateTextContent({
  persona,
  topic,
  toneDescription,
  maxLength,
}: {
  persona: { bio?: string | null; topics?: string | null; style?: string | null; catchphrases?: string | null } | null;
  topic?: string;
  toneDescription: string;
  maxLength: number;
}): string {
  // Parse persona data
  const topics = persona?.topics ? JSON.parse(persona.topics) as string[] : [];
  const catchphrases = persona?.catchphrases ? JSON.parse(persona.catchphrases) as string[] : [];
  const style = persona?.style || "conversational";

  // This is a placeholder - in production, this would call OpenAI/Claude API
  // For now, generate a template-based script
  const firstTopic = topics[0];
  const selectedTopic: string = topic || firstTopic || "success mindset";
  const randomCatchphrase = catchphrases[Math.floor(Math.random() * catchphrases.length)];
  const catchphrase = randomCatchphrase || "";

  const templates: string[] = [
    `${selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)} ist nicht nur ein Ziel - es ist eine Lebensweise. ${catchphrase}`,
    `Hier ist die Wahrheit uber ${selectedTopic}: Es geht nicht darum, perfekt zu sein. Es geht darum, jeden Tag besser zu werden. ${catchphrase}`,
    `Was die meisten Menschen uber ${selectedTopic} nicht verstehen: Der Weg ist das Ziel. ${catchphrase}`,
  ];

  let script: string = templates[Math.floor(Math.random() * templates.length)] as string;

  // Truncate if needed
  if (script.length > maxLength) {
    script = script.substring(0, maxLength - 3) + "...";
  }

  return script;
}

// Helper function to generate video script (placeholder for AI integration)
function generateVideoScript({
  persona,
  topic,
  toneDescription,
  platform,
  duration,
}: {
  persona: { bio?: string | null; topics?: string | null; style?: string | null; catchphrases?: string | null } | null;
  topic?: string;
  toneDescription: string;
  platform: string;
  duration: string;
}): string {
  // Parse persona data
  const topics = persona?.topics ? JSON.parse(persona.topics) as string[] : [];
  const catchphrases = persona?.catchphrases ? JSON.parse(persona.catchphrases) as string[] : [];
  const bio = persona?.bio || "";

  // This is a placeholder - in production, this would call OpenAI/Claude API
  const selectedTopic = topic || (topics.length > 0 ? topics[0] : "personal growth");
  const catchphrase = catchphrases.length > 0 ? `\n\n"${catchphrases[0]}"` : "";

  const script = `[${platform} Video Script - ${duration}]

HOOK (0-3 Sekunden):
"Willst du wissen, was ${selectedTopic} wirklich bedeutet?"

HAUPTTEIL (3-25 Sekunden):
"Die meisten Menschen denken, ${selectedTopic} sei kompliziert.
Aber hier ist das Geheimnis:
Es beginnt mit einer einzigen Entscheidung.
Der Entscheidung, heute anzufangen - nicht morgen."

CALL-TO-ACTION:
"Folge mir fur mehr Content wie diesen.
Und kommentiere: Was ist DEIN erster Schritt?"${catchphrase}

---
Ton: ${toneDescription}
Zielgruppe: ${bio ? `Passend zu: ${bio}` : "Allgemeines Publikum"}`;

  return script;
}

export { generateRouter };
