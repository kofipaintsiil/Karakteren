import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

const VOICES = {
  female: process.env.ELEVENLABS_VOICE_ID ?? "k5IgYJw2jfo6mO5HhagG",
  male:   process.env.ELEVENLABS_VOICE_ID_MALE ?? "ikwOHnCcqQJgOoz5Wxex",
};
const FALLBACK_VOICE_ID = "XB0fDUnXU5powFXDhCwa"; // Charlotte — public fallback
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
        model_id: "eleven_turbo_v2_5",
        // Calm, professional examiner — high stability, minimal style flair
        voice_settings: { stability: 0.70, similarity_boost: 0.75, style: 0.05 },
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
  if (!await rateLimit(`tts:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const { text, voice } = await req.json() as { text: string; voice?: "male" | "female" };
  if (!text) return NextResponse.json({ error: "Mangler tekst" }, { status: 400 });
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Tekst for lang" }, { status: 400 });
  }

  if (process.env.ELEVENLABS_API_KEY) {
    const voiceId = VOICES[voice ?? "female"];
    let audio = await elevenLabsTTS(text, voiceId).catch((e) => {
      console.error("[TTS] ElevenLabs primary error:", e);
      return null;
    });
    if (!audio && voiceId !== FALLBACK_VOICE_ID) {
      console.warn("[TTS] Primary voice failed, trying fallback voice");
      audio = await elevenLabsTTS(text, FALLBACK_VOICE_ID).catch(() => null);
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
