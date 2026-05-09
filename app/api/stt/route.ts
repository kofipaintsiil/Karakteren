import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_AUDIO_MB = 10;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const ip = req.headers.get("x-forwarded-for") ?? auth.userId;
  if (!await rateLimit(`stt:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;
  const lang = (formData.get("lang") as string) ?? "no";
  if (!audio) return NextResponse.json({ error: "Mangler lyddata." }, { status: 400 });

  if (audio.size > MAX_AUDIO_MB * 1024 * 1024) {
    return NextResponse.json({ error: "Lydfil for stor (maks 10 MB)" }, { status: 400 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio);
  whisperForm.append("model", "whisper-large-v3-turbo");
  whisperForm.append("language", lang);
  whisperForm.append("response_format", "json");

  // Try Groq first (free, fast)
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: whisperForm,
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ text: data.text ?? "" });
      }
    } catch {
      // fall through to OpenAI
    }
  }

  // Fallback: OpenAI Whisper
  if (process.env.OPENAI_API_KEY) {
    try {
      const openaiForm = new FormData();
      openaiForm.append("file", audio);
      openaiForm.append("model", "whisper-1");
      openaiForm.append("language", lang);
      const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: openaiForm,
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ text: data.text ?? "" });
      }
    } catch {
      // fall through
    }
  }

  return NextResponse.json({ error: "Ingen STT-nøkkel konfigurert." }, { status: 503 });
}
