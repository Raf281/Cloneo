import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Avatar, AvatarMedia, AvatarMediaType } from "@/lib/types";

// ============================================
// Query Keys
// ============================================

export const avatarKeys = {
  all: ["avatars"] as const,
  media: (avatarId: string) => ["avatars", avatarId, "media"] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch all avatars for the current user.
 * GET /api/avatars
 */
export function useAvatars() {
  return useQuery({
    queryKey: avatarKeys.all,
    queryFn: () => api.get<Avatar[]>("/api/avatars"),
  });
}

// ============================================
// Mutations
// ============================================

interface AddAvatarMediaInput {
  avatarId: string;
  type: AvatarMediaType;
  url: string;
}

/**
 * Add media (video/image) to an avatar.
 * POST /api/avatars/:id/media
 */
export function useAddAvatarMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatarId, type, url }: AddAvatarMediaInput) =>
      api.post<AvatarMedia>(`/api/avatars/${avatarId}/media`, { type, url }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: avatarKeys.all });
      queryClient.invalidateQueries({
        queryKey: avatarKeys.media(variables.avatarId),
      });
    },
  });
}

interface UpdateAvatarStatusInput {
  avatarId: string;
  status: Avatar["status"];
}

/**
 * Update avatar training status.
 * PATCH /api/avatars/:id/status
 */
export function useUpdateAvatarStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatarId, status }: UpdateAvatarStatusInput) =>
      api.patch<Avatar>(`/api/avatars/${avatarId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: avatarKeys.all });
    },
  });
}
