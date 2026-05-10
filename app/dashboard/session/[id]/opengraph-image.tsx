import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { fetchSession } from "@/lib/sessions-server";

export const runtime = "edge";
export const alt = "Karakteren — Eksamenresultat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function gradeColor(g: number) {
  if (g >= 5) return "#22c55e";
  if (g >= 4) return "#eab308";
  if (g >= 3) return "#f97316";
  return "#ef4444";
}

function gradeLabel(g: number) {
  if (g === 6) return "Fremragende";
  if (g === 5) return "Meget godt";
  if (g === 4) return "Godt";
  if (g === 3) return "Nokså godt";
  if (g === 2) return "Lav kompetanse";
  return "Svært lav";
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const session = user ? await fetchSession(id, user.id) : null;

  const grade = session?.grade ?? null;
  const subject = session?.subject ?? "Muntlig eksamen";
  const topic = session?.topic ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FAF8F4 0%, #F0EDE6 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "#6C5CE7", display: "flex" }} />

        {/* Card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "60px 80px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          minWidth: "800px",
          gap: "0px",
        }}>
          {/* Brand */}
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#6C5CE7", letterSpacing: "0.5px", marginBottom: "32px", display: "flex" }}>
            KARAKTEREN
          </div>

          {/* Grade bubble */}
          {grade !== null && (
            <div style={{
              width: "140px", height: "140px", borderRadius: "70px",
              background: gradeColor(grade) + "18",
              border: `4px solid ${gradeColor(grade)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              <span style={{ fontSize: "72px", fontWeight: 900, color: gradeColor(grade), lineHeight: 1, display: "flex" }}>
                {grade}
              </span>
            </div>
          )}

          {/* Grade label */}
          {grade !== null && (
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px", display: "flex" }}>
              {gradeLabel(grade)}
            </div>
          )}

          {/* Subject + topic */}
          <div style={{ fontSize: "20px", color: "#666", display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ display: "flex" }}>{subject}</span>
            {topic && <><span style={{ display: "flex", color: "#aaa" }}>·</span><span style={{ display: "flex" }}>{topic}</span></>}
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: "absolute", bottom: "28px", fontSize: "16px", color: "#999", display: "flex" }}>
          Øv til muntlig eksamen på karakteren.no
        </div>
      </div>
    ),
    { ...size }
  );
}
