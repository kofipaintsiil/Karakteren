"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SubjectIcon, SUBJECT_COLORS } from "@/components/SubjectIcon";
import { EXAM_SUBJECTS, EXAM_TOPICS } from "@/lib/exam-data";

function savePreferences(patch: Record<string, string | null>) {
  fetch("/api/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => { /* offline */ });
}

function BackChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EksamenStartInner() {
  const router = useRouter();
  const params = useSearchParams();
  const subjectId = params.get("subject") ?? "norsk";

  const fag = EXAM_SUBJECTS.find(s => s.id === subjectId) ?? EXAM_SUBJECTS[0];
  const color = SUBJECT_COLORS[subjectId] ?? "var(--accent)";

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [drawnTopic, setDrawnTopic] = useState<string | null>(null);

  const activeKey = selectedVariant ?? subjectId;
  const topics = EXAM_TOPICS[activeKey] ?? EXAM_TOPICS[subjectId] ?? [];
  const canDraw = !fag.variants || selectedVariant !== null;

  const activeVariant = fag.variants?.find(v => v.id === selectedVariant);
  const activeLabel = activeVariant ? `${fag.label} ${activeVariant.label}` : fag.label;

  function handleVariantChange(id: string) {
    setSelectedVariant(id);
    setDrawnTopic(null);
    localStorage.setItem("exam-variant", id);
    savePreferences({ exam_fag: subjectId, exam_variant: id });
  }

  function drawTopic() {
    if (!canDraw) return;
    setDrawing(true);
    setDrawnTopic(null);
    savePreferences({ exam_fag: subjectId, exam_variant: selectedVariant });
    setTimeout(() => {
      setDrawnTopic(topics[Math.floor(Math.random() * topics.length)]);
      setDrawing(false);
    }, 1200);
  }

  function startExam() {
    if (!drawnTopic) return;
    router.push(`/exam?subject=${activeKey}&topic=${encodeURIComponent(drawnTopic)}`);
  }

  return (
    <div style={{
      minHeight: "100dvh", backgroundColor: "var(--bg)",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--surface)",
      }}>
        <button
          onClick={() => router.push("/eksamen")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: 600, color: "var(--ink-light)",
            fontFamily: "inherit", padding: 0, WebkitTapHighlightColor: "transparent",
          }}
        >
          <BackChevron />
          Eksamen
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px", maxWidth: "520px", margin: "0 auto", width: "100%", gap: "20px" }}>

        {/* Subject header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            backgroundColor: color + "22",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <SubjectIcon id={subjectId} size={26} color={color} />
          </div>
          <div>
            <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.4px", color: "var(--text)", lineHeight: 1.2 }}>
              {fag.label}
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              {fag.variants ? "Velg kurs nedenfor" : "Blobb trekker et tilfeldig tema"}
            </p>
          </div>
        </div>

        {/* Variant picker */}
        {fag.variants && (
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>
              Velg kurs
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {fag.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => handleVariantChange(v.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    gap: "2px", padding: "14px",
                    borderRadius: "var(--r-lg)",
                    border: selectedVariant === v.id ? "2px solid var(--accent)" : "1.5px solid var(--border)",
                    backgroundColor: selectedVariant === v.id ? "var(--accent-bg)" : "var(--bg)",
                    fontFamily: "Inter, system-ui, sans-serif",
                    cursor: "pointer", transition: "all 0.12s",
                    WebkitTapHighlightColor: "transparent",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "15px", color: selectedVariant === v.id ? "var(--accent-dark)" : "var(--text)" }}>
                    {v.label}
                  </span>
                  <span style={{ fontSize: "12px", color: selectedVariant === v.id ? "var(--accent)" : "var(--text-muted)" }}>
                    {v.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Draw / result */}
        {!drawnTopic ? (
          <button
            onClick={drawTopic}
            disabled={drawing || !canDraw}
            style={{
              width: "100%", padding: "15px", borderRadius: "var(--r-full)", border: "none",
              backgroundColor: canDraw ? "var(--accent)" : "var(--bg-alt)",
              color: canDraw ? "#fff" : "var(--text-muted)",
              fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "15px",
              cursor: canDraw ? "pointer" : "default",
              boxShadow: canDraw ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
              opacity: drawing ? 0.7 : 1,
              transition: "opacity 0.15s, background-color 0.15s",
            }}
          >
            {drawing ? "Trekker tema..." : canDraw ? "Trekk tema og start eksamen" : "Velg kurs ovenfor for å fortsette"}
          </button>
        ) : (
          <>
            <div style={{
              backgroundColor: "var(--text)", borderRadius: "var(--r-lg)", padding: "24px",
              textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px" }}>
                Trukket tema
              </p>
              <p style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.25 }}>
                {drawnTopic}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "6px" }}>
                {activeLabel}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={startExam}
                style={{
                  width: "100%", padding: "15px", borderRadius: "var(--r-full)", border: "none",
                  backgroundColor: "var(--accent)", color: "#fff",
                  fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "15px",
                  cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                }}
              >
                Start eksamen med dette temaet →
              </button>
              <button
                onClick={drawTopic}
                style={{
                  width: "100%", padding: "13px", borderRadius: "var(--r-full)",
                  border: "1.5px solid var(--border)",
                  backgroundColor: "var(--surface)", color: "var(--text)",
                  fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Trekk nytt tema
              </button>
            </div>
          </>
        )}

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
  );
}

export default function EksamenStartPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg)", fontFamily: "Inter, system-ui, sans-serif", color: "var(--text-muted)", fontSize: "14px" }}>
        Laster...
      </div>
    }>
      <EksamenStartInner />
    </Suspense>
  );
}
