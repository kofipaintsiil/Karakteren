"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/LogoutButton";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "26px", borderRadius: "13px", border: "none",
        backgroundColor: value ? "var(--accent)" : "var(--bg-alt)",
        position: "relative", cursor: "pointer", transition: "background 0.2s",
        flexShrink: 0, WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{
        position: "absolute", top: "3px",
        left: value ? "21px" : "3px",
        width: "20px", height: "20px", borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.2s ease",
      }} />
    </button>
  );
}

function Row({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderBottom: "1px solid var(--border)",
    }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{label}</p>
        {sublabel && <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{sublabel}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px", marginTop: "24px" }}>
      {children}
    </p>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--ink-light)" }}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)", overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {children}
    </div>
  );
}

export default function InstillingerPage() {
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [streakAlert, setStreakAlert] = useState(true);
  const [language, setLanguage] = useState("nb");

  useEffect(() => {
    setDark(localStorage.getItem("dark-mode") === "true");
    const saved = localStorage.getItem("language");
    if (saved) setLanguage(saved);
    const savedNotif = localStorage.getItem("notifications");
    if (savedNotif !== null) setNotifications(savedNotif === "true");
    const savedStreak = localStorage.getItem("streak-alert");
    if (savedStreak !== null) setStreakAlert(savedStreak === "true");
  }, []);

  function toggleDark(v: boolean) {
    setDark(v);
    localStorage.setItem("dark-mode", String(v));
    document.documentElement.setAttribute("data-dark", v ? "true" : "false");
    window.dispatchEvent(new Event("dark-mode-change"));
  }

  function toggleNotifications(v: boolean) {
    setNotifications(v);
    localStorage.setItem("notifications", String(v));
  }

  function toggleStreakAlert(v: boolean) {
    setStreakAlert(v);
    localStorage.setItem("streak-alert", String(v));
  }

  function setLang(l: string) {
    setLanguage(l);
    localStorage.setItem("language", l);
  }

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "20px", fontFamily: "Inter, system-ui, sans-serif" }}>

        <h1 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
          Innstillinger
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-light)", marginBottom: "4px" }}>App-preferanser og kontoinnstillinger</p>

        {/* Utseende */}
        <SectionLabel>Utseende</SectionLabel>
        <Card>
          <Row label="Mørk modus" sublabel="Skånsomt for øynene om natten">
            <Toggle value={dark} onChange={toggleDark} />
          </Row>
        </Card>

        {/* Språk */}
        <SectionLabel>Språk</SectionLabel>
        <Card>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>Appspråk</p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[["nb", "Bokmål"], ["nn", "Nynorsk"], ["en", "English"]].map(([code, lbl]) => (
                <button key={code} onClick={() => setLang(code)} style={{
                  padding: "5px 10px", borderRadius: "8px", border: "none",
                  backgroundColor: language === code ? "var(--text)" : "var(--bg-alt)",
                  color: language === code ? "var(--bg)" : "var(--text-muted)",
                  fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                }}>{lbl}</button>
              ))}
            </div>
          </div>
        </Card>

        {/* Varsler */}
        <SectionLabel>Varsler</SectionLabel>
        <Card>
          <Row label="Daglige påminnelser" sublabel="Blobb minner deg på å øve">
            <Toggle value={notifications} onChange={toggleNotifications} />
          </Row>
          <Row label="Streak-varsler" sublabel="Ikke bryt rekken din">
            <Toggle value={streakAlert} onChange={toggleStreakAlert} />
          </Row>
        </Card>

        {/* Konto */}
        <SectionLabel>Konto</SectionLabel>
        <Card>
          <Link href="/profil" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>Rediger profil</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Navn og profilbilde</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/pricing" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>Abonnement</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Gratis plan</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/profil/personvern" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>Personvern</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Datapolitikk og cookies</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/profil/hjelp" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>Hjelp og støtte</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Kontakt oss</p>
            </div>
            <ChevronRight />
          </Link>
        </Card>

        {/* Danger zone */}
        <SectionLabel>Faresone</SectionLabel>
        <Card>
          <Link href="/instillinger/slett" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--error)" }}>Slett konto</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>Permanent sletting av alle data</p>
            </div>
            <ChevronRight />
          </Link>
        </Card>

        <div style={{ marginTop: "24px" }}>
          <LogoutButton />
        </div>

      </div>
    </AppShell>
  );
}
