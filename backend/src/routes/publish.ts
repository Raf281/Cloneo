import { Hono } from "hono";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { publishContent } from "../services/publisher";
import type { ContentPlatform } from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const publishRouter = new Hono<{ Variables: AuthVariables }>();

// Require authentication on all publish routes
publishRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      401
    );
  }
  await next();
});

// POST /api/publish/:id - Publish a piece of generated content
publishRouter.post("/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  // Load the content and verify ownership
  const content = await prisma.generatedContent.findFirst({
    where: { id, userId: user.id },
  });

  if (!content) {
    return c.json(
      { error: { message: "Content not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Only allow publishing content that is in an approved or scheduled state
  if (!["approved", "scheduled"].includes(content.status)) {
    return c.json(
      {
        error: {
          message: `Cannot publish content with status "${content.status}". Content must be approved or scheduled first.`,
          code: "INVALID_STATUS",
        },
      },
      400
    );
  }

  // Call the publisher service
  const publishResult = await publishContent({
    id: content.id,
    platform: content.platform as ContentPlatform,
    script: content.script,
    videoUrl: content.videoUrl,
  });

  if (!publishResult.success) {
    return c.json(
      {
        error: {
          message: publishResult.error ?? "Publishing failed",
          code: "PUBLISH_FAILED",
        },
      },
      500
    );
  }

  // Update the content record with publish details
  const updatedContent = await prisma.generatedContent.update({
    where: { id: content.id },
    data: {
      status: "published",
      publishedAt: new Date(),
      externalId: publishResult.externalId ?? null,
      externalUrl: publishResult.externalUrl ?? null,
    },
  });

  return c.json({
    data: {
      publishResult,
      content: updatedContent,
    },
  });
});

export { publishRouter };
