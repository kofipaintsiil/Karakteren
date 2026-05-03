"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Blobb from "@/components/Blobb";
import { X } from "lucide-react";

interface UpgradeModalProps {
  used: number;
  limit: number;
  isPremium?: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ used, limit, isPremium = false, onClose }: UpgradeModalProps) {
  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1);
  resetDate.setDate(1);
  const resetStr = resetDate.toLocaleDateString("nb-NO", { day: "numeric", month: "long" });

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
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Blobb state="grumpy" size={80} />
          <p style={{ marginTop: "10px", fontSize: "13px", fontWeight: 500, color: "var(--text-muted)", fontStyle: "italic" }}>
            {isPremium
              ? "&ldquo;Imponerende. Du har tømt kvoten din for måneden.&rdquo;"
              : "\"Gratis har sine grenser. Det har jeg alltid sagt.\""}
          </p>
        </div>

        {isPremium ? (
          <>
            <h2 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--text)", textAlign: "center", marginBottom: "8px" }}>
              {used} av {limit} prøver brukt
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
              Du har nådd månedlig grense. Kvoten nullstilles {resetStr}.
            </p>
            <Button size="lg" fullWidth onClick={onClose}>
              OK
            </Button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "Syne, system-ui, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--text)", textAlign: "center", marginBottom: "8px" }}>
              Du har brukt {used}/{limit} gratis prøver
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
              Oppgrader til Premium for ubegrenset øving, detaljert analyse og toppliste-tilgang.
            </p>

            <div style={{
              backgroundColor: "var(--accent-bg)",
              border: "1px solid var(--accent)",
              borderRadius: "var(--r-lg)",
              padding: "16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontWeight: 800, color: "var(--accent-dark)", fontSize: "15px" }}>Premium</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Ubegrensede prøver</p>
              </div>
              <p style={{ fontSize: "24px", fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, color: "var(--accent-dark)" }}>
                99 <span style={{ fontSize: "14px" }}>kr/mnd</span>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/pricing" style={{ textDecoration: "none" }}>
                <Button size="lg" fullWidth onClick={onClose}>
                  Oppgrader nå
                </Button>
              </Link>
              <Button variant="secondary" size="md" fullWidth onClick={onClose}>
                Ikke nå
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
