import type { Context, Next } from "hono";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Max requests per window per user */
  maxRequests: number;
  /** Prefix for identifying the limit type */
  keyPrefix: string;
}

// In-memory store: "keyPrefix:userId" -> RateLimitEntry
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60_000);

/**
 * Creates a rate limiting middleware for authenticated routes.
 * Tracks usage per user within a time window.
 */
export function rateLimit(config: RateLimitConfig) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      return next();
    }

    const key = `${config.keyPrefix}:${user.id}`;
    const now = Date.now();

    let entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      entry = {
        count: 0,
        resetAt: now + config.windowMs,
      };
    }

    entry.count++;
    store.set(key, entry);

    if (entry.count > config.maxRequests) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      return c.json(
        {
          error: {
            message: `Rate limit exceeded. Try again in ${retryAfterSec} seconds.`,
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        429
      );
    }

    c.header("X-RateLimit-Limit", String(config.maxRequests));
    c.header(
      "X-RateLimit-Remaining",
      String(Math.max(0, config.maxRequests - entry.count))
    );
    c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    return next();
  };
}

// Pre-configured rate limiters
export const generateRateLimit = rateLimit({
  windowMs: 24 * 60 * 60_000, // 24 hours
  maxRequests: 50,
  keyPrefix: "generate",
});

export const voiceCloneRateLimit = rateLimit({
  windowMs: 24 * 60 * 60_000,
  maxRequests: 5,
  keyPrefix: "voice-clone",
});

export const videoRateLimit = rateLimit({
  windowMs: 24 * 60 * 60_000,
  maxRequests: 20,
  keyPrefix: "video",
});

export const ttsRateLimit = rateLimit({
  windowMs: 24 * 60 * 60_000,
  maxRequests: 50,
  keyPrefix: "tts",
});
