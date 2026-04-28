"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Blobb from "@/components/Blobb";
import { X } from "lucide-react";

interface UpgradeModalProps {
  used: number;
  limit: number;
  onClose: () => void;
}

export default function UpgradeModal({ used, limit, onClose }: UpgradeModalProps) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "oklch(0.17 0.012 55 / 0.5)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderBottom: "none",
          borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Blobb */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Blobb state="hint" size={80} />
          <p style={{ marginTop: "10px", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", fontStyle: "italic" }}>
            &ldquo;Vil du ha et hint? Selvfølgelig vil du det.&rdquo;
          </p>
        </div>

        {/* Message */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", textAlign: "center", marginBottom: "8px" }}>
          Du har brukt {used}/{limit} gratis prøver
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
          Oppgrader til Premium for ubegrenset øving, detaljert analyse og toppliste-tilgang.
        </p>

        {/* Pricing */}
        <div style={{
          backgroundColor: "var(--coral-soft)",
          border: "2px solid var(--coral)",
          borderBottom: "4px solid var(--coral-press)",
          borderRadius: "var(--r-lg)",
          padding: "16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontWeight: 800, color: "var(--coral-press)", fontSize: "1rem" }}>Premium</p>
            <p style={{ fontSize: "13px", color: "var(--coral)", fontWeight: 600 }}>Ubegrensede prøver</p>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--coral-press)" }}>
            99 <span style={{ fontSize: "0.875rem" }}>kr/mnd</span>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/pricing">
            <Button size="lg" fullWidth onClick={onClose}>
              Oppgrader nå
            </Button>
          </Link>
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            Ikke nå
          </Button>
        </div>
      </div>
    </div>
  );
}
