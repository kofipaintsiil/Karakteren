import { createBrowserClient } from "@supabase/ssr";

const FREE_LIMIT    = 3;
const PREMIUM_LIMIT = 60;

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getSessionsThisMonth(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", start.toISOString());

  return count ?? 0;
}

export async function isPremium(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  return (
    data?.status === "active" &&
    data?.current_period_end != null &&
    new Date(data.current_period_end) > new Date()
  );
}

export async function canStartExam(): Promise<{ allowed: boolean; isPremium: boolean; used: number; limit: number }> {
  const premium = await isPremium();
  const limit = premium ? PREMIUM_LIMIT : FREE_LIMIT;
  const used = await getSessionsThisMonth();
  return { allowed: used < limit, isPremium: premium, used, limit };
}
