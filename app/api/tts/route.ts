import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

const ELEVENLABS_VOICE_ID = "BGEU6wFi2uNm6Kje1Yhk";
const MAX_TEXT_LENGTH = 1000;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const ip = req.headers.get("x-forwarded-for") ?? auth.userId;
  if (!rateLimit(`tts:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "Mangler tekst" }, { status: 400 });
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Tekst for lang" }, { status: 400 });
  }

  // ElevenLabs — primary
  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.45, similarity_boost: 0.75, style: 0.2 },
          }),
          signal: AbortSignal.timeout(15_000),
        }
      );
      if (res.ok) {
        const audio = await res.arrayBuffer();
        return new NextResponse(audio, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
        });
      }
    } catch {
      // fall through to OpenAI
    }
  }

  // OpenAI — fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "tts-1", voice: "alloy", input: text, speed: 1.0 }),
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) {
        const audio = await res.arrayBuffer();
        return new NextResponse(audio, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
        });
      }
    } catch {
      // fall through
    }
  }

  return NextResponse.json({ error: "TTS ikke tilgjengelig" }, { status: 503 });
}
