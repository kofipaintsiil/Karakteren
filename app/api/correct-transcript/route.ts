import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ text: null }, { status: 503 });
  }

  const { text, alternatives, subject, topic } = await req.json() as {
    text: string;
    alternatives?: string[];
    subject: string;
    topic: string;
  };
  if (!text?.trim()) return NextResponse.json({ text });

  const altSection = alternatives && alternatives.length > 1
    ? `\nAlternativer fra talegjenkjenning (velg beste utgangspunkt):\n${alternatives.map((a, i) => `${i + 1}. "${a}"`).join("\n")}\n`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: `Du er en norsk korrekturleser som fikser talegjenkjenningsfeil i eksamenssvar.
Faget er ${subject}, tema: "${topic}".

Primær transskribering: "${text}"${altSection}
Din oppgave:
1. Korriger ord misforstått fonetisk (f.eks. "deribert" → "derivert", "integrel" → "integral", "fotosyn tese" → "fotosyntese", "ker nen" → "kjernen")
2. Korriger fagbegreper og matematisk notasjon (f.eks. "x i andre" → "x²", "pi r kvadrat" → "πr²", "delta x" → "Δx", "e til x" → "eˣ")
3. Korriger norske ord misforstått som noe annet (f.eks. "de" → "det", "å" → "og", "a" → "av")
4. Fiks hakkete setningsstruktur fra talegjenkjenning
5. Hvis et alternativ fra listen er mer korrekt enn primærtranskripsjon, bruk det som grunnlag
6. IKKE legg til faglig innhold som ikke ble sagt
7. IKKE endre meningen eller omformuler unødig

Returner KUN den korrigerte teksten — ingen forklaring, ingen anførselstegn.`,
    }],
  });

  const corrected = response.content[0].type === "text" ? response.content[0].text.trim() : null;
  return NextResponse.json({ text: corrected || text });
}
