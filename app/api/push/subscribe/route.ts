import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  // Remove any existing record for this endpoint before inserting.
  // Prevents a recycled browser endpoint from staying linked to another user.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("push_subscriptions") as any).delete().eq("endpoint", endpoint);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("push_subscriptions") as any).insert({
    user_id: user.id,
    endpoint,
    p256dh: keys.p256dh,
    auth_key: keys.auth,
  });

  return NextResponse.json({ ok: true });
}
