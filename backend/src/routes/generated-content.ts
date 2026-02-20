import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import {
  CreateGeneratedContentRequestSchema,
  GeneratedContentQuerySchema,
  UpdateGeneratedContentSchema,
  ApproveContentSchema,
  RejectContentSchema,
  ScheduleContentSchema,
} from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const generatedContentRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
generatedContentRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: { message: "Unauthorized", code: "UNAUTHORIZED" } }, 401);
  }
  await next();
});

// POST /api/generated-content - Create new generated content
generatedContentRouter.post(
  "/",
  zValidator("json", CreateGeneratedContentRequestSchema),
  async (c) => {
    const user = c.get("user")!;
    const { avatarId, type, platform, script, videoUrl } = c.req.valid("json");

    // Verify avatar belongs to user if provided
    if (avatarId) {
      const avatar = await prisma.avatar.findFirst({
        where: { id: avatarId, userId: user.id },
      });
      if (!avatar) {
        return c.json(
          { error: { message: "Avatar not found", code: "NOT_FOUND" } },
          404
        );
      }
    }

    const content = await prisma.generatedContent.create({
      data: {
        userId: user.id,
        avatarId: avatarId || null,
        type,
        platform,
        script: script || null,
        videoUrl: videoUrl || null,
        status: "draft",
      },
    });

    return c.json({ data: content });
  }
);

// GET /api/generated-content - Get all generated content for user with filtering and pagination
generatedContentRouter.get(
  "/",
  zValidator("query", GeneratedContentQuerySchema),
  async (c) => {
    const user = c.get("user")!;
    const { status, platform, type, page, limit } = c.req.valid("query");

    // Build where clause
    const where: {
      userId: string;
      status?: string;
      platform?: string;
      type?: string;
    } = { userId: user.id };

    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (type) where.type = type;

    // Get total count
    const total = await prisma.generatedContent.count({ where });

    // Get paginated results
    const skip = (page - 1) * limit;
    const contents = await prisma.generatedContent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return c.json({
      data: contents,
      pagination: {
        total,
        page,
        limit,
      },
    });
  }
);

// GET /api/generated-content/:id - Get single content item
generatedContentRouter.get("/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  const content = await prisma.generatedContent.findFirst({
    where: { id, userId: user.id },
  });

  if (!content) {
    return c.json(
      { error: { message: "Content not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: content });
});

// PATCH /api/generated-content/:id - Update content
generatedContentRouter.patch(
  "/:id",
  zValidator("json", UpdateGeneratedContentSchema),
  async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const updates = c.req.valid("json");

    // Verify content belongs to user
    const existing = await prisma.generatedContent.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return c.json(
        { error: { message: "Content not found", code: "NOT_FOUND" } },
        404
      );
    }

    const content = await prisma.generatedContent.update({
      where: { id },
      data: {
        ...(updates.script !== undefined && { script: updates.script }),
        ...(updates.videoUrl !== undefined && { videoUrl: updates.videoUrl }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.scheduledFor !== undefined && {
          scheduledFor: new Date(updates.scheduledFor),
        }),
      },
    });

    return c.json({ data: content });
  }
);

// DELETE /api/generated-content/:id - Delete content
generatedContentRouter.delete("/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  // Verify content belongs to user
  const existing = await prisma.generatedContent.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return c.json(
      { error: { message: "Content not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.generatedContent.delete({ where: { id } });

  return c.json({ data: { success: true } });
});

// ============================================
// Content Actions
// ============================================

// POST /api/generated-content/:id/approve - Approve content for publishing
generatedContentRouter.post(
  "/:id/approve",
  zValidator("json", ApproveContentSchema),
  async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const { scheduledFor } = c.req.valid("json");

    // Verify content belongs to user
    const existing = await prisma.generatedContent.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return c.json(
        { error: { message: "Content not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Set status to "approved" or "scheduled" if datetime provided
    const newStatus = scheduledFor ? "scheduled" : "approved";

    const content = await prisma.generatedContent.update({
      where: { id },
      data: {
        status: newStatus,
        ...(scheduledFor && { scheduledFor: new Date(scheduledFor) }),
      },
    });

    return c.json({ data: content });
  }
);

// POST /api/generated-content/:id/reject - Reject content
generatedContentRouter.post(
  "/:id/reject",
  zValidator("json", RejectContentSchema),
  async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    // reason is accepted but currently not stored (could be added to schema later)
    const { reason: _reason } = c.req.valid("json");

    // Verify content belongs to user
    const existing = await prisma.generatedContent.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return c.json(
        { error: { message: "Content not found", code: "NOT_FOUND" } },
        404
      );
    }

    const content = await prisma.generatedContent.update({
      where: { id },
      data: { status: "rejected" },
    });

    return c.json({ data: content });
  }
);

// POST /api/generated-content/:id/publish - Mark as published
generatedContentRouter.post("/:id/publish", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  // Verify content belongs to user
  const existing = await prisma.generatedContent.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return c.json(
      { error: { message: "Content not found", code: "NOT_FOUND" } },
      404
    );
  }

  const content = await prisma.generatedContent.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
    },
  });

  return c.json({ data: content });
});

// PUT /api/generated-content/:id/schedule - Schedule content for a specific date/time
generatedContentRouter.put(
  "/:id/schedule",
  zValidator("json", ScheduleContentSchema),
  async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const { scheduledFor } = c.req.valid("json");

    // Verify content belongs to user
    const existing = await prisma.generatedContent.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return c.json(
        { error: { message: "Content not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Only allow scheduling of draft, approved, or already-scheduled content
    const allowedStatuses = ["draft", "approved", "scheduled", "pending_review"];
    if (!allowedStatuses.includes(existing.status)) {
      return c.json(
        {
          error: {
            message: `Cannot schedule content with status "${existing.status}"`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    const content = await prisma.generatedContent.update({
      where: { id },
      data: {
        status: "scheduled",
        scheduledFor: new Date(scheduledFor),
      },
    });

    return c.json({ data: content });
  }
);

export { generatedContentRouter };
