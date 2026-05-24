"use client";

import { useState, useEffect } from "react";

interface FirstTimeIntroProps {
  storageKey: string;
  title: string;
  body: string;
}

export default function FirstTimeIntro({ storageKey, title, body }: FirstTimeIntroProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setVisible(true);
    }
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: "var(--accent-bg)",
      border: "1px solid var(--accent)",
      borderRadius: "var(--r-lg)",
      padding: "14px 16px",
      marginBottom: "16px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "3px" }}>{title}</p>
        <p style={{ fontSize: "12px", color: "var(--accent-dark)", lineHeight: 1.55, opacity: 0.85 }}>{body}</p>
      </div>
      <button
        onClick={dismiss}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--accent)", padding: "0", flexShrink: 0,
          display: "flex", alignItems: "center",
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label="Lukk"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
