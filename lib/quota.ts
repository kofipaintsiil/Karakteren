import { createClient } from "@supabase/supabase-js";

const FREE_LIMIT    = 3;
const PREMIUM_LIMIT = 60;

export async function checkQuota(userId: string): Promise<{ allowed: boolean; isPremium: boolean; used: number; limit: number }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check premium status
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .single();

  const isPremium =
    sub?.status === "active" &&
    sub?.current_period_end != null &&
    new Date(sub.current_period_end) > new Date();

  const limit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT;

  // Count exams started this calendar month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  const used = count ?? 0;

  return { allowed: used < limit, isPremium, used, limit };
}
