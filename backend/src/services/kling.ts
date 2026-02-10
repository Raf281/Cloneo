import * as jwt from "jsonwebtoken";

// ============================================
// Types
// ============================================

export interface KlingVideoOptions {
  duration?: 5 | 10;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  mode?: "std" | "pro";
  model?: string;
}

export interface KlingTaskResult {
  taskId: string;
}

export interface KlingTaskStatus {
  status: string;
  videoUrl?: string;
}

interface KlingApiResponse {
  code: number;
  message: string;
  request_id: string;
  data?: {
    task_id: string;
    task_status: string;
    task_result?: {
      videos?: Array<{
        id: string;
        url: string;
        duration: string;
      }>;
    };
  };
}

// ============================================
// Constants
// ============================================

const KLING_BASE_URL = "https://api.klingai.com";

const DEFAULT_OPTIONS: Required<KlingVideoOptions> = {
  duration: 5,
  aspectRatio: "9:16",
  mode: "std",
  model: "kling-v2-master",
};

// ============================================
// JWT Generation
// ============================================

/**
 * Generates a JWT token for Kling API authentication.
 *
 * The KLING_API_KEY is an access key where the part before the first "="
 * is used as the access_key_id (iss), and the full key is used as the
 * HS256 signing secret.
 */
export function generateJWT(): string {
  const apiKey = process.env.KLING_API_KEY;
  if (!apiKey) {
    throw new Error("KLING_API_KEY environment variable is not set");
  }

  // The part before the first "=" is the access_key_id
  const eqIndex = apiKey.indexOf("=");
  const accessKeyId = eqIndex !== -1 ? apiKey.substring(0, eqIndex) : apiKey;

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const payload = {
    iss: accessKeyId,
    exp: nowInSeconds + 1800, // 30 minutes
    nbf: nowInSeconds - 5,
    iat: nowInSeconds,
  };

  const token = jwt.sign(payload, apiKey, { algorithm: "HS256" });

  console.log("[Kling] JWT generated for access_key_id:", accessKeyId);

  return token;
}

// ============================================
// Internal HTTP Helper
// ============================================

async function klingFetch<T = KlingApiResponse>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = generateJWT();
  const url = `${KLING_BASE_URL}${path}`;

  console.log(`[Kling] ${options.method ?? "GET"} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const body = (await response.json()) as T;

  if (!response.ok) {
    console.error("[Kling] API error:", JSON.stringify(body, null, 2));
    throw new Error(
      `Kling API error (${response.status}): ${JSON.stringify(body)}`
    );
  }

  console.log("[Kling] Response:", JSON.stringify(body, null, 2));

  return body;
}

// ============================================
// Text to Video
// ============================================

/**
 * Generate a video from a text prompt.
 *
 * @param prompt - The text description of the video to generate
 * @param options - Optional generation parameters
 * @returns The task ID for polling status
 */
export async function textToVideo(
  prompt: string,
  options?: KlingVideoOptions
): Promise<KlingTaskResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const requestBody = {
    prompt,
    duration: String(opts.duration),
    aspect_ratio: opts.aspectRatio,
    mode: opts.mode,
    model_name: opts.model,
  };

  console.log("[Kling] textToVideo request:", JSON.stringify(requestBody, null, 2));

  const response = await klingFetch<KlingApiResponse>("/v1/videos/text2video", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  if (!response.data?.task_id) {
    throw new Error(
      `Kling textToVideo failed: no task_id in response. Code: ${response.code}, Message: ${response.message}`
    );
  }

  console.log("[Kling] textToVideo task created:", response.data.task_id);

  return { taskId: response.data.task_id };
}

// ============================================
// Image to Video
// ============================================

/**
 * Generate a video from an image and text prompt.
 *
 * @param imageUrl - URL of the source image
 * @param prompt - Text description guiding the video generation
 * @param options - Optional generation parameters
 * @returns The task ID for polling status
 */
export async function imageToVideo(
  imageUrl: string,
  prompt: string,
  options?: KlingVideoOptions
): Promise<KlingTaskResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const requestBody = {
    image: imageUrl,
    prompt,
    duration: String(opts.duration),
    aspect_ratio: opts.aspectRatio,
    mode: opts.mode,
    model_name: opts.model,
  };

  console.log("[Kling] imageToVideo request:", JSON.stringify(requestBody, null, 2));

  const response = await klingFetch<KlingApiResponse>("/v1/videos/image2video", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  if (!response.data?.task_id) {
    throw new Error(
      `Kling imageToVideo failed: no task_id in response. Code: ${response.code}, Message: ${response.message}`
    );
  }

  console.log("[Kling] imageToVideo task created:", response.data.task_id);

  return { taskId: response.data.task_id };
}

// ============================================
// Task Status
// ============================================

/**
 * Check the status of a video generation task.
 *
 * @param taskId - The task ID returned from textToVideo or imageToVideo
 * @param type - The type of task ("text2video" or "image2video")
 * @returns The current status and video URL if complete
 */
export async function getTaskStatus(
  taskId: string,
  type: "text2video" | "image2video"
): Promise<KlingTaskStatus> {
  const response = await klingFetch<KlingApiResponse>(
    `/v1/videos/${type}/${taskId}`
  );

  if (!response.data) {
    throw new Error(
      `Kling getTaskStatus failed: no data in response. Code: ${response.code}, Message: ${response.message}`
    );
  }

  const status = response.data.task_status;
  const videoUrl = response.data.task_result?.videos?.[0]?.url;

  console.log(
    `[Kling] Task ${taskId} status: ${status}${videoUrl ? `, videoUrl: ${videoUrl}` : ""}`
  );

  return {
    status,
    ...(videoUrl ? { videoUrl } : {}),
  };
}

// ============================================
// Lip Sync
// ============================================

/**
 * Apply lip sync to an existing video using an audio track.
 *
 * @param videoUrl - URL of the source video
 * @param audioUrl - URL of the audio track to sync
 * @returns The task ID for polling status
 */
export async function lipSync(
  videoUrl: string,
  audioUrl: string
): Promise<KlingTaskResult> {
  const requestBody = {
    video_url: videoUrl,
    audio_url: audioUrl,
  };

  console.log("[Kling] lipSync request:", JSON.stringify(requestBody, null, 2));

  const response = await klingFetch<KlingApiResponse>("/v1/videos/lip-sync", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  if (!response.data?.task_id) {
    throw new Error(
      `Kling lipSync failed: no task_id in response. Code: ${response.code}, Message: ${response.message}`
    );
  }

  console.log("[Kling] lipSync task created:", response.data.task_id);

  return { taskId: response.data.task_id };
}
