"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Blobb, { BlobbState } from "@/components/Blobb";
import Button from "@/components/ui/Button";
import { Mic, MicOff, ChevronLeft, Send, CheckSquare, Square } from "lucide-react";
import { getSubjectData } from "@/lib/mock-examiner";
import { speak, stopSpeaking, startRecognition, isSpeechRecognitionSupported } from "@/lib/speech";

type Phase = "select" | "conversation" | "done";

interface Message {
  role: "examiner" | "student";
  text: string;
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

const BLUE_PRESS = "oklch(0.48 0.19 240)";

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/gs, "$1")
    .replace(/\*\*(.*?)\*\*/gs, "$1")
    .replace(/\*(.*?)\*/gs, "$1")
    .replace(/_(.*?)_/gs, "$1")
    .replace(/`([^`]+)`/gs, "$1")
    .replace(/^#{1,6}\s+/gm, "");
}

function StudyPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const subject = params.get("subject") ?? "matematikk";
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const allTopics = getSubjectData(subject).topics.map((t) => t.name);

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [blobbState, setBlobbState] = useState<BlobbState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [hasMic, setHasMic] = useState(true);
  const [exchangeCount, setExchangeCount] = useState(0);

  const stopRecognitionRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const selectedTopicsRef = useRef<string[]>([]);

  useEffect(() => { if (!isSpeechRecognitionSupported()) setHasMic(false); }, []);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { selectedTopicsRef.current = selectedTopics; }, [selectedTopics]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveTranscript, streamingText]);

  const tutorSpeak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    setBlobbState("talking");
    await speak(text, subject === "engelsk" ? "en-GB" : "nb-NO");
    setIsSpeaking(false);
    setBlobbState("listening");
  }, [subject]);

  function addMessage(role: "examiner" | "student", text: string) {
    setMessages((prev) => [...prev, { role, text }]);
  }

  async function streamTutorResponse(
    apiPhase: "opening" | "followup",
    currentMessages: Message[],
    topics: string[],
  ): Promise<{ text: string; done: boolean } | null> {
    setIsStreaming(true);
    setBlobbState("thinking");
    setStreamingText("");

    try {
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, messages: currentMessages, phase: apiPhase }),
      });

      if (!res.ok || !res.body) return null;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
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

  async function startStudy() {
    const topics = selectedTopicsRef.current;
    if (topics.length === 0) return;

    setPhase("conversation");
    setMessages([]);
    setExchangeCount(0);

    const result = await streamTutorResponse("opening", [], topics);
    if (!result) return;

    addMessage("examiner", result.text);
    if (result.done) {
      await tutorSpeak(result.text);
      setPhase("done");
    } else {
      await tutorSpeak(result.text);
    }
  }

  async function handleStudentAnswer(answer: string) {
    if (!answer.trim()) return;
    const trimmed = answer.trim();
    setTypedAnswer("");
    setLiveTranscript("");

    const updatedMessages: Message[] = [...messagesRef.current, { role: "student", text: trimmed }];
    setMessages(updatedMessages);
    setExchangeCount((c) => c + 1);

    const result = await streamTutorResponse("followup", updatedMessages, selectedTopicsRef.current);
    if (!result) return;

    addMessage("examiner", result.text);
    if (result.done) {
      await tutorSpeak(result.text);
      setPhase("done");
    } else {
      await tutorSpeak(result.text);
    }
  }

  async function stopRecordingAndReview(text: string) {
    stopRecognitionRef.current?.();
    stopRecognitionRef.current = null;
    setIsRecording(false);
    setLiveTranscript("");
    const trimmed = text.trim();
    if (!trimmed) return;

    setTypedAnswer(trimmed);
    try {
      const res = await fetch("/api/correct-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, subject, topic: selectedTopicsRef.current.join(", ") }),
      });
      if (res.ok) {
        const { text: corrected } = await res.json();
        if (corrected && corrected !== trimmed) setTypedAnswer(corrected);
      }
    } catch {}
  }

  function toggleRecording() {
    if (isRecording) {
      void stopRecordingAndReview(liveTranscript);
    } else {
      setLiveTranscript("");
      setTypedAnswer("");
      const stop = startRecognition(
        (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal) void stopRecordingAndReview(text);
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

  // ─── SELECT SCREEN ────────────────────────────────────────────────────────────
  if (phase === "select") {
    const allSelected = selectedTopics.length === allTopics.length;
    return (
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", padding: "24px" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "inherit", marginBottom: "24px" }}
        >
          <ChevronLeft size={16} /> Tilbake
        </button>

        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Blobb state="idle" size={90} />
            <div style={{
              display: "inline-block",
              backgroundColor: "var(--blue-soft)",
              border: `2px solid var(--blue)`,
              borderRadius: "var(--r-full)",
              padding: "4px 16px",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--blue)",
              marginTop: "14px",
              marginBottom: "10px",
            }}>
              {subjectLabel} — Øvingsmodus
            </div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>
              Velg emner å øve på
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.5 }}>
              Blobb stiller spørsmål og gir tilbakemelding på hvert emne.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>
              {selectedTopics.length} av {allTopics.length} valgt
            </span>
            <button
              onClick={() => setSelectedTopics(allSelected ? [] : [...allTopics])}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "var(--blue)", fontFamily: "inherit" }}
            >
              {allSelected ? "Fjern alle" : "Velg alle"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {allTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() =>
                    setSelectedTopics(
                      isSelected
                        ? selectedTopics.filter((t) => t !== topic)
                        : [...selectedTopics, topic]
                    )
                  }
                  style={{
                    width: "100%",
                    backgroundColor: isSelected ? "var(--blue-soft)" : "var(--surface)",
                    border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                    borderBottom: `4px solid ${isSelected ? BLUE_PRESS : "var(--border-dark)"}`,
                    borderRadius: "var(--r-md)",
                    padding: "13px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "border-color 120ms ease, background-color 120ms ease",
                  }}
                >
                  {isSelected
                    ? <CheckSquare size={18} color="var(--blue)" style={{ flexShrink: 0 }} />
                    : <Square size={18} color="var(--text-faint)" style={{ flexShrink: 0 }} />
                  }
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)" }}>{topic}</span>
                </button>
              );
            })}
          </div>

          <Button
            size="lg"
            fullWidth
            disabled={selectedTopics.length === 0}
            onClick={startStudy}
            style={selectedTopics.length === 0 ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            {selectedTopics.length === 0
              ? "Velg minst ett emne"
              : `Start øving — ${selectedTopics.length} emne${selectedTopics.length > 1 ? "r" : ""}`}
          </Button>
        </div>
      </div>
    );
  }

  // ─── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "320px" }}>
          <Blobb state="happy" size={130} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginTop: "24px", marginBottom: "8px" }}>
            Bra jobbet!
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "6px" }}>
            Du har øvd på {selectedTopics.length} emne{selectedTopics.length > 1 ? "r" : ""} i {subjectLabel}.
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-faint)", fontWeight: 600, marginBottom: "28px" }}>
            Klar for å teste deg selv under eksamenspress?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button size="lg" fullWidth onClick={() => router.push(`/exam?subject=${subject}`)}>
              Prøv eksamensmodus
            </Button>
            <Button
              size="md"
              fullWidth
              variant="secondary"
              onClick={() => { setPhase("select"); setMessages([]); setExchangeCount(0); }}
            >
              Øv på flere emner
            </Button>
            <Button size="md" fullWidth variant="ghost" onClick={() => router.push("/dashboard")}>
              Tilbake til dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CONVERSATION SCREEN ─────────────────────────────────────────────────────
  const isTutorTurn = isStreaming || isSpeaking;
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

        <div style={{ flex: 1, height: "6px", backgroundColor: "var(--border)", borderRadius: "var(--r-full)", margin: "0 16px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progressFill * 100}%`,
            backgroundColor: "var(--blue)",
            borderRadius: "var(--r-full)",
            transition: "width 400ms ease-out",
          }} />
        </div>

        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-faint)", flexShrink: 0 }}>
          {exchangeCount} svar
        </span>
      </div>

      {/* Blobb + info */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, backgroundColor: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
        <Blobb state={blobbState} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-faint)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {subjectLabel} · {selectedTopics.join(", ")}
          </p>
          {isStreaming && <p style={{ fontSize: "13px", color: "var(--blue)", fontWeight: 700 }}>Blobb tenker...</p>}
          {isSpeaking && !isStreaming && <p style={{ fontSize: "13px", color: "var(--blue)", fontWeight: 700 }}>Blobb snakker...</p>}
          {!isTutorTurn && <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 700 }}>Din tur</p>}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "student" ? "flex-end" : "flex-start",
            maxWidth: "82%",
            backgroundColor: m.role === "student" ? "var(--blue)" : "var(--surface)",
            color: m.role === "student" ? "#fff" : "var(--text)",
            border: m.role === "student" ? `2px solid ${BLUE_PRESS}` : "2px solid var(--border)",
            borderRadius: m.role === "student"
              ? "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)"
              : "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.6,
          }}>
            {m.role === "examiner" ? stripMarkdown(m.text) : m.text}
          </div>
        ))}

        {streamingText && (
          <div style={{
            alignSelf: "flex-start", maxWidth: "82%",
            backgroundColor: "var(--surface)", border: "2px solid var(--border)",
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px", fontSize: "14px", fontWeight: 500, lineHeight: 1.6, color: "var(--text)",
          }}>
            {stripMarkdown(streamingText)}
            <span style={{ display: "inline-block", width: "2px", height: "14px", backgroundColor: "var(--blue)", marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
          </div>
        )}

        {liveTranscript && (
          <div style={{
            alignSelf: "flex-end", maxWidth: "82%",
            backgroundColor: "var(--blue-soft)", border: `2px dashed var(--blue)`,
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)",
            padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "var(--blue)", lineHeight: 1.6,
          }}>
            {liveTranscript}
          </div>
        )}
      </div>

      {/* Input */}
      {phase === "conversation" && !isTutorTurn && (
        <div style={{
          backgroundColor: "var(--surface)", borderTop: "2px solid var(--border)",
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
                flex: 1, height: "48px", padding: "0 14px",
                backgroundColor: "var(--bg)", border: "2px solid var(--border)",
                borderRadius: "var(--r-lg)", fontSize: "14px", fontWeight: 500,
                color: "var(--text)", fontFamily: "inherit", outline: "none",
                opacity: isRecording ? 0.4 : 1,
              }}
            />
            {typedAnswer.trim() && !isRecording && (
              <button
                onClick={() => handleStudentAnswer(typedAnswer)}
                style={{
                  width: "48px", height: "48px", borderRadius: "var(--r-lg)",
                  backgroundColor: "var(--blue)", border: `2px solid ${BLUE_PRESS}`,
                  boxShadow: `0 4px 0 ${BLUE_PRESS}`,
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
                  width: "56px", height: "56px", borderRadius: "var(--r-full)",
                  backgroundColor: isRecording ? "var(--error)" : "var(--blue)",
                  border: isRecording ? "2px solid oklch(0.43 0.20 22)" : `2px solid ${BLUE_PRESS}`,
                  boxShadow: isRecording ? "0 4px 0 oklch(0.43 0.20 22)" : `0 4px 0 ${BLUE_PRESS}`,
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
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", backgroundColor: "var(--bg)" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>Laster...</span>
      </div>
    }>
      <StudyPageInner />
    </Suspense>
  );
}
