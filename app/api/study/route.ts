import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth-guard";
import { rateLimit } from "@/lib/rate-limit";

const client = new Anthropic();

export const runtime = "nodejs";

interface Message {
  role: "examiner" | "student";
  text: string;
}

interface StudyRequest {
  subject: string;
  topics: string[];
  messages: Message[];
  phase: "opening" | "followup";
}

const SUBJECT_LABELS: Record<string, string> = {
  norsk: "Norsk", matematikk: "Matematikk", naturfag: "Naturfag",
  fysikk: "Fysikk", kjemi: "Kjemi", biologi: "Biologi",
  historie: "Historie", samfunnsfag: "Samfunnskunnskap", engelsk: "Engelsk", geografi: "Geografi",
  "matematikk-1t": "Matematikk 1T", "matematikk-r1": "Matematikk R1",
  "matematikk-r2": "Matematikk R2", "matematikk-2p": "Matematikk 2P",
  "kjemi-1": "Kjemi 1", "kjemi-2": "Kjemi 2",
  "fysikk-1": "Fysikk 1", "fysikk-2": "Fysikk 2",
  "biologi-1": "Biologi 1", "biologi-2": "Biologi 2",
  "fransk-1": "Français (Niveau I)", "fransk-2": "Français (Niveau II)",
};

function buildStudySystemPrompt(subject: string, topics: string[]): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const isEnglish = subject === "engelsk";
  const isFrench = subject === "fransk-1" || subject === "fransk-2";
  const topicList = topics.map((t, i) => `${i + 1}. ${t}`).join("\n");

  return `Du er Blobb, en studieassistent som hjelper en elev å forberede seg til muntlig eksamen i ${subjectLabel} (LK20).

Emner som skal gjennomgås i denne økten:
${topicList}

${isEnglish ? "Conduct this study session entirely in English since the subject is English." : isFrench ? "Conduis cette session d'étude entièrement en français. L'élève doit répondre en français." : "Studiesesjonen foregår på norsk bokmål."}

Din rolle:
- Still spørsmål for å sjekke elevens forståelse, akkurat som en sensor ville gjort
- Gi korte, presise forklaringer og rettledning når eleven er usikker eller svarer feil
- Vær oppmuntrende, men faglig presis — dette er øving, ikke eksamen
- Dekk emne for emne i rekkefølge. Gå videre til neste emne når eleven har vist tilstrekkelig forståelse
- Etter at alle emner er grundig gjennomgått og eleven er ferdig: si en kort avslutningssetning (f.eks. "Du har nå gått gjennom alle emnene. Bra innsats!") og avslutt meldingen med nøyaktig [FERDIG] — ingenting etter det

Regler:
- Maks 2–3 setninger per respons
- Bruk fagbegreper fra LK20-pensum for ${subjectLabel}
- Ikke gi forelesninger — still heller spørsmål og la eleven forklare
- Sett aldri [FERDIG] de første 3 elevresponsene
- [FERDIG] skal bare stå som absolutt siste tekst i meldingen
- Skriv kun ren tekst — ingen markdown-formatering, ingen **bold**, ingen *kursiv*, ingen lister med - eller *`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI ikke konfigurert." }, { status: 503 });
  }

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const ip = req.headers.get("x-forwarded-for") ?? auth.userId;
  if (!await rateLimit(`study:${ip}`, 40, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const body = await req.json() as StudyRequest;
  const { subject, topics, messages, phase } = body;

  const systemPrompt = buildStudySystemPrompt(subject, topics);
  const anthropicMessages: Anthropic.MessageParam[] = [];

  if (phase === "opening") {
    const topicStr = topics.length === 1 ? `"${topics[0]}"` : topics.map((t) => `"${t}"`).join(", ");
    anthropicMessages.push({
      role: "user",
      content: `Start en øvingsøkt om ${topicStr}. Start med en vennlig setning, deretter det første spørsmålet.`,
    });
  } else {
    for (const msg of messages) {
      anthropicMessages.push({
        role: msg.role === "examiner" ? "assistant" : "user",
        content: msg.text,
      });
    }
  }

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 320,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch {
        // Client disconnected or stream error — close cleanly
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
