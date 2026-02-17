import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "../auth";
import { prisma } from "../prisma";
import {
  textToVideo,
  imageToVideo,
  getTaskStatus,
  lipSync,
} from "../services/kling";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const videoRouter = new Hono<{ Variables: AuthVariables }>();

// Require authentication for all video routes
videoRouter.use("*", async (c, next) => {
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
// POST /api/video/text2video - Generate video from text
// ============================================
const Text2VideoSchema = z.object({
  prompt: z.string().min(1, "prompt is required"),
  duration: z.union([z.literal(5), z.literal(10)]).optional(),
  aspectRatio: z.string().optional(),
  mode: z.string().optional(),
});

videoRouter.post(
  "/text2video",
  zValidator("json", Text2VideoSchema),
  async (c) => {
    const { prompt, duration, aspectRatio, mode } = c.req.valid("json");

    try {
      const result = await textToVideo(prompt, {
        duration,
        aspectRatio: aspectRatio as "16:9" | "9:16" | "1:1" | undefined,
        mode: mode as "std" | "pro" | undefined,
      });

      return c.json({ data: { taskId: result.taskId } });
    } catch (error) {
      console.error("[Video] textToVideo error:", error);
      return c.json(
        {
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to create text2video task",
            code: "KLING_ERROR",
          },
        },
        500
      );
    }
  }
);

// ============================================
// POST /api/video/image2video - Generate video from image
// ============================================
const Image2VideoSchema = z.object({
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  prompt: z.string().min(1, "prompt is required"),
  duration: z.union([z.literal(5), z.literal(10)]).optional(),
  aspectRatio: z.string().optional(),
});

videoRouter.post(
  "/image2video",
  zValidator("json", Image2VideoSchema),
  async (c) => {
    const { imageUrl, prompt, duration, aspectRatio } = c.req.valid("json");

    try {
      const result = await imageToVideo(imageUrl, prompt, {
        duration,
        aspectRatio: aspectRatio as "16:9" | "9:16" | "1:1" | undefined,
      });

      return c.json({ data: { taskId: result.taskId } });
    } catch (error) {
      console.error("[Video] imageToVideo error:", error);
      return c.json(
        {
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to create image2video task",
            code: "KLING_ERROR",
          },
        },
        500
      );
    }
  }
);

// ============================================
// GET /api/video/status/:taskId - Check generation status
// ============================================
const TaskTypeSchema = z.enum(["text2video", "image2video"]);

videoRouter.get("/status/:taskId", async (c) => {
  const taskId = c.req.param("taskId");
  const typeParam = c.req.query("type");

  const parsedType = TaskTypeSchema.safeParse(typeParam);
  if (!parsedType.success) {
    return c.json(
      {
        error: {
          message:
            "type query param is required and must be 'text2video' or 'image2video'",
          code: "INVALID_INPUT",
        },
      },
      400
    );
  }

  try {
    const result = await getTaskStatus(taskId, parsedType.data);

    return c.json({
      data: {
        status: result.status,
        videoUrl: result.videoUrl ?? null,
      },
    });
  } catch (error) {
    console.error("[Video] getTaskStatus error:", error);
    return c.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to get task status",
          code: "KLING_ERROR",
        },
      },
      500
    );
  }
});

// ============================================
// POST /api/video/lip-sync - Apply lip sync
// ============================================
const LipSyncSchema = z.object({
  videoUrl: z.string().url("videoUrl must be a valid URL"),
  audioUrl: z.string().url("audioUrl must be a valid URL"),
});

videoRouter.post(
  "/lip-sync",
  zValidator("json", LipSyncSchema),
  async (c) => {
    const { videoUrl, audioUrl } = c.req.valid("json");

    try {
      const result = await lipSync(videoUrl, audioUrl);

      return c.json({ data: { taskId: result.taskId } });
    } catch (error) {
      console.error("[Video] lipSync error:", error);
      return c.json(
        {
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to create lip-sync task",
            code: "KLING_ERROR",
          },
        },
        500
      );
    }
  }
);

