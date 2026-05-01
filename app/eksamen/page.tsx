"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Blobb from "@/components/Blobb";

const SUBJECTS = [
  { id: "norsk",       label: "Norsk",       emoji: "📝" },
  { id: "matematikk",  label: "Matematikk",  emoji: "➗" },
  { id: "fysikk",      label: "Fysikk",      emoji: "⚛️" },
  { id: "kjemi",       label: "Kjemi",       emoji: "🧪" },
  { id: "biologi",     label: "Biologi",     emoji: "🌱" },
  { id: "historie",    label: "Historie",    emoji: "🏛️" },
  { id: "naturfag",    label: "Naturfag",    emoji: "🌍" },
  { id: "samfunnsfag", label: "Samfunnsfag", emoji: "🗺️" },
  { id: "engelsk",     label: "Engelsk",     emoji: "🌐" },
  { id: "geografi",    label: "Geografi",    emoji: "🗻" },
];

const TOPICS: Record<string, string[]> = {
  norsk:       ["Dramatikk og teater", "Retorikk", "Norrøn litteratur", "Modernisme", "Språkhistorie"],
  matematikk:  ["Derivasjon", "Integrasjon", "Vektorer", "Funksjoner", "Statistikk"],
  historie:    ["Mellomkrigstiden", "Andre verdenskrig", "Den kalde krigen", "Industrialisering", "Kolonitiden"],
  fysikk:      ["Mekanikk", "Elektrisitet", "Termodynamikk", "Optikk", "Atomfysikk"],
  kjemi:       ["Syrer og baser", "Organisk kjemi", "Periodesystemet", "Redoks", "Kjemisk likevekt"],
  biologi:     ["Cellebiologi", "Genetikk", "Evolusjon", "Økologi", "Fysiologi"],
  naturfag:    ["Celler og arv", "Bioteknologi", "Elektromagnetisme", "Stråling", "Klima"],
  samfunnsfag: ["Demokrati", "Økonomi", "FN og globalisering", "Menneskerettigheter", "Politiske systemer"],
  engelsk:     ["Literature", "Grammar", "Global Issues", "British Culture", "American Culture"],
  geografi:    ["Klima og miljø", "Befolkning", "Ressurser", "Urbanisering", "Naturkatastrofer"],
};

export default function EksamenPage() {
  const router = useRouter();
  const [selectedFag, setSelectedFag] = useState("norsk");
  const [examDate, setExamDate] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [drawnTopic, setDrawnTopic] = useState<string | null>(null);

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000))
    : null;
  const urgency = daysLeft === null ? null : daysLeft <= 3 ? "red" : daysLeft <= 7 ? "amber" : "green";
  const urgencyColor = urgency === "red" ? "var(--error)" : urgency === "amber" ? "oklch(65% 0.14 70)" : "var(--green)";

  const fag = SUBJECTS.find(s => s.id === selectedFag);

  function drawTopic() {
    setDrawing(true);
    setDrawnTopic(null);
    const list = TOPICS[selectedFag] ?? TOPICS.norsk;
    setTimeout(() => {
      setDrawnTopic(list[Math.floor(Math.random() * list.length)]);
      setDrawing(false);
    }, 1200);
  }

  function startExam() {
    router.push(`/exam?subject=${selectedFag}${drawnTopic ? `&topic=${encodeURIComponent(drawnTopic)}` : ""}`);
  }

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "3px" }}>
              Eksamen
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Blobb trekker tema — akkurat som en ekte sensor
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
            <Blobb mood="idle" size={48} animate />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "24px" }}>

          {/* Exam date */}
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>
              Eksamensdato
            </p>
            <input
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px",
                borderRadius: "var(--r-md)",
                border: `1.5px solid ${examDate ? "var(--accent)" : "var(--border)"}`,
                fontFamily: "Inter, sans-serif", fontSize: "15px", color: "var(--text)",
                backgroundColor: "var(--bg)", outline: "none",
                transition: "border-color 0.2s", boxSizing: "border-box",
              }}
            />
            {daysLeft !== null && (
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: urgencyColor, flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: urgencyColor, fontWeight: 600 }}>
                  {daysLeft === 0 ? "Eksamen i dag!" : `${daysLeft} dag${daysLeft === 1 ? "" : "er"} igjen`}
                </span>
              </div>
            )}
          </div>

          {/* Subject pills */}
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>Fag</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedFag(s.id); setDrawnTopic(null); }}
                  style={{
                    padding: "7px 14px", borderRadius: "var(--r-full)", border: "none",
                    backgroundColor: selectedFag === s.id ? "var(--text)" : "var(--bg-alt)",
                    color: selectedFag === s.id ? "var(--bg)" : "var(--text-muted)",
                    fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic draw */}
          <div style={{
            backgroundColor: drawnTopic ? "var(--text)" : "var(--surface)",
            border: `1px solid ${drawnTopic ? "var(--text)" : "var(--border)"}`,
            borderRadius: "var(--r-lg)",
            padding: "28px 20px",
            textAlign: "center",
            transition: "all 0.4s ease",
            minHeight: "120px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {drawing ? (
              <>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      backgroundColor: "var(--accent)",
                      animation: `pulse 0.8s ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Blobb trekker tema...</p>
              </>
            ) : drawnTopic ? (
              <>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.8px", textTransform: "uppercase" }}>Trukket tema</p>
                <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px" }}>{drawnTopic}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{fag?.emoji} {fag?.label}</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: "32px" }}>🎲</div>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Klar for et tilfeldig tema?</p>
                <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>Akkurat som en ekte eksamen</p>
              </>
            )}
          </div>

          {/* CTA */}
          {!drawnTopic ? (
            <button
              onClick={drawTopic}
              disabled={drawing}
              style={{
                width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
                backgroundColor: "var(--accent)", color: "#fff",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
                cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                opacity: drawing ? 0.7 : 1,
              }}
            >
              {drawing ? "Trekker..." : "Trekk tema og start eksamen"}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={startExam}
                style={{
                  width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
                  backgroundColor: "var(--accent)", color: "#fff",
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
                  cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                }}
              >
                Start eksamen med dette temaet →
              </button>
              <button
                onClick={drawTopic}
                style={{
                  width: "100%", padding: "14px", borderRadius: "var(--r-full)",
                  border: "1.5px solid var(--border)",
                  backgroundColor: "var(--surface)", color: "var(--text)",
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Trekk nytt tema
              </button>
            </div>
          )}

          {/* Info note */}
          <div style={{
            backgroundColor: "var(--accent-bg)", borderRadius: "var(--r-md)",
            padding: "12px 14px",
            fontSize: "12px", color: "var(--accent-dark)", lineHeight: 1.5,
          }}>
            💡 På eksamensdagen velger sensor temaet for deg. Her trener du på å håndtere det ukjente.
          </div>

        </div>
      </div>
    </AppShell>
  );
}
