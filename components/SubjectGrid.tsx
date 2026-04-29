"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Calculator, FlaskConical, Zap, TestTube, Dna,
  Scroll, Landmark, Globe, Map, ChevronDown, ChevronUp,
  GraduationCap, BookMarked,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Level { id: string; label: string; desc: string }
interface Subject {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  border: string;
  levels?: Level[];
}

type Mode = "exam" | "study";

const subjects: Subject[] = [
  { id: "norsk",       label: "Norsk",       icon: BookOpen,    color: "var(--blue-soft)",   border: "var(--blue)" },
  {
    id: "matematikk", label: "Matematikk", icon: Calculator, color: "var(--coral-soft)", border: "var(--coral)",
    levels: [
      { id: "matematikk-1t", label: "1T",  desc: "Vg1 teoretisk" },
      { id: "matematikk-r1", label: "R1",  desc: "Vg2 realfag" },
      { id: "matematikk-r2", label: "R2",  desc: "Vg3 realfag" },
      { id: "matematikk-2p", label: "2P",  desc: "Vg2 praktisk" },
    ],
  },
  { id: "naturfag",    label: "Naturfag",    icon: FlaskConical, color: "var(--green-soft)",  border: "var(--green)" },
  {
    id: "fysikk", label: "Fysikk", icon: Zap, color: "var(--yellow-soft)", border: "var(--yellow-press)",
    levels: [
      { id: "fysikk-1", label: "Fysikk 1", desc: "Vg2" },
      { id: "fysikk-2", label: "Fysikk 2", desc: "Vg3" },
    ],
  },
  {
    id: "kjemi", label: "Kjemi", icon: TestTube, color: "var(--green-soft)", border: "var(--green)",
    levels: [
      { id: "kjemi-1", label: "Kjemi 1", desc: "Vg2" },
      { id: "kjemi-2", label: "Kjemi 2", desc: "Vg3" },
    ],
  },
  {
    id: "biologi", label: "Biologi", icon: Dna, color: "var(--blue-soft)", border: "var(--blue)",
    levels: [
      { id: "biologi-1", label: "Biologi 1", desc: "Vg2" },
      { id: "biologi-2", label: "Biologi 2", desc: "Vg3" },
    ],
  },
  { id: "historie",    label: "Historie",    icon: Scroll,    color: "var(--yellow-soft)", border: "var(--yellow-press)" },
  { id: "samfunnsfag", label: "Samfunnsfag", icon: Landmark,  color: "var(--coral-soft)",  border: "var(--coral)" },
  { id: "engelsk",     label: "Engelsk",     icon: Globe,     color: "var(--blue-soft)",   border: "var(--blue)" },
  { id: "geografi",    label: "Geografi",    icon: Map,       color: "var(--green-soft)",  border: "var(--green)" },
];

const MODES = [
  {
    id: "exam" as Mode,
    label: "Eksamensmodus",
    desc: "Trekk et tilfeldig tema og bli vurdert av Blobb — akkurat som en ekte muntlig eksamen.",
    icon: GraduationCap,
    bg: "var(--coral-soft)",
    border: "var(--coral)",
    borderPress: "var(--coral-press)",
    iconColor: "var(--coral)",
    dotActive: "var(--coral)",
  },
  {
    id: "study" as Mode,
    label: "Øvingsmodus",
    desc: "Velg emner fra pensum og øv med Blobbs hjelp — med forklaringer og tilbakemelding underveis.",
    icon: BookMarked,
    bg: "var(--blue-soft)",
    border: "var(--blue)",
    borderPress: "oklch(0.48 0.19 240)",
    iconColor: "var(--blue)",
    dotActive: "var(--blue)",
  },
];

