"use client";

import Link from "next/link";

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function TopNav() {
  return (
    <header style={{
      backgroundColor: "rgba(250,248,244,0.92)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(0,0,0,0.07)",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 16px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{
            width: "28px", height: "28px",
            borderRadius: "var(--r-sm)",
            backgroundColor: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "13px",
            fontFamily: "Syne, sans-serif",
          }}>K</span>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)", fontFamily: "Syne, sans-serif" }}>Karakteren</span>
        </Link>

        {/* Settings gear — top right */}
        <Link href="/instillinger" style={{
          width: "36px", height: "36px",
          borderRadius: "var(--r-md)",
          backgroundColor: "var(--bg-alt)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)",
          textDecoration: "none",
        }}>
          <GearIcon />
        </Link>
      </div>
    </header>
  );
}
