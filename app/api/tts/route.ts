import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_VOICE_ID = "nhvaqgRyAq6BmFs3WcdX";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "Mangler tekst" }, { status: 400 });

  // ElevenLabs first
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
        }
      );
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

  // OpenAI TTS fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "nova",
          input: text,
          speed: 1.0,
        }),
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

  // ElevenLabs fallback
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
        }
      );
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

  // VoiceRSS fallback
  if (!process.env.VOICERSS_API_KEY) {
    return NextResponse.json({ error: "TTS ikke konfigurert" }, { status: 503 });
  }

  const params = new URLSearchParams({
    key: process.env.VOICERSS_API_KEY,
    hl: "nb-no",
    src: text,
    c: "mp3",
    f: "44khz_16bit_stereo",
  });

  const res = await fetch(`https://api.voicerss.org/?${params}`);
  if (!res.ok) return NextResponse.json({ error: "TTS feilet" }, { status: 500 });

  const audio = await res.arrayBuffer();
  return new NextResponse(audio, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
