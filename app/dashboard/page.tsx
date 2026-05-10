import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import GradeChart from "@/components/GradeChart";
import WeakAreas from "@/components/WeakAreas";
import { SubjectIcon, subjectColor } from "@/components/SubjectIcon";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchSessions, fetchProfile } from "@/lib/sessions-server";

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

function Shimmer({ w, h, radius = "var(--r-md)" }: { w: string; h: string; radius?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      backgroundColor: "var(--bg-alt)",
      animation: "shimmer 1.4s ease-in-out infinite",
    }} />
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ paddingTop: "8px" }}>
      <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>

      {/* Greeting */}
      <div style={{ padding: "20px 0 16px" }}>
        <Shimmer w="60px" h="13px" radius="6px" />
        <div style={{ marginTop: "6px", marginBottom: "16px" }}>
          <Shimmer w="160px" h="28px" radius="8px" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <Shimmer w="40px" h="22px" radius="6px" />
              <Shimmer w="56px" h="11px" radius="4px" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginBottom: "20px" }}>
        <Shimmer w="100%" h="48px" radius="var(--r-full)" />
      </div>

      {/* Recent sessions */}
      <div style={{ marginBottom: "8px" }}>
        <Shimmer w="80px" h="11px" radius="4px" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px" }}>
            <Shimmer w="40px" h="40px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <Shimmer w="100px" h="14px" radius="5px" />
              <Shimmer w="140px" h="12px" radius="4px" />
            </div>
            <Shimmer w="24px" h="24px" radius="6px" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, sessions] = user
    ? await Promise.all([fetchStats(user.id), fetchSessions(user.id)])
    : [null, []];

  const profile = user ? await fetchProfile(user.id) : null;
  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Elev";

  const recentSessions = sessions.slice(0, 6);
  const streak = stats?.streak ?? 0;

  const daysToExam = profile?.exam_date
    ? Math.ceil((new Date(profile.exam_date).setHours(23, 59, 59, 999) - Date.now()) / 86400000)
    : null;

  return (
    <div style={{ paddingTop: "8px" }}>

      {/* Greeting */}
      <div style={{ padding: "20px 0 16px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>God dag,</p>
        <h1 style={{
          fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "26px",
          letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "16px",
        }}>
          {displayName}
        </h1>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { val: stats?.total ?? 0, label: "Prøver", streak: false },
            { val: stats?.avg?.toFixed(1) ?? "—", label: "Snitt", streak: false },
            { val: streak, label: "Dager på rad", streak: streak > 0 },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              padding: "14px 12px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "20px", color: s.streak ? "oklch(0.7 0.18 45)" : "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                {s.streak && (
                  <svg width="14" height="16" viewBox="0 0 14 18" fill="none" style={{ flexShrink: 0, marginBottom: "-1px" }}>
                    <path d="M8 1C8 1 10 4 10 6.5C10 8 9 9 8 9C8 9 9 7 7.5 5.5C7.5 5.5 7 8 5 9.5C4 10.2 3 11 3 12.5C3 15 5 17 7 17C9 17 11 15.5 11 13C11 11 9.5 9.5 9 8.5C10.5 10 13 11 13 13.5C13 16.5 10.5 18 7 18C3.5 18 1 15.5 1 12.5C1 10 2.5 8 4 6.5C5 5.5 6 4 6 2.5C6.5 3 8 1 8 1Z" fill="oklch(0.7 0.18 45)"/>
                  </svg>
                )}
                {s.val}
              </div>
              <div style={{ fontSize: "11px", color: "var(--ink-light)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam countdown */}
      {daysToExam !== null && daysToExam >= 0 && (
        <div style={{
          backgroundColor: daysToExam <= 3 ? "oklch(0.96 0.05 22)" : "var(--surface)",
          border: `1px solid ${daysToExam <= 3 ? "oklch(0.75 0.14 22)" : "var(--border)"}`,
          borderRadius: "var(--r-md)",
          padding: "12px 16px",
          marginBottom: "14px",
          display: "flex", alignItems: "center", gap: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          {daysToExam <= 3 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.18 22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 8v4l3 3"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          )}
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)" }}>
              {daysToExam === 0 ? "Eksamen er i dag!" : daysToExam === 1 ? "1 dag til eksamen" : `${daysToExam} dager til eksamen`}
            </p>
            <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>
              {daysToExam <= 3 ? "Øv nå!" : "Hold streaken og du er klar"}
            </p>
          </div>
        </div>
      )}

      {/* New exam CTA */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/eksamen" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          backgroundColor: "var(--accent)", color: "#fff",
          fontWeight: 600, fontSize: "15px",
          padding: "14px", borderRadius: "var(--r-full)",
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        }}>
          Gå til eksamen →
        </Link>
      </div>

      {/* Empty state */}
      {recentSessions.length === 0 && (
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "32px 20px",
          textAlign: "center",
          marginBottom: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>Ingen prøver ennå</p>
          <p style={{ fontSize: "13px", color: "var(--ink-light)", marginBottom: "20px" }}>
            Ta din første muntlige prøve og se hvordan du ligger an.
          </p>
          <Link href="/eksamen" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            backgroundColor: "var(--accent)", color: "#fff",
            fontWeight: 700, fontSize: "14px",
            padding: "10px 20px", borderRadius: "var(--r-full)",
            textDecoration: "none",
          }}>
            Start første prøve →
          </Link>
        </div>
      )}

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
                      borderRadius: "var(--r-md)",
                      backgroundColor: color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <SubjectIcon id={s.subject.toLowerCase().split(" ")[0]} size={20} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{s.subject}</p>
                      <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>{s.topic} · {formatDate(s.created_at)}</p>
                    </div>
                    {s.grade && (
                      <span style={{
                        fontFamily: "Inter, system-ui, sans-serif", fontWeight: 900, fontSize: "22px",
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
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
