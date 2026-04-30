"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import type { LeaderboardEntry } from "@/lib/sessions-server";

interface Props {
  entries: LeaderboardEntry[];
  subjects: string[];
  medals: string[];
  currentUserId: string | null;
}

export default function LeaderboardClient({ entries, subjects, medals, currentUserId }: Props) {
  const [activeSubject, setActiveSubject] = useState("Alle");

  const filtered = activeSubject === "Alle"
    ? entries
    : entries.filter((e) => e.top_subject === activeSubject);

  return (
    <div style={{ width: "100%" }}>
      {/* Subject filter tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--r-full)",
              fontSize: "12px",
              fontWeight: 700,
              border: `2px solid ${activeSubject === s ? "var(--coral)" : "var(--border)"}`,
              backgroundColor: activeSubject === s ? "var(--coral-soft)" : "var(--surface)",
              color: activeSubject === s ? "var(--coral-press)" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 150ms ease-out",
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
          return (
            <div
              key={entry.user_id}
              style={{
                backgroundColor: isMe ? "var(--coral-soft)" : rank <= 3 ? "var(--surface)" : "var(--surface)",
                border: `2px solid ${isMe ? "var(--coral)" : rank <= 3 ? "var(--coral-mid)" : "var(--border)"}`,
                borderBottom: `4px solid ${isMe ? "var(--coral-press)" : rank <= 3 ? "var(--coral)" : "var(--border-dark)"}`,
                borderRadius: "var(--r-lg)",
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
                color: rank <= 3 ? "inherit" : "var(--text-faint)",
                flexShrink: 0,
              }}>
                {medals[rank - 1] ?? `#${rank}`}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: isMe ? "var(--coral-press)" : "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {entry.display_name}{isMe && " (deg)"}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>
                  {entry.top_subject} · {entry.total_sessions} prøver
                </p>
              </div>
              <Badge variant={entry.avg_grade >= 5 ? "success" : entry.avg_grade >= 4 ? "yellow" : "error"}>
                {entry.avg_grade.toFixed(1)}
              </Badge>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: "40px 24px",
          textAlign: "center",
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-lg)",
        }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600 }}>
            Ingen resultater for dette faget ennå.
          </p>
        </div>
      )}
    </div>
  );
}
