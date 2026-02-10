import type { PublishResult } from "../types";
import type { ContentPlatform } from "../types";

/**
 * Publishes content to an external platform (Instagram, TikTok, X).
 *
 * Currently simulates the publish operation. In production, this function
 * would integrate with each platform's API using OAuth tokens stored
 * in the user's Account records.
 */
export async function publishContent(content: {
  id: string;
  platform: ContentPlatform;
  script: string | null;
  videoUrl: string | null;
}): Promise<PublishResult> {
  console.log(`[Publisher] Publishing to ${content.platform}:`, content.id);

  // Simulate network latency of a real API call
  await new Promise((r) => setTimeout(r, 500));

  // -------------------------------------------------------
  // TODO: Replace this stub with real API calls:
  //   - instagram_reel -> Instagram Graph API (requires FB OAuth)
  //   - tiktok         -> TikTok Content Posting API
  //   - x_post         -> X (Twitter) API v2
  // Each branch should:
  //   1. Upload the video / post text via the platform SDK
  //   2. Return the external post ID and URL
  //   3. Handle rate limits and token refresh
  // -------------------------------------------------------

  const platformHostMap: Record<ContentPlatform, string> = {
    instagram_reel: "instagram.com",
    tiktok: "tiktok.com",
    x_post: "x.com",
  };

  const host = platformHostMap[content.platform];

  return {
    success: true,
    platform: content.platform,
    externalId: `ext_${content.id}_${Date.now()}`,
    externalUrl: `https://${host}/post/${content.id}`,
  };
}
