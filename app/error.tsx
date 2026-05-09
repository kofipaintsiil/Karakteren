"use client";

import { useEffect } from "react";
import Blobb from "@/components/Blobb";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
      backgroundColor: "var(--bg)",
    }}>
      <Blobb state="disappointed" size={96} />
      <h1 style={{
        fontFamily: "Syne, system-ui, sans-serif",
        fontSize: "2rem",
        fontWeight: 900,
        color: "var(--text)",
        marginTop: "24px",
        marginBottom: "8px",
      }}>
        Noe gikk galt
      </h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px", maxWidth: "320px", lineHeight: 1.6 }}>
        Blobb vet ikke helt hva som skjedde. Prøv igjen — det ordner seg sikkert.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "13px 28px",
          borderRadius: "999px",
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          marginBottom: "12px",
        }}
      >
        Prøv igjen
      </button>
      <a
        href="/dashboard"
        style={{
          fontSize: "14px",
          color: "var(--text-faint)",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Gå til dashboard
      </a>
    </div>
  );
}
