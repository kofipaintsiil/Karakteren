import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

const client = new Anthropic();

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ text: null }, { status: 503 });
  }

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  if (!await rateLimit(`transcript:${auth.userId}`, 30, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const { text, alternatives, subject, topic } = await req.json() as {
    text: string;
    alternatives?: string[];
    subject: string;
    topic: string;
  };
  if (!text?.trim()) return NextResponse.json({ text });
  if (text.length > 2000) return NextResponse.json({ text }); // skip correction, return as-is

  const altSection = alternatives && alternatives.length > 1
    ? `\nAlternativer fra talegjenkjenning (velg beste utgangspunkt):\n${alternatives.map((a, i) => `${i + 1}. "${a}"`).join("\n")}\n`
    : "";

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: `Du er en norsk korrekturleser som fikser talegjenkjenningsfeil i eksamenssvar.
Faget er ${subject}, tema: "${topic}".

Primær transskribering: "${text}"${altSection}
Din oppgave:
1. Korriger ord misforstått fonetisk (f.eks. "deribert" → "derivert", "integrel" → "integral")
2. Korriger fagbegreper og matematisk notasjon
3. Korriger norske ord misforstått som noe annet
4. Fiks hakkete setningsstruktur fra talegjenkjenning
5. IKKE legg til faglig innhold som ikke ble sagt

Returner KUN den korrigerte teksten — ingen forklaring, ingen anførselstegn.`,
      }],
    }, { timeout: 10_000 });

    const corrected = response.content[0].type === "text" ? response.content[0].text.trim() : null;
    return NextResponse.json({ text: corrected || text });
  } catch {
    return NextResponse.json({ text }); // return original on error
  }
}
