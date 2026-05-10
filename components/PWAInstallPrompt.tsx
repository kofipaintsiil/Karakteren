"use client";

import { useEffect, useState } from "react";

type Mode = "android" | "ios" | null;

export default function PWAInstallPrompt() {
  const [mode, setMode] = useState<Mode>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed or dismissed this session
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      sessionStorage.getItem("pwa-prompt-dismissed") === "1"
    ) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);

    // iOS: show instructions banner (no beforeinstallprompt)
    if (isIOS && isSafari) {
      const t = setTimeout(() => setMode("ios"), 8000);
      return () => clearTimeout(t);
    }

    // Chrome / Android: wait for browser prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDismissed(true);
    setDeferredPrompt(null);
  }

  if (dismissed || !mode) return null;

  return (
    <div style={{
      position: "fixed", bottom: "80px", left: "12px", right: "12px", zIndex: 999,
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: "14px 16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", gap: "12px",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {/* Icon */}
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
        backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L12 16M12 2L8 6M12 2L16 6"/>
          <path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>
          Legg til på hjemskjermen
        </p>
        <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>
          {mode === "ios"
            ? 'Trykk Del-knappen ↑ og velg "Legg til på hjemskjerm"'
            : "Få raskere tilgang til eksamenstreningen"}
        </p>
      </div>

      {mode === "android" && (
        <button onClick={install} style={{
          backgroundColor: "var(--accent)", color: "#fff",
          border: "none", borderRadius: "var(--r-md)",
          padding: "8px 14px", fontSize: "13px", fontWeight: 700,
          cursor: "pointer", flexShrink: 0,
          fontFamily: "Inter, system-ui, sans-serif",
        }}>
          Installer
        </button>
      )}

      <button onClick={dismiss} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "var(--ink-light)", padding: "4px", flexShrink: 0,
        display: "flex", alignItems: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
