import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PremiumButton from "@/components/PremiumButton";

export const metadata: Metadata = { title: "Priser", description: "Gratis 3 prøver per måned. Oppgrader til Premium for ubegrenset øving til 99 kr/mnd." };

const freeFeatures = [
  "3 prøver per måned",
  "Alle 10 fag",
  "Enkel tilbakemelding",
];

const premiumFeatures = [
  "Ubegrensede prøver",
  "Alle 10 fag",
  "Detaljert tilbakemelding",
  "Del resultater med venner",
  "Fremgangsanalyse",
  "Toppliste-tilgang",
  "Nye funksjoner først",
];

function CheckIcon({ color = "var(--green)" }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function PricingPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif", paddingBottom: "32px" }}>

        <div style={{ padding: "24px 0 20px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "8px" }}>
            Enkelt og ærlig
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Start gratis. Oppgrader når du er klar.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Free */}
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--text)", marginBottom: "6px" }}>Gratis</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "36px", color: "var(--text)" }}>0</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)", paddingBottom: "4px" }}>kr/mnd</span>
            </div>
            <Link href="/login?signup=1" style={{
              display: "block", width: "100%", padding: "13px", borderRadius: "var(--r-full)",
              border: "1.5px solid var(--border)", backgroundColor: "var(--bg-alt)",
              color: "var(--text)", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px",
              textAlign: "center", textDecoration: "none", marginBottom: "20px",
              transition: "background-color 0.15s",
            }}>
              Kom i gang
            </Link>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", padding: 0, margin: 0 }}>
              {freeFeatures.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
                  <CheckIcon color="var(--green)" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div style={{
            backgroundColor: "var(--text)",
            borderRadius: "var(--r-lg)",
            padding: "22px",
            position: "relative",
            overflow: "hidden",
          }}>
            <span style={{
              position: "absolute", top: "14px", right: "14px",
              backgroundColor: "var(--accent)", color: "#fff",
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "11px",
              padding: "3px 10px", borderRadius: "var(--r-full)",
            }}>
              POPULÆR
            </span>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--bg)", marginBottom: "6px" }}>Premium</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "36px", color: "#fff" }}>99</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", paddingBottom: "4px" }}>kr/mnd</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <PremiumButton />
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", padding: 0, margin: 0 }}>
              {premiumFeatures.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <CheckIcon color="var(--accent)" /> {f}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--ink-light)", marginTop: "20px" }}>
          Betalingsalternativer: Stripe og Vipps. Ingen bindingstid.
        </p>
      </div>
    </AppShell>
  );
}
