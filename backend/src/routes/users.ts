import { Hono } from "hono";
import { prisma } from "../prisma";
import { auth } from "../auth";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

// Type the router with user/session variables
const usersRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
usersRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// GET /api/users/me/onboarding-status - Check onboarding progress
usersRouter.get("/me/onboarding-status", async (c) => {
  const user = c.get("user")!;

  // Check if user has any avatars
  const avatarCount = await prisma.avatar.count({
    where: { userId: user.id },
  });

  // Check if user has a persona
  const personaCount = await prisma.persona.count({
    where: { userId: user.id },
  });

  // Get connected platforms from accounts
  // Better Auth stores OAuth accounts here
  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    select: { providerId: true },
  });

  // Filter out credential provider (email/password)
  const connectedPlatforms = accounts
    .map((a) => a.providerId)
    .filter((p) => p !== "credential");

  return c.json({
    data: {
      hasAvatar: avatarCount > 0,
      hasPersona: personaCount > 0,
      connectedPlatforms,
    },
  });
});

export { usersRouter };
