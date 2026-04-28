"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Blobb, { BlobbState } from "@/components/Blobb";
import Button from "@/components/ui/Button";
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
  6: { color: "var(--green)",   label: "Fremragende",    blobbState: "happy",       quote: "DET var faktisk bra! Ikke fortell noen at jeg sa det." },
  5: { color: "var(--green)",   label: "Meget godt",     blobbState: "happy",       quote: "6'er energi. Nesten." },
  4: { color: "var(--warning)", label: "Godt",           blobbState: "idle",        quote: "Solid. Du vet hva du gjør." },
  3: { color: "var(--warning)", label: "Nokså godt",     blobbState: "idle",        quote: "Ikke verst. Men du kan bedre." },
  2: { color: "var(--error)",   label: "Lav kompetanse", blobbState: "disappointed", quote: "Interessant svar. Feil, men interessant." },
  1: { color: "var(--error)",   label: "Svært lav",      blobbState: "disappointed", quote: "Vi øver mer. Ingen skam i det." },
};


export default function FeedbackPage() {
  const [result, setResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("examResult");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch {}
    }
  }, []);

  const grade = result?.grade ?? 5;
  const cfg = gradeConfig[grade] ?? gradeConfig[4];
  const strengths = result?.strengths ?? [];
  const improvements = result?.improvements ?? [];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Blobb + quote */}
        <div className="flex flex-col items-center text-center mb-8">
          <Blobb state={cfg.blobbState} size={90} />
          <p style={{ marginTop: "12px", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", fontStyle: "italic", maxWidth: "28ch" }}>
            &ldquo;{cfg.quote}&rdquo;
          </p>
        </div>

        {/* Grade card */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderBottom: "6px solid var(--border-dark)",
          borderRadius: "var(--r-xl)",
          padding: "32px 24px",
          marginBottom: "16px",
          textAlign: "center",
        }}>
          {result && (
            <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "12px" }}>
              {result.subject} — {result.topic}
            </p>
          )}
          <p style={{ fontSize: "6rem", fontWeight: 800, lineHeight: 1, color: cfg.color, marginBottom: "10px" }}>
            {grade}
          </p>
          <span style={{
            display: "inline-block",
            backgroundColor: cfg.color,
            color: "#fff",
            borderRadius: "var(--r-full)",
            padding: "5px 18px",
            fontSize: "14px",
            fontWeight: 800,
          }}>
            {cfg.label}
          </span>
        </div>

        {/* Feedback text */}
        {result?.feedback && (
          <div style={{
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderBottom: "4px solid var(--border-dark)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "10px" }}>
              Tilbakemelding
            </p>
            <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, fontWeight: 500 }}>{result.feedback}</p>
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div style={{
            backgroundColor: "var(--green-soft)",
            border: "2px solid var(--green)",
            borderBottom: "4px solid var(--green-press)",
            borderRadius: "var(--r-lg)",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--green-press)", marginBottom: "12px" }}>
              Styrker
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {strengths.map((s) => (
                <li key={s} style={{ fontSize: "14px", color: "var(--green-press)", fontWeight: 600, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} strokeWidth={2} color="var(--green)" style={{ flexShrink: 0, marginTop: "2px" }} />{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        <div style={{
          backgroundColor: "var(--yellow-soft)",
          border: "2px solid var(--yellow)",
          borderBottom: "4px solid var(--yellow-press)",
          borderRadius: "var(--r-lg)",
          padding: "20px",
          marginBottom: "32px",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "oklch(0.44 0.15 82)", marginBottom: "12px" }}>
            Kan forbedres
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {improvements.map((s) => (
              <li key={s} style={{ fontSize: "14px", color: "oklch(0.38 0.14 82)", fontWeight: 600, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <ArrowRight size={16} strokeWidth={2} color="oklch(0.44 0.15 82)" style={{ flexShrink: 0, marginTop: "2px" }} />{s}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
          <Link href="/dashboard"><Button size="lg" fullWidth>Øv igjen</Button></Link>
          <Link href="/dashboard"><Button variant="secondary" size="lg" fullWidth>Tilbake til dashboard</Button></Link>
        </div>
      </div>
    </AppShell>
  );
}
