import Link from "next/link";
import Blobb from "@/components/Blobb";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Side ikke funnet" };

export default function NotFound() {
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
        fontSize: "clamp(3rem, 15vw, 6rem)",
        fontWeight: 900,
        color: "var(--text)",
        lineHeight: 1,
        marginTop: "24px",
        marginBottom: "8px",
      }}>
        404
      </h1>
      <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>
        Siden finnes ikke
      </p>
      <p style={{ fontSize: "14px", color: "var(--text-faint)", marginBottom: "32px" }}>
        Blobb lette overalt. Ingenting her.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: "inline-block",
          padding: "13px 28px",
          borderRadius: "999px",
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          textDecoration: "none",
        }}
      >
        Tilbake til dashboard
      </Link>
    </div>
  );
}