// ============================================
// POST /api/video/check-content/:contentId - Check & update video/lip-sync status
// Auto-triggers lip-sync when video completes and audio exists
// ============================================
videoRouter.post("/check-content/:contentId", async (c) => {
  const user = c.get("user")!;
  const contentId = c.req.param("contentId");

  // Find the content
  const content = await prisma.generatedContent.findFirst({
    where: { id: contentId, userId: user.id },
  });

  if (!content) {
    return c.json(
      { error: { message: "Content not found", code: "NOT_FOUND" } },
      404
    );
  }

  // ---- Check lip-sync status if in progress ----
  if (content.lipSyncTaskId && content.lipSyncStatus !== "completed" && content.lipSyncStatus !== "failed") {
    try {
      const lsResult = await getTaskStatus(content.lipSyncTaskId, "text2video");
      let newLsStatus: string;
      let newFinalUrl: string | null = null;

      if (lsResult.status === "succeed" || lsResult.status === "completed") {
        newLsStatus = "completed";
        newFinalUrl = lsResult.videoUrl || null;
      } else if (lsResult.status === "failed") {
        newLsStatus = "failed";
      } else {
        newLsStatus = "processing";
      }

      const updated = await prisma.generatedContent.update({
        where: { id: contentId },
        data: {
          lipSyncStatus: newLsStatus,
          ...(newFinalUrl ? { finalVideoUrl: newFinalUrl } : {}),
        },
      });

      console.log(`[Video] Content ${contentId} lip-sync status: ${newLsStatus}`);

      return c.json({
        data: {
          videoStatus: updated.videoStatus,
          videoUrl: updated.videoUrl,
          lipSyncStatus: updated.lipSyncStatus,
          finalVideoUrl: updated.finalVideoUrl,
          audioUrl: updated.audioUrl,
        },
      });
    } catch (error) {
      console.error("[Video] lip-sync check error:", error);
    }
  }

  // ---- If lip-sync already done, return final state ----
  if (content.lipSyncStatus === "completed" && content.finalVideoUrl) {
    return c.json({
      data: {
        videoStatus: content.videoStatus,
        videoUrl: content.videoUrl,
        lipSyncStatus: content.lipSyncStatus,
        finalVideoUrl: content.finalVideoUrl,
        audioUrl: content.audioUrl,
      },
    });
  }

  // ---- Check video generation status ----
  if (!content.videoTaskId) {
    return c.json(
      { error: { message: "No video task for this content", code: "NO_TASK" } },
      400
    );
  }

  if (content.videoStatus === "completed" || content.videoStatus === "failed") {
    // Video done but no lip-sync yet - try to start lip-sync
    if (content.videoStatus === "completed" && content.videoUrl && content.audioUrl && !content.lipSyncTaskId) {
      try {
        const backendUrl = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || "";
        const fullAudioUrl = content.audioUrl.startsWith("http")
          ? content.audioUrl
          : `${backendUrl}${content.audioUrl}`;

        console.log(`[Video] Auto-starting lip-sync: video=${content.videoUrl}, audio=${fullAudioUrl}`);
        const lsResult = await lipSync(content.videoUrl, fullAudioUrl);

        await prisma.generatedContent.update({
          where: { id: contentId },
          data: {
            lipSyncTaskId: lsResult.taskId,
            lipSyncStatus: "pending",
          },
        });

        console.log(`[Video] Lip-sync started for content ${contentId}, taskId: ${lsResult.taskId}`);
      } catch (error) {
        console.error("[Video] Auto lip-sync failed:", error);
        await prisma.generatedContent.update({
          where: { id: contentId },
          data: { lipSyncStatus: "failed" },
        });
      }
    }

    return c.json({
      data: {
        videoStatus: content.videoStatus,
        videoUrl: content.videoUrl,
        lipSyncStatus: content.lipSyncStatus,
        finalVideoUrl: content.finalVideoUrl,
        audioUrl: content.audioUrl,
      },
    });
  }

  try {
    // Check Kling video status
    const result = await getTaskStatus(content.videoTaskId, "text2video");

    let newVideoStatus: string;
    let newVideoUrl: string | null = null;

    if (result.status === "succeed" || result.status === "completed") {
      newVideoStatus = "completed";
      newVideoUrl = result.videoUrl || null;
    } else if (result.status === "failed") {
      newVideoStatus = "failed";
    } else {
      newVideoStatus = "processing";
    }

    // Update DB
    const updated = await prisma.generatedContent.update({
      where: { id: contentId },
      data: {
        videoStatus: newVideoStatus,
        ...(newVideoUrl ? { videoUrl: newVideoUrl } : {}),
      },
    });

    console.log(
      `[Video] Content ${contentId} video status: ${newVideoStatus}${newVideoUrl ? `, url: ${newVideoUrl}` : ""}`
    );

    // Auto-trigger lip-sync if video just completed and we have audio
    if (newVideoStatus === "completed" && newVideoUrl && content.audioUrl) {
      try {
        const backendUrl = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || "";
        const fullAudioUrl = content.audioUrl.startsWith("http")
          ? content.audioUrl
          : `${backendUrl}${content.audioUrl}`;

        console.log(`[Video] Auto-starting lip-sync: video=${newVideoUrl}, audio=${fullAudioUrl}`);
        const lsResult = await lipSync(newVideoUrl, fullAudioUrl);

        await prisma.generatedContent.update({
          where: { id: contentId },
          data: {
            lipSyncTaskId: lsResult.taskId,
            lipSyncStatus: "pending",
          },
        });

        console.log(`[Video] Lip-sync auto-started for content ${contentId}`);
      } catch (error) {
        console.error("[Video] Auto lip-sync trigger failed:", error);
        await prisma.generatedContent.update({
          where: { id: contentId },
          data: { lipSyncStatus: "failed" },
        });
      }
    }

    return c.json({
      data: {
        videoStatus: updated.videoStatus,
        videoUrl: updated.videoUrl,
        lipSyncStatus: updated.lipSyncStatus,
        finalVideoUrl: updated.finalVideoUrl,
        audioUrl: updated.audioUrl,
      },
    });
  } catch (error) {
    console.error("[Video] check-content error:", error);
    return c.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : "Failed to check video status",
          code: "KLING_ERROR",
        },
      },
      500
    );
  }
});

export { videoRouter };
