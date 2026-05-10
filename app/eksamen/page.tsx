"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Blobb from "@/components/Blobb";
import { SubjectIcon, subjectColor } from "@/components/SubjectIcon";

async function loadPreferences() {
  try {
    const res = await fetch("/api/preferences");
    if (res.ok) return await res.json() as { exam_date?: string; exam_fag?: string; exam_variant?: string };
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

const SUBJECTS = [
  { id: "norsk",       label: "Norsk",                         short: "Norsk",          variants: null },
  { id: "matematikk",  label: "Matematikk",                    short: "Matte",          variants: [
    { id: "matematikk-1t", label: "1T",  desc: "Vg1 teoretisk" },
    { id: "matematikk-r1", label: "R1",  desc: "Vg2 realfag" },
    { id: "matematikk-r2", label: "R2",  desc: "Vg3 realfag" },
    { id: "matematikk-2p", label: "2P",  desc: "Vg2 praktisk" },
  ]},
  { id: "fysikk",      label: "Fysikk",                        short: "Fysikk",         variants: [
    { id: "fysikk-1", label: "Fysikk 1", desc: "Vg2" },
    { id: "fysikk-2", label: "Fysikk 2", desc: "Vg3" },
  ]},
  { id: "kjemi",       label: "Kjemi",                         short: "Kjemi",          variants: [
    { id: "kjemi-1", label: "Kjemi 1", desc: "Vg2" },
    { id: "kjemi-2", label: "Kjemi 2", desc: "Vg3" },
  ]},
  { id: "biologi",     label: "Biologi",                       short: "Biologi",        variants: [
    { id: "biologi-1", label: "Biologi 1", desc: "Vg2" },
    { id: "biologi-2", label: "Biologi 2", desc: "Vg3" },
  ]},
  { id: "historie",    label: "Historie",                      short: "Historie",       variants: null },
  { id: "naturfag",    label: "Naturfag",                      short: "Naturfag",       variants: null },
  { id: "samfunnsfag", label: "Samfunnskunnskap",              short: "Samfunn",        variants: null },
  { id: "engelsk",     label: "Engelsk",                       short: "Engelsk",        variants: null },
  { id: "geografi",    label: "Geografi",                      short: "Geografi",       variants: null },
  { id: "fransk",      label: "Fransk",                        short: "Fransk",         variants: [
    { id: "fransk-1", label: "Fransk 1", desc: "Vg2 Niveau I" },
    { id: "fransk-2", label: "Fransk 2", desc: "Vg3 Niveau II" },
  ]},
  { id: "tysk",        label: "Tysk",                          short: "Tysk",           variants: [
    { id: "tysk-2", label: "Tysk 2", desc: "Vg3 Nivå II" },
  ]},
  { id: "spansk",      label: "Spansk",                        short: "Spansk",         variants: [
    { id: "spansk-2", label: "Spansk 2", desc: "Vg3 Nivå II" },
  ]},
  { id: "samfunnsøkonomi", label: "Samfunnsøkonomi",          short: "Samf.øk.",       variants: [
    { id: "samfunnsøkonomi-1", label: "Samfunnsøkonomi 1", desc: "Vg2" },
    { id: "samfunnsøkonomi-2", label: "Samfunnsøkonomi 2", desc: "Vg3" },
  ]},
  { id: "sosiologi",   label: "Sosiologi og sosialantropologi", short: "Sosiologi",     variants: null },
  { id: "psykologi",   label: "Psykologi",                     short: "Psykologi",     variants: [
    { id: "psykologi-1", label: "Psykologi 1", desc: "Vg2" },
    { id: "psykologi-2", label: "Psykologi 2", desc: "Vg3" },
  ]},
  { id: "rettslære",   label: "Rettslære",                     short: "Rettslære",     variants: [
    { id: "rettslære-1", label: "Rettslære 1", desc: "Vg2" },
    { id: "rettslære-2", label: "Rettslære 2", desc: "Vg3" },
  ]},
  { id: "markedsføring", label: "Markedsføring og ledelse",   short: "Marked.",        variants: [
    { id: "markedsføring-1", label: "Markedsføring 1", desc: "Vg2" },
    { id: "markedsføring-2", label: "Markedsføring 2", desc: "Vg3" },
  ]},
  { id: "teknologi",   label: "Teknologi og forskningslære 1", short: "Teknologi",     variants: null },
  { id: "religion",    label: "Religion og etikk",             short: "Religion",      variants: null },
];

const TOPICS: Record<string, string[]> = {
  norsk:            ["Dramatikk og teater", "Retorikk og argumentasjon", "Norrøn litteratur", "Modernisme og samtid", "Språkhistorie", "Ibsen", "Hamsun", "Romantikken"],
  "matematikk-1t":  ["Algebra", "Lineære funksjoner", "Kvadratiske funksjoner", "Trigonometri", "Statistikk", "Kombinatorikk", "Eksponentialfunksjoner", "Logaritmer"],
  "matematikk-r1":  ["Derivasjon", "Integrasjon", "Vektorer", "Sinussetningen", "Cosinussetningen", "Kombinatorikk", "Rekker", "Grenseverdi"],
  "matematikk-r2":  ["Differensiallikninger", "Delbrøksoppspaltning", "Integrasjon per partes", "Matriser", "Egenverdier", "Komplekse tall", "Funksjonsdrøfting", "Tallteori"],
  "matematikk-2p":  ["Rente og lån", "Budsjett og økonomi", "Statistikk", "Sannsynlighet", "Areal og volum", "Trigonometri", "Lineære funksjoner", "Proporsjonalitet"],
  "fysikk-1":       ["Newtons lover", "Energi og arbeid", "Bevegelsesmengde", "Ohms lov", "Elektriske kretser", "Bølger og lyd", "Termodynamikk", "Gasslovene"],
  "fysikk-2":       ["Diffrakjon og interferens", "Faradays lov", "Induksjon", "Spesiell relativitet", "Tidsdilatasjon", "Bohr-modellen", "Fotoelektrisk effekt", "Radioaktivitet"],
  "kjemi-1":        ["Periodesystemet", "Elektronkonfigurasjon", "Ionebinding", "Kovalent binding", "pH og syrer", "Nøytralisering", "Redoks", "Organisk kjemi"],
  "kjemi-2":        ["Organiske reaksjonsmekanismer", "Kjemisk likevekt", "Le Chateliers prinsipp", "Elektrolyse", "Entalpi og entropi", "Gibbs energi", "Polymerer", "Biokjemi"],
  "biologi-1":      ["Cellemembranen", "Mitose og meiose", "DNA-replikasjon", "Transkripsjon og translasjon", "Nervesystemet", "Immunforsvaret", "Naturlig seleksjon", "Bioteknologi"],
  "biologi-2":      ["Krysningsanalyse", "Koppling og mutasjoner", "Antigen-antistoff", "T-celler og B-celler", "Hormonsystemet", "Populasjonsvekst", "Atferdsbiologi", "Reproduksjon"],
  historie:         ["Mellomkrigstiden", "Andre verdenskrig", "Den kalde krigen", "Industrialisering", "Kolonitiden", "Opplysningstiden", "Første verdenskrig", "FN og globalisering"],
  naturfag:         ["Celler og arv", "Bioteknologi", "Elektromagnetisme", "Stråling og radioaktivitet", "Klima og miljø", "Fornybar energi", "Kosmologi", "Bioteknologi"],
  samfunnsfag:      ["Demokrati og styresett", "Norsk økonomi", "FN og globalisering", "Menneskerettigheter", "Politiske systemer", "Media og ytringsfrihet", "Kriminalitet", "Velferdsstaten"],
  engelsk:          ["Literature analysis", "Grammar and writing", "Global issues", "British culture", "American culture", "Media and communication", "Science and technology", "Ethics"],
  geografi:         ["Klima og miljø", "Befolkningsvekst", "Ressurser og bærekraft", "Urbanisering", "Naturkatastrofer", "Geopolitikk", "Migrasjon", "Næringsgeografi"],
  "fransk-1":       ["Présentation personnelle et famille", "La vie quotidienne et l'école", "La gastronomie française", "Paris et les régions françaises", "Les loisirs et le sport", "La mode et les tendances"],
  "fransk-2":       ["Culture et identité française", "La Francophonie", "Littérature et cinéma français", "Société et politique en France", "L'environnement et le développement durable", "La jeunesse et les réseaux sociaux", "L'éducation en France", "La technologie et l'avenir"],
  "tysk-2":         ["Deutsche Gesellschaft und Kultur", "Geschichte und Erinnerungskultur", "Die Europäische Union", "Umwelt und Nachhaltigkeit", "Jugend und Lebenswelt", "Migration und Integration", "Medien und Kommunikation", "Wirtschaft und Beruf"],
  "spansk-2":       ["Cultura e identidad hispana", "Historia y política en el mundo hispano", "Medio ambiente y sostenibilidad", "Migración y globalización", "Jóvenes y redes sociales", "Literatura y cine hispanohablante", "Economía y trabajo", "Sociedad y diversidad"],
  "samfunnsøkonomi-1": ["Tilbud og etterspørsel", "Markedsmekanismen og prisdannelse", "Nasjonalregnskap og BNP", "Konjunktursvingninger", "Penge- og finanspolitikk", "Arbeidsledighet og inflasjon", "Offentlig sektor og skatter", "Internasjonal handel"],
  "samfunnsøkonomi-2": ["Fullkommen og ufullkommen konkurranse", "Markedssvikt og offentlige inngrep", "Fordelingspolitikk og velferd", "Valutamarkedet og valutapolitikk", "Miljøøkonomi og bærekraft", "Makroøkonomiske modeller", "Vekstteori og innovasjon", "Internasjonale finansmarkeder"],
  sosiologi:        ["Sosialisering og identitet", "Sosiale grupper og institusjoner", "Sosial ulikhet og stratifikasjon", "Kultur og kulturmøter", "Etnisitet og minoriteter", "Kjønn og kjønnsroller", "Sosial kontroll og avvik", "Globalisering og sosiale endringer"],
  "psykologi-1":    ["Sansing og persepsjon", "Klassisk og operant betinging", "Kognisjon og hukommelse", "Motivasjon og emosjoner", "Personlighet og personlighetsteorier", "Psykisk helse og psykiske lidelser", "Sosialpsykologi", "Biologisk psykologi"],
  "psykologi-2":    ["Kognitiv psykologi og informasjonsbehandling", "Utviklingspsykologi", "Klinisk psykologi og behandling", "Nevropsykologi og hjernen", "Positiv psykologi og mestring", "Stresspsykologi", "Psykologisk forskning og etikk", "Kulturpsykologi"],
  "rettslære-1":    ["Rettsstatens prinsipper og rettssystemet", "Rettskilder og lovgivning", "Avtaleretten", "Kjøpsretten og forbrukervern", "Erstatningsretten", "Strafferettens grunnbegreper", "Familieretten", "Arbeidsretten"],
  "rettslære-2":    ["Selskapsretten (AS, ANS, ENK)", "Immaterialretten", "Arbeidsrettens avtaleverk", "Forvaltningsretten", "Kontraktsrett og mislighold", "Kredittsikkerhet og panterett", "Internasjonal privatrett", "Strafferetten"],
  "markedsføring-1": ["Markedsføring og markedsmekanismer", "Markedsanalyse og segmentering", "Produkt og produktutvikling", "Pris og prisstrategier", "Distribusjon og salgsstrategi", "Markedskommunikasjon og reklame", "Digital markedsføring", "Bedriftsetikk og samfunnsansvar"],
  "markedsføring-2": ["Strategisk ledelse og SWOT-analyse", "Merkevarebygging", "Internasjonal markedsføring", "Ledelsesteorier og ledelsesstiler", "Prosjektledelse og teamarbeid", "Forretningsmodeller og innovasjon", "Budsjett og økonomiplanlegging", "Gründerskap"],
  teknologi:        ["Vitenskapelig metode og hypotesetesting", "Teknologiutvikling og samfunn", "Bærekraftig teknologi og grønn innovasjon", "Datateknologi og kunstig intelligens", "Bioteknologi og etikk", "Energiteknologi og fornybar energi", "Forsøksdesign og dataanalyse", "Teknologihistorie og fremtidsperspektiver"],
  religion:         ["Kristendom og kirkehistorie", "Islam", "Jødedom", "Hinduisme og buddhisme", "Ikke-religiøse livssyn (humanisme)", "Etikk og etiske teorier", "Religion og samfunn", "Nyreligiøsitet og new age"],
};

export default function EksamenPage() {
  const router = useRouter();
  const [selectedFag, setSelectedFag] = useState("norsk");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [examDate, setExamDate] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [drawnTopic, setDrawnTopic] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Load from DB first, fall back to localStorage
  useEffect(() => {
    const applyPrefs = (date?: string | null, fag?: string | null, variant?: string | null) => {
      if (date) { setExamDate(date); localStorage.setItem("exam-date", date); }
      if (fag) {
        setSelectedFag(fag);
        localStorage.setItem("exam-fag", fag);
        const fagObj = SUBJECTS.find(s => s.id === fag);
        if (!fagObj?.variants) { setSelectedVariant(null); localStorage.removeItem("exam-variant"); }
      }
      if (variant) { setSelectedVariant(variant); localStorage.setItem("exam-variant", variant); }
    };

    // Apply localStorage immediately so UI isn't blank while fetching
    const lsDate = localStorage.getItem("exam-date");
    const lsFag = localStorage.getItem("exam-fag");
    const lsVariant = localStorage.getItem("exam-variant");
    applyPrefs(lsDate, lsFag, lsVariant);

    const syncFromDB = () =>
      loadPreferences().then((prefs) => {
        if (!prefs) return;
        applyPrefs(prefs.exam_date, prefs.exam_fag, prefs.exam_variant);
        hydrated.current = true;
      });

    // Initial load
    syncFromDB();

    // Refetch when user switches back to the app (e.g. from phone to this tab)
    const onVisible = () => { if (document.visibilityState === "visible") syncFromDB(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const activeFag = SUBJECTS.find(s => s.id === selectedFag)!;
  const activeKey = selectedVariant ?? selectedFag;
  const topics = TOPICS[activeKey] ?? TOPICS[selectedFag] ?? [];

  const daysLeft = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000))
    : null;
  const urgency = daysLeft === null ? null : daysLeft <= 3 ? "red" : daysLeft <= 7 ? "amber" : "green";
  const urgencyColor = urgency === "red" ? "var(--error)" : urgency === "amber" ? "var(--accent)" : "var(--green)";

  function handleFagChange(id: string) {
    setSelectedFag(id);
    setDrawnTopic(null);
    localStorage.setItem("exam-fag", id);
    const fag = SUBJECTS.find(s => s.id === id);
    if (!fag?.variants) {
      setSelectedVariant(null);
      localStorage.removeItem("exam-variant");
      savePreferences({ exam_fag: id, exam_variant: null });
    } else {
      savePreferences({ exam_fag: id });
    }
  }

  function handleVariantChange(id: string) {
    setSelectedVariant(id);
    setDrawnTopic(null);
    localStorage.setItem("exam-variant", id);
    savePreferences({ exam_variant: id });
  }

  function handleDateChange(v: string) {
    setExamDate(v);
    localStorage.setItem("exam-date", v);
    savePreferences({ exam_date: v || null });
  }

  function drawTopic() {
    if (activeFag.variants && !selectedVariant) return;
    setDrawing(true);
    setDrawnTopic(null);
    setTimeout(() => {
      setDrawnTopic(topics[Math.floor(Math.random() * topics.length)]);
      setDrawing(false);
    }, 1200);
  }

  function startExam() {
    if (!drawnTopic) return;
    router.push(`/exam?subject=${activeKey}&topic=${encodeURIComponent(drawnTopic)}`);
  }

  const canDraw = !activeFag.variants || selectedVariant !== null;
  const activeLabel = selectedVariant
    ? `${activeFag.label} ${activeFag.variants?.find(v => v.id === selectedVariant)?.label ?? ""}`
    : activeFag.label;

  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "3px" }}>
              Eksamen
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Blobb trekker tema — akkurat som en ekte sensor
            </p>
          </div>
          <div style={{ marginTop: "4px" }}>
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
              onChange={e => handleDateChange(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px",
                borderRadius: "var(--r-md)",
                border: `1.5px solid ${examDate ? "var(--accent)" : "var(--border)"}`,
                fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", color: "var(--text)",
                backgroundColor: "var(--bg)", outline: "none",
                boxSizing: "border-box",
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

          {/* Subject */}
          <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "12px 12px 8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "2px" }}>Fag</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
              {SUBJECTS.map(s => {
                const active = selectedFag === s.id;
                const color = subjectColor(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleFagChange(s.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: "4px", padding: "8px 4px", borderRadius: "var(--r-md)", border: "none",
                      backgroundColor: active ? "var(--text)" : "var(--bg-alt)",
                      color: active ? "var(--bg)" : "var(--text)",
                      fontFamily: "Inter, system-ui, sans-serif", fontSize: "11px", fontWeight: active ? 600 : 400,
                      cursor: "pointer", transition: "all 0.15s",
                      WebkitTapHighlightColor: "transparent",
                      textAlign: "center", minHeight: "52px", lineHeight: 1.2,
                    }}
                  >
                    <SubjectIcon id={s.id} size={15} color={active ? "var(--bg)" : color} />
                    <span>{s.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variant selector — only shown for subjects with variants */}
          {activeFag.variants && (
            <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "2px" }}>
                Hvilken {activeFag.label}?
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {activeFag.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    style={{
                      padding: "12px 14px", borderRadius: "var(--r-md)", border: "none",
                      backgroundColor: selectedVariant === v.id ? "var(--accent)" : "var(--bg-alt)",
                      color: selectedVariant === v.id ? "#fff" : "var(--text)",
                      fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s",
                      WebkitTapHighlightColor: "transparent",
                      textAlign: "left", minHeight: "52px",
                    }}
                  >
                    {v.label}
                    <span style={{ display: "block", fontSize: "11px", fontWeight: 400, opacity: 0.7, marginTop: "2px" }}>
                      {v.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic draw */}
          <div style={{
            backgroundColor: drawnTopic ? "var(--text)" : "var(--surface)",
            border: `1px solid ${drawnTopic ? "var(--text)" : "var(--border)"}`,
            borderRadius: "var(--r-lg)", padding: "28px 20px",
            textAlign: "center", transition: "all 0.4s ease",
            minHeight: "120px", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "10px",
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
                <p style={{ fontFamily: "Syne, system-ui, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px" }}>{drawnTopic}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{activeLabel}</p>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "var(--r-md)", backgroundColor: "var(--bg-alt)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
                  </svg>
                </div>
                <p style={{ fontSize: "14px", color: canDraw ? "var(--text-muted)" : "var(--text-faint)" }}>
                  {canDraw ? "Klar for et tilfeldig tema?" : `Velg hvilken ${activeFag.label} du har eksamen i`}
                </p>
                {canDraw && <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>Akkurat som en ekte eksamen</p>}
              </>
            )}
          </div>

          {/* CTA */}
          {!drawnTopic ? (
            <button
              onClick={drawTopic}
              disabled={drawing || !canDraw}
              style={{
                width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
                backgroundColor: canDraw ? "var(--accent)" : "var(--bg-alt)",
                color: canDraw ? "#fff" : "var(--text-muted)",
                fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "15px",
                cursor: canDraw ? "pointer" : "default",
                boxShadow: canDraw ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
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
                  fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "15px",
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
                  fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Trekk nytt tema
              </button>
            </div>
          )}

          <div style={{
            backgroundColor: "var(--accent-bg)", borderRadius: "var(--r-md)",
            padding: "12px 14px", fontSize: "12px", color: "var(--accent-dark)", lineHeight: 1.5,
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
