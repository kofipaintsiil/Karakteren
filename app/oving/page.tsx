"use client";

import { useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

const SUBJECT_COLORS: Record<string, string> = {
  norsk:       "oklch(0.60 0.15 260)",
  matematikk:  "oklch(0.58 0.18 22)",
  fysikk:      "oklch(0.55 0.16 210)",
  kjemi:       "oklch(0.60 0.16 140)",
  biologi:     "oklch(0.58 0.15 150)",
  historie:    "oklch(0.58 0.14 50)",
  naturfag:    "oklch(0.58 0.15 160)",
  samfunnsfag: "oklch(0.58 0.14 280)",
  engelsk:     "oklch(0.55 0.15 230)",
  geografi:    "oklch(0.58 0.14 80)",
};

function SubjectIcon({ id, size = 18, color }: { id: string; size?: number; color?: string }) {
  const stroke = color ?? SUBJECT_COLORS[id] ?? "var(--accent)";
  const icons: Record<string, ReactElement> = {
    norsk: (
      /* pen writing */
      <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>
    ),
    matematikk: (
      /* sigma / summation */
      <path d="M18 4H7l7 8-7 8h11"/>
    ),
    fysikk: (
      /* lightning bolt */
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    ),
    kjemi: (
      /* flask */
      <><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></>
    ),
    biologi: (
      /* leaf */
      <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></>
    ),
    historie: (
      /* open book */
      <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>
    ),
    naturfag: (
      /* globe */
      <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>
    ),
    samfunnsfag: (
      /* people / community */
      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>
    ),
    engelsk: (
      /* speech bubble */
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    ),
    geografi: (
      /* map pin */
      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[id] ?? <circle cx="12" cy="12" r="8"/>}
    </svg>
  );
}

const SUBJECTS = [
  { id: "norsk",       label: "Norsk",       variants: null },
  { id: "matematikk",  label: "Matematikk",  variants: [
    { id: "matematikk-1t", label: "1T",  desc: "Vg1 teoretisk" },
    { id: "matematikk-r1", label: "R1",  desc: "Vg2 realfag" },
    { id: "matematikk-r2", label: "R2",  desc: "Vg3 realfag" },
    { id: "matematikk-2p", label: "2P",  desc: "Vg2 praktisk" },
  ]},
  { id: "fysikk",      label: "Fysikk",      variants: [
    { id: "fysikk-1", label: "Fysikk 1", desc: "Vg2" },
    { id: "fysikk-2", label: "Fysikk 2", desc: "Vg3" },
  ]},
  { id: "kjemi",       label: "Kjemi",       variants: [
    { id: "kjemi-1", label: "Kjemi 1", desc: "Vg2" },
    { id: "kjemi-2", label: "Kjemi 2", desc: "Vg3" },
  ]},
  { id: "biologi",     label: "Biologi",     variants: [
    { id: "biologi-1", label: "Biologi 1", desc: "Vg2" },
    { id: "biologi-2", label: "Biologi 2", desc: "Vg3" },
  ]},
  { id: "historie",    label: "Historie",    variants: null },
  { id: "naturfag",    label: "Naturfag",    variants: null },
  { id: "samfunnsfag", label: "Samfunnsfag", variants: null },
  { id: "engelsk",     label: "Engelsk",     variants: null },
  { id: "geografi",    label: "Geografi",    variants: null },
];

const CHAPTERS: Record<string, { id: string; title: string; topics: string[] }[]> = {
  norsk: [
    { id: "c1", title: "Dramaturgi og sjanger", topics: ["Aristoteles", "Modernisme", "Sjangertrekk"] },
    { id: "c2", title: "Retorikk og argumentasjon", topics: ["Logos", "Etos", "Patos"] },
    { id: "c3", title: "Norrøn litteratur", topics: ["Eddadikt", "Sagaer", "Skaldekunst"] },
    { id: "c4", title: "Modernisme og samtid", topics: ["Ibsen", "Hamsun", "Fosse"] },
    { id: "c5", title: "Språkhistorie", topics: ["Bokmål", "Nynorsk", "Dialekter"] },
  ],
  "matematikk-1t": [
    { id: "1t-1", title: "Algebra", topics: ["Faktorisering", "Likninger", "Ulikheter"] },
    { id: "1t-2", title: "Funksjoner", topics: ["Lineære", "Kvadratiske", "Eksponential"] },
    { id: "1t-3", title: "Geometri", topics: ["Trigonometri", "Pytagoras", "Arealer"] },
    { id: "1t-4", title: "Statistikk", topics: ["Sentralmål", "Spredning", "Normalfordeling"] },
    { id: "1t-5", title: "Kombinatorikk og sannsynlighet", topics: ["Permutasjoner", "Kombinasjoner", "Betinget sannsynlighet"] },
  ],
  "matematikk-r1": [
    { id: "r1-1", title: "Derivasjon", topics: ["Grenseverdi", "Kjerneregel", "Produktregel"] },
    { id: "r1-2", title: "Integrasjon", topics: ["Bestemt integral", "Areal", "Volum"] },
    { id: "r1-3", title: "Vektorer", topics: ["Skalarproduktet", "Kryssprodukt", "Linjer i rom"] },
    { id: "r1-4", title: "Geometri", topics: ["Trigonometri", "Sinussetningen", "Cosinussetningen"] },
    { id: "r1-5", title: "Kombinatorikk", topics: ["Binomialkoeffisienter", "Rekker", "Induksjon"] },
  ],
  "matematikk-r2": [
    { id: "r2-1", title: "Differensiallikninger", topics: ["Separable", "Lineære", "Systemer"] },
    { id: "r2-2", title: "Integrasjon (avansert)", topics: ["Delbrøksoppspaltning", "Bytte", "Per partes"] },
    { id: "r2-3", title: "Funksjonsdrøfting", topics: ["Ekstrema", "Vendepunkter", "Asymptoter"] },
    { id: "r2-4", title: "Lineær algebra", topics: ["Matriser", "Determinant", "Egenverdier"] },
    { id: "r2-5", title: "Tallteori og bevis", topics: ["Induksjon", "Komplekse tall", "Geometriske rekker"] },
  ],
  "matematikk-2p": [
    { id: "2p-1", title: "Økonomi", topics: ["Rente", "Lån og sparing", "Budsjett"] },
    { id: "2p-2", title: "Statistikk", topics: ["Gjennomsnitt", "Median", "Frekvens"] },
    { id: "2p-3", title: "Sannsynlighet", topics: ["Utfallsrom", "Kombinatorikk", "Binomisk"] },
    { id: "2p-4", title: "Geometri", topics: ["Areal", "Volum", "Trigonometri"] },
    { id: "2p-5", title: "Funksjoner", topics: ["Lineære", "Proporsjonalitet", "Grafer"] },
  ],
  "fysikk-1": [
    { id: "f1-1", title: "Mekanikk", topics: ["Newtons lover", "Energi", "Bevegelsesmengde"] },
    { id: "f1-2", title: "Elektrisitet", topics: ["Ohms lov", "Kretser", "Kondensatorer"] },
    { id: "f1-3", title: "Bølger og lyd", topics: ["Bølgelengde", "Frekvens", "Interferens"] },
    { id: "f1-4", title: "Termodynamikk", topics: ["Varme", "Temperatur", "Gasslovene"] },
  ],
  "fysikk-2": [
    { id: "f2-1", title: "Bølgefysikk", topics: ["Diffrakjon", "Polarisasjon", "Optikk"] },
    { id: "f2-2", title: "Elektromagnetisme", topics: ["Faradays lov", "Induksjon", "Transformatorer"] },
    { id: "f2-3", title: "Relativitetsteori", topics: ["Spesiell relativitet", "Tidsdilatasjon", "Lengdekontraksjon"] },
    { id: "f2-4", title: "Atomfysikk", topics: ["Bohr-modellen", "Fotoelektrisk effekt", "Spektre"] },
    { id: "f2-5", title: "Kjernefysikk", topics: ["Radioaktivitet", "Halveringstid", "Fisjon og fusjon"] },
  ],
  "kjemi-1": [
    { id: "k1-1", title: "Periodesystemet", topics: ["Atomstruktur", "Elektronkonfigurasjon", "Periodetrender"] },
    { id: "k1-2", title: "Kjemiske bindinger", topics: ["Ionebinding", "Kovalent binding", "Metall"] },
    { id: "k1-3", title: "Syrer og baser", topics: ["pH", "Nøytralisering", "Buffere"] },
    { id: "k1-4", title: "Redoks", topics: ["Oksidasjonstall", "Reduksjon", "Galvaniske celler"] },
    { id: "k1-5", title: "Organisk kjemi (intro)", topics: ["Alkaner", "Alkener", "Alkoholer"] },
  ],
  "kjemi-2": [
    { id: "k2-1", title: "Organisk kjemi (avansert)", topics: ["Funksjonelle grupper", "Reaksjonsmekanismer", "Stereokjemi"] },
    { id: "k2-2", title: "Kjemisk likevekt", topics: ["Likevektskonstant", "Le Chateliers prinsipp", "Løselighetsproduktet"] },
    { id: "k2-3", title: "Elektrokjemi", topics: ["Elektromotorisk kraft", "Elektrolyse", "Korrosjon"] },
    { id: "k2-4", title: "Termokjemi", topics: ["Entalpi", "Entropi", "Gibbs energi"] },
    { id: "k2-5", title: "Polymerer og biokjemi", topics: ["Proteiner", "DNA", "Karbohydrater"] },
  ],
  "biologi-1": [
    { id: "b1-1", title: "Cellebiologi", topics: ["Cellemembranen", "Mitose", "Meiose"] },
    { id: "b1-2", title: "Genetikk", topics: ["DNA-replikasjon", "Transkripsjon", "Translasjon"] },
    { id: "b1-3", title: "Fysiologi (mennesket)", topics: ["Nervesystemet", "Hormoner", "Immunforsvaret"] },
    { id: "b1-4", title: "Evolusjon", topics: ["Naturlig seleksjon", "Artsdannelse", "Fossiler"] },
    { id: "b1-5", title: "Bioteknologi", topics: ["Genteknologi", "CRISPR", "GMO"] },
  ],
  "biologi-2": [
    { id: "b2-1", title: "Genetikk (avansert)", topics: ["Krysningsanalyse", "Koppling", "Mutasjoner"] },
    { id: "b2-2", title: "Immunforsvaret", topics: ["Antigen-antistoff", "T-celler", "B-celler"] },
    { id: "b2-3", title: "Hormoner og regulering", topics: ["Endokrint system", "Feedback-mekanismer", "Reproduksjon"] },
    { id: "b2-4", title: "Populasjonsbiologi", topics: ["Populasjonsvekst", "Bæreevne", "Artsinteraksjoner"] },
    { id: "b2-5", title: "Atferdsbiologi", topics: ["Innate atferd", "Lært atferd", "Sosiale systemer"] },
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

type Step = "fag" | "variant" | "chapters";

export default function OvingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("fag");
  const [selectedFag, setSelectedFag] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const recentSubjects = SUBJECTS.filter(s => ["norsk", "matematikk"].includes(s.id));

  // The chapter key is the variant ID if selected, otherwise the base subject
  const chapterKey = selectedVariant ?? selectedFag ?? "";
  const chapters = CHAPTERS[chapterKey] ?? [];
  const allSelected = selected.size === chapters.length && chapters.length > 0;

  const baseFag = SUBJECTS.find(s => s.id === selectedFag);
  const variantObj = baseFag?.variants?.find(v => v.id === selectedVariant);

  function pickSubject(id: string) {
    const subj = SUBJECTS.find(s => s.id === id)!;
    setSelectedFag(id);
    setSelectedVariant(null);
    setSelected(new Set());
    setExpanded(new Set());
    if (subj.variants) {
      setStep("variant");
    } else {
      setStep("chapters");
    }
  }

  function pickVariant(variantId: string) {
    setSelectedVariant(variantId);
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
    const params = new URLSearchParams({ subject: selectedVariant ?? selectedFag! });
    Array.from(selected).forEach(id => params.append("chapter", id));
    router.push(`/exam?${params.toString()}`);
  }

  // ── STEP 1: Subject picker ─────────────────────────────────────────
  if (step === "fag") {
    return (
      <AppShell>
        <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
          <div style={{ padding: "20px 0 16px" }}>
            <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "3px" }}>
              Velg tema selv
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Du bestemmer — velg fag og kapitler
            </p>
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
                      fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px", fontWeight: 500,
                      cursor: "pointer", transition: "all 0.15s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <SubjectIcon id={s.id} size={15} />
                    {s.label}
                    {s.variants && (
                      <span style={{ fontSize: "11px", color: "var(--ink-light)", fontWeight: 400 }}>
                        {s.variants.length} nivåer
                      </span>
                    )}
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
                    fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s",
                    textAlign: "left", WebkitTapHighlightColor: "transparent",
                    position: "relative",
                  }}
                >
                  <SubjectIcon id={s.id} size={22} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ lineHeight: 1.2 }}>{s.label}</div>
                    {s.variants && (
                      <div style={{ fontSize: "11px", color: "var(--ink-light)", marginTop: "2px" }}>
                        {s.variants.map(v => v.label).join(" · ")}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── STEP 1b: Variant picker (for Math/Fysikk/Kjemi/Biologi) ────────
  if (step === "variant" && baseFag?.variants) {
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
                color: "var(--text-muted)", fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px",
                marginBottom: "12px", padding: 0, WebkitTapHighlightColor: "transparent",
              }}
            >
              <ChevronLeft size={14} /> Tilbake
            </button>
            <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.3px", color: "var(--text)", marginBottom: "2px" }}>
              {baseFag.label} — Velg nivå
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Velg hvilket kurs du øver til
            </p>
          </div>

          <div style={{ paddingTop: "16px", paddingBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {baseFag.variants.map(v => (
              <button
                key={v.id}
                onClick={() => pickVariant(v.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  gap: "4px",
                  backgroundColor: "var(--surface)", color: "var(--text)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--r-lg)", padding: "18px 16px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  cursor: "pointer", transition: "all 0.15s",
                  textAlign: "left", WebkitTapHighlightColor: "transparent",
                }}
              >
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text)" }}>{v.label}</span>
                <span style={{ fontSize: "12px", color: "var(--ink-light)" }}>{v.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // ── STEP 2: Chapter picker ──────────────────────────────────────────
  const headingLabel = variantObj
    ? `${baseFag?.label} ${variantObj.label}`
    : `${baseFag?.label}`;

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
        {/* Back + title */}
        <div style={{ padding: "16px 0 12px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={() => setStep(baseFag?.variants ? "variant" : "fag")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              color: "var(--text-muted)", fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px",
              marginBottom: "12px", padding: 0, WebkitTapHighlightColor: "transparent",
            }}
          >
            <ChevronLeft size={14} /> Tilbake
          </button>
          <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.3px", color: "var(--text)", marginBottom: "2px" }}>
            {headingLabel} — Kapitler
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
              fontFamily: "Inter, system-ui, sans-serif", fontSize: "13px", fontWeight: 600,
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
              fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "15px",
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
