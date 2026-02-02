import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { auth } from "../auth";
import {
  CreateAvatarSchema,
  AvatarStatusSchema,
  AvatarMediaTypeSchema,
} from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

// Type the router with user/session variables
const avatarsRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
avatarsRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// POST /api/avatars - Create a new avatar
avatarsRouter.post("/", zValidator("json", CreateAvatarSchema), async (c) => {
  const user = c.get("user")!;
  const { name } = c.req.valid("json");

  const avatar = await prisma.avatar.create({
    data: {
      userId: user.id,
      name,
      status: "pending",
    },
  });

  return c.json({ data: avatar });
});

// GET /api/avatars - Get all avatars for current user
avatarsRouter.get("/", async (c) => {
  const user = c.get("user")!;

  const avatars = await prisma.avatar.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: avatars });
});

// POST /api/avatars/:id/media - Add media to avatar
const AddMediaSchema = z.object({
  type: AvatarMediaTypeSchema,
  url: z.string().url(),
});

avatarsRouter.post("/:id/media", zValidator("json", AddMediaSchema), async (c) => {
  const user = c.get("user")!;
  const avatarId = c.req.param("id");
  const { type, url } = c.req.valid("json");

  // Verify avatar belongs to user
  const avatar = await prisma.avatar.findFirst({
    where: { id: avatarId, userId: user.id },
  });

  if (!avatar) {
    return c.json({ error: { message: "Avatar not found", code: "NOT_FOUND" } }, 404);
  }

  const media = await prisma.avatarMedia.create({
    data: {
      avatarId,
      type,
      url,
      status: "uploaded",
    },
  });

  return c.json({ data: media });
});

// PATCH /api/avatars/:id/status - Update avatar status
const UpdateStatusSchema = z.object({
  status: AvatarStatusSchema,
});

avatarsRouter.patch("/:id/status", zValidator("json", UpdateStatusSchema), async (c) => {
  const user = c.get("user")!;
  const avatarId = c.req.param("id");
  const { status } = c.req.valid("json");

  // Verify avatar belongs to user
  const existing = await prisma.avatar.findFirst({
    where: { id: avatarId, userId: user.id },
  });

  if (!existing) {
    return c.json({ error: { message: "Avatar not found", code: "NOT_FOUND" } }, 404);
  }

  const avatar = await prisma.avatar.update({
    where: { id: avatarId },
    data: { status },
  });

  return c.json({ data: avatar });
});

export { avatarsRouter };
