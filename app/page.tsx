"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Blobb from "@/components/Blobb";
import type { BlobbMood } from "@/components/Blobb";

const MOODS: BlobbMood[] = ["idle", "grumpy", "thinking", "happy"];
const QUOTES = [
  "Greit, la oss se hva du faktisk kan da...",
  "Du kan ikke bare håpe at det går bra.",
  "Hmm. Det der var... et forsøk.",
  "Okay, det var faktisk ikke så dumt.",
];

const STEPS = [
  { n: "1", title: "Trekk et tema", desc: "Blobb velger et tilfeldig tema fra pensum — akkurat som en ekte sensor." },
  { n: "2", title: "Svar på spørsmål", desc: "Snakk i mikrofonen eller skriv svaret ditt. Blobb stiller oppfølgingsspørsmål." },
  { n: "3", title: "Få karakter 1–6", desc: "Etter prøven får du detaljert tilbakemelding og veiledning til neste økt." },
];

export default function LandingPage() {
  const [moodIdx, setMoodIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMoodIdx(i => (i + 1) % MOODS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Sticky nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "rgba(250,248,244,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 20px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.5px", color: "var(--text)" }}>Karakteren</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/login" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--text-muted)", textDecoration: "none", padding: "8px 12px" }}>
              Logg inn
            </Link>
            <Link href="/login?signup=1" style={{
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px",
              backgroundColor: "var(--accent)", color: "#fff",
              padding: "9px 18px", borderRadius: "var(--r-full)",
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              Prøv gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <Blobb mood={MOODS[moodIdx]} size={110} animate />
        </div>

        {/* Quote bubble */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "12px 18px",
          margin: "0 auto 28px",
          maxWidth: "280px",
          fontSize: "13px",
          color: "var(--text-muted)",
          fontStyle: "italic",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          minHeight: "42px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
          position: "relative",
        }}>
          <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", fontSize: "18px" }}>💬</span>
          &ldquo;{QUOTES[moodIdx]}&rdquo;
        </div>

        <h1 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 7vw, 36px)", lineHeight: 1.1,
          letterSpacing: "-1px", color: "var(--text)",
          margin: "0 0 14px",
        }}>
          Øv til muntlig.<br />
          <span style={{ color: "var(--accent)" }}>Tørr det faktisk.</span>
        </h1>

        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 auto 28px", maxWidth: "300px" }}>
          AI-sensor trekker tema, stiller spørsmål og gir deg karakter 1–6. Ingen dom, ingen vitner.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <Link href="/login?signup=1" style={{
            display: "block", width: "100%", maxWidth: "300px",
            backgroundColor: "var(--accent)", color: "#fff",
            fontWeight: 600, fontSize: "15px",
            padding: "14px 28px", borderRadius: "var(--r-full)",
            textDecoration: "none", textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}>
            Start gratis — 3 prøver/mnd
          </Link>
          <Link href="/welcome" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "underline", textDecorationColor: "transparent", padding: "8px" }}>
            Se hvordan det fungerer
          </Link>
        </div>

        <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "10px" }}>
          Ingen betalingskort nødvendig
        </p>
      </section>

      {/* Stats strip */}
      <div style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg-alt)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px", display: "flex", justifyContent: "space-around" }}>
          {[["10", "fag"], ["1–6", "karakter"], ["gratis", "å starte"]].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--text)" }}>{val}</div>
              <div style={{ fontSize: "11px", color: "var(--ink-light)", marginTop: "2px" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 20px" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.3px", marginBottom: "24px", color: "var(--text)" }}>
          Tre steg til bedre karakter
        </h2>
        {STEPS.map(s => (
          <div key={s.n} style={{ display: "flex", gap: "16px", marginBottom: "22px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              backgroundColor: "var(--accent-bg)", color: "var(--accent-dark)",
              fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)", marginBottom: "4px" }}>{s.title}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA bottom */}
      <div style={{ backgroundColor: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 20px 56px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "20px", marginBottom: "8px", color: "var(--text)" }}>
            Klar for en prøve?
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Start med 3 gratis prøver.</p>
          <Link href="/login?signup=1" style={{
            display: "inline-block", width: "100%", maxWidth: "300px",
            backgroundColor: "var(--accent)", color: "#fff",
            fontWeight: 600, fontSize: "15px",
            padding: "14px 28px", borderRadius: "var(--r-full)",
            textDecoration: "none", textAlign: "center",
          }}>
            Lag gratis konto
          </Link>
        </div>
      </div>

    </div>
  );
}
