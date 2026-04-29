"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Blobb, { BlobbState } from "@/components/Blobb";
import Button from "@/components/ui/Button";
import { Mic, MicOff, ChevronLeft, Send } from "lucide-react";
import { pickRandomTopic } from "@/lib/mock-examiner";
import { speak, stopSpeaking, startRecognition, isSpeechRecognitionSupported } from "@/lib/speech";
import { saveSession } from "@/lib/sessions";
import { canStartExam } from "@/lib/limits";
import UpgradeModal from "@/components/UpgradeModal";

type Phase = "draw" | "conversation" | "grading" | "done";

interface Message {
  role: "examiner" | "student";
  text: string;
}

interface SessionResult {
  grade: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  subject: string;
  topic: string;
  messages: Message[];
}

const SUBJECT_LABELS: Record<string, string> = {
  norsk: "Norsk", matematikk: "Matematikk", naturfag: "Naturfag",
  fysikk: "Fysikk", kjemi: "Kjemi", biologi: "Biologi",
  historie: "Historie", samfunnsfag: "Samfunnsfag", engelsk: "Engelsk", geografi: "Geografi",
  "matematikk-1t": "Matematikk 1T", "matematikk-r1": "Matematikk R1",
  "matematikk-r2": "Matematikk R2", "matematikk-2p": "Matematikk 2P",
  "kjemi-1": "Kjemi 1", "kjemi-2": "Kjemi 2",
  "fysikk-1": "Fysikk 1", "fysikk-2": "Fysikk 2",
  "biologi-1": "Biologi 1", "biologi-2": "Biologi 2",
};


function ExamPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const subject = params.get("subject") ?? "matematikk";
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  const [phase, setPhase] = useState<Phase>("draw");
  const [topicName, setTopicName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [blobbState, setBlobbState] = useState<BlobbState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ used: 0, limit: 3 });
  const [typedAnswer, setTypedAnswer] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [hasMic, setHasMic] = useState(false);

  const stopRecognitionRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    setHasMic(isSpeechRecognitionSupported());
  }, []);

  // Keep messages ref in sync for use in callbacks
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveTranscript, streamingText]);

  const examinerSpeak = useCallback(async (text: string, nextState: BlobbState = "listening") => {
    setIsSpeaking(true);
    setBlobbState("talking");
    await speak(text, subject === "engelsk" ? "en-GB" : "nb-NO");
    setIsSpeaking(false);
    setBlobbState(nextState);
  }, [subject]);

  function addMessage(role: "examiner" | "student", text: string) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  async function streamExaminerResponse(
    apiPhase: "opening" | "followup",
    currentMessages: Message[],
    currentTopic: string,
  ): Promise<{ text: string; done: boolean } | null> {
    setIsStreaming(true);
    setBlobbState("thinking");
    setStreamingText("");

    try {
      const res = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic: currentTopic, messages: currentMessages, phase: apiPhase }),
      });

      if (!res.ok || !res.body) return null;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        // Show streaming text without [FERDIG] token
        setStreamingText(fullText.replace(/\[FERDIG\]/g, "").trimEnd());
      }

      setStreamingText("");
      setIsStreaming(false);

      const done = fullText.includes("[FERDIG]");
      const text = fullText.replace(/\[FERDIG\]/g, "").trim();
      return text ? { text, done } : null;
    } catch {
      setIsStreaming(false);
      return null;
    }
  }

  async function callGrade(currentMessages: Message[], currentTopic: string): Promise<{ grade: number; feedback: string; strengths: string[]; improvements: string[] } | null> {
    try {
      const res = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic: currentTopic, messages: currentMessages, phase: "grade" }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function startExam() {
    const { allowed, used, limit } = await canStartExam();
    if (!allowed) {
      setLimitInfo({ used, limit });
      setShowUpgrade(true);
      return;
    }

    // Pick topic name from mock list (just needs the name, AI generates the actual question)
    const mockTopic = pickRandomTopic(subject);
    const name = mockTopic.name;
    setTopicName(name);
    setPhase("conversation");
    setExchangeCount(0);

    const aiResult = await streamExaminerResponse("opening", [], name);
    const openingText = aiResult?.text ?? mockTopic.opening;
    addMessage("examiner", openingText);
    await examinerSpeak(openingText);
  }

  async function handleStudentAnswer(answer: string) {
    if (!answer.trim() || !topicName) return;

    const trimmed = answer.trim();
    setTypedAnswer("");
    setLiveTranscript("");

    const updatedMessages: Message[] = [...messagesRef.current, { role: "student", text: trimmed }];
    setMessages(updatedMessages);
    setExchangeCount((c) => c + 1);

    const aiResult = await streamExaminerResponse("followup", updatedMessages, topicName);
    if (!aiResult) return;

    const { text: aiText, done } = aiResult;
    const messagesWithAI: Message[] = [...updatedMessages, { role: "examiner", text: aiText }];
    addMessage("examiner", aiText);

    if (done) {
      // AI has enough to grade — speak closing statement then grade
      await examinerSpeak(aiText, "thinking");
      setPhase("grading");
      setBlobbState("thinking");

      const result = await callGrade(messagesWithAI, topicName);
      const grade = result?.grade ?? 4;
      const feedback = result?.feedback ?? "Eksamen fullført.";
      const strengths: string[] = result?.strengths ?? [];
      const improvements: string[] = result?.improvements ?? [];

      const sessionResult: SessionResult = {
        grade,
        feedback,
        strengths,
        improvements,
        subject: subjectLabel,
        topic: topicName,
        messages: messagesWithAI,
      };
      sessionStorage.setItem("examResult", JSON.stringify(sessionResult));
      saveSession({ subject: subjectLabel, topic: topicName, grade, feedback, strengths, improvements, messages: messagesWithAI });
      setBlobbState(grade >= 5 ? "happy" : grade >= 3 ? "idle" : "disappointed");
      setPhase("done");
    } else {
      await examinerSpeak(aiText);
    }
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecognitionRef.current?.();
      stopRecognitionRef.current = null;
      setIsRecording(false);
      if (liveTranscript.trim()) handleStudentAnswer(liveTranscript);
    } else {
      setLiveTranscript("");
      const stop = startRecognition(
        (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal) {
            setLiveTranscript("");
            stopRecognitionRef.current?.();
            stopRecognitionRef.current = null;
            setIsRecording(false);
            handleStudentAnswer(text);
          }
        },
        () => setIsRecording(false),
        subject === "engelsk" ? "en-US" : "nb-NO"
      );
      if (stop) {
        stopRecognitionRef.current = stop;
        setIsRecording(true);
      }
    }
  }

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecognitionRef.current?.();
    };
  }, []);

  // --- DRAW SCREEN ---
  if (phase === "draw") {
    return (
      <>
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ position: "absolute", top: "16px", left: "16px", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "inherit" }}
          >
            <ChevronLeft size={16} /> Tilbake
          </button>

          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <div style={{ marginBottom: "24px" }}>
              <Blobb state="idle" size={130} />
            </div>
            <div style={{
              display: "inline-block",
              backgroundColor: "var(--coral-soft)",
              border: "2px solid var(--coral-mid)",
              borderRadius: "var(--r-full)",
              padding: "4px 16px",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--coral-press)",
              marginBottom: "16px",
            }}>
              {subjectLabel}
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "10px" }}>
              Klar for eksamen?
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "32px", lineHeight: 1.6 }}>
              Blobb trekker et tema og stiller deg spørsmål. Svar høyt eller skriv svaret ditt.
            </p>
            <Button size="lg" fullWidth onClick={startExam}>
              Trekk tema og start
            </Button>
            {!hasMic && (
              <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-faint)", fontWeight: 600 }}>
                Mikrofon ikke tilgjengelig — du kan skrive svarene dine
              </p>
            )}
          </div>
        </div>
        {showUpgrade && (
          <UpgradeModal
            used={limitInfo.used}
            limit={limitInfo.limit}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      </>
    );
  }

  // --- DONE SCREEN ---
  if (phase === "done") {
    return (
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "320px" }}>
          <Blobb state={blobbState} size={130} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginTop: "24px", marginBottom: "10px" }}>
            Eksamen ferdig!
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "32px" }}>
            Blobb har vurdert svarene dine.
          </p>
          <Button size="lg" fullWidth onClick={() => router.push("/exam/feedback")}>
            Se karakter og tilbakemelding
          </Button>
        </div>
      </div>
    );
  }

  // --- CONVERSATION SCREEN ---
  const isExaminerTurn = isStreaming || isSpeaking || phase === "grading";
  // Asymptotic progress — approaches 100% but never reaches it, so there's no fixed endpoint
  const progressFill = exchangeCount / (exchangeCount + 4);

  return (
    <div style={{ backgroundColor: "var(--bg)", height: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: "var(--surface)", borderBottom: "2px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <button
          onClick={() => { stopSpeaking(); router.push("/dashboard"); }}
          style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "inherit" }}
        >
          <ChevronLeft size={16} /> Avslutt
        </button>

        {/* Progress bar */}
        <div style={{
          flex: 1,
          height: "6px",
          backgroundColor: "var(--border)",
          borderRadius: "var(--r-full)",
          margin: "0 16px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progressFill * 100}%`,
            backgroundColor: "var(--coral)",
            borderRadius: "var(--r-full)",
            transition: "width 400ms ease-out",
          }} />
        </div>

        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-faint)", flexShrink: 0 }}>
          {exchangeCount} svar
        </span>
      </div>

      {/* Blobb + topic */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, backgroundColor: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
        <Blobb state={blobbState} size={64} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "4px" }}>
            {subjectLabel}{topicName ? ` — ${topicName}` : ""}
          </p>
          {isStreaming && (
            <p style={{ fontSize: "13px", color: "var(--coral)", fontWeight: 700 }}>Blobb tenker...</p>
          )}
          {isSpeaking && !isStreaming && (
            <p style={{ fontSize: "13px", color: "var(--coral)", fontWeight: 700 }}>Blobb snakker...</p>
          )}
          {phase === "grading" && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 700 }}>Vurderer svarene dine...</p>
          )}
          {!isExaminerTurn && phase === "conversation" && (
            <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 700 }}>Din tur</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "student" ? "flex-end" : "flex-start",
            maxWidth: "82%",
            backgroundColor: m.role === "student" ? "var(--coral)" : "var(--surface)",
            color: m.role === "student" ? "#fff" : "var(--text)",
            border: m.role === "student" ? "2px solid var(--coral-press)" : "2px solid var(--border)",
            borderRadius: m.role === "student"
              ? "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)"
              : "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.6,
          }}>
            {m.text}
          </div>
        ))}

        {/* Streaming bubble */}
        {streamingText && (
          <div style={{
            alignSelf: "flex-start",
            maxWidth: "82%",
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.6,
            color: "var(--text)",
          }}>
            {streamingText}
            <span style={{
              display: "inline-block",
              width: "2px",
              height: "14px",
              backgroundColor: "var(--coral)",
              marginLeft: "2px",
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }} />
          </div>
        )}

        {/* Live speech transcript */}
        {liveTranscript && (
          <div style={{
            alignSelf: "flex-end",
            maxWidth: "82%",
            backgroundColor: "var(--coral-soft)",
            border: "2px dashed var(--coral-mid)",
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--coral-press)",
            lineHeight: 1.6,
          }}>
            {liveTranscript}
          </div>
        )}
      </div>

      {/* Input area */}
      {phase === "conversation" && !isExaminerTurn && (
        <div style={{
          backgroundColor: "var(--surface)",
          borderTop: "2px solid var(--border)",
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && typedAnswer.trim()) handleStudentAnswer(typedAnswer); }}
              placeholder="Skriv svaret ditt..."
              disabled={isRecording}
              style={{
                flex: 1,
                height: "48px",
                padding: "0 14px",
                backgroundColor: "var(--bg)",
                border: "2px solid var(--border)",
                borderRadius: "var(--r-lg)",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                opacity: isRecording ? 0.4 : 1,
              }}
            />
            {typedAnswer.trim() && !isRecording && (
              <button
                onClick={() => handleStudentAnswer(typedAnswer)}
                style={{
                  width: "48px", height: "48px",
                  borderRadius: "var(--r-lg)",
                  backgroundColor: "var(--coral)",
                  border: "2px solid var(--coral-press)",
                  boxShadow: "0 4px 0 var(--coral-press)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                <Send size={18} color="#fff" />
              </button>
            )}
            {hasMic && (
              <button
                onClick={toggleRecording}
                style={{
                  width: "56px", height: "56px",
                  borderRadius: "var(--r-full)",
                  backgroundColor: isRecording ? "var(--error)" : "var(--coral)",
                  border: isRecording ? "2px solid oklch(0.43 0.20 22)" : "2px solid var(--coral-press)",
                  boxShadow: isRecording ? "0 4px 0 oklch(0.43 0.20 22)" : "0 4px 0 var(--coral-press)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
                aria-label={isRecording ? "Stop innspilling" : "Start innspilling"}
              >
                {isRecording ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grading overlay */}
      {phase === "grading" && (
        <div style={{
          backgroundColor: "var(--surface)",
          borderTop: "2px solid var(--border)",
          padding: "20px 16px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>
            Blobb setter karakter...
          </p>
        </div>
      )}
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", backgroundColor: "var(--bg)" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>Laster...</span>
      </div>
    }>
      <ExamPageInner />
    </Suspense>
  );
}
