"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Blobb from "@/components/Blobb";
import type { BlobbMood } from "@/components/Blobb";

const STEPS: { mood: BlobbMood; title: string; desc: string; quote: string }[] = [
  {
    mood: "idle",
    title: "Hei! Jeg er Blobb.",
    desc: "Din personlige eksamenstrener. Litt sarkastisk, men jeg er egentlig på din side.",
    quote: "Greit, la oss se hva du faktisk kan da...",
  },
  {
    mood: "thinking",
    title: "Slik fungerer det",
    desc: "Jeg trekker et tema, stiller spørsmål — akkurat som en ekte sensor. Du svarer. Jeg dømmer.",
    quote: "Nei, \"jeg husker det ikke\" er ikke et svar.",
  },
  {
    mood: "happy",
    title: "Du får karakter 1–6",
    desc: "Etter hver prøve gir jeg deg detaljert tilbakemelding. Hva var bra, hva var meh, og hva du bør jobbe med.",
    quote: "Okay, det var faktisk ganske bra.",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div style={{
      minHeight: "100dvh", backgroundColor: "var(--bg)",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      padding: "24px 24px 40px",
      maxWidth: "480px", margin: "0 auto",
    }}>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "36px", marginTop: "8px" }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: "5px", borderRadius: "3px",
            backgroundColor: i <= step ? "var(--accent)" : "var(--border)",
            width: i === step ? "28px" : "14px",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Blobb */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <Blobb mood={s.mood} size={130} animate />
      </div>

      {/* Dark quote box */}
      <div style={{
        backgroundColor: "var(--text)", color: "var(--bg)",
        borderRadius: "var(--r-lg)", padding: "14px 18px",
        fontSize: "13px", fontStyle: "italic",
        marginBottom: "28px", position: "relative", lineHeight: 1.5,
      }}>
        <span style={{ position: "absolute", top: -1, left: "16px", fontSize: "20px", color: "var(--accent)" }}>&ldquo;</span>
        <span style={{ paddingLeft: "12px" }}>{s.quote}</span>
      </div>

      <h2 style={{
        fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "26px",
        letterSpacing: "-0.5px", marginBottom: "10px", color: "var(--text)",
      }}>{s.title}</h2>

      <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "auto" }}>{s.desc}</p>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "40px" }}>
        {step < STEPS.length - 1 ? (
          <>
            <button
              onClick={() => router.push("/login?signup=1")}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "14px 16px" }}
            >
              Hopp over
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
                backgroundColor: "var(--accent)", color: "#fff",
                border: "none", borderRadius: "var(--r-full)", padding: "14px",
                cursor: "pointer",
              }}
            >
              Neste →
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login?signup=1")}
            style={{
              flex: 1, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
              backgroundColor: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "var(--r-full)", padding: "14px",
              cursor: "pointer",
            }}
          >
            Velg et fag →
          </button>
        )}
      </div>
    </div>
  );
}
