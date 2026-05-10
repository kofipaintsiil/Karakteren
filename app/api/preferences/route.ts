import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("profiles")
    .select("exam_date, exam_fag, exam_variant, examiner_voice, dark_mode, language")
    .eq("id", user.id)
    .single();

  return NextResponse.json(data ?? {});
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    exam_date?: string | null;
    exam_fag?: string | null;
    exam_variant?: string | null;
    examiner_voice?: string | null;
    dark_mode?: boolean | null;
    language?: string | null;
  };

  const record: ProfileInsert = { id: user.id };
  if ("exam_date" in body) record.exam_date = body.exam_date ?? null;
  if ("exam_fag" in body) record.exam_fag = body.exam_fag ?? null;
  if ("exam_variant" in body) record.exam_variant = body.exam_variant ?? null;
  if ("examiner_voice" in body) record.examiner_voice = body.examiner_voice ?? null;
  if ("dark_mode" in body) record.dark_mode = body.dark_mode ?? false;
  if ("language" in body) record.language = body.language ?? "nb";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any).upsert(record, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
