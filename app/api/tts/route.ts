import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

// Override via ELEVENLABS_VOICE_ID env var in Vercel if you change voices
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB";
// Well-known public fallback (ElevenLabs "Charlotte" — multilingual)
const FALLBACK_VOICE_ID = "XB0fDUnXU5powFXDhCwa";
const MAX_TEXT_LENGTH = 1000;

async function elevenLabsTTS(text: string, voiceId: string): Promise<ArrayBuffer | null> {
  if (!process.env.ELEVENLABS_API_KEY) return null;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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
  if (res.ok) return res.arrayBuffer();
  const errBody = await res.text().catch(() => "(no body)");
  console.error(`[TTS] ElevenLabs voice=${voiceId} status=${res.status}:`, errBody);
  return null;
}

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

  if (process.env.ELEVENLABS_API_KEY) {
    // Try configured voice first, then fall back to public voice
    let audio = await elevenLabsTTS(text, VOICE_ID).catch((e) => {
      console.error("[TTS] ElevenLabs primary error:", e);
      return null;
    });
    if (!audio && VOICE_ID !== FALLBACK_VOICE_ID) {
      console.warn("[TTS] Primary voice failed, trying fallback voice");
      audio = await elevenLabsTTS(text, FALLBACK_VOICE_ID).catch((e) => {
        console.error("[TTS] ElevenLabs fallback error:", e);
        return null;
      });
    }
    if (audio) {
      return new NextResponse(audio, {
        headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
      });
    }
  } else {
    console.error("[TTS] ELEVENLABS_API_KEY is not set in environment");
  }

  // OpenAI — last resort
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
      const errBody = await res.text().catch(() => "(no body)");
      console.error(`[TTS] OpenAI ${res.status}:`, errBody);
    } catch (e) {
      console.error("[TTS] OpenAI fetch error:", e);
    }
  }

  return NextResponse.json({ error: "TTS ikke tilgjengelig" }, { status: 503 });
}
