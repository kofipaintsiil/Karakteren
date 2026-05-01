"use client";

import { useState } from "react";
import type { LeaderboardEntry } from "@/lib/sessions-server";

interface Props {
  entries: LeaderboardEntry[];
  subjects: string[];
  medals: string[];
  currentUserId: string | null;
}

function gradeColor(avg: number) {
  if (avg >= 5) return "var(--green)";
  if (avg >= 4) return "var(--accent)";
  return "oklch(58% 0.18 22)";
}

export default function LeaderboardClient({ entries, subjects, medals, currentUserId }: Props) {
  const [activeSubject, setActiveSubject] = useState("Alle");

  const filtered = activeSubject === "Alle"
    ? entries
    : entries.filter((e) => e.top_subject === activeSubject);

  return (
    <div style={{ width: "100%", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Subject filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--r-full)",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              backgroundColor: activeSubject === s ? "var(--text)" : "var(--bg-alt)",
              color: activeSubject === s ? "var(--bg)" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 150ms ease-out",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", overflow: "hidden" }}>
        {filtered.map((entry, i) => {
          const isMe = entry.user_id === currentUserId;
          const rank = i + 1;
          const color = gradeColor(entry.avg_grade);
          return (
            <div
              key={entry.user_id}
              style={{
                backgroundColor: isMe ? "var(--accent-bg)" : "var(--surface)",
                border: `1px solid ${isMe ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <span style={{
                fontSize: rank <= 3 ? "22px" : "15px",
                fontWeight: 800,
                width: "32px",
                textAlign: "center",
                color: rank <= 3 ? "inherit" : "var(--ink-light)",
                flexShrink: 0,
                fontFamily: "Syne, sans-serif",
              }}>
                {medals[rank - 1] ?? `#${rank}`}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: isMe ? "var(--accent-dark)" : "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {entry.display_name}{isMe && " (deg)"}
                </p>
                <p style={{ fontSize: "12px", color: "var(--ink-light)", marginTop: "2px" }}>
                  {entry.top_subject} · {entry.total_sessions} prøver
                </p>
              </div>
              <span style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                color,
                flexShrink: 0,
              }}>
                {entry.avg_grade.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: "40px 24px",
          textAlign: "center",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
        }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Ingen resultater for dette faget ennå.
          </p>
        </div>
      )}
    </div>
  );
}
