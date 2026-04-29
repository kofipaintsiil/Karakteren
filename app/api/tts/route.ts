import { NextRequest, NextResponse } from "next/server";

// ElevenLabs voice IDs — eleven_multilingual_v2 handles Norwegian well
const ELEVENLABS_VOICE_ID = "s2xtA7B2CTXPPlJzch1v";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "Mangler tekst" }, { status: 400 });

  // Try ElevenLabs first (high-quality multilingual Norwegian)
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
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-store",
          },
        });
      }
    } catch {
      // fall through to VoiceRSS
    }
  }

  // Fallback: VoiceRSS
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
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
