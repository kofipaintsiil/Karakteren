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
  topics?: string[];
  messages: Message[];
  phase: "opening" | "followup" | "grade";
  studentAnswers: string[];
}

const SUBJECT_LABELS: Record<string, string> = {
  norsk: "Norsk", matematikk: "Matematikk", naturfag: "Naturfag",
  fysikk: "Fysikk", kjemi: "Kjemi", biologi: "Biologi",
  historie: "Historie", samfunnsfag: "Samfunnskunnskap", engelsk: "Engelsk", geografi: "Geografi",
  "fransk-1": "Français (Niveau I)", "fransk-2": "Français (Niveau II)",
  "samfunnsøkonomi-1": "Samfunnsøkonomi 1", "samfunnsøkonomi-2": "Samfunnsøkonomi 2",
  sosiologi: "Sosiologi og sosialantropologi",
  "psykologi-1": "Psykologi 1", "psykologi-2": "Psykologi 2",
  "rettslære-1": "Rettslære 1", "rettslære-2": "Rettslære 2",
  "markedsføring-1": "Markedsføring og ledelse 1", "markedsføring-2": "Markedsføring og ledelse 2",
  teknologi: "Teknologi og forskningslære 1",
  "tysk-1": "Deutsch (Niveau I)", "tysk-2": "Deutsch (Niveau II)",
  "spansk-1": "Español (Nivel I)", "spansk-2": "Español (Nivel II)",
  religion: "Religion og etikk",
};

function getLangInstruction(subject: string): string {
  if (subject === "engelsk") return "Conduct this conversation entirely in English. The student must also answer in English.";
  if (subject === "fransk-1" || subject === "fransk-2") return "Conduis cette conversation entièrement en français. L'élève doit aussi répondre en français.";
  if (subject === "tysk-1" || subject === "tysk-2") return "Führe dieses Gespräch vollständig auf Deutsch durch. Der Schüler muss ebenfalls auf Deutsch antworten.";
  if (subject === "spansk-1" || subject === "spansk-2") return "Conduce esta conversación completamente en español. El alumno también debe responder en español.";
  return "Samtalen foregår på norsk bokmål.";
}

function buildOvingSystemPrompt(subject: string, topics: string[]): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const topicList = topics.map((t, i) => `${i + 1}. ${t}`).join("\n");

  return `Du er en faglærer som gjennomfører en muntlig fagsamtale med en elev i ${subjectLabel}.

${getLangInstruction(subject)}

Emnene for fagsamtalen er:
${topicList}

DIN OPPGAVE:
- Gå gjennom ALLE emnene i løpet av samtalen — dette er en fagsamtale, ikke en eksamen om ett tema
- Start med emne 1. Etter 2–3 utvekslinger per emne, gå naturlig videre: "La oss gå videre til [neste emne]..."
- Still åpne spørsmål som lar eleven vise hva de kan
- Følg opp gode svar: "Kan du gi et konkret eksempel?", "Hva er sammenhengen mellom X og Y?", "Hva skjer hvis...?"
- Hvis eleven ikke kan svare: gå videre til neste aspekt — svar aldri selv
- Tilpass deg det eleven sier — ingen faste, forhåndsbestemte spørsmål
- Avslutt FØRST når alle emnene er berørt
- Avslutt med én nøytral setning, f.eks. "Vi har vært gjennom alle emnene — takk for en god samtale." etterfulgt av [FERDIG]
- [FERDIG] settes ALDRI midt i en melding, bare etter avslutningssetningen

Stil og tone:
- Vennlig og engasjert — dette er en læringssamtale, ikke en eksamen
- Kort og tydelig: maks 2 setninger per tur fra deg
- Profesjonell men ikke kald`;
}

function buildOvingOpeningMessage(subject: string, topics: string[]): string {
  const isFrench = subject === "fransk-1" || subject === "fransk-2";
  const isGerman = subject === "tysk-1" || subject === "tysk-2";
  const isSpanish = subject === "spansk-1" || subject === "spansk-2";
  const isEnglish = subject === "engelsk";

  const topicStr = topics.join(", ");
  const first = topics[0];

  if (isEnglish) return `Start the subject conversation. Tell the student you will go through the following topics: ${topicStr}. Then start with "${first}" and ask one open question.`;
  if (isFrench) return `Commence la conversation. Dis à l'élève que vous allez aborder les thèmes suivants : ${topicStr}. Commence par "${first}" et pose une question ouverte.`;
  if (isGerman) return `Beginne das Gespräch. Sag dem Schüler, dass ihr folgende Themen besprechen werdet: ${topicStr}. Fange mit "${first}" an und stelle eine offene Frage.`;
  if (isSpanish) return `Comienza la conversación. Dile al alumno que vais a tratar los siguientes temas: ${topicStr}. Empieza con "${first}" y haz una pregunta abierta.`;
  return `Start fagsamtalen. Fortell eleven at dere skal gå gjennom følgende emner: ${topicStr}. Start med "${first}" og still ett åpent spørsmål.`;
}

function buildSystemPrompt(subject: string, topic: string): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  return `Du er en muntlig eksamenssensor for norsk videregående skole (VGS). Du eksaminerer en elev i faget ${subjectLabel}, tema: "${topic}".

${getLangInstruction(subject)}

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
- Aldri avslutt på de første 2 elevresponsene
- Avslutt etter 3–5 utvekslinger når du har nok grunnlag — tilpass til svarets dybde
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

  if (!await rateLimit(`exam:${user.id}`, 50, 60_000)) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const body = await req.json() as ExamRequest;
  const { subject, topic, topics, messages, phase } = body;
  const isOvingFagsamtale = Array.isArray(topics) && topics.length > 1;

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
    const gradePrompt = isOvingFagsamtale
      ? buildGradePrompt(subject, topics!.join(", "), messages)
      : buildGradePrompt(subject, topic, messages);
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
  const systemPrompt = isOvingFagsamtale
    ? buildOvingSystemPrompt(subject, topics!)
    : buildSystemPrompt(subject, topic);

  const anthropicMessages: Anthropic.MessageParam[] = [];

  const isFrench = subject === "fransk-1" || subject === "fransk-2";

  if (phase === "opening") {
    anthropicMessages.push({
      role: "user",
      content: isOvingFagsamtale
        ? buildOvingOpeningMessage(subject, topics!)
        : isFrench
        ? `Commence l'examen. Dis d'abord "Tu as tiré le thème : ${topic}." puis pose une question ouverte qui donne à l'élève la possibilité de montrer ce qu'il sait sur ce thème. Ne pose pas de questions oui/non.`
        : `Start eksamenen. Si først "Du har trukket tema: ${topic}." og still deretter ett åpent spørsmål som gir eleven mulighet til å vise hva de kan om temaet. Ikke still ja/nei-spørsmål.`,
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
