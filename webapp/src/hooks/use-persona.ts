import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Persona, CreatePersonaInput } from "@/lib/types";

// ============================================
// Query Keys
// ============================================

export const personaKeys = {
  all: ["persona"] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch the current user's persona.
 * GET /api/personas
 * Returns the persona object or null if not set up yet.
 */
export function usePersona() {
  return useQuery({
    queryKey: personaKeys.all,
    queryFn: () => api.get<Persona | null>("/api/personas"),
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create or update the user's persona.
 * POST /api/personas
 */
export function useUpdatePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePersonaInput) =>
      api.post<Persona>("/api/personas", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaKeys.all });
    },
  });
}
