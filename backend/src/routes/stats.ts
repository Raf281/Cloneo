import { Hono } from "hono";
import { prisma } from "../prisma";
import { auth } from "../auth";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const statsRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
statsRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// GET /api/stats/content - Get content statistics
statsRouter.get("/content", async (c) => {
  const user = c.get("user")!;

  // Calculate start of this week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Get count of content created this week
  const thisWeek = await prisma.generatedContent.count({
    where: {
      userId: user.id,
      createdAt: { gte: startOfWeek },
    },
  });

  // Get count of content pending review
  const pendingReview = await prisma.generatedContent.count({
    where: {
      userId: user.id,
      status: "pending_review",
    },
  });

  // Get count of published content
  const published = await prisma.generatedContent.count({
    where: {
      userId: user.id,
      status: "published",
    },
  });

  // Get count of scheduled content
  const scheduled = await prisma.generatedContent.count({
    where: {
      userId: user.id,
      status: "scheduled",
    },
  });

  return c.json({
    data: {
      thisWeek,
      pendingReview,
      published,
      scheduled,
    },
  });
});

export { statsRouter };
