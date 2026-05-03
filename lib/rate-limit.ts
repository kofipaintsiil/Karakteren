// Simple in-memory rate limiter — per serverless instance.
// Good enough to stop abuse bursts; for distributed rate-limiting add Upstash Redis.

interface Window { count: number; reset: number }
const store = new Map<string, Window>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= limit) return false; // blocked

  entry.count++;
  return true; // allowed
}

// Prune stale entries every 5 minutes to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (now > val.reset) store.delete(key);
  }
}, 5 * 60 * 1000);
