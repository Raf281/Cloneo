/**
 * Shared types mirroring backend/src/types.ts Zod schemas.
 * Kept in sync manually -- the single source of truth is the backend file.
 */

// ============================================
// Enums / Unions
// ============================================

export type AvatarStatus = "pending" | "training" | "ready" | "failed";

export type Platform = "instagram" | "tiktok" | "x" | "youtube";

export type ContentType = "video" | "text";

export type ContentPlatform = "instagram_reel" | "tiktok" | "x_post";

export type GeneratedContentStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected";

export type ContentTone =
  | "motivierend"
  | "informativ"
  | "unterhaltsam"
  | "provokant";

// ============================================
// Domain Models
// ============================================

export interface GeneratedContent {
  id: string;
  userId: string;
  avatarId: string | null;
  type: ContentType;
  platform: ContentPlatform;
  script: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  videoTaskId: string | null;
  videoStatus: string | null;
  lipSyncTaskId: string | null;
  lipSyncStatus: string | null;
  finalVideoUrl: string | null;
  status: GeneratedContentStatus;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentStats {
  thisWeek: number;
  pendingReview: number;
  published: number;
  scheduled: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface Avatar {
  id: string;
  userId: string;
  name: string;
  status: AvatarStatus;
  heygenAvatarId: string | null;
  voiceId: string | null;
  voiceStatus: "none" | "processing" | "ready" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvatarInput {
  name: string;
}

export type AvatarMediaType = "video" | "image";
export type AvatarMediaStatus = "uploaded" | "processing" | "processed";

export interface AvatarMedia {
  id: string;
  avatarId: string;
  type: AvatarMediaType;
  url: string;
  status: AvatarMediaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Persona {
  id: string;
  userId: string;
  bio: string | null;
  topics: string[] | null;
  style: string | null;
  catchphrases: string[] | null;
  targetAudience: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonaInput {
  bio?: string;
  topics?: string[];
  style?: string;
  catchphrases?: string[];
  targetAudience?: string;
}

export interface PersonaAnalysis {
  bio: string;
  topics: string[];
  style: string;
  catchphrases: string[];
  targetAudience: string;
}

export interface AnalyzePersonaRequest {
  content: string[];
}

// Voice Cloning
export type VoiceStatus = "none" | "processing" | "ready" | "failed";

export interface VoiceCloneResult {
  voiceId: string;
  avatarId: string;
  voiceStatus: VoiceStatus;
}

export interface VoiceStatusResponse {
  voiceStatus: VoiceStatus;
  voiceId: string | null;
  avatarId?: string;
}

// Onboarding Status
export interface OnboardingStatus {
  hasAvatar: boolean;
  hasPersona: boolean;
  connectedPlatforms: string[];
}
