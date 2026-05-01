import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchProfile } from "@/lib/sessions-server";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-light)", flexShrink: 0 }}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const initial = displayName[0]?.toUpperCase() ?? "E";

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

  const menuItems = [
    { label: "Abonnement", href: "/pricing", sublabel: "Gratis plan" },
    { label: "Personvern", href: "/profil/personvern", sublabel: "Datapolitikk og cookies" },
    { label: "Hjelp og støtte", href: "/profil/hjelp", sublabel: "Kontakt oss" },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* User header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div style={{
            width: "56px", height: "56px",
            borderRadius: "var(--r-full)",
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Syne, sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--accent-dark)",
          }}>
            {initial}
          </div>
          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text)", letterSpacing: "-0.3px" }}>{displayName}</p>
            <p style={{ fontSize: "13px", color: "var(--ink-light)", marginTop: "2px" }}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "14px",
          textAlign: "center",
        }}>
          {[
            { value: stats?.total ?? 0, label: "Prøver" },
            { value: stats?.avg?.toFixed(1) ?? "—", label: "Snitt" },
            { value: `${stats?.streak ?? 0}🔥`, label: "Dager på rad" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.375rem", color: "var(--text)" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "var(--ink-light)", fontWeight: 600, marginTop: "2px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Free sessions remaining */}
        <div style={{
          backgroundColor: "var(--accent-bg)",
          border: "1px solid var(--accent)",
          borderRadius: "var(--r-lg)",
          padding: "14px 16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-dark)" }}>
              {remaining} gratis {remaining === 1 ? "prøve" : "prøver"} igjen
            </p>
            <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Nullstilles {resetDate}</p>
          </div>
          <Link href="/pricing" style={{
            padding: "8px 16px", borderRadius: "var(--r-full)", border: "none",
            backgroundColor: "var(--accent)", color: "#fff",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px",
            textDecoration: "none",
          }}>
            Oppgrader
          </Link>
        </div>

        {/* Menu */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
          marginBottom: "16px",
        }}>
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                textDecoration: "none",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{item.sublabel}</p>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>

        <LogoutButton />
      </div>
    </AppShell>
  );
}
