import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { CreatePersonaSchema, UpdatePersonaSchema } from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

// Type the router with user/session variables
const personasRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
personasRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// Helper to parse JSON arrays from persona
function parsePersona(persona: {
  id: string;
  userId: string;
  bio: string | null;
  topics: string | null;
  style: string | null;
  catchphrases: string | null;
  targetAudience: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...persona,
    topics: persona.topics ? JSON.parse(persona.topics) : null,
    catchphrases: persona.catchphrases ? JSON.parse(persona.catchphrases) : null,
  };
}

// POST /api/personas - Create or update user's persona
personasRouter.post("/", zValidator("json", CreatePersonaSchema), async (c) => {
  const user = c.get("user")!;
  const data = c.req.valid("json");

  // Check if user already has a persona
  const existing = await prisma.persona.findFirst({
    where: { userId: user.id },
  });

  if (existing) {
    // Update existing persona
    const persona = await prisma.persona.update({
      where: { id: existing.id },
      data: {
        bio: data.bio ?? existing.bio,
        topics: data.topics ? JSON.stringify(data.topics) : existing.topics,
        style: data.style ?? existing.style,
        catchphrases: data.catchphrases ? JSON.stringify(data.catchphrases) : existing.catchphrases,
        targetAudience: data.targetAudience ?? existing.targetAudience,
      },
    });
    return c.json({ data: parsePersona(persona) });
  }

  // Create new persona
  const persona = await prisma.persona.create({
    data: {
      userId: user.id,
      bio: data.bio,
      topics: data.topics ? JSON.stringify(data.topics) : null,
      style: data.style,
      catchphrases: data.catchphrases ? JSON.stringify(data.catchphrases) : null,
      targetAudience: data.targetAudience,
    },
  });

  return c.json({ data: parsePersona(persona) });
});

// GET /api/personas - Get current user's persona
personasRouter.get("/", async (c) => {
  const user = c.get("user")!;

  const persona = await prisma.persona.findFirst({
    where: { userId: user.id },
  });

  if (!persona) {
    return c.json({ data: null });
  }

  return c.json({ data: parsePersona(persona) });
});

// PATCH /api/personas/:id - Update persona
personasRouter.patch("/:id", zValidator("json", UpdatePersonaSchema), async (c) => {
  const user = c.get("user")!;
  const personaId = c.req.param("id");
  const data = c.req.valid("json");

  // Verify persona belongs to user
  const existing = await prisma.persona.findFirst({
    where: { id: personaId, userId: user.id },
  });

  if (!existing) {
    return c.json({ error: { message: "Persona not found", code: "NOT_FOUND" } }, 404);
  }

  const persona = await prisma.persona.update({
    where: { id: personaId },
    data: {
      bio: data.bio ?? existing.bio,
      topics: data.topics ? JSON.stringify(data.topics) : existing.topics,
      style: data.style ?? existing.style,
      catchphrases: data.catchphrases ? JSON.stringify(data.catchphrases) : existing.catchphrases,
      targetAudience: data.targetAudience ?? existing.targetAudience,
    },
  });

  return c.json({ data: parsePersona(persona) });
});

export { personasRouter };
