import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import GradeChart from "@/components/GradeChart";
import WeakAreas from "@/components/WeakAreas";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchSessions } from "@/lib/sessions-server";

export const metadata: Metadata = { title: "Dashboard" };

function gradeColor(g: number): string {
  if (g >= 5) return "oklch(0.62 0.14 150)";
  if (g >= 4) return "var(--accent)";
  if (g >= 3) return "oklch(0.65 0.14 85)";
  return "oklch(0.58 0.18 22)";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "I dag";
  if (diff === 1) return "I går";
  return `${diff} dager siden`;
}

const SUBJECT_COLORS: Record<string, string> = {
  norsk:       "oklch(72% 0.12 45)",
  matematikk:  "oklch(72% 0.12 200)",
  fysikk:      "oklch(72% 0.12 260)",
  kjemi:       "oklch(72% 0.12 150)",
  biologi:     "oklch(72% 0.12 130)",
  historie:    "oklch(72% 0.12 60)",
  naturfag:    "oklch(72% 0.12 180)",
  samfunnsfag: "oklch(72% 0.12 90)",
  engelsk:     "oklch(72% 0.12 220)",
  geografi:    "oklch(72% 0.12 160)",
};
function subjectColor(subject: string) {
  const key = subject.toLowerCase().split(" ")[0];
  return SUBJECT_COLORS[key] ?? "var(--accent)";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, sessions] = user
    ? await Promise.all([fetchStats(user.id), fetchSessions(user.id)])
    : [null, []];

  const recentSessions = sessions.slice(0, 6);
  const streak = stats?.streak ?? 0;
  const displayName = user?.email?.split("@")[0] ?? "Elev";

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "8px" }}>

        {/* Greeting */}
        <div style={{ padding: "20px 0 16px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>God dag,</p>
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "26px",
            letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "16px",
          }}>
            {displayName} 👋
          </h1>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              { val: stats?.total ?? 0, label: "Prøver" },
              { val: stats?.avg?.toFixed(1) ?? "—", label: "Snitt" },
              { val: `${streak}${streak > 0 ? "🔥" : ""}`, label: "Dager på rad" },
            ].map(s => (
              <div key={s.label} style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "14px 12px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--text)" }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: "var(--ink-light)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New exam CTA */}
        <div style={{ marginBottom: "20px" }}>
          <Link href="/exam" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            backgroundColor: "var(--accent)", color: "#fff",
            fontWeight: 600, fontSize: "15px",
            padding: "14px", borderRadius: "var(--r-full)",
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}>
            + Ny prøve
          </Link>
        </div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <section style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
              Siste prøver
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentSessions.map((s) => {
                const color = subjectColor(s.subject);
                return (
                  <Link key={s.id} href={`/dashboard/session/${s.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-md)",
                      padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: "14px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}>
                      <div style={{
                        width: "40px", height: "40px",
                        borderRadius: "10px",
                        backgroundColor: color + "30",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color }}>{s.subject[0]}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{s.subject}</p>
                        <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>{s.topic} · {formatDate(s.created_at)}</p>
                      </div>
                      {s.grade && (
                        <span style={{
                          fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: "22px",
                          color: gradeColor(s.grade), flexShrink: 0,
                        }}>{s.grade}</span>
                      )}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-light)", flexShrink: 0 }}>
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Progress chart */}
        {stats && stats.chartData.length > 1 && (
          <section style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>Fremgang</p>
            <div style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <GradeChart data={stats.chartData} />
            </div>
          </section>
        )}

        {/* Subject averages */}
        <section style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>Fag-oversikt</p>
          <WeakAreas subjectAvgs={stats?.subjectAvgs ?? []} />
        </section>

      </div>
    </AppShell>
  );
}
