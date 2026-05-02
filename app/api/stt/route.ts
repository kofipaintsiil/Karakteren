import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "STT ikke konfigurert." }, { status: 503 });
  }
  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  const lang = (formData.get("lang") as string) ?? "no";
  if (!audio) return NextResponse.json({ error: "Mangler lyddata." }, { status: 400 });

  const whisperForm = new FormData();
  whisperForm.append("file", audio);
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", lang);

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: whisperForm,
  });
  if (!res.ok) {
    const errBody = await res.text();
    return NextResponse.json({ error: `Whisper: ${res.status} — ${errBody}` }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json({ text: data.text ?? "" });
}
