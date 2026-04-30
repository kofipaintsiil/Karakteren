import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell, Shield, HelpCircle, Trash2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = { title: "Instillinger" };

const items = [
  { label: "Varsler",      href: "/instillinger/varsler",   icon: Bell,       desc: "Push og e-postvarsler" },
  { label: "Personvern",   href: "/profil/personvern",      icon: Shield,     desc: "Datapolitikk og cookies" },
  { label: "Hjelp og støtte", href: "/profil/hjelp",        icon: HelpCircle, desc: "Kontakt oss" },
  { label: "Slett konto",  href: "/instillinger/slett",     icon: Trash2,     desc: "Permanent sletting", danger: true },
];

export default async function InstillingerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/instillinger");

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
            Instillinger
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600 }}>
            {user.email}
          </p>
        </div>

        <div style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          marginBottom: "16px",
        }}>
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                textDecoration: "none",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--r-sm)",
                backgroundColor: item.danger ? "oklch(0.96 0.04 22)" : "var(--surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <item.icon size={18} strokeWidth={1.75} color={item.danger ? "var(--error)" : "var(--text-muted)"} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: item.danger ? "var(--error)" : "var(--text)" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-faint)", fontWeight: 600 }}>{item.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
            </Link>
          ))}
        </div>

        <LogoutButton />
      </div>
    </AppShell>
  );
}
