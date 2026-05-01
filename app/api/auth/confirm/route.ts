import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Confirms an existing unconfirmed user's email so they can log in
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Mangler e-post." }, { status: 400 });

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const user = data.users.find((u) => u.email === email);
  if (!user) return NextResponse.json({ error: "Bruker ikke funnet." }, { status: 404 });

  await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
  return NextResponse.json({ ok: true });
}
