"use client";

import { useRouter } from "next/navigation";
import Blobb from "@/components/Blobb";
import Button from "@/components/ui/Button";
import { useState } from "react";

const steps = [
  {
    blobbState: "happy" as const,
    title: "Hei! Jeg er Blobb.",
    body: "Jeg er din personlige eksamenstrener. Litt sarkastisk, men jeg er egentlig på din side.",
    quote: "Greit, la oss se hva du faktisk kan da...",
  },
  {
    blobbState: "thinking" as const,
    title: "Slik fungerer det",
    body: "Jeg trekker et tema fra pensum, stiller spørsmål akkurat som en ekte sensor, og gir deg karakter 1–6 til slutt.",
    quote: "Ingen dom. Ingen vitner. Bare øving.",
  },
  {
    blobbState: "listening" as const,
    title: "Svar høyt eller skriv",
    body: "Du kan bruke mikrofonen til å snakke, eller skrive svaret ditt. Velg det som passer deg best.",
    quote: "Vil du ha et hint? Selvfølgelig vil du det.",
  },
  {
    blobbState: "idle" as const,
    title: "3 gratis prøver per måned",
    body: "Du starter med 3 gratis prøver. Oppgrader til Premium for ubegrenset øving.",
    quote: "6'er energi. Nesten.",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      backgroundColor: "var(--bg)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "360px", textAlign: "center" }}>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "32px" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? "24px" : "8px",
              height: "8px",
              borderRadius: "var(--r-full)",
              backgroundColor: i === step ? "var(--coral)" : "var(--border)",
              transition: "width 300ms ease-out, background-color 300ms",
            }} />
          ))}
        </div>

        {/* Blobb */}
        <div style={{ marginBottom: "24px" }}>
          <Blobb state={current.blobbState} size={120} />
        </div>

        {/* Content */}
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "12px" }}>
          {current.title}
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: "20px" }}>
          {current.body}
        </p>

        {/* Blobb quote */}
        <div style={{
          backgroundColor: "var(--coral-soft)",
          border: "2px solid var(--coral-mid)",
          borderRadius: "var(--r-lg)",
          padding: "14px 18px",
          marginBottom: "32px",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--coral-press)",
          fontStyle: "italic",
        }}>
          &ldquo;{current.quote}&rdquo;
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {isLast ? (
            <Button size="lg" fullWidth onClick={() => router.push("/dashboard")}>
              Start øvingen!
            </Button>
          ) : (
            <Button size="lg" fullWidth onClick={() => setStep((s) => s + 1)}>
              Neste →
            </Button>
          )}
          {!isLast && (
            <Button variant="ghost" size="md" fullWidth onClick={() => router.push("/dashboard")}>
              Hopp over
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
