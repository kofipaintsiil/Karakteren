"use client";

import { useState } from "react";

interface Props {
  url: string;
  grade: number;
  subject: string;
}

export default function ShareButton({ url, grade, subject }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: "Karakteren",
      text: `Jeg fikk ${grade} i ${subject}! Øv du også på karakteren.no`,
      url,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share or clipboard failed — silently ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        width: "100%",
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        borderBottom: "4px solid var(--border-dark)",
        borderRadius: "var(--r-lg)",
        padding: "13px",
        fontSize: "14px", fontWeight: 700,
        color: "var(--text)",
        cursor: "pointer",
        marginBottom: "12px",
        fontFamily: "Inter, system-ui, sans-serif",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      {copied ? "Lenke kopiert!" : "Del resultatet"}
    </button>
  );
}
