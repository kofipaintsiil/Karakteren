import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Ikke innlogget" }, { status: 401 }) };
  }
  return { ok: true, userId: user.id };
}
