import { createBrowserClient } from "@supabase/ssr";

const FREE_LIMIT = 3;

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
    .select("status")
    .eq("user_id", user.id)
    .single();

  return data?.status === "active";
}

export async function canStartExam(): Promise<{ allowed: boolean; used: number; limit: number }> {
  const premium = await isPremium();
  if (premium) return { allowed: true, used: 0, limit: Infinity };
  const used = await getSessionsThisMonth();
  return { allowed: used < FREE_LIMIT, used, limit: FREE_LIMIT };
}
