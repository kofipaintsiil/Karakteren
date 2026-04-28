interface SubjectAvg {
  subject: string;
  avg: number;
  count: number;
}

interface WeakAreasProps {
  subjectAvgs: SubjectAvg[];
}

function gradeColor(avg: number) {
  if (avg >= 5) return { bar: "var(--green)", text: "var(--green-press)", bg: "var(--green-soft)" };
  if (avg >= 4) return { bar: "var(--yellow)", text: "oklch(0.44 0.15 82)", bg: "var(--yellow-soft)" };
  return { bar: "var(--error)", text: "var(--error)", bg: "oklch(0.96 0.04 22)" };
}

export default function WeakAreas({ subjectAvgs }: WeakAreasProps) {
  if (subjectAvgs.length === 0) {
    return (
      <div style={{
        padding: "24px",
        textAlign: "center",
        backgroundColor: "var(--surface-2)",
        borderRadius: "var(--r-md)",
        border: "2px dashed var(--border)",
      }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-faint)" }}>
          Ingen data ennå — fullfør noen prøver
        </p>
      </div>
    );
  }

  const sorted = [...subjectAvgs].sort((a, b) => a.avg - b.avg);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {sorted.map((s) => {
        const { bar, text, bg } = gradeColor(s.avg);
        const pct = ((s.avg - 1) / 5) * 100;
        return (
          <div key={s.subject} style={{
            backgroundColor: bg,
            border: `2px solid ${bar}`,
            borderRadius: "var(--r-md)",
            padding: "12px 14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{s.subject}</span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: text }}>
                {s.avg.toFixed(1)} <span style={{ fontSize: "11px", fontWeight: 600 }}>({s.count} prøver)</span>
              </span>
            </div>
            <div style={{ height: "8px", backgroundColor: "oklch(0.92 0.01 60)", borderRadius: "var(--r-full)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                backgroundColor: bar,
                borderRadius: "var(--r-full)",
                transition: "width 600ms ease-out",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
