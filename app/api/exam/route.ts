import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkQuota } from "@/lib/quota";
import { rateLimit } from "@/lib/rate-limit";

const client = new Anthropic();

export const runtime = "nodejs";

interface Message {
  role: "examiner" | "student";
  text: string;
}

interface ExamRequest {
  subject: string;
  topic: string;
  messages: Message[];
  phase: "opening" | "followup" | "grade";
  studentAnswers: string[];
}

const SUBJECT_LABELS: Record<string, string> = {
  norsk: "Norsk", matematikk: "Matematikk", naturfag: "Naturfag",
  fysikk: "Fysikk", kjemi: "Kjemi", biologi: "Biologi",
  historie: "Historie", samfunnsfag: "Samfunnsfag", engelsk: "Engelsk", geografi: "Geografi",
};

function buildSystemPrompt(subject: string, topic: string): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const isEnglish = subject === "engelsk";

  return `Du er en muntlig eksamenssensor for norsk videregående skole (VGS). Du eksaminerer en elev i faget ${subjectLabel}, tema: "${topic}".

${isEnglish ? "Conduct this exam in English since the subject is English." : "Eksamen foregår på norsk bokmål."}

SENSORENS VIKTIGSTE OPPGAVE:
Muntlig eksamen handler om å gi eleven best mulig mulighet til å vise hva de KAN — ikke å avsløre hva de ikke kan. En rettferdig sensor:
- Stiller åpne spørsmål slik at eleven får utfolde seg fritt
- Følger opp gode svar for å utforske dybden: "Kan du gi et konkret eksempel?", "Hva er sammenhengen mellom X og Y?", "Hva mener du med det?"
- Hvis eleven ikke kan svare eller svarer feil: gå videre til et annet aspekt av temaet — svar aldri selv og dvel ikke ved hull
- Kartlegger bredden i temaet ved å stille spørsmål fra ulike deler av fagplanen (LK20)
- Tilpasser oppfølgingsspørsmål til det eleven faktisk sier — ikke faste, forhåndsbestemte spørsmål

Stil og tone:
- Profesjonell og nøytral. Kort og tydelig.
- Aldri overstrømmende ros ("Flott svar!"), men heller ikke kald eller avvisende
- Maks 1–2 setninger per tur fra deg
- Naturlige sensorfraser: "Kan du si mer om det?", "Hva skjer hvis...?", "Kan du gi et eksempel på det i praksis?"

Progresjon:
- Aldri avslutt på de første 3 elevresponsene
- Avslutt etter 4–8 utvekslinger når du har nok grunnlag — tilpass til svarets dybde
- Avslutt med én nøytral setning, f.eks. "Takk, jeg har det jeg trenger." og sett [FERDIG] aller sist
- [FERDIG] settes ALDRI midt i en melding, bare etter avslutningssetningen`;
}

function buildGradePrompt(subject: string, topic: string, messages: Message[]): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const conversation = messages
    .map((m) => `${m.role === "examiner" ? "SENSOR" : "ELEV"}: ${m.text}`)
    .join("\n");

  return `Du har nå gjennomført en muntlig eksamen i ${subjectLabel}, tema "${topic}".

Samtalen:
${conversation}

Sett karakter fra 1–6 basert på norsk vurderingsskala (LK20):
- 6: Fremragende kompetanse
- 5: Meget god kompetanse
- 4: God kompetanse
- 3: Nokså god kompetanse
- 2: Lav kompetanse
- 1: Svært lav kompetanse / ikke bestått

Basert på det eleven faktisk sa i denne samtalen, identifiser:
- "strengths": Konkrete ting eleven gjorde bra — sitér gjerne fra svarene. Maks 3 punkter. Tom liste hvis karakteren er 1–2.
- "improvements": Konkrete ting som trakk karakteren ned — f.eks. "Svarte ikke på spørsmålet om X", "Brukte ikke fagterminologi for Y", "Forklaringen av Z var for overfladisk". Maks 3 punkter.

Svar KUN med dette JSON-formatet (ingen annen tekst):
{"grade": <tall 1-6>, "feedback": "<2-3 setninger oppsummering>", "strengths": ["<punkt 1>", "..."], "improvements": ["<punkt 1>", "..."]}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI-eksaminatoren er ikke konfigurert ennå." }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for") ?? user.id;
  if (!rateLimit(`exam:${ip}`, 50, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const body = await req.json() as ExamRequest;
  const { subject, topic, messages, phase } = body;

  // Only enforce quota on new exam starts, not follow-up turns or grading
  if (phase === "opening") {
    const quota = await checkQuota(user.id);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          isPremium: quota.isPremium,
          used: quota.used,
          limit: quota.limit,
        },
        { status: 429 }
      );
    }
  }

  // Grading phase — returns JSON, not streaming
  if (phase === "grade") {
    const gradePrompt = buildGradePrompt(subject, topic, messages);
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: gradePrompt }],
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    try {
      const result = JSON.parse(text.trim());
      return NextResponse.json(result);
    } catch {
      const gradeMatch = text.match(/"grade"\s*:\s*(\d)/);
      const feedbackMatch = text.match(/"feedback"\s*:\s*"([^"]+)"/);
      return NextResponse.json({
        grade: gradeMatch ? parseInt(gradeMatch[1]) : 4,
        feedback: feedbackMatch ? feedbackMatch[1] : "Eksamen fullført.",
        strengths: [],
        improvements: [],
      });
    }
  }

  // Conversation phase — streaming
  const systemPrompt = buildSystemPrompt(subject, topic);

  const anthropicMessages: Anthropic.MessageParam[] = [];

  if (phase === "opening") {
    anthropicMessages.push({
      role: "user",
      content: `Start eksamenen. Si først "Du har trukket tema: ${topic}." og still deretter ett åpent spørsmål som gir eleven mulighet til å vise hva de kan om temaet. Ikke still ja/nei-spørsmål.`,
    });
  } else {
    // Convert conversation history
    for (const msg of messages) {
      anthropicMessages.push({
        role: msg.role === "examiner" ? "assistant" : "user",
        content: msg.text,
      });
    }
  }

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
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
