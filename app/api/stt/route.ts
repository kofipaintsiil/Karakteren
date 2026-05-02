import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  const lang = (formData.get("lang") as string) ?? "no";
  if (!audio) return NextResponse.json({ error: "Mangler lyddata." }, { status: 400 });

  const whisperForm = new FormData();
  whisperForm.append("file", audio);
  whisperForm.append("model", "whisper-large-v3-turbo");
  whisperForm.append("language", lang);
  whisperForm.append("response_format", "json");

  // Try Groq first (free, fast)
  if (process.env.GROQ_API_KEY) {
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: whisperForm,
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ text: data.text ?? "" });
    }
    const errText = await res.text();
    return NextResponse.json({ error: `Groq: ${res.status} — ${errText}` }, { status: 500 });
  }

  // Fallback: OpenAI Whisper
  if (process.env.OPENAI_API_KEY) {
    const openaiForm = new FormData();
    openaiForm.append("file", audio);
    openaiForm.append("model", "whisper-1");
    openaiForm.append("language", lang);
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: openaiForm,
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ text: data.text ?? "" });
    }
    const errText = await res.text();
    return NextResponse.json({ error: `Whisper: ${res.status} — ${errText}` }, { status: 500 });
  }

  return NextResponse.json({ error: "Ingen STT-nøkkel konfigurert. Legg til GROQ_API_KEY i Vercel." }, { status: 503 });
}
