import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { parseFeedback } from "@/lib/sessions";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, subject, topic, grade, feedback, created_at")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: { id: string; subject: string; topic: string; grade: number | null; feedback: string | null; created_at: string } | null; error: unknown };

  if (error || !data) return NextResponse.json(null);

  const { text, strengths, improvements } = parseFeedback(data.feedback ?? "");
  return NextResponse.json({
    grade: data.grade,
    feedback: text,
    strengths,
    improvements,
    subject: data.subject,
    topic: data.topic,
  });
}
