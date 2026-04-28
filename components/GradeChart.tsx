"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface DataPoint {
  nr: number;
  karakter: number;
  fag: string;
}

interface GradeChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      backgroundColor: "var(--surface)",
      border: "2px solid var(--border)",
      borderRadius: "var(--r-md)",
      padding: "10px 14px",
      fontSize: "13px",
      fontWeight: 700,
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "2px" }}>{d.fag}</p>
      <p style={{ color: "var(--coral)", fontSize: "1.2rem" }}>Karakter {d.karakter}</p>
    </div>
  );
}

export default function GradeChart({ data }: GradeChartProps) {
  if (data.length < 2) {
    return (
      <div style={{
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--surface-2)",
        borderRadius: "var(--r-md)",
        border: "2px dashed var(--border)",
      }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-faint)" }}>
          Fullfør minst 2 prøver for å se grafen
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="nr"
          tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-faint)", fontFamily: "Plus Jakarta Sans, system-ui" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Prøve", position: "insideBottom", offset: -2, fontSize: 11, fill: "var(--text-faint)" }}
        />
        <YAxis
          domain={[1, 6]}
          ticks={[1, 2, 3, 4, 5, 6]}
          tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-faint)", fontFamily: "Plus Jakarta Sans, system-ui" }}
          tickLine={false}
          axisLine={false}
        />
        <ReferenceLine y={4} stroke="var(--yellow)" strokeDasharray="4 4" strokeWidth={1.5} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="karakter"
          stroke="var(--coral)"
          strokeWidth={3}
          dot={{ fill: "var(--coral)", r: 5, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 7, fill: "var(--coral)", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
