"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Blobb from "@/components/Blobb";
import { SubjectIcon, SUBJECT_COLORS } from "@/components/SubjectIcon";
import { EXAM_SUBJECTS, EXAM_CATEGORIES } from "@/lib/exam-data";
import FirstTimeIntro from "@/components/FirstTimeIntro";

async function loadPreferences() {
  try {
    const res = await fetch("/api/preferences");
    if (res.ok) return await res.json() as { exam_date?: string };
  } catch { /* offline */ }
  return null;
}

function savePreferences(patch: Record<string, string | null>) {
  fetch("/api/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => { /* offline */ });
}

export default function EksamenPage() {
  const router = useRouter();
  const [examDate, setExamDate] = useState("");
  const hydrated = useRef(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const lsDate = localStorage.getItem("exam-date");
    if (lsDate) setExamDate(lsDate);

    loadPreferences().then((prefs) => {
      if (!prefs) return;
      if (prefs.exam_date) { setExamDate(prefs.exam_date); localStorage.setItem("exam-date", prefs.exam_date); }
      hydrated.current = true;
    });

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        loadPreferences().then(prefs => {
          if (prefs?.exam_date) { setExamDate(prefs.exam_date); localStorage.setItem("exam-date", prefs.exam_date); }
        });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  function handleDateChange(v: string) {
    setExamDate(v);
    localStorage.setItem("exam-date", v);
    savePreferences({ exam_date: v || null });
  }

  const daysLeft = examDate
    ? Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000)
    : null;
  const pastExam = daysLeft !== null && daysLeft < 0;
  const urgency = daysLeft === null || pastExam ? null : daysLeft <= 3 ? "red" : daysLeft <= 7 ? "amber" : "green";
  const urgencyColor = urgency === "red" ? "var(--error)" : urgency === "amber" ? "var(--accent)" : "var(--green)";

  const searchLower = search.toLowerCase();
  const filteredIds = search
    ? EXAM_SUBJECTS.filter(s => s.label.toLowerCase().includes(searchLower)).map(s => s.id)
    : null;

  const SubjectRow = ({ id, idx }: { id: string; idx: number }) => {
    const subj = EXAM_SUBJECTS.find(s => s.id === id);
    if (!subj) return null;
    const color = SUBJECT_COLORS[id] ?? "var(--accent)";
    const hasVariants = !!subj.variants;
    return (
      <button
        onClick={() => { setSearch(""); router.push(`/eksamen/start?subject=${id}`); }}
        style={{
          display: "flex", alignItems: "center", gap: "14px",
          width: "100%", minHeight: "56px", padding: "12px 16px",
          background: "none", border: "none",
          borderTop: idx > 0 ? "1px solid var(--border)" : "none",
          cursor: "pointer", textAlign: "left",
          WebkitTapHighlightColor: "transparent",
          transition: "background 0.1s",
        }}
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "var(--bg-alt)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <SubjectIcon id={id} size={18} color={color} />
        </div>
        <span style={{ flex: 1, fontSize: "15px", fontWeight: 500, color: "var(--text)", lineHeight: 1.3 }}>
          {subj.label}
        </span>
        {hasVariants && (
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>Velg kurs</span>
        )}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  };

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ padding: "16px 0 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "2px" }}>
              Eksamen
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Blobb trekker tema — akkurat som en ekte sensor
            </p>
          </div>
          <div style={{ marginTop: "2px" }}>
            <Blobb mood="idle" size={44} animate />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "32px" }}>

          <FirstTimeIntro
            storageKey="seen_intro_eksamen"
            title="Eksamen"
            body="Blobb trekker et tilfeldig tema, akkurat som sensor gjør på eksamensdagen. Tren på å håndtere det ukjente. Legg inn eksamensdatoen din for nedtelling."
          />

          {/* Exam date — post-exam state */}
          {pastExam ? (
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "20px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "oklch(0.95 0.06 150)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.52 0.16 150)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>Hvordan gikk eksamen?</p>
              </div>
              <p style={{ fontSize: "13px", color: "var(--ink-light)", lineHeight: 1.55, marginBottom: "16px" }}>
                Klar for å øve til neste fagsamtale eller eksamen? Tøm datoen og start på nytt.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleDateChange("")}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "var(--r-full)",
                    border: "1.5px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text)",
                    fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "13px",
                    cursor: "pointer", WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Tøm dato
                </button>
                <button
                  onClick={() => router.push("/oving")}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "var(--r-full)",
                    border: "none", backgroundColor: "var(--accent)", color: "#fff",
                    fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "13px",
                    cursor: "pointer", WebkitTapHighlightColor: "transparent",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                  }}
                >
                  Øv videre →
                </button>
              </div>
            </div>
          ) : (
            /* Normal date picker */
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px" }}>
                Eksamensdato
              </p>
              <input
                type="date"
                value={examDate}
                onChange={e => handleDateChange(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  border: `1.5px solid ${examDate ? "var(--accent)" : "var(--border)"}`,
                  fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", color: "var(--text)",
                  backgroundColor: "var(--bg)", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {daysLeft !== null && (
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: urgencyColor, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: urgencyColor, fontWeight: 600 }}>
                    {daysLeft === 0 ? "Eksamen i dag!" : `${daysLeft} dag${daysLeft === 1 ? "" : "er"} igjen`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Subject picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
              Velg fag
            </p>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="search"
                placeholder="Søk etter fag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", height: "44px", padding: "0 16px 0 40px",
                  borderRadius: "var(--r-full)", border: "1.5px solid var(--border)",
                  backgroundColor: "var(--surface)", fontSize: "15px", color: "var(--text)",
                  fontFamily: "Inter, system-ui, sans-serif", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {filteredIds ? (
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                {filteredIds.length === 0
                  ? <p style={{ padding: "20px 16px", fontSize: "14px", color: "var(--text-muted)" }}>Ingen fag funnet.</p>
                  : filteredIds.map((id, idx) => <SubjectRow key={id} id={id} idx={idx} />)
                }
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {EXAM_CATEGORIES.map(cat => (
                  <div key={cat.label}>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px", paddingLeft: "4px" }}>
                      {cat.label}
                    </p>
                    <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                      {cat.ids.map((id, idx) => <SubjectRow key={id} id={id} idx={idx} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: "var(--accent-bg)", borderRadius: "var(--r-md)",
            padding: "11px 14px", fontSize: "12px", color: "var(--accent-dark)", lineHeight: 1.5,
            display: "flex", gap: "10px", alignItems: "flex-start",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            På eksamensdagen velger sensor temaet for deg. Her trener du på å håndtere det ukjente.
          </div>

        </div>
      </div>
    </AppShell>
  );
}
