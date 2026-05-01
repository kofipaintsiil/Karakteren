import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchStats, fetchProfile } from "@/lib/sessions-server";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";

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

  // Count sessions this month
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
    { label: "Abonnement", href: "/pricing", badge: "Gratis" },
    { label: "Personvern", href: "/profil/personvern", badge: null },
    { label: "Hjelp og støtte", href: "/profil/hjelp", badge: null },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0" }}>

        {/* User header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div style={{
            width: "56px", height: "56px",
            borderRadius: "var(--r-full)",
            backgroundColor: "var(--coral-soft)",
            border: "2px solid var(--coral-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 800, color: "var(--coral-press)",
          }}>
            {initial}
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>{displayName}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "16px",
          textAlign: "center",
        }}>
          {[
            { value: stats?.total ?? 0, label: "Prøver" },
            { value: stats?.avg?.toFixed(1) ?? "—", label: "Snitt" },
            { value: stats?.streak ?? 0, label: "Streak" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontWeight: 800, fontSize: "1.375rem", color: "var(--text)" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, marginTop: "2px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Free sessions remaining */}
        <div style={{
          backgroundColor: "var(--yellow-soft)",
          border: "1.5px solid var(--yellow)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
          padding: "14px 16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--text)" }}>
              {remaining} gratis {remaining === 1 ? "prøve" : "prøver"} igjen
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Nullstilles {resetDate}</p>
          </div>
          <Link href="/pricing">
            <Button size="sm">Oppgrader</Button>
          </Link>
        </div>

        {/* Menu */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden",
          marginBottom: "16px",
        }}>
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{item.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {item.badge && <Badge variant="default">{item.badge}</Badge>}
                <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
              </div>
            </Link>
          ))}
        </div>

        <LogoutButton />
      </div>
    </AppShell>
  );
}
