import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ============================================
// Types
// ============================================

interface GenerateVideoInput {
  prompt: string;
  duration?: 5 | 10;
  aspectRatio?: string;
  mode?: string;
}

interface GenerateVideoResponse {
  taskId: string;
}

interface VideoStatusResponse {
  status: string;
  videoUrl: string | null;
}

// ============================================
// Mutations
// ============================================

/**
 * Generate a video from text using Kling.
 * POST /api/video/text2video
 */
export function useGenerateVideo() {
  return useMutation({
    mutationFn: (input: GenerateVideoInput) =>
      api.post<GenerateVideoResponse>("/api/video/text2video", input),
  });
}

// ============================================
// Queries
// ============================================

/**
 * Poll video generation status.
 * GET /api/video/status/:taskId?type=...
 *
 * Polls every 5 seconds while the status is not "completed" or "failed".
 * Pass taskId=null to disable the query.
 */
export function useVideoStatus(
  taskId: string | null,
  type: "text2video" | "image2video"
) {
  return useQuery({
    queryKey: ["video-status", taskId, type],
    queryFn: () =>
      api.get<VideoStatusResponse>(
        `/api/video/status/${taskId}?type=${type}`
      ),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      return 5000;
    },
  });
}
