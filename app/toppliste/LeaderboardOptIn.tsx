"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LeaderboardOptIn({ userId }: { userId: string }) {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ id: userId, show_on_leaderboard: true } as any, { onConflict: "id" });
    setLoading(false);
    setJoined(true);
  }

  if (joined) {
    return (
      <div style={{
        backgroundColor: "oklch(0.96 0.05 150)",
        border: "1px solid oklch(0.75 0.14 150)",
        borderRadius: "var(--r-lg)",
        padding: "14px 16px",
        marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <span style={{ fontSize: "20px" }}>🎉</span>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "oklch(0.35 0.1 150)" }}>
          Du er nå på topplisten! Last siden på nytt for å se deg selv.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: "16px",
      marginBottom: "20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>
          Du er ikke på topplisten
        </p>
        <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>
          Bli med og se hvordan du ligger an mot andre
        </p>
      </div>
      <button
        onClick={handleJoin}
        disabled={loading}
        style={{
          backgroundColor: "var(--accent)", color: "#fff",
          border: "none", borderRadius: "var(--r-md)",
          padding: "9px 16px", fontSize: "13px", fontWeight: 700,
          cursor: loading ? "default" : "pointer", flexShrink: 0,
          opacity: loading ? 0.7 : 1,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {loading ? "..." : "Bli med"}
      </button>
    </div>
  );
}
