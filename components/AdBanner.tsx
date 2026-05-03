"use client";

import { useEffect, useRef, useState } from "react";
import { isPremium } from "@/lib/limits";
import Link from "next/link";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner() {
  const [premium, setPremium] = useState<boolean | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    isPremium().then(setPremium);
  }, []);

  useEffect(() => {
    if (premium === false && !pushed.current && process.env.NEXT_PUBLIC_ADSENSE_ID) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {}
    }
  }, [premium]);

  // Don't show anything while loading or for premium users
  if (premium !== false) return null;

  // No AdSense ID yet — show house ad promoting Premium
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return (
      <div style={{
        backgroundColor: "var(--bg-alt)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-faint)", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: "3px" }}>
            Fjern reklame
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.4 }}>
            Ubegrensede prøver + ingen annonser med Premium
          </p>
        </div>
        <Link href="/pricing" style={{
          flexShrink: 0,
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 700,
          padding: "8px 14px",
          borderRadius: "var(--r-full)",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>
          99 kr/mnd
        </Link>
      </div>
    );
  }

  // Real AdSense ad
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "10px", color: "var(--text-faint)", marginBottom: "4px", letterSpacing: "0.5px" }}>ANNONSE</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
