import type { ReactElement } from "react";

export const SUBJECT_COLORS: Record<string, string> = {
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

export function subjectColor(subject: string): string {
  const key = subject.toLowerCase().split(" ")[0];
  return SUBJECT_COLORS[key] ?? "var(--accent)";
}

export function SubjectIcon({ id, size = 18, color }: { id: string; size?: number; color?: string }) {
  const stroke = color ?? SUBJECT_COLORS[id] ?? "var(--accent)";

  const icons: Record<string, ReactElement> = {
    norsk: (
      <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>
    ),
    matematikk: (
      <path d="M18 4H7l7 8-7 8h11"/>
    ),
    fysikk: (
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    ),
    kjemi: (
      <><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></>
    ),
    biologi: (
      <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></>
    ),
    historie: (
      <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>
    ),
    naturfag: (
      <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>
    ),
    samfunnsfag: (
      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>
    ),
    engelsk: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    ),
    geografi: (
      <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>
    ),
    fransk: (
      <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[id] ?? <circle cx="12" cy="12" r="8"/>}
    </svg>
  );
}
