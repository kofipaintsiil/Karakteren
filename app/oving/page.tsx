"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

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

const CHAPTERS: Record<string, { id: string; title: string; topics: string[] }[]> = {
  norsk: [
    { id: "c1", title: "Dramaturgi og sjanger", topics: ["Aristoteles", "Modernisme", "Sjangertrekk"] },
    { id: "c2", title: "Retorikk og argumentasjon", topics: ["Logos", "Etos", "Patos"] },
    { id: "c3", title: "Norrøn litteratur", topics: ["Eddadikt", "Sagaer", "Skaldekunst"] },
    { id: "c4", title: "Modernisme og samtid", topics: ["Ibsen", "Hamsun", "Fosse"] },
    { id: "c5", title: "Språkhistorie", topics: ["Bokmål", "Nynorsk", "Dialekter"] },
  ],
  matematikk: [
    { id: "m1", title: "Derivasjon", topics: ["Grenseverdi", "Kjerneregel", "Produktregel"] },
    { id: "m2", title: "Integrasjon", topics: ["Bestemt integral", "Areal", "Volumberegning"] },
    { id: "m3", title: "Funksjoner", topics: ["Polynomer", "Eksponential", "Logaritme"] },
    { id: "m4", title: "Geometri", topics: ["Trigonometri", "Vektorer", "Koordinatsystem"] },
  ],
  fysikk: [
    { id: "f1", title: "Mekanikk", topics: ["Newtons lover", "Energi", "Bevegelsesmengde"] },
    { id: "f2", title: "Elektrisitet", topics: ["Ohms lov", "Kretser", "Kondensatorer"] },
    { id: "f3", title: "Bølger og optikk", topics: ["Interferens", "Diffrakjon", "Lys"] },
  ],
  kjemi: [
    { id: "k1", title: "Syrer og baser", topics: ["pH", "Nøytralisering", "Buffere"] },
    { id: "k2", title: "Organisk kjemi", topics: ["Alkaner", "Alkener", "Funksjonelle grupper"] },
    { id: "k3", title: "Redoks", topics: ["Oksidasjon", "Reduksjon", "Galvaniske celler"] },
  ],
  biologi: [
    { id: "b1", title: "Cellebiologi", topics: ["Cellemembranen", "Mitose", "Meiose"] },
    { id: "b2", title: "Genetikk", topics: ["DNA", "Arvelighet", "Mutasjoner"] },
    { id: "b3", title: "Evolusjon", topics: ["Naturlig seleksjon", "Adaptasjon", "Artsdannelse"] },
    { id: "b4", title: "Fysiologi", topics: ["Nervesystemet", "Hormoner", "Immunforsvaret"] },
  ],
  historie: [
    { id: "h1", title: "Mellomkrigstiden", topics: ["Versaillestraktaten", "Depresjon", "Fascisme"] },
    { id: "h2", title: "Andre verdenskrig", topics: ["Blitzkrieg", "Holocaust", "Allierte"] },
    { id: "h3", title: "Den kalde krigen", topics: ["NATO", "Cubakrise", "Jernteppet"] },
    { id: "h4", title: "Industrialisering", topics: ["Urbanisering", "Arbeiderklassen", "Teknologi"] },
  ],
  naturfag: [
    { id: "n1", title: "Celler og arv", topics: ["Celledeling", "DNA-replikasjon", "Genmutasjoner"] },
    { id: "n2", title: "Elektromagnetisme", topics: ["Elektrisitet", "Magnetisme", "Induksjon"] },
    { id: "n3", title: "Klima og miljø", topics: ["Drivhuseffekten", "Fornybar energi", "Naturressurser"] },
    { id: "n4", title: "Bioteknologi", topics: ["Genteknologi", "CRISPR", "GMO"] },
  ],
  samfunnsfag: [
    { id: "sf1", title: "Demokrati og politikk", topics: ["Valgsystemet", "Stortinget", "Partier"] },
    { id: "sf2", title: "Økonomi", topics: ["Tilbud og etterspørsel", "Inflasjon", "Statsbudsjettet"] },
    { id: "sf3", title: "FN og globalisering", topics: ["FN-pakten", "Menneskerettigheter", "Handelsavtaler"] },
    { id: "sf4", title: "Kultur og identitet", topics: ["Mangfold", "Integrering", "Nasjonal identitet"] },
  ],
  engelsk: [
    { id: "e1", title: "Literature & Fiction", topics: ["Shakespeare", "Novel structure", "Poetry"] },
    { id: "e2", title: "Grammar & Writing", topics: ["Tenses", "Passive voice", "Essay structure"] },
    { id: "e3", title: "Global Issues", topics: ["Climate", "Migration", "Digital society"] },
    { id: "e4", title: "Culture", topics: ["British culture", "American culture", "Postcolonialism"] },
  ],
  geografi: [
    { id: "g1", title: "Klima og miljø", topics: ["Klimasoner", "Ekstremvær", "Klimaendringer"] },
    { id: "g2", title: "Befolkning", topics: ["Demografisk utvikling", "Migrasjon", "Urbanisering"] },
    { id: "g3", title: "Ressurser og næring", topics: ["Landbruk", "Industri", "Energiressurser"] },
    { id: "g4", title: "Naturkatastrofer", topics: ["Jordskjelv", "Vulkaner", "Flom"] },
  ],
};

