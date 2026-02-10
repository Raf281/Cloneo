import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  GeneratedContent,
  ContentStats,
  GeneratedContentStatus,
  ContentPlatform,
  ContentType,
  ContentTone,
  Pagination,
} from "@/lib/types";

// ============================================
// Query Keys
// ============================================

export const contentKeys = {
  all: ["generated-content"] as const,
  list: (filters?: GeneratedContentFilters) =>
    ["generated-content", "list", filters] as const,
  stats: ["content-stats"] as const,
};

// ============================================
// Filter Types
// ============================================

export interface GeneratedContentFilters {
  status?: GeneratedContentStatus;
  platform?: ContentPlatform;
  type?: ContentType;
  page?: number;
  limit?: number;
}

interface GeneratedContentListResponse {
  items: GeneratedContent[];
  pagination: Pagination;
}

// ============================================
// Queries
// ============================================

/**
 * Fetch generated content with optional filters and pagination.
 * GET /api/generated-content?status=...&platform=...&type=...&page=...&limit=...
 */
export function useGeneratedContent(filters?: GeneratedContentFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const queryString = params.toString();
  const path = `/api/generated-content${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: contentKeys.list(filters),
    queryFn: async (): Promise<GeneratedContentListResponse> => {
      // The backend returns { data: [...], pagination: {...} }
      // Our api client unwraps `data`, but pagination is a sibling field.
      // We need the raw response for this endpoint.
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";
      const res = await fetch(`${BASE_URL}${path}`, {
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
      return {
        items: json.data as GeneratedContent[],
        pagination: json.pagination as Pagination,
      };
    },
  });
}

/**
 * Fetch content statistics.
 * GET /api/stats/content
 */
export function useContentStats() {
  return useQuery({
    queryKey: contentKeys.stats,
    queryFn: () => api.get<ContentStats>("/api/stats/content"),
  });
}

// ============================================
// Mutations
// ============================================

interface GenerateContentInput {
  platform: ContentPlatform;
  topic?: string;
  tone?: ContentTone;
}

/**
 * Generate new AI content.
 * POST /api/generate
 */
export function useGenerateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateContentInput) =>
      api.post<GeneratedContent>("/api/generate", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.stats });
    },
  });
}

interface ApproveContentInput {
  id: string;
  scheduledFor?: string;
}

/**
 * Approve content for publishing.
 * POST /api/generated-content/:id/approve
 */
export function useApproveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scheduledFor }: ApproveContentInput) =>
      api.post<GeneratedContent>(`/api/generated-content/${id}/approve`, {
        scheduledFor,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.stats });
    },
  });
}

interface RejectContentInput {
  id: string;
  reason?: string;
}

/**
 * Reject content.
 * POST /api/generated-content/:id/reject
 */
export function useRejectContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: RejectContentInput) =>
      api.post<GeneratedContent>(`/api/generated-content/${id}/reject`, {
        reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.stats });
    },
  });
}

/**
 * Delete generated content.
 * DELETE /api/generated-content/:id
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/generated-content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      queryClient.invalidateQueries({ queryKey: contentKeys.stats });
    },
  });
}
