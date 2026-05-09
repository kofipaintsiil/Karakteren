import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    const { data, error } = await adminClient().rpc("check_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });
    if (error) throw error;
    return data as boolean;
  } catch (err) {
    // If DB is unreachable, fail open so users aren't blocked by infrastructure issues
    console.error("rate-limit DB error:", err);
    return true;
  }
}