function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checkmark() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
      <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OvingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"fag" | "chapters">("fag");
  const [selectedFag, setSelectedFag] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const recentSubjects = SUBJECTS.filter(s => ["norsk", "matematikk"].includes(s.id));
  const chapters = selectedFag ? (CHAPTERS[selectedFag] ?? []) : [];
  const allSelected = selected.size === chapters.length && chapters.length > 0;
  const fag = SUBJECTS.find(s => s.id === selectedFag);

  function pickSubject(id: string) {
    setSelectedFag(id);
    setSelected(new Set());
    setExpanded(new Set());
    setStep("chapters");
  }

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(chapters.map(c => c.id)));
  }

  function startSession() {
    if (selected.size === 0) return;
    const params = new URLSearchParams({ subject: selectedFag! });
    const chapArr = Array.from(selected);
    chapArr.forEach(id => params.append("chapter", id));
    router.push(`/exam?${params.toString()}`);
  }

  if (step === "fag") {
    return (
      <AppShell>
        <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
          {/* Header */}
          <div style={{ padding: "20px 0 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "3px" }}>
                Velg tema selv
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Du bestemmer — velg fag og kapitler
              </p>
            </div>
          </div>

          <div style={{ paddingBottom: "32px" }}>
            {/* Recently practiced */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px" }}>
                Sist øvd
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {recentSubjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => pickSubject(s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      backgroundColor: "var(--surface)", color: "var(--text)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--r-full)", padding: "8px 16px",
                      fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500,
                      cursor: "pointer", transition: "all 0.15s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* All subjects */}
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>
              Alle fag
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => pickSubject(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    backgroundColor: "var(--surface)", color: "var(--text)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--r-lg)", padding: "14px 16px",
                    fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s",
                    textAlign: "left", WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{s.emoji}</span>
                  <span style={{ lineHeight: 1.2 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // step === "chapters"
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
        {/* Back + title */}
        <div style={{ padding: "16px 0 12px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={() => setStep("fag")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontSize: "13px",
              marginBottom: "12px", padding: 0, WebkitTapHighlightColor: "transparent",
            }}
          >
            <ChevronLeft size={14} /> Tilbake
          </button>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.3px", color: "var(--text)", marginBottom: "2px" }}>
            {fag?.emoji} {fag?.label} — Kapitler
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Velg hvilke kapitler Blobb stiller spørsmål fra
          </p>
        </div>

        {/* Count + select all */}
        <div style={{
          padding: "10px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {selected.size} av {chapters.length} valgt
          </span>
          <button
            onClick={toggleAll}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600,
              color: "var(--accent-dark)", padding: 0,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {allSelected ? "Fjern alle" : "Velg alle"}
          </button>
        </div>

        {/* Chapter list */}
        <div style={{ paddingTop: "12px", paddingBottom: "110px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {chapters.map(ch => {
            const isSelected = selected.has(ch.id);
            const isExpanded = expanded.has(ch.id);
            return (
              <div
                key={ch.id}
                style={{
                  backgroundColor: "var(--surface)",
                  border: `1.5px solid ${isSelected ? "var(--accent-dark)" : "var(--border)"}`,
                  borderRadius: "var(--r-lg)", overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: "12px" }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => toggle(ch.id)}
                    style={{
                      width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                      border: `2px solid ${isSelected ? "var(--accent-dark)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "var(--accent-dark)" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s", WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {isSelected && <Checkmark />}
                  </button>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{ch.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--ink-light)", marginTop: "2px" }}>{ch.topics.length} temaer</div>
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => toggleExpand(ch.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--ink-light)", padding: "4px",
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(90deg)" : "none",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {isExpanded && (
                  <div style={{
                    borderTop: "1px solid var(--border)",
                    padding: "10px 16px 14px",
                    display: "flex", flexWrap: "wrap", gap: "6px",
                  }}>
                    {ch.topics.map(t => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 10px", borderRadius: "var(--r-full)",
                          backgroundColor: "var(--accent-bg)", color: "var(--accent-dark)",
                          fontSize: "12px", fontWeight: 500,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticky CTA */}
        <div style={{
          position: "sticky", bottom: "66px",
          padding: "12px 0",
          background: "linear-gradient(to top, rgba(250,248,244,1) 60%, rgba(250,248,244,0))",
        }}>
          <button
            onClick={startSession}
            disabled={selected.size === 0}
            style={{
              width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
              backgroundColor: "var(--accent)", color: "#fff",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
              cursor: selected.size > 0 ? "pointer" : "default",
              opacity: selected.size > 0 ? 1 : 0.4,
              boxShadow: selected.size > 0 ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
              transition: "opacity 0.2s",
            }}
          >
            {selected.size > 0
              ? `Start prøve — ${selected.size} kapittel${selected.size === 1 ? "" : "er"} valgt →`
              : "Velg minst ett kapittel"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
