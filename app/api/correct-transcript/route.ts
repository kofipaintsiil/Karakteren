import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ text: null }, { status: 503 });
  }

  const { text, subject, topic } = await req.json() as { text: string; subject: string; topic: string };
  if (!text?.trim()) return NextResponse.json({ text });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{
      role: "user",
      content: `Du korrigerer talegjenkjenningsfeil i et eksamenssvar. Faget er ${subject}, tema: "${topic}".

Rå transskribering: "${text}"

Regler:
- Korriger fagbegreper som er stavet feil eller lyder fonetisk feil (f.eks. "fotosyntes" → "fotosyntese", "adenosin trifosfat" → "adenosintrifosfat")
- Korriger åpenbare norske ord som ble misforstått
- IKKE endre meningen, legg til informasjon, eller omformuler setninger
- Returner KUN den korrigerte teksten — ingen forklaring, ingen anførselstegn`,
    }],
  });

  const corrected = response.content[0].type === "text" ? response.content[0].text.trim() : null;
  return NextResponse.json({ text: corrected || text });
}
