"use client";

import { useState } from "react";
import Blobb, { BlobbState } from "@/components/Blobb";
import Button from "@/components/ui/Button";
import { Share2, Check } from "lucide-react";

interface ShareCardProps {
  grade: number;
  subject: string;
  topic: string;
  label: string;
  blobbState: BlobbState;
  gradeColor: string;
}

export default function ShareCard({ grade, subject, topic, label, blobbState, gradeColor }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  function handleShare() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const text = `Jeg fikk karakter ${grade} (${label}) i ${subject} på Karakteren! 📚\nTema: ${topic}\nØv til eksamen: ${appUrl}`;
    if (navigator.share) {
      navigator.share({ title: "Karakteren-resultat", text, url: appUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" size="lg" fullWidth onClick={() => setOpen(true)}>
        <Share2 size={16} style={{ marginRight: "8px" }} />
        Del resultatet
      </Button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Card preview */}
      <div style={{
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        borderBottom: "4px solid var(--border-dark)",
        borderRadius: "var(--r-xl)",
        padding: "28px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "4px",
          backgroundColor: gradeColor,
        }} />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <Blobb state={blobbState} size={64} />
        </div>
        <p style={{
          fontSize: "11px", fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: "6px",
        }}>
          {subject} — {topic}
        </p>
        <p style={{ fontSize: "4.5rem", fontWeight: 800, lineHeight: 1, color: gradeColor, marginBottom: "8px" }}>
          {grade}
        </p>
        <span style={{
          display: "inline-block",
          backgroundColor: gradeColor,
          color: "#fff",
          borderRadius: "var(--r-full)",
          padding: "4px 16px",
          fontSize: "13px",
          fontWeight: 800,
        }}>
          {label}
        </span>
        <p style={{
          marginTop: "16px", fontSize: "12px", fontWeight: 700,
          color: "var(--text-faint)", letterSpacing: "0.04em",
        }}>
          karakteren.vercel.app
        </p>
      </div>

      <Button size="lg" fullWidth onClick={handleShare}>
        {copied ? (
          <><Check size={16} style={{ marginRight: "8px" }} />Kopiert!</>
        ) : (
          <><Share2 size={16} style={{ marginRight: "8px" }} />Del / Kopier tekst</>
        )}
      </Button>
      <Button variant="ghost" size="md" fullWidth onClick={() => setOpen(false)}>
        Lukk
      </Button>
    </div>
  );
}
