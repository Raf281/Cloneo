import type { PublishResult, ContentPlatform } from "../types";

/**
 * Publishes content to an external platform (Instagram, TikTok, X).
 * Uses real platform APIs with tokens from environment variables.
 */
export async function publishContent(content: {
  id: string;
  platform: ContentPlatform;
  script: string | null;
  videoUrl: string | null;
}): Promise<PublishResult> {
  console.log(`[Publisher] Publishing to ${content.platform}:`, content.id);

  switch (content.platform) {
    case "x_post":
      return publishToX(content);
    case "instagram_reel":
      return publishToInstagram(content);
    case "tiktok":
      return publishToTikTok(content);
    default:
      return {
        success: false,
        platform: content.platform,
        error: `Unsupported platform: ${content.platform}`,
      };
  }
}

// ============================================
// X (Twitter) API v2
// ============================================

async function publishToX(content: {
  id: string;
  script: string | null;
}): Promise<PublishResult> {
  const bearerToken = process.env.X_BEARER_TOKEN;

  if (!bearerToken) {
    return {
      success: false,
      platform: "x_post",
      error:
        "X/Twitter API credentials not configured. Set X_BEARER_TOKEN environment variable.",
    };
  }

  if (!content.script) {
    return {
      success: false,
      platform: "x_post",
      error: "No text content to publish.",
    };
  }

  try {
    const response = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: content.script.substring(0, 280),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("[Publisher:X] API error:", response.status, error);
      return {
        success: false,
        platform: "x_post",
        error: `X API error (${response.status}): ${error?.detail || error?.title || response.statusText}`,
      };
    }

    const data = await response.json();
    const tweetId = data.data?.id;

    return {
      success: true,
      platform: "x_post",
      externalId: tweetId,
      externalUrl: `https://x.com/i/status/${tweetId}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Publisher:X] Error:", message);
    return {
      success: false,
      platform: "x_post",
      error: `Failed to publish to X: ${message}`,
    };
  }
}

// ============================================
// Instagram Graph API (Reels)
// ============================================

async function publishToInstagram(content: {
  id: string;
  script: string | null;
  videoUrl: string | null;
}): Promise<PublishResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !igUserId) {
    return {
      success: false,
      platform: "instagram_reel",
      error:
        "Instagram API credentials not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID environment variables.",
    };
  }

  if (!content.videoUrl) {
    return {
      success: false,
      platform: "instagram_reel",
      error: "No video URL available for Instagram Reel.",
    };
  }

  try {
    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: content.videoUrl,
          caption: content.script || "",
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json().catch(() => ({}));
      console.error("[Publisher:IG] Container creation error:", error);
      return {
        success: false,
        platform: "instagram_reel",
        error: `Instagram API error: ${error?.error?.message || containerResponse.statusText}`,
      };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Wait for video processing (poll status, max ~5 min)
    let mediaReady = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 10_000));

      const statusResponse = await fetch(
        `https://graph.instagram.com/v21.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusResponse.json();

      if (statusData.status_code === "FINISHED") {
        mediaReady = true;
        break;
      } else if (statusData.status_code === "ERROR") {
        return {
          success: false,
          platform: "instagram_reel",
          error: "Instagram video processing failed.",
        };
      }
    }

    if (!mediaReady) {
      return {
        success: false,
        platform: "instagram_reel",
        error: "Instagram video processing timed out.",
      };
    }

    // Step 3: Publish the container
    const publishResponse = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json().catch(() => ({}));
      console.error("[Publisher:IG] Publish error:", error);
      return {
        success: false,
        platform: "instagram_reel",
        error: `Instagram publish error: ${error?.error?.message || publishResponse.statusText}`,
      };
    }

    const publishData = await publishResponse.json();
    const mediaId = publishData.id;

    // Get permalink
    const permalinkResponse = await fetch(
      `https://graph.instagram.com/v21.0/${mediaId}?fields=permalink&access_token=${accessToken}`
    );
    const permalinkData = await permalinkResponse.json();

    return {
      success: true,
      platform: "instagram_reel",
      externalId: mediaId,
      externalUrl:
        permalinkData.permalink ||
        `https://instagram.com/reel/${mediaId}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Publisher:IG] Error:", message);
    return {
      success: false,
      platform: "instagram_reel",
      error: `Failed to publish to Instagram: ${message}`,
    };
  }
}

// ============================================
// TikTok Content Posting API
// ============================================

async function publishToTikTok(content: {
  id: string;
  script: string | null;
  videoUrl: string | null;
}): Promise<PublishResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      success: false,
      platform: "tiktok",
      error:
        "TikTok API credentials not configured. Set TIKTOK_ACCESS_TOKEN environment variable.",
    };
  }

  if (!content.videoUrl) {
    return {
      success: false,
      platform: "tiktok",
      error: "No video URL available for TikTok.",
    };
  }

  try {
    // Step 1: Initialize upload via pull from URL
    const initResponse = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          post_info: {
            title: content.script?.substring(0, 150) || "New video",
            privacy_level: "PUBLIC_TO_EVERYONE",
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
          },
          source_info: {
            source: "PULL_FROM_URL",
            video_url: content.videoUrl,
          },
        }),
      }
    );

    if (!initResponse.ok) {
      const error = await initResponse.json().catch(() => ({}));
      console.error("[Publisher:TT] Init error:", error);
      return {
        success: false,
        platform: "tiktok",
        error: `TikTok API error: ${error?.error?.message || initResponse.statusText}`,
      };
    }

    const initData = await initResponse.json();
    const publishId = initData.data?.publish_id;

    if (!publishId) {
      return {
        success: false,
        platform: "tiktok",
        error: "TikTok did not return a publish ID.",
      };
    }

    // Step 2: Poll publish status (max ~5 min)
    let postId: string | null = null;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 10_000));

      const statusResponse = await fetch(
        "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ publish_id: publishId }),
        }
      );

      const statusData = await statusResponse.json();
      const status = statusData.data?.status;

      if (status === "PUBLISH_COMPLETE") {
        postId =
          statusData.data?.publicaly_available_post_id?.[0] || publishId;
        break;
      } else if (status === "FAILED") {
        return {
          success: false,
          platform: "tiktok",
          error: `TikTok publish failed: ${statusData.data?.fail_reason || "Unknown reason"}`,
        };
      }
    }

    if (!postId) {
      return {
        success: false,
        platform: "tiktok",
        error: "TikTok video processing timed out.",
      };
    }

    return {
      success: true,
      platform: "tiktok",
      externalId: postId,
      externalUrl: `https://www.tiktok.com/@user/video/${postId}`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Publisher:TT] Error:", message);
    return {
      success: false,
      platform: "tiktok",
      error: `Failed to publish to TikTok: ${message}`,
    };
  }
}
