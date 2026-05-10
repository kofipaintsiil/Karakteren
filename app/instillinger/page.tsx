"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import LogoutButton from "@/components/LogoutButton";
import { useLang } from "@/components/LangProvider";
import { usePush } from "@/components/PushProvider";
import type { Lang } from "@/lib/i18n";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void | Promise<void> }) {
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
  const { lang, setLang, t } = useLang();
  const { permission, subscribe, unsubscribe } = usePush();
  const [dark, setDark] = useState(false);
  const [voice, setVoice] = useState<"female" | "male">("female");
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deferredInstall = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    setIsIOS(ios && safari);

    const handler = (e: Event) => {
      e.preventDefault();
      deferredInstall.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    setDark(localStorage.getItem("dark-mode") === "true");
    const savedVoice = localStorage.getItem("examiner-voice") as "female" | "male" | null;
    if (savedVoice) setVoice(savedVoice);

    return () => window.removeEventListener("beforeinstallprompt", handler);

    // Sync prefs from DB (source of truth)
    fetch("/api/preferences").then(r => r.ok ? r.json() : null).then(prefs => {
      if (!prefs) return;
      if (prefs.examiner_voice) {
        setVoice(prefs.examiner_voice);
        localStorage.setItem("examiner-voice", prefs.examiner_voice);
      }
      if (prefs.dark_mode !== undefined && prefs.dark_mode !== null) {
        setDark(prefs.dark_mode);
      }
    }).catch(() => {});
  }, []);

  function handleVoiceChange(v: "female" | "male") {
    setVoice(v);
    localStorage.setItem("examiner-voice", v);
    fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examiner_voice: v }),
    }).catch(() => {});
  }

  function toggleDark(v: boolean) {
    setDark(v);
    localStorage.setItem("dark-mode", String(v));
    document.documentElement.setAttribute("data-dark", v ? "true" : "false");
    window.dispatchEvent(new Event("dark-mode-change"));
    fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dark_mode: v }),
    }).catch(() => {});
  }

  async function toggleNotifications(v: boolean) {
    setNotifError(null);
    setNotifLoading(true);
    try {
      if (v) {
        const ok = await subscribe();
        if (!ok && Notification.permission === "denied") {
          setNotifError("Blokkert av nettleseren — tillat varsler i nettleserinnstillingene");
        } else if (!ok) {
          setNotifError("Kunne ikke aktivere varsler. Prøv igjen.");
        }
      } else {
        await unsubscribe();
      }
    } finally {
      setNotifLoading(false);
    }
  }

  async function installApp() {
    if (deferredInstall.current) {
      deferredInstall.current.prompt();
      const { outcome } = await deferredInstall.current.userChoice;
      if (outcome === "accepted") { setCanInstall(false); deferredInstall.current = null; }
    } else if (isIOS) {
      setShowIOSHint(true);
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "20px", fontFamily: "Inter, system-ui, sans-serif" }}>

        <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
          {t("set_title")}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-light)", marginBottom: "4px" }}>{t("set_subtitle")}</p>

        {/* Utseende */}
        <SectionLabel>{t("set_appearance")}</SectionLabel>
        <Card>
          <Row label={t("set_dark")} sublabel={t("set_dark_sub")}>
            <Toggle value={dark} onChange={toggleDark} />
          </Row>
        </Card>

        {/* Språk */}
        <SectionLabel>{t("set_language")}</SectionLabel>
        <Card>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{t("set_app_lang")}</p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {([["nb", "Bokmål"], ["en", "English"]] as [Lang, string][]).map(([code, lbl]) => (
                <button key={code} onClick={() => {
                  setLang(code);
                  fetch("/api/preferences", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ language: code }),
                  }).catch(() => {});
                }} style={{
                  padding: "5px 10px", borderRadius: "8px", border: "none",
                  backgroundColor: lang === code ? "var(--text)" : "var(--bg-alt)",
                  color: lang === code ? "var(--bg)" : "var(--text-muted)",
                  fontFamily: "Inter, system-ui, sans-serif", fontSize: "12px", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                }}>{lbl}</button>
              ))}
            </div>
          </div>
        </Card>

        {/* Eksaminatorstemme */}
        <SectionLabel>Eksaminatorstemme</SectionLabel>
        <Card>
          <div style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Velg stemme</p>
            <p style={{ fontSize: "12px", color: "var(--ink-light)", marginBottom: "12px" }}>Hvilken stemme skal eksaminator bruke?</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {([
                { value: "female", label: "Kvinne" },
                { value: "male",   label: "Mann" },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleVoiceChange(opt.value)}
                  style={{
                    flex: 1, padding: "12px 8px", borderRadius: "var(--r-md)", border: "none",
                    backgroundColor: voice === opt.value ? "var(--text)" : "var(--bg-alt)",
                    color: voice === opt.value ? "var(--bg)" : "var(--text-muted)",
                    fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 4px" }}>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
                  </svg>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Varsler */}
        <SectionLabel>{t("set_notifs")}</SectionLabel>
        <Card>
          {permission === "unsupported" ? (
            <Row label={t("set_daily")} sublabel="Ikke støttet i denne nettleseren">
              <span style={{ fontSize: "12px", color: "var(--ink-light)" }}>—</span>
            </Row>
          ) : (
            <div>
              <Row label={t("set_daily")} sublabel={permission === "denied" ? "Blokkert — tillat i nettleserinnstillingene" : t("set_daily_sub")}>
                {notifLoading
                  ? <span style={{ fontSize: "12px", color: "var(--ink-light)" }}>...</span>
                  : <Toggle value={permission === "granted"} onChange={toggleNotifications} />
                }
              </Row>
              {notifError && (
                <div style={{ padding: "10px 16px", fontSize: "12px", color: "var(--error)", borderTop: "1px solid var(--border)" }}>
                  {notifError}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Legg til på hjemskjerm */}
        {!isStandalone && (isIOS || canInstall) && (
          <>
            <SectionLabel>App</SectionLabel>
            <Card>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)", marginBottom: "2px" }}>Legg til på hjemskjermen</p>
                <p style={{ fontSize: "12px", color: "var(--ink-light)", marginBottom: "12px" }}>
                  Få raskere tilgang — fungerer som en vanlig app
                </p>
                {showIOSHint ? (
                  <div style={{ backgroundColor: "var(--bg-alt)", borderRadius: "var(--r-md)", padding: "12px 14px", fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>
                    Trykk <strong>Del-knappen</strong> (firkant med pil opp) nederst i Safari, og velg <strong>«Legg til på hjemskjerm»</strong>.
                  </div>
                ) : (
                  <button
                    onClick={installApp}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "var(--r-full)",
                      border: "none", backgroundColor: "var(--accent)", color: "#fff",
                      fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {isIOS ? "Vis meg hvordan" : "Installer app"}
                  </button>
                )}
              </div>
            </Card>
          </>
        )}

        {/* Konto */}
        <SectionLabel>{t("set_account")}</SectionLabel>
        <Card>
          <Link href="/profil" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{t("set_edit")}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{t("set_edit_sub")}</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/pricing" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{t("set_sub")}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{t("set_sub_sub")}</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/profil/personvern" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{t("set_privacy")}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{t("set_privacy_sub")}</p>
            </div>
            <ChevronRight />
          </Link>
          <Link href="/profil/hjelp" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{t("set_help")}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{t("set_help_sub")}</p>
            </div>
            <ChevronRight />
          </Link>
        </Card>

        {/* Danger zone */}
        <SectionLabel>{t("set_danger")}</SectionLabel>
        <Card>
          <Link href="/instillinger/slett" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", textDecoration: "none" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--error)" }}>{t("set_delete")}</p>
              <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "1px" }}>{t("set_delete_sub")}</p>
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
