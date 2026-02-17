import { Hono } from "hono";
import { join } from "path";
import { stat } from "fs/promises";

const uploadsRouter = new Hono();

// Base directory for all uploads
const UPLOADS_DIR = join(import.meta.dir, "../../uploads");

// GET /api/uploads/audio/:filename - Serve audio files
uploadsRouter.get("/audio/:filename", async (c) => {
  const { filename } = c.req.param();

  // Sanitize filename to prevent directory traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return c.json({ error: { message: "Invalid filename", code: "INVALID_INPUT" } }, 400);
  }

  const filePath = join(UPLOADS_DIR, "audio", filename);

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
    }
  } catch {
    return c.json({ error: { message: "Not found", code: "NOT_FOUND" } }, 404);
  }

  const file = Bun.file(filePath);
  return new Response(file.stream(), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=86400",
    },
  });
});

export { uploadsRouter };
