import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "../auth";
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

export { videoRouter };
