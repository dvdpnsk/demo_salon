import { headers } from "next/headers";

// Einfacher In-Memory Fixed-Window-Limiter.
//
// Hinweis: Auf serverlosen Plattformen (Vercel) ist der Zustand pro
// Instanz und überlebt keine Cold-Starts – er ist also keine harte
// Garantie, hebt die Hürde gegen Brute-Force/Spam aber deutlich. Für
// produktive Härtung über mehrere Instanzen hinweg sollte ein geteilter
// Store (z. B. Upstash Redis, @vercel/kv) verwendet werden.

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

export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;

  // Gelegentliches Aufräumen abgelaufener Einträge, damit die Map nicht
  // unbegrenzt wächst.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  return {
    allowed: true,
    remaining: limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

// Ermittelt die Client-IP aus den (auf Vercel gesetzten) Proxy-Headern.
export async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return headerStore.get("x-real-ip") ?? "unknown";
}

// Variante für Route-Handler, die bereits ein Request-Objekt haben.
export function getClientIpFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
