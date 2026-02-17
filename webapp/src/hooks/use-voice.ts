import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VoiceCloneResult, VoiceStatusResponse } from "@/lib/types";
import { avatarKeys } from "./use-avatar";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export const voiceKeys = {
  status: ["voice-status"] as const,
};

/**
 * Get voice clone status for current user.
 * GET /api/voice/status
 */
export function useVoiceStatus() {
  return useQuery({
    queryKey: voiceKeys.status,
    queryFn: async (): Promise<VoiceStatusResponse> => {
      const res = await fetch(`${BASE_URL}/api/voice/status`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({
          error: { message: res.statusText },
        }));
        throw new Error(error.error?.message || res.statusText);
      }
      const json = await res.json();
      return json.data as VoiceStatusResponse;
    },
  });
}

/**
 * Clone voice from video or audio file.
 * POST /api/voice/clone-from-media (multipart form data)
 */
export function useCloneVoiceFromMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<VoiceCloneResult> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/api/voice/clone-from-media`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({
          error: { message: res.statusText },
        }));
        throw new Error(error.error?.message || "Voice cloning failed");
      }

      const json = await res.json();
      return json.data as VoiceCloneResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voiceKeys.status });
      queryClient.invalidateQueries({ queryKey: avatarKeys.all });
    },
  });
}
