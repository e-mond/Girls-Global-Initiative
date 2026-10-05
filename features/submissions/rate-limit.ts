type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __ggiRateLimit?: Map<string, Bucket>;
};

/** Cap map size so a burst of unique keys cannot grow memory without bound. */
const MAX_BUCKETS = 8_000;

function buckets() {
  if (!globalStore.__ggiRateLimit) {
    globalStore.__ggiRateLimit = new Map();
  }
  return globalStore.__ggiRateLimit;
}

function pruneExpired(map: Map<string, Bucket>, now: number) {
  if (map.size < MAX_BUCKETS) return;
  for (const [key, bucket] of map) {
    if (bucket.resetAt <= now) map.delete(key);
  }
  // Under sustained unique-IP floods, drop oldest entries rather than OOM.
  if (map.size >= MAX_BUCKETS) {
    const overflow = map.size - Math.floor(MAX_BUCKETS * 0.75);
    let removed = 0;
    for (const key of map.keys()) {
      if (removed >= overflow) break;
      map.delete(key);
      removed += 1;
    }
  }
}

/**
 * Sliding-window rate limit for public form endpoints.
 * Best-effort per isolate on Cloudflare Workers — pair with WAF rate rules
 * for production traffic; never remove this check for deploy convenience.
 */
export function checkRateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const map = buckets();
  pruneExpired(map, now);
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
