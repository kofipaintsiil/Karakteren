import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Karakteren — Øv til muntlig eksamen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          backgroundColor: "#faf8f5",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Background dots pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, #e0dbd4 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          display: "flex",
        }} />

        {/* Card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffffff",
          border: "3px solid #e2dcd6",
          borderRadius: "24px",
          padding: "64px 80px",
          boxShadow: "0 8px 0 #e2dcd6",
          position: "relative",
          maxWidth: "900px",
          width: "100%",
          margin: "0 60px",
        }}>

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
            <div style={{
              width: "56px", height: "56px",
              borderRadius: "14px",
              backgroundColor: "#e8553e",
              border: "3px solid #b83a28",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "24px",
            }}>
              K
            </div>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#1a1714" }}>
              Karakteren
            </span>
          </div>

          {/* Headline */}
          <div style={{
            fontSize: "62px",
            fontWeight: 800,
            color: "#1a1714",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <span>Øv til muntlig.</span>
            <span style={{ color: "#e8553e" }}>Tørr det faktisk.</span>
          </div>

          {/* Subline */}
          <p style={{
            fontSize: "24px",
            color: "#7a6f66",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "40px",
            lineHeight: 1.4,
          }}>
            AI-sensor trekker tema og gir deg karakter 1–6
          </p>

          {/* Pills */}
          <div style={{ display: "flex", gap: "12px" }}>
            {["10 fag", "Karakter 1–6", "Gratis å starte"].map((label) => (
              <div key={label} style={{
                backgroundColor: "#fdf0ed",
                border: "2px solid #f4c4ba",
                borderRadius: "100px",
                padding: "10px 22px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#b83a28",
                display: "flex",
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
