"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PremiumButton from "@/components/PremiumButton";

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
  const [annual, setAnnual] = useState(false);

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif", paddingBottom: "32px" }}>

        <div style={{ padding: "24px 0 20px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "8px" }}>
            Enkelt og ærlig
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "20px" }}>
            Start gratis. Oppgrader når du er klar.
          </p>

          {/* Monthly / Annual toggle */}
          <div style={{
            display: "inline-flex",
            backgroundColor: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-full)",
            padding: "3px",
            gap: "2px",
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: "7px 18px",
                borderRadius: "var(--r-full)",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                backgroundColor: !annual ? "var(--bg)" : "transparent",
                color: !annual ? "var(--text)" : "var(--text-muted)",
                boxShadow: !annual ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Månedlig
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: "7px 18px",
                borderRadius: "var(--r-full)",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                backgroundColor: annual ? "var(--bg)" : "transparent",
                color: annual ? "var(--text)" : "var(--text-muted)",
                boxShadow: annual ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Årlig
              <span style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "var(--r-full)",
              }}>
                −20%
              </span>
            </button>
          </div>
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
            <p style={{ fontWeight: 700, fontSize: "18px", color: "var(--text)", marginBottom: "6px" }}>Gratis</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "36px", color: "var(--text)" }}>0</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)", paddingBottom: "4px" }}>kr/mnd</span>
            </div>
            <Link href="/login?signup=1" style={{
              display: "block", width: "100%", padding: "13px", borderRadius: "var(--r-full)",
              border: "1.5px solid var(--border)", backgroundColor: "var(--bg-alt)",
              color: "var(--text)", fontWeight: 600, fontSize: "14px",
              textAlign: "center", textDecoration: "none", marginBottom: "20px",
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
              fontWeight: 700, fontSize: "11px",
              padding: "3px 10px", borderRadius: "var(--r-full)",
            }}>
              POPULÆR
            </span>
            <p style={{ fontWeight: 700, fontSize: "18px", color: "var(--bg)", marginBottom: "6px" }}>Premium</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: annual ? "4px" : "20px" }}>
              <span style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "36px", color: "#fff" }}>
                {annual ? "79" : "99"}
              </span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", paddingBottom: "4px" }}>kr/mnd</span>
              {!annual && (
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", paddingBottom: "4px", textDecoration: "line-through", marginLeft: "4px" }}>
                </span>
              )}
            </div>
            {annual && (
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
                Faktureres 948 kr/år
              </p>
            )}
            <div style={{ marginBottom: "20px" }}>
              <PremiumButton plan={annual ? "annual" : "monthly"} />
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
          Betalingsalternativer: Stripe og Vipps. {annual ? "Faktureres én gang per år." : "Ingen bindingstid."}
        </p>
      </div>
    </AppShell>
  );
}
