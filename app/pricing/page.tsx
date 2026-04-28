import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import PremiumButton from "@/components/PremiumButton";
import { Check } from "lucide-react";

export const metadata: Metadata = { title: "Priser", description: "Gratis 3 prøver per måned. Oppgrader til Premium for ubegrenset øving til 99 kr/mnd." };

const freeFeatures = [
  "3 eksamener per måned",
  "Alle 10 fag",
  "Enkel tilbakemelding",
];

const premiumFeatures = [
  "Ubegrensede eksamener",
  "Alle 10 fag",
  "Detaljert tilbakemelding",
  "Del resultater med venner",
  "Fremgangsanalyse",
  "Svake områder-dashboard",
  "Toppliste-tilgang",
  "Nye funksjoner først",
];

export default function PricingPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: "8px" }}>
            Enkelt og ærlig
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "30ch", margin: "0 auto" }}>
            Start gratis. Oppgrader når du er klar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderBottom: "4px solid var(--border-dark)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
          }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "4px" }}>Gratis</p>
            <div className="flex items-end gap-1 mb-6">
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--text)" }}>0</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)", paddingBottom: "6px" }}>kr/mnd</span>
            </div>
            <Link href="/login?signup=1">
              <Button variant="secondary" size="md" fullWidth style={{ marginBottom: "20px" }}>
                Kom i gang
              </Button>
            </Link>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {freeFeatures.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
                  <Check size={15} strokeWidth={2.5} color="var(--text-faint)" style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div style={{
            backgroundColor: "var(--coral-soft)",
            border: "2px solid var(--coral)",
            borderBottom: "4px solid var(--coral-press)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
            position: "relative",
          }}>
            <span style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--coral)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "var(--r-full)",
              padding: "3px 12px",
              whiteSpace: "nowrap",
            }}>
              Mest populær
            </span>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--coral-press)", marginBottom: "4px" }}>Premium</p>
            <div className="flex items-end gap-1 mb-6">
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--coral-press)" }}>99</span>
              <span style={{ fontSize: "14px", color: "var(--coral-press)", paddingBottom: "6px", opacity: 0.7 }}>kr/mnd</span>
            </div>
            <PremiumButton />
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {premiumFeatures.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--coral-press)" }}>
                  <Check size={15} strokeWidth={2.5} color="var(--coral)" style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-faint)", marginTop: "24px" }}>
          Betalingsalternativer: Stripe og Vipps. Ingen bindingstid.
        </p>
      </div>
    </AppShell>
  );
}
