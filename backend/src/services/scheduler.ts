import { prisma } from "../prisma";
import { publishContent } from "./publisher";
import type { ContentPlatform } from "../types";

const POLL_INTERVAL_MS = 60_000; // Check every 60 seconds

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Processes scheduled content that is due for publishing.
 * Finds content with status "scheduled" and scheduledFor <= now,
 * then publishes each one via the platform publisher.
 */
async function processScheduledContent() {
  try {
    const now = new Date();

    const dueContent = await prisma.generatedContent.findMany({
      where: {
        status: "scheduled",
        scheduledFor: {
          lte: now,
        },
      },
    });

    if (dueContent.length === 0) return;

    console.log(
      `[Scheduler] Found ${dueContent.length} content item(s) due for publishing`
    );

    for (const content of dueContent) {
      try {
        console.log(
          `[Scheduler] Publishing ${content.id} to ${content.platform}`
        );

        const result = await publishContent({
          id: content.id,
          platform: content.platform as ContentPlatform,
          script: content.script,
          videoUrl: content.finalVideoUrl || content.videoUrl,
        });

        if (result.success) {
          await prisma.generatedContent.update({
            where: { id: content.id },
            data: {
              status: "published",
              publishedAt: new Date(),
              externalId: result.externalId ?? null,
              externalUrl: result.externalUrl ?? null,
            },
          });
          console.log(`[Scheduler] Successfully published ${content.id}`);
        } else {
          console.error(
            `[Scheduler] Failed to publish ${content.id}: ${result.error}`
          );
        }
      } catch (err) {
        console.error(`[Scheduler] Error publishing ${content.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[Scheduler] Error in scheduled content processing:", err);
  }
}

/**
 * Starts the content scheduler that auto-publishes content at the scheduled time.
 * Checks every 60 seconds for due content.
 */
export function startScheduler() {
  if (intervalId) {
    console.log("[Scheduler] Already running");
    return;
  }

  console.log(
    `[Scheduler] Started - checking every ${POLL_INTERVAL_MS / 1000}s`
  );
  intervalId = setInterval(processScheduledContent, POLL_INTERVAL_MS);

  // Run once immediately on startup
  processScheduledContent();
}

/**
 * Stops the content scheduler.
 */
export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[Scheduler] Stopped");
  }
}
