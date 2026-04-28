import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

  return `Du er Blobb, en muntlig eksamenssensor for norsk videregående skole (VGS). Du eksaminerer en elev i faget ${subjectLabel}, tema: "${topic}".

${isEnglish ? "Conduct this exam entirely in English since the subject is English." : "Eksamen foregår på norsk bokmål."}

Regler:
- Vær direkte og presis. Ikke vær overdrevent positiv eller hyggelig — du er en sensor, ikke en coach.
- Still oppfølgingsspørsmål basert på det eleven faktisk svarer, ikke forhåndsbestemte spørsmål.
- Hvis svaret er for kort (under 2-3 setninger), be eleven utdype: "Kan du si mer om det?"
- Svar alltid med KUN spørsmålet eller kommentaren — ingen lange innledninger, ingen "Takk for svaret ditt".
- Maksimalt 2-3 setninger per svar fra deg.

Avslutningstidspunkt:
- Aldri avslutt på de første 3 elevresponsene.
- Avslutt når du har nok grunnlag for en rettferdig karakter — typisk etter 4–8 utvekslinger, avhengig av svarets dybde.
- Når du avslutter: si en kort avslutningssetning (f.eks. "Greit, jeg har nå det jeg trenger for å sette karakter.") og avslutt meldingen med nøyaktig teksten [FERDIG] — ingenting etter det.
- Sett aldri [FERDIG] midt i en melding, bare helt til slutt.

Fagets kompetansemål (LK20) for ${subjectLabel} skal ligge til grunn for vurderingen.`;
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

  const body = await req.json() as ExamRequest;
  const { subject, topic, messages, phase } = body;

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
      content: `Still åpningsspørsmålet for tema "${topic}". Start med: "Du har trukket tema: ${topic}."`,
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
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
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