export default function SubjectGrid() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("exam");
  const swiperRef = useRef<HTMLDivElement>(null);
  const scrollingProgrammatically = useRef(false);

  function scrollToMode(m: Mode, smooth = true) {
    const el = swiperRef.current;
    if (!el) return;
    const idx = m === "exam" ? 0 : 1;
    scrollingProgrammatically.current = true;
    el.scrollTo({ left: idx * el.clientWidth, behavior: smooth ? "smooth" : "instant" });
    setTimeout(() => { scrollingProgrammatically.current = false; }, 400);
  }

  // Set initial scroll position without animation
  useEffect(() => {
    scrollToMode("exam", false);
  }, []);

  function handleSwiperScroll() {
    if (scrollingProgrammatically.current) return;
    const el = swiperRef.current;
    if (!el) return;
    const newMode = el.scrollLeft < el.clientWidth * 0.5 ? "exam" : "study";
    if (newMode !== mode) {
      setMode(newMode);
      setExpanded(null);
    }
  }

  function navigate(subjectId: string) {
    router.push(mode === "exam" ? `/exam?subject=${subjectId}` : `/study?subject=${subjectId}`);
  }

  function handleSubjectClick(s: Subject) {
    if (s.levels) {
      setExpanded(expanded === s.id ? null : s.id);
    } else {
      navigate(s.id);
    }
  }

  const activeModeData = MODES.find((m) => m.id === mode)!;

  return (
    <div>
      {/* ── Mode swiper ─────────────────────────────────────────────────── */}
      <div
        ref={swiperRef}
        data-no-swipe
        onScroll={handleSwiperScroll}
        className="hide-scrollbar"
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          borderRadius: "var(--r-xl)",
          marginBottom: "10px",
          gap: "0",
        } as React.CSSProperties}
      >
        {MODES.map((m, idx) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          const otherLabel = MODES[1 - idx].label;
          return (
            <div
              key={m.id}
              style={{
                flex: "0 0 100%",
                scrollSnapAlign: "start",
                backgroundColor: m.bg,
                border: `2px solid ${m.border}`,
                borderBottom: `4px solid ${m.borderPress}`,
                borderRadius: "var(--r-xl)",
                padding: "20px",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "52px", height: "52px",
                borderRadius: "var(--r-lg)",
                backgroundColor: "var(--surface)",
                border: `2px solid ${m.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
              }}>
                <Icon size={26} color={m.iconColor} strokeWidth={2} />
              </div>

              <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text)", marginBottom: "6px", lineHeight: 1.2 }}>
                {m.label}
              </p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: "260px" }}>
                {m.desc}
              </p>

              {/* Hint at other mode */}
              <p style={{
                position: "absolute",
                right: "16px",
                bottom: "18px",
                fontSize: "11px",
                fontWeight: 700,
                color: m.iconColor,
                opacity: 0.7,
              }}>
                {idx === 0 ? `${otherLabel} →` : `← ${otherLabel}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Dot indicators ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); scrollToMode(m.id); setExpanded(null); }}
            aria-label={m.label}
            style={{
              width: mode === m.id ? "20px" : "8px",
              height: "8px",
              borderRadius: "var(--r-full)",
              backgroundColor: mode === m.id ? m.dotActive : "var(--border-dark)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 250ms ease, background-color 250ms ease",
            }}
          />
        ))}
      </div>

      {/* ── Section label ───────────────────────────────────────────────── */}
      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-faint)", marginBottom: "10px", paddingLeft: "2px" }}>
        {mode === "exam"
          ? "Velg fag — Blobb trekker tema"
          : "Velg fag — du velger emner"}
      </p>

      {/* ── Subject grid ────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        {subjects.map((s) => {
          const isExpanded = expanded === s.id;
          const hasLevels = !!s.levels;
          const Icon = s.icon;
          const borderColor = isExpanded
            ? (mode === "exam" ? "var(--coral)" : "var(--blue)")
            : s.border;

          return (
            <div key={s.id} style={{ gridColumn: isExpanded ? "1 / -1" : undefined }}>
              <button
                onClick={() => handleSubjectClick(s)}
                style={{
                  width: "100%",
                  backgroundColor: s.color,
                  border: `2px solid ${borderColor}`,
                  borderBottom: isExpanded ? `2px solid ${borderColor}` : `4px solid ${borderColor}`,
                  borderRadius: isExpanded ? "var(--r-lg) var(--r-lg) 0 0" : "var(--r-lg)",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="btn-3d"
              >
                <Icon size={22} strokeWidth={2} color={s.border} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", flex: 1 }}>{s.label}</span>
                {hasLevels && (
                  isExpanded
                    ? <ChevronUp size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                )}
              </button>

              {isExpanded && s.levels && (
                <div style={{
                  backgroundColor: s.color,
                  border: `2px solid ${activeModeData.border}`,
                  borderTop: "none",
                  borderBottom: `4px solid ${activeModeData.borderPress}`,
                  borderRadius: "0 0 var(--r-lg) var(--r-lg)",
                  padding: "12px",
                  display: "grid",
                  gridTemplateColumns: `repeat(${s.levels.length <= 2 ? 2 : 4}, 1fr)`,
                  gap: "8px",
                }}>
                  {s.levels.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => { setExpanded(null); navigate(lvl.id); }}
                      style={{
                        backgroundColor: "var(--surface)",
                        border: `2px solid ${activeModeData.border}`,
                        borderBottom: `4px solid ${activeModeData.borderPress}`,
                        borderRadius: "var(--r-md)",
                        padding: "10px 8px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "center",
                      }}
                      className="btn-3d"
                    >
                      <p style={{ fontSize: "15px", fontWeight: 800, color: "var(--text)" }}>{lvl.label}</p>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
