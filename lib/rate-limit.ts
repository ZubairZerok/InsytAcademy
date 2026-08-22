// lib/rate-limit.ts
// Minimal per-key sliding-window rate limiter.
//
// In-memory (per server instance) — good enough to stop casual abuse and the
// denial-of-wallet vector on AI endpoints. For multi-instance production scale,
// swap the Map for Upstash Redis behind the same checkRateLimit() signature.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * @param key       unique caller key, e.g. `assistant:${userId}`
 * @param limit     max requests per window
 * @param windowMs  window length in ms
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

// Opportunistic cleanup so the Map can't grow unbounded over a long uptime.
if (typeof setInterval !== "undefined") {
  const t = setInterval(() => {
    const now = Date.now();
    buckets.forEach((v, k) => {
      if (v.resetAt <= now) buckets.delete(k);
    });
  }, 60_000);
  // Don't keep the process alive just for cleanup.
  (t as unknown as { unref?: () => void }).unref?.();
}
