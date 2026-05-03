"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function SlettKontoPage() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (confirm !== "SLETT") return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json();
      setError(data.error ?? "Noe gikk galt. Prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "32px", fontFamily: "Inter, system-ui, sans-serif" }}>

        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "24px", padding: "0", fontFamily: "inherit" }}
        >
          ← Tilbake
        </button>

        <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--error)", marginBottom: "8px" }}>
          Slett konto
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "28px" }}>
          Dette sletter kontoen din og all data permanent — eksamenshistorikk, resultater og profil. Det kan ikke angres.
        </p>

        <div style={{
          backgroundColor: "var(--error-bg)",
          border: "1.5px solid var(--error)",
          borderRadius: "var(--r-lg)",
          padding: "18px",
          marginBottom: "24px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--error)", marginBottom: "12px" }}>
            Skriv <strong>SLETT</strong> for å bekrefte:
          </p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.toUpperCase())}
            placeholder="SLETT"
            style={{
              width: "100%", height: "44px", padding: "0 14px",
              backgroundColor: "var(--bg)",
              border: "2px solid var(--error)",
              borderRadius: "var(--r-md)",
              fontSize: "14px", fontWeight: 700,
              color: "var(--error)", fontFamily: "inherit", outline: "none",
              letterSpacing: "0.1em",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "var(--error)", marginBottom: "16px", fontWeight: 600 }}>{error}</p>
        )}

        <button
          onClick={handleDelete}
          disabled={confirm !== "SLETT" || loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
            backgroundColor: confirm === "SLETT" ? "var(--error)" : "var(--bg-alt)",
            color: confirm === "SLETT" ? "#fff" : "var(--text-faint)",
            fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "15px",
            cursor: confirm === "SLETT" ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          {loading ? "Sletter..." : "Slett konto permanent"}
        </button>
      </div>
    </AppShell>
  );
}
