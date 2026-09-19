type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __ggiRateLimit?: Map<string, Bucket>;
};

function buckets() {
  if (!globalStore.__ggiRateLimit) {
    globalStore.__ggiRateLimit = new Map();
  }
  return globalStore.__ggiRateLimit;
}

/** Simple sliding-window rate limit for public form endpoints. */
export function checkRateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const map = buckets();
  const current = map.get(key);

  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  map.set(key, current);
  return { ok: true };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
