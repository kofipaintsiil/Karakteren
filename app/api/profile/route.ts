import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { display_name } = body;
  if (!display_name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const { error } = await (supabase.from("profiles") as any).upsert({
    user_id: user.id,
    display_name: display_name.trim(),
  }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
