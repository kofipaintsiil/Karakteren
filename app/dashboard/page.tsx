import type { Metadata } from "next";
import Link from "next/link";
import { Flame, FileText } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import SubjectGrid from "@/components/SubjectGrid";
import Badge from "@/components/ui/Badge";
import GradeChart from "@/components/GradeChart";
import WeakAreas from "@/components/WeakAreas";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchSessions } from "@/lib/sessions-server";

export const metadata: Metadata = { title: "Dashboard" };

function gradeColor(g: number): string {
  if (g >= 5) return "var(--green-press)";
  if (g >= 3) return "oklch(0.44 0.15 82)";
  return "var(--error)";
}

function streakCopy(streak: number): string {
  if (streak === 0) return "Klar for en prøve?";
  if (streak === 1) return "En dag i strekk.";
  if (streak < 5) return `${streak} dager på rad.`;
  return `${streak} dager. Ganske bra.`;
}

function gradeVariant(g: number): "success" | "warning" | "default" {
  if (g >= 5) return "success";
  if (g >= 3) return "default";
  return "warning";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "I dag";
  if (diff === 1) return "I går";
  return `${diff} dager siden`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, sessions] = user
    ? await Promise.all([fetchStats(user.id), fetchSessions(user.id)])
    : [null, []];

  const recentSessions = sessions.slice(0, 5);
  const streak = stats?.streak ?? 0;

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "20px" }}>

        {/* Subject grid — first thing you see */}
        <section className="mb-8">
          <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "12px" }}>
            Velg fag
          </h2>
          <SubjectGrid mode="exam" />
        </section>

        {/* Session history */}
        <section className="mb-8">
          <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "12px" }}>
            Tidligere prøver
          </h2>
          {recentSessions.length === 0 ? (
            <div style={{
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "40px 24px",
              textAlign: "center",
            }}>
              <FileText size={40} strokeWidth={1.5} color="var(--text-faint)" style={{ marginBottom: "12px" }} />
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>
                Ingen prøver ennå.
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                Velg et fag ovenfor og start øving.
              </p>
              <Link href="/exam?subject=matematikk">
                <Button size="md">Start eksamen</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentSessions.map((s) => (
                <Link key={s.id} href={`/dashboard/session/${s.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "var(--surface)",
                    border: "2px solid var(--border)",
                    borderBottom: "4px solid var(--border-dark)",
                    borderRadius: "var(--r-md)",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>{s.subject}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                        {s.topic} · {formatDate(s.created_at)}
                      </p>
                    </div>
                    {s.grade && <Badge variant={gradeVariant(s.grade)}>{s.grade}</Badge>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Stats — lower on page, less confrontational */}
        {stats && (
          <section className="mb-8">
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "12px" }}>
              Din statistikk
            </h2>

            {/* Streak */}
            <div style={{
              backgroundColor: streak > 0 ? "var(--yellow-soft)" : "var(--surface)",
              border: `2px solid ${streak > 0 ? "var(--yellow-press)" : "var(--border)"}`,
              borderBottom: `4px solid ${streak > 0 ? "var(--yellow-press)" : "var(--border-dark)"}`,
              borderRadius: "var(--r-lg)",
              padding: "16px 20px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  {streakCopy(streak)}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{streak}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>{streak === 1 ? "dag" : "dager"}</span>
                </div>
              </div>
              <Flame size={40} strokeWidth={1.5} color={streak > 0 ? "var(--yellow-press)" : "var(--text-faint)"} style={{ opacity: streak === 0 ? 0.2 : 1, flexShrink: 0 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div style={{ backgroundColor: "var(--surface)", border: "2px solid var(--border)", borderBottom: "4px solid var(--border-dark)", borderRadius: "var(--r-md)", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Snittkarakter</p>
                <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, color: gradeColor(stats.avg) }}>{stats.avg}</p>
                <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "4px" }}>av 6</p>
              </div>
              <div style={{ backgroundColor: "var(--surface)", border: "2px solid var(--border)", borderBottom: "4px solid var(--border-dark)", borderRadius: "var(--r-md)", padding: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Prøver totalt</p>
                <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1, color: "var(--text)" }}>{stats.total}</p>
                <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "4px" }}>{stats.bestSubject !== "—" ? `Best i ${stats.bestSubject}` : "Ingen data ennå"}</p>
              </div>
            </div>
          </section>
        )}

        {/* Progress chart */}
        {stats && stats.chartData.length > 1 && (
          <section className="mb-8">
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "12px" }}>Fremgang</h2>
            <div style={{ backgroundColor: "var(--surface)", border: "2px solid var(--border)", borderBottom: "4px solid var(--border-dark)", borderRadius: "var(--r-lg)", padding: "16px" }}>
              <GradeChart data={stats.chartData} />
            </div>
          </section>
        )}

        {/* Subject averages */}
        <section className="mb-8">
          <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", marginBottom: "12px" }}>Fag-oversikt</h2>
          <WeakAreas subjectAvgs={stats?.subjectAvgs ?? []} />
        </section>

      </div>
    </AppShell>
  );
}
