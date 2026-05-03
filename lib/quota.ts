import { createClient } from "@supabase/supabase-js";

const FREE_LIMIT    = 3;
const PREMIUM_LIMIT = 60;
const CACHE_TTL_MS  = 60_000; // 1 minute

interface CachedQuota {
  allowed: boolean;
  isPremium: boolean;
  used: number;
  limit: number;
  exp: number;
}
const cache = new Map<string, CachedQuota>();

export async function checkQuota(userId: string): Promise<Omit<CachedQuota, "exp">> {
  const now = Date.now();
  const cached = cache.get(userId);
  if (cached && now < cached.exp) {
    const { exp: _, ...rest } = cached;
    return rest;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Run both queries in parallel
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [subResult, countResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart.toISOString()),
  ]);

  const sub = subResult.data;
  const isPremium =
    sub?.status === "active" &&
    sub?.current_period_end != null &&
    new Date(sub.current_period_end) > new Date();

  const limit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT;
  const used = countResult.count ?? 0;
  const result = { allowed: used < limit, isPremium, used, limit };

  cache.set(userId, { ...result, exp: now + CACHE_TTL_MS });
  return result;
}

// Invalidate cache when a new session is saved (called from sessions.ts)
export function invalidateQuotaCache(userId: string) {
  cache.delete(userId);
}
