"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Calculator, FlaskConical, Zap, TestTube, Dna,
  Scroll, Landmark, Globe, Map, ChevronDown, ChevronUp,
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

export default function SubjectGrid() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleClick(s: Subject) {
    if (s.levels) {
      setExpanded(expanded === s.id ? null : s.id);
    } else {
      router.push(`/exam?subject=${s.id}`);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
      {subjects.map((s) => {
        const isExpanded = expanded === s.id;
        const hasLevels = !!s.levels;
        const Icon = s.icon;

        return (
          <div key={s.id} style={{ gridColumn: isExpanded ? "1 / -1" : undefined }}>
            <button
              onClick={() => handleClick(s)}
              style={{
                width: "100%",
                backgroundColor: s.color,
                border: `2px solid ${s.border}`,
                borderBottom: isExpanded ? `2px solid ${s.border}` : `4px solid ${s.border}`,
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
                border: `2px solid ${s.border}`,
                borderTop: "none",
                borderBottom: `4px solid ${s.border}`,
                borderRadius: "0 0 var(--r-lg) var(--r-lg)",
                padding: "12px",
                display: "grid",
                gridTemplateColumns: `repeat(${s.levels.length <= 2 ? 2 : 4}, 1fr)`,
                gap: "8px",
              }}>
                {s.levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => { setExpanded(null); router.push(`/exam?subject=${lvl.id}`); }}
                    style={{
                      backgroundColor: "var(--surface)",
                      border: `2px solid ${s.border}`,
                      borderBottom: `4px solid ${s.border}`,
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
  );
}
