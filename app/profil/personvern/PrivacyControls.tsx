"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

interface Props {
  userId: string;
  initialShowOnLeaderboard: boolean;
}

export default function PrivacyControls({ userId, initialShowOnLeaderboard }: Props) {
  const [show, setShow] = useState(initialShowOnLeaderboard);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("profiles").upsert({ user_id: userId, show_on_leaderboard: show });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        borderBottom: "4px solid var(--border-dark)",
        borderRadius: "var(--r-lg)",
        padding: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
              Vis på topplisten
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5 }}>
              Andre brukere kan se ditt navn og snittkarakter i topplisten.
            </p>
          </div>
          {/* Toggle */}
          <button
            onClick={() => setShow((v) => !v)}
            style={{
              width: "52px",
              height: "28px",
              borderRadius: "var(--r-full)",
              backgroundColor: show ? "var(--coral)" : "var(--border-dark)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background-color 200ms ease-out",
            }}
            aria-label="Toggle toppliste"
          >
            <span style={{
              position: "absolute",
              top: "3px",
              left: show ? "26px" : "3px",
              width: "22px",
              height: "22px",
              borderRadius: "var(--r-full)",
              backgroundColor: "#fff",
              boxShadow: "0 1px 4px oklch(0 0 0 / 0.25)",
              transition: "left 200ms ease-out",
            }} />
          </button>
        </div>
      </div>

      <Button
        size="md"
        onClick={handleSave}
        variant={saved ? "success" : "primary"}
      >
        {saved ? <><Check size={16} style={{ marginRight: "8px" }} />Lagret!</> : saving ? "Lagrer..." : "Lagre innstillinger"}
      </Button>
    </div>
  );
}
