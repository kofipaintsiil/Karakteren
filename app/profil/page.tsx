import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchProfile } from "@/lib/sessions-server";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";
import EditProfileClient from "./EditProfileClient";

function gradeColor(g: number) {
  if (g >= 5) return "oklch(0.62 0.14 150)";
  if (g >= 4) return "var(--accent)";
  if (g >= 3) return "oklch(0.65 0.14 85)";
  return "oklch(0.58 0.18 22)";
}

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profil");

  const [stats, profile] = await Promise.all([
    fetchStats(user.id),
    fetchProfile(user.id),
  ]);

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "Elev";
  const avatarUrl = (profile as any)?.avatar_url ?? null;

  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const { count: usedThisMonth } = await (await createClient())
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", start.toISOString());

  const remaining = Math.max(0, 3 - (usedThisMonth ?? 0));
  const resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    .toLocaleDateString("nb-NO", { day: "numeric", month: "long" });

  const subjectAvgs = stats?.subjectAvgs ?? [];

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0", fontFamily: "Inter, system-ui, sans-serif" }}>

        <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
          Profil
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-light)", marginBottom: "28px" }}>{user.email}</p>

        {/* Edit avatar + name */}
        <div style={{
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: "16px",
        }}>
          <EditProfileClient initialName={displayName} initialAvatar={avatarUrl} />
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", padding: "20px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px",
          marginBottom: "16px", textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          {[
            { value: stats?.total ?? 0, label: "Prøver totalt" },
            { value: stats?.avg?.toFixed(1) ?? "—", label: "Snittkarakter" },
            { value: `${stats?.streak ?? 0}🔥`, label: "Dager på rad" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.375rem", color: "var(--text)" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "var(--ink-light)", fontWeight: 600, marginTop: "2px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Per-subject breakdown */}
        {subjectAvgs.length > 0 && (
          <div style={{
            backgroundColor: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "18px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: "16px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "14px" }}>
              Karakterer per fag
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {subjectAvgs.slice(0, 6).map(s => (
                <div key={s.subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text)" }}>{s.subject}</span>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: gradeColor(s.avg) }}>{s.avg}/6</span>
                  </div>
                  <div style={{ height: "5px", backgroundColor: "var(--bg-alt)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(s.avg / 6) * 100}%`, backgroundColor: gradeColor(s.avg), borderRadius: "3px", transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free sessions remaining */}
        <div style={{
          backgroundColor: "var(--accent-bg)", border: "1px solid var(--accent)",
          borderRadius: "var(--r-lg)", padding: "14px 16px", marginBottom: "24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-dark)" }}>
              {remaining} gratis {remaining === 1 ? "prøve" : "prøver"} igjen denne måneden
            </p>
            <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Nullstilles {resetDate}</p>
          </div>
          <Link href="/pricing" style={{
            padding: "8px 16px", borderRadius: "var(--r-full)",
            backgroundColor: "var(--accent)", color: "#fff",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px",
            textDecoration: "none",
          }}>
            Oppgrader
          </Link>
        </div>

        <div style={{ marginTop: "8px" }}>
          <LogoutButton />
        </div>
      </div>
    </AppShell>
  );
}
