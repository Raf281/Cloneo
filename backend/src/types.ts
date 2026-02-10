import { z } from "zod";

// ============================================
// Enums and Constants
// ============================================

export const AvatarStatusSchema = z.enum(["pending", "training", "ready", "failed"]);
export type AvatarStatus = z.infer<typeof AvatarStatusSchema>;

export const AvatarMediaTypeSchema = z.enum(["video", "image"]);
export type AvatarMediaType = z.infer<typeof AvatarMediaTypeSchema>;

export const AvatarMediaStatusSchema = z.enum(["uploaded", "processing", "processed"]);
export type AvatarMediaStatus = z.infer<typeof AvatarMediaStatusSchema>;

export const PlatformSchema = z.enum(["instagram", "tiktok", "x", "youtube"]);
export type Platform = z.infer<typeof PlatformSchema>;

export const ContentTypeSchema = z.enum(["video", "text"]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

export const ContentPlatformSchema = z.enum(["instagram_reel", "tiktok", "x_post"]);
export type ContentPlatform = z.infer<typeof ContentPlatformSchema>;

export const GeneratedContentStatusSchema = z.enum([
  "draft",
  "pending_review",
  "approved",
  "scheduled",
  "published",
  "rejected",
]);
export type GeneratedContentStatus = z.infer<typeof GeneratedContentStatusSchema>;

// ============================================
// Avatar Schemas
// ============================================

export const AvatarSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  status: AvatarStatusSchema,
  heygenAvatarId: z.string().nullable(),
  voiceId: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type Avatar = z.infer<typeof AvatarSchema>;

export const CreateAvatarSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type CreateAvatarInput = z.infer<typeof CreateAvatarSchema>;

export const UpdateAvatarSchema = z.object({
  name: z.string().min(1).optional(),
  status: AvatarStatusSchema.optional(),
  heygenAvatarId: z.string().optional(),
  voiceId: z.string().optional(),
});
export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;

// ============================================
// Avatar Media Schemas
// ============================================

export const AvatarMediaSchema = z.object({
  id: z.string(),
  avatarId: z.string(),
  type: AvatarMediaTypeSchema,
  url: z.string().url(),
  status: AvatarMediaStatusSchema,
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type AvatarMedia = z.infer<typeof AvatarMediaSchema>;

export const CreateAvatarMediaSchema = z.object({
  avatarId: z.string(),
  type: AvatarMediaTypeSchema,
  url: z.string().url(),
});
export type CreateAvatarMediaInput = z.infer<typeof CreateAvatarMediaSchema>;

// ============================================
// Persona Schemas
// ============================================

export const PersonaSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable(),
  topics: z.array(z.string()).nullable(), // Parsed from JSON
  style: z.string().nullable(),
  catchphrases: z.array(z.string()).nullable(), // Parsed from JSON
  targetAudience: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const CreatePersonaSchema = z.object({
  bio: z.string().optional(),
  topics: z.array(z.string()).optional(),
  style: z.string().optional(),
  catchphrases: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
});
export type CreatePersonaInput = z.infer<typeof CreatePersonaSchema>;

export const UpdatePersonaSchema = CreatePersonaSchema;
export type UpdatePersonaInput = z.infer<typeof UpdatePersonaSchema>;

// ============================================
// Content Post Schemas (for learning)
// ============================================

export const EngagementSchema = z.object({
  likes: z.number().optional(),
  comments: z.number().optional(),
  shares: z.number().optional(),
  views: z.number().optional(),
});
export type Engagement = z.infer<typeof EngagementSchema>;

export const ContentPostSchema = z.object({
  id: z.string(),
  personaId: z.string(),
  platform: PlatformSchema,
  originalUrl: z.string().nullable(),
  content: z.string().nullable(),
  engagement: EngagementSchema.nullable(),
  analyzedAt: z.string().or(z.date()).nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type ContentPost = z.infer<typeof ContentPostSchema>;

export const CreateContentPostSchema = z.object({
  personaId: z.string(),
  platform: PlatformSchema,
  originalUrl: z.string().url().optional(),
  content: z.string().optional(),
  engagement: EngagementSchema.optional(),
});
export type CreateContentPostInput = z.infer<typeof CreateContentPostSchema>;

// ============================================
// Generated Content Schemas
// ============================================

export const VideoGenerationStatusSchema = z.enum(["pending", "processing", "completed", "failed"]);
export type VideoGenerationStatus = z.infer<typeof VideoGenerationStatusSchema>;

export const GeneratedContentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  avatarId: z.string().nullable(),
  type: ContentTypeSchema,
  platform: ContentPlatformSchema,
  script: z.string().nullable(),
  videoUrl: z.string().nullable(),
  videoTaskId: z.string().nullable(),
  videoStatus: VideoGenerationStatusSchema.nullable(),
  status: GeneratedContentStatusSchema,
  scheduledFor: z.string().or(z.date()).nullable(),
  publishedAt: z.string().or(z.date()).nullable(),
  externalId: z.string().nullable(),
  externalUrl: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

export const CreateGeneratedContentSchema = z.object({
  avatarId: z.string().optional(),
  type: ContentTypeSchema,
  platform: ContentPlatformSchema,
  script: z.string().optional(),
});
export type CreateGeneratedContentInput = z.infer<typeof CreateGeneratedContentSchema>;

export const UpdateGeneratedContentSchema = z.object({
  script: z.string().optional(),
  videoUrl: z.string().url().optional(),
  videoTaskId: z.string().optional(),
  videoStatus: VideoGenerationStatusSchema.optional(),
  status: GeneratedContentStatusSchema.optional(),
  scheduledFor: z.string().datetime().optional(),
});
export type UpdateGeneratedContentInput = z.infer<typeof UpdateGeneratedContentSchema>;

// ============================================
// Generated Content Request Schemas
// ============================================

// Create generated content request (when AI generates something)
export const CreateGeneratedContentRequestSchema = z.object({
  avatarId: z.string().optional(),
  type: ContentTypeSchema,
  platform: ContentPlatformSchema,
  script: z.string().optional(),
  videoUrl: z.string().url().optional(),
});
export type CreateGeneratedContentRequest = z.infer<typeof CreateGeneratedContentRequestSchema>;

// Query params for filtering generated content
export const GeneratedContentQuerySchema = z.object({
  status: GeneratedContentStatusSchema.optional(),
  platform: ContentPlatformSchema.optional(),
  type: ContentTypeSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type GeneratedContentQuery = z.infer<typeof GeneratedContentQuerySchema>;

// Pagination response
export const PaginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

// Approve content request
export const ApproveContentSchema = z.object({
  scheduledFor: z.string().datetime().optional(),
});
export type ApproveContentInput = z.infer<typeof ApproveContentSchema>;

// Reject content request
export const RejectContentSchema = z.object({
  reason: z.string().optional(),
});
export type RejectContentInput = z.infer<typeof RejectContentSchema>;

// ============================================
// AI Content Generation Schemas
// ============================================

export const ContentToneSchema = z.enum(["motivierend", "informativ", "unterhaltsam", "provokant"]);
export type ContentTone = z.infer<typeof ContentToneSchema>;

export const GenerateContentRequestSchema = z.object({
  platform: ContentPlatformSchema,
  topic: z.string().optional(),
  tone: ContentToneSchema.optional(),
  generateVideo: z.boolean().optional(), // Auto-start video generation after script
  videoPrompt: z.string().optional(), // Custom prompt for video generation (optional)
});
export type GenerateContentRequest = z.infer<typeof GenerateContentRequestSchema>;

// ============================================
// Content Stats Schema
// ============================================

export const ContentStatsSchema = z.object({
  thisWeek: z.number(),
  pendingReview: z.number(),
  published: z.number(),
  scheduled: z.number(),
});
export type ContentStats = z.infer<typeof ContentStatsSchema>;

// ============================================
// Onboarding Status Schema
// ============================================

export const OnboardingStatusSchema = z.object({
  hasAvatar: z.boolean(),
  hasPersona: z.boolean(),
  connectedPlatforms: z.array(z.string()),
});
export type OnboardingStatus = z.infer<typeof OnboardingStatusSchema>;

// ============================================
// Persona Analysis Schemas (AI-powered)
// ============================================

export const PersonaAnalysisSchema = z.object({
  bio: z.string(),
  topics: z.array(z.string()),
  style: z.string(),
  catchphrases: z.array(z.string()),
  targetAudience: z.string(),
});
export type PersonaAnalysis = z.infer<typeof PersonaAnalysisSchema>;

export const AnalyzePersonaRequestSchema = z.object({
  content: z.array(z.string()).min(1, "At least one content item is required"),
});
export type AnalyzePersonaRequest = z.infer<typeof AnalyzePersonaRequestSchema>;

// ============================================
// Publish Result Schema
// ============================================

export const PublishResultSchema = z.object({
  success: z.boolean(),
  platform: z.string(),
  externalId: z.string().optional(),
  externalUrl: z.string().optional(),
  error: z.string().optional(),
});
export type PublishResult = z.infer<typeof PublishResultSchema>;

// ============================================
// API Response Helpers
// ============================================

// Standard data envelope
export const createDataResponse = <T extends z.ZodType>(schema: T) =>
  z.object({ data: schema });

// Error response
export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
