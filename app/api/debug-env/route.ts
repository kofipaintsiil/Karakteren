import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MANGLER";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "MANGLER";
  return NextResponse.json({
    url_start: url.slice(0, 30),
    key_start: key.slice(0, 20),
    key_end: key.slice(-10),
    key_length: key.length,
  });
}
