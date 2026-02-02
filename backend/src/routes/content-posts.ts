import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { CreateContentPostSchema } from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

// Type the router with user/session variables
const contentPostsRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
contentPostsRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// Helper to parse JSON engagement from content post
function parseContentPost(post: {
  id: string;
  personaId: string;
  platform: string;
  originalUrl: string | null;
  content: string | null;
  engagement: string | null;
  analyzedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...post,
    engagement: post.engagement ? JSON.parse(post.engagement) : null,
  };
}

// POST /api/content-posts - Add an existing post for analysis
contentPostsRouter.post("/", zValidator("json", CreateContentPostSchema), async (c) => {
  const user = c.get("user")!;
  const data = c.req.valid("json");

  // Verify persona belongs to user
  const persona = await prisma.persona.findFirst({
    where: { id: data.personaId, userId: user.id },
  });

  if (!persona) {
    return c.json({ error: { message: "Persona not found", code: "NOT_FOUND" } }, 404);
  }

  const post = await prisma.contentPost.create({
    data: {
      personaId: data.personaId,
      platform: data.platform,
      originalUrl: data.originalUrl,
      content: data.content,
      engagement: data.engagement ? JSON.stringify(data.engagement) : null,
    },
  });

  return c.json({ data: parseContentPost(post) });
});

// GET /api/content-posts - Get all analyzed posts
const QuerySchema = z.object({
  personaId: z.string().optional(),
});

contentPostsRouter.get("/", zValidator("query", QuerySchema), async (c) => {
  const user = c.get("user")!;
  const { personaId } = c.req.valid("query");

  // If personaId provided, verify it belongs to user
  if (personaId) {
    const persona = await prisma.persona.findFirst({
      where: { id: personaId, userId: user.id },
    });

    if (!persona) {
      return c.json({ error: { message: "Persona not found", code: "NOT_FOUND" } }, 404);
    }

    const posts = await prisma.contentPost.findMany({
      where: { personaId },
      orderBy: { createdAt: "desc" },
    });

    return c.json({ data: posts.map(parseContentPost) });
  }

  // Get all posts for all of user's personas
  const personas = await prisma.persona.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const personaIds = personas.map((p) => p.id);

  const posts = await prisma.contentPost.findMany({
    where: { personaId: { in: personaIds } },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: posts.map(parseContentPost) });
});

export { contentPostsRouter };
