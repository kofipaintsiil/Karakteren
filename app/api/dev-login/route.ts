import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdmin } from "@supabase/supabase-js";

// Dev-only route — blocked in production
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const origin = new URL(req.url).origin;

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const devEmail = process.env.DEV_LOGIN_EMAIL;
  if (!devEmail) {
    return NextResponse.json({ error: "DEV_LOGIN_EMAIL not set" }, { status: 500 });
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: devEmail,
  });

  if (error || !data.properties?.hashed_token) {
    return NextResponse.json({ error: error?.message ?? "No token" }, { status: 500 });
  }

  // Verify the token server-side and set the session cookie in the response
  const response = NextResponse.redirect(new URL("/dashboard", origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, { ...options, secure: false, sameSite: "lax" });
          });
        },
      },
    }
  );

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: "magiclink",
  });

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 });
  }

  return response;
}
