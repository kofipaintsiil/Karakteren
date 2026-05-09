"use client";
import { useState } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://karakteren.vercel.app";

export default function InviteClient() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(APP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "Karakteren",
        text: "Øv til muntlig eksamen med AI-sensor! Gratis for VGS-elever.",
        url: APP_URL,
      });
    } else {
      copy();
    }
  }

  return (
    <div style={{
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: "18px",
      marginBottom: "24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "var(--r-md)", backgroundColor: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text)" }}>
            Inviter venner
          </p>
          <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>
            Del Karakteren med klassekameratene dine
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={share}
          style={{
            flex: 1, padding: "11px", borderRadius: "var(--r-full)", border: "none",
            backgroundColor: "var(--accent)", color: "#fff",
            fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Del med venner
        </button>
        <button
          onClick={copy}
          style={{
            padding: "11px 16px", borderRadius: "var(--r-full)",
            border: "1.5px solid var(--border)",
            backgroundColor: "var(--surface)", color: "var(--text)",
            fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "14px",
            cursor: "pointer", minWidth: "100px",
          }}
        >
          {copied ? "Kopiert" : "Kopier lenke"}
        </button>
      </div>
    </div>
  );
}
