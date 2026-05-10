import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { fetchSession } from "@/lib/sessions-server";
import { parseFeedback } from "@/lib/sessions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, ArrowRight } from "lucide-react";
import Blobb from "@/components/Blobb";
import ShareButton from "@/components/ShareButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tilbakemelding" };

function gradeColor(g: number) {
  if (g >= 5) return "var(--green)";
  if (g >= 3) return "oklch(0.44 0.15 82)";
  return "var(--coral)";
}

function gradeLabel(g: number) {
  if (g === 6) return "Fremragende";
  if (g === 5) return "Meget godt";
  if (g === 4) return "Godt";
  if (g === 3) return "Nokså godt";
  if (g === 2) return "Lav kompetanse";
  return "Svært lav";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const session = await fetchSession(id, user.id);
  if (!session) redirect("/dashboard");

  const grade = session.grade ?? 4;
  const color = gradeColor(grade);
  const { text: feedbackText, strengths, improvements } = parseFeedback(session.feedback ?? "");
  const transcript = session.transcript ?? [];

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>

        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px" }}>
          <ChevronLeft size={16} /> Tilbake
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "4px" }}>
            {session.subject} — {session.topic}
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{formatDate(session.created_at)}</p>
        </div>

        {/* Grade card */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderBottom: "6px solid var(--border-dark)",
          borderRadius: "var(--r-xl)",
          padding: "32px 24px",
          marginBottom: "16px",
          textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <Blobb state={grade >= 5 ? "happy" : grade >= 3 ? "idle" : "disappointed"} size={72} />
          <p style={{ fontSize: "5rem", fontWeight: 800, lineHeight: 1, color, marginTop: "16px", marginBottom: "8px" }}>
            {grade}
          </p>
          <span style={{
            display: "inline-block",
            backgroundColor: color,
            color: "#fff",
            borderRadius: "var(--r-full)",
            padding: "5px 18px",
            fontSize: "14px",
            fontWeight: 800,
          }}>
            {gradeLabel(grade)}
          </span>
        </div>

        {/* Feedback */}
        {feedbackText && (
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderBottom: "4px solid var(--border-dark)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "10px" }}>
              Tilbakemelding
            </p>
            <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, fontWeight: 500 }}>{feedbackText}</p>
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div style={{
            backgroundColor: "var(--green-soft)",
            border: "2px solid var(--green)",
            borderBottom: "4px solid var(--green-press)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--green-press)", marginBottom: "12px" }}>
              Styrker
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {strengths.map((s, i) => (
                <li key={i} style={{ fontSize: "14px", color: "var(--green-press)", fontWeight: 600, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} strokeWidth={2} color="var(--green)" style={{ flexShrink: 0, marginTop: "2px" }} />{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div style={{
            backgroundColor: "var(--yellow-soft)",
            border: "2px solid var(--yellow)",
            borderBottom: "4px solid var(--yellow-press)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "24px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "oklch(0.44 0.15 82)", marginBottom: "12px" }}>
              Kan forbedres
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {improvements.map((s, i) => (
                <li key={i} style={{ fontSize: "14px", color: "oklch(0.38 0.14 82)", fontWeight: 600, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <ArrowRight size={16} strokeWidth={2} color="oklch(0.44 0.15 82)" style={{ flexShrink: 0, marginTop: "2px" }} />{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "12px" }}>
              Samtalen
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {transcript.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === "student" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  backgroundColor: m.role === "student" ? "var(--coral)" : "var(--surface)",
                  color: m.role === "student" ? "#fff" : "var(--text)",
                  border: m.role === "student" ? "2px solid var(--coral-press)" : "2px solid var(--border)",
                  borderRadius: m.role === "student"
                    ? "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)"
                    : "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  display: "flex",
                }}>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <ShareButton
          url={`${process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.no"}/dashboard/session/${session.id}`}
          grade={grade}
          subject={session.subject}
        />

        <Link href={`/exam?subject=${session.subject.toLowerCase()}`}>
          <div style={{
            backgroundColor: "var(--coral)",
            border: "2px solid var(--coral-press)",
            borderBottom: "4px solid var(--coral-press)",
            borderRadius: "var(--r-lg)",
            padding: "14px",
            textAlign: "center",
            fontSize: "15px",
            fontWeight: 800,
            color: "#fff",
            cursor: "pointer",
          }}>
            Øv på {session.subject} igjen
          </div>
        </Link>

      </div>
    </AppShell>
  );
}
