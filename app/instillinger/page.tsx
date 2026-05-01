import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = { title: "Innstillinger" };

const sections = [
  {
    label: "Konto",
    items: [
      { label: "Abonnement", href: "/pricing", sublabel: "Gratis plan" },
      { label: "Personvern", href: "/profil/personvern", sublabel: "Datapolitikk og cookies" },
      { label: "Hjelp og støtte", href: "/profil/hjelp", sublabel: "Kontakt oss" },
    ],
  },
];

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-light)", flexShrink: 0 }}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function InstillingerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/instillinger");

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "20px", fontFamily: "Inter, system-ui, sans-serif" }}>

        <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
          Innstillinger
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-light)", marginBottom: "28px" }}>{user.email}</p>

        {sections.map(section => (
          <div key={section.label} style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>
              {section.label}
            </p>
            <div style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px",
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{item.label}</p>
                    <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{item.sublabel}</p>
                  </div>
                  <ChevronRight />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>Konto</p>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <Link href="/instillinger/slett" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", textDecoration: "none",
            }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--error)" }}>Slett konto</p>
                <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Permanent sletting av alle data</p>
              </div>
              <ChevronRight />
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <LogoutButton />
        </div>

      </div>
    </AppShell>
  );
}
