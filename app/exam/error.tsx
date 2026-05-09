"use client";

import { useEffect } from "react";
import Blobb from "@/components/Blobb";
import { useRouter } from "next/navigation";

export default function ExamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

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
      <Blobb state="disappointed" size={80} />
      <h2 style={{
        fontFamily: "Syne, system-ui, sans-serif",
        fontSize: "1.5rem",
        fontWeight: 800,
        color: "var(--text)",
        marginTop: "20px",
        marginBottom: "8px",
      }}>
        Eksamen krasjet
      </h2>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px", maxWidth: "300px", lineHeight: 1.6 }}>
        Noe gikk galt. Svaret ditt er ikke tapt — prøv å start eksamen på nytt.
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
          width: "100%",
          maxWidth: "280px",
        }}
      >
        Prøv igjen
      </button>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          padding: "13px 28px",
          borderRadius: "999px",
          backgroundColor: "transparent",
          color: "var(--text-muted)",
          fontWeight: 600,
          fontSize: "14px",
          border: "2px solid var(--border)",
          cursor: "pointer",
          width: "100%",
          maxWidth: "280px",
        }}
      >
        Gå til dashboard
      </button>
    </div>
  );
}
