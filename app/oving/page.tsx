import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import SubjectGrid from "@/components/SubjectGrid";

export const metadata: Metadata = { title: "Øving" };

export default function OvingPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "20px", paddingBottom: "16px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>
            Øvingsmodus
          </h1>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Velg fag, velg emner du vil øve på — Blobb stiller spørsmål og gir deg tilbakemelding underveis.
          </p>
        </div>
        <SubjectGrid mode="study" />
      </div>
    </AppShell>
  );
}
