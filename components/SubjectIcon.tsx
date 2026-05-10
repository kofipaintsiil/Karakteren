import type { ReactElement } from "react";

export const SUBJECT_COLORS: Record<string, string> = {
  norsk:            "oklch(0.60 0.15 260)",
  matematikk:       "oklch(0.58 0.18 22)",
  fysikk:           "oklch(0.55 0.16 210)",
  kjemi:            "oklch(0.60 0.16 140)",
  biologi:          "oklch(0.58 0.15 150)",
  historie:         "oklch(0.58 0.14 50)",
  naturfag:         "oklch(0.58 0.15 160)",
  samfunnsfag:      "oklch(0.58 0.14 280)",
  engelsk:          "oklch(0.55 0.15 230)",
  geografi:         "oklch(0.58 0.14 80)",
  fransk:           "oklch(0.55 0.15 10)",
  tysk:             "oklch(0.52 0.14 245)",
  spansk:           "oklch(0.58 0.16 18)",
  samfunnsøkonomi:  "oklch(0.56 0.14 195)",
  sosiologi:        "oklch(0.56 0.15 300)",
  psykologi:        "oklch(0.56 0.16 270)",
  rettslære:        "oklch(0.60 0.14 65)",
  markedsføring:    "oklch(0.58 0.16 35)",
  teknologi:        "oklch(0.53 0.15 200)",
  religion:         "oklch(0.58 0.13 55)",
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
    tysk: (
      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/></>
    ),
    spansk: (
      <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none"/></>
    ),
    samfunnsøkonomi: (
      <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>
    ),
    sosiologi: (
      <><circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M2 21v-1a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v1"/><line x1="12" y1="11" x2="12" y2="14"/></>
    ),
    psykologi: (
      <><path d="M9.5 2A6.5 6.5 0 0 1 16 8.5c0 1.8-.7 3.4-1.8 4.6L12 16l-2.2-2.9A6.5 6.5 0 0 1 9.5 2z"/><path d="M12 16v6"/><path d="M9 22h6"/><path d="M9.5 8a1.5 1.5 0 0 0 3 0"/></>
    ),
    rettslære: (
      <><path d="M12 22V2"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 6l4-4 4 4"/><path d="M6 12 2 4l8 2"/><path d="M18 12l4-8-8 2"/></>
    ),
    markedsføring: (
      <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M6 11h4"/><path d="M6 15h4"/></>
    ),
    teknologi: (
      <><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M9 10h6"/><path d="M9 12h6"/><path d="M9 14h4"/></>
    ),
    religion: (
      <><path d="M12 2v4"/><path d="M9 5h6"/><path d="M12 6c0 6-6 8-6 12h12c0-4-6-6-6-12z"/><path d="M7 22h10"/></>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[id] ?? <circle cx="12" cy="12" r="8"/>}
    </svg>
  );
}
