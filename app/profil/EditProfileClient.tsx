"use client";
import { useRef, useState } from "react";

interface Props {
  initialName: string;
  initialAvatar: string | null;
}

export default function EditProfileClient({ initialName, initialAvatar }: Props) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function saveName() {
    if (!name.trim() || name === initialName) return;
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Navn lagret ✓");
    } else {
      const body = await res.json().catch(() => ({}));
      setMsg(`Feil: ${body.error ?? res.status}`);
    }
    setTimeout(() => setMsg(""), 6000);
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately
    const local = URL.createObjectURL(file);
    setAvatar(local);

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    if (res.ok) {
      const { avatar_url } = await res.json();
      setAvatar(avatar_url);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(`Profilbilde feil: ${body.error ?? res.status}`);
    }
  }

  const initials = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: "80px", height: "80px", borderRadius: "var(--r-full)",
            backgroundColor: avatar ? "transparent" : "var(--accent-bg)",
            border: "2px solid var(--border)",
            overflow: "hidden", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}
          title="Bytt profilbilde"
        >
          {avatar
            ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--accent-dark)" }}>{initials}</span>
          }
          <div style={{
            position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0, transition: "opacity 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadAvatar} />
        <div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text)", marginBottom: "4px" }}>Profilbilde</p>
          <p style={{ fontSize: "12px", color: "var(--ink-light)" }}>Klikk for å laste opp bilde</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink-light)", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
          Visningsnavn
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && saveName()}
            placeholder="Ditt navn"
            maxLength={40}
            style={{
              flex: 1, padding: "11px 14px",
              borderRadius: "var(--r-md)",
              border: "1.5px solid var(--border)",
              fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", color: "var(--text)",
              backgroundColor: "var(--bg)", outline: "none",
            }}
          />
          <button
            onClick={saveName}
            disabled={saving || !name.trim() || name === initialName}
            style={{
              padding: "11px 18px", borderRadius: "var(--r-md)", border: "none",
              backgroundColor: "var(--accent)", color: "#fff",
              fontFamily: "Inter, system-ui, sans-serif", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", opacity: (saving || !name.trim() || name === initialName) ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            {saving ? "…" : "Lagre"}
          </button>
        </div>
        {msg && <p style={{ fontSize: "12px", color: "var(--green)", marginTop: "6px", fontWeight: 600 }}>{msg}</p>}
      </div>
    </div>
  );
}
