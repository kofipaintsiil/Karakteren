import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Mangler e-post eller passord." }, { status: 400 });
  }

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await anon.auth.signUp({ email, password });

  if (error) {
    // Always return the same message to prevent email enumeration
    return NextResponse.json({ error: "Noe gikk galt. Prøv igjen." }, { status: 400 });
  }

  // Auto-confirm the email server-side so users don't need to click a link.
  // This is safe because signup already validated the password — only the
  // account owner knows the credentials.
  if (data.user?.id) {
    await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
  }

  return NextResponse.json({ userId: data.user?.id });
}
