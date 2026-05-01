"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Blobb, { BlobbState } from "@/components/Blobb";
import AppShell from "@/components/layout/AppShell";
import ShareCard from "@/components/ShareCard";

interface SessionResult {
  grade: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  subject: string;
  topic: string;
}

const gradeConfig: Record<number, { color: string; label: string; blobbState: BlobbState; quote: string }> = {
  6: { color: "var(--green)",                  label: "Fremragende",    blobbState: "happy",       quote: "DET var faktisk bra! Ikke fortell noen at jeg sa det." },
  5: { color: "var(--green)",                  label: "Meget godt",     blobbState: "happy",       quote: "Okay, det var faktisk ganske bra." },
  4: { color: "var(--accent)",                 label: "Godt",           blobbState: "idle",        quote: "Ikke verst. Kan bli bedre." },
  3: { color: "oklch(65% 0.14 70)",            label: "Nokså godt",     blobbState: "idle",        quote: "Middels, men vi har noe å jobbe med." },
  2: { color: "oklch(58% 0.18 22)",            label: "Lav kompetanse", blobbState: "grumpy",      quote: "Interessant svar. Feil, men interessant." },
  1: { color: "oklch(58% 0.18 22)",            label: "Svært lav",      blobbState: "grumpy",      quote: "Vi øver mer. Ingen skam i det." },
};

export default function FeedbackPage() {
  const router = useRouter();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("examResult");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch {}
    }
    const t = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(t);
  }, []);

  const grade = result?.grade ?? 5;
  const cfg = gradeConfig[grade] ?? gradeConfig[4];
  const strengths = result?.strengths ?? [];
  const improvements = result?.improvements ?? [];

  const circumference = 2 * Math.PI * 52;
  const dashArray = revealed ? (grade / 6) * circumference : 0;

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif", paddingBottom: "32px" }}>

        {/* Grade hero */}
        <div style={{
          padding: "32px 0 28px",
          background: `linear-gradient(160deg, var(--bg-alt) 0%, var(--bg) 100%)`,
          textAlign: "center",
          borderBottom: "1px solid var(--border)",
          marginBottom: "20px",
        }}>
          <Blobb state={cfg.blobbState} size={80} animate />
          <div style={{
            marginTop: "12px", marginBottom: "20px",
            fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic",
          }}>
            &ldquo;{cfg.quote}&rdquo;
          </div>

          {/* Animated grade circle */}
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="130" height="130" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={cfg.color}
                strokeWidth="6"
                strokeDasharray={`${dashArray} ${circumference}`}
                strokeLinecap="round"
                strokeDashoffset={circumference * 0.25}
                style={{ transition: "stroke-dasharray 1s ease", transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: "44px", color: cfg.color, lineHeight: 1, transition: "all 0.5s" }}>
                {revealed ? grade : "?"}
              </div>
              <div style={{ fontSize: "10px", color: "var(--ink-light)", marginTop: "2px" }}>av 6</div>
            </div>
          </div>

          <div style={{ marginTop: "12px", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text)" }}>{cfg.label}</div>
          {result && (
            <div style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "4px" }}>
              {result.subject} · {result.topic}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Feedback text */}
          {result?.feedback && (
            <div style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>
                Blobb sier
              </p>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7 }}>{result.feedback}</p>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div style={{
              backgroundColor: "oklch(96% 0.04 150)",
              border: "1px solid oklch(62% 0.14 150)",
              borderRadius: "var(--r-lg)",
              padding: "18px",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "oklch(42% 0.14 150)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
                Styrker
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {strengths.map((s) => (
                  <li key={s} style={{ fontSize: "14px", color: "oklch(35% 0.14 150)", fontWeight: 500, display: "flex", gap: "10px", alignItems: "flex-start", listStyle: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <path d="M20 6L9 17L4 12" stroke="oklch(52% 0.14 150)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {improvements.length > 0 && (
            <div style={{
              backgroundColor: "oklch(96% 0.04 70)",
              border: "1px solid var(--accent)",
              borderRadius: "var(--r-lg)",
              padding: "18px",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent-dark)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
                Kan forbedres
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {improvements.map((s) => (
                  <li key={s} style={{ fontSize: "14px", color: "var(--accent-dark)", fontWeight: 500, display: "flex", gap: "10px", alignItems: "flex-start", listStyle: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Share card */}
          {result && (
            <ShareCard
              grade={grade}
              subject={result.subject}
              topic={result.topic}
              label={cfg.label}
              blobbState={cfg.blobbState}
              gradeColor={cfg.color}
            />
          )}

          {/* Actions */}
          <button
            onClick={() => router.push("/eksamen")}
            style={{
              width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
              backgroundColor: "var(--accent)", color: "#fff",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
              cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            Øv igjen
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%", padding: "14px", borderRadius: "var(--r-full)",
              border: "1.5px solid var(--border)",
              backgroundColor: "var(--surface)", color: "var(--text)",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Tilbake til dashboard
          </button>
        </div>
      </div>
    </AppShell>
  );
}
