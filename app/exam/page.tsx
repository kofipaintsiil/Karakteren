"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Blobb, { BlobbState } from "@/components/Blobb";
import { pickRandomTopic } from "@/lib/mock-examiner";
import { speak, stopSpeaking, unlockAudio, startRecording } from "@/lib/speech";
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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const transcribeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecognitionRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

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
    unlockAudio();
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

  async function stopRecordingAndReview(text: string) {
    stopRecognitionRef.current?.();
    stopRecognitionRef.current = null;
    setIsRecording(false);
    setLiveTranscript("");
    const trimmed = text.trim();
    if (!trimmed) return;

    setTypedAnswer(trimmed); // vis rå tekst umiddelbart

    // Korriger fagbegreper stille i bakgrunnen
    try {
      const res = await fetch("/api/correct-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, subject, topic: topicName }),
      });
      if (res.ok) {
        const { text: corrected } = await res.json();
        if (corrected && corrected !== trimmed) setTypedAnswer(corrected);
      }
    } catch {}
  }

  async function toggleRecording() {
    if (isRecording) {
      // Stop recording
      if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null; }
      if (recordingSeconds < 1) {
        // Too short — just cancel
        stopRecognitionRef.current?.();
        stopRecognitionRef.current = null;
        setIsRecording(false);
        setRecordingSeconds(0);
        setMicError("Hold inne mikrofonen litt lengre og snakk tydelig.");
        return;
      }
      stopRecognitionRef.current?.();
      stopRecognitionRef.current = null;
      setIsRecording(false);
      setRecordingSeconds(0);
      setIsTranscribing(true);
      transcribeTimeoutRef.current = setTimeout(() => {
        setIsTranscribing(false);
        setMicError("Transkribering tok for lang tid — prøv igjen.");
      }, 25000);
    } else {
      // Start recording
      setMicError(null);
      setLiveTranscript("");
      setTypedAnswer("");
      setIsRequestingMic(true);
      const stop = await startRecording(
        async (text) => {
          if (transcribeTimeoutRef.current) clearTimeout(transcribeTimeoutRef.current);
          setIsTranscribing(false);
          setLiveTranscript("");
          if (text.trim()) {
            await stopRecordingAndReview(text);
          } else {
            setMicError((prev) => prev ?? "Ingen tale registrert — snakk høyt og tydelig, og prøv igjen.");
          }
        },
        subject === "engelsk" ? "en-US" : "nb-NO",
        (err) => { setIsTranscribing(false); setMicError(err); },
        (interim) => setLiveTranscript(interim),
      );
      setIsRequestingMic(false);
      if (stop) {
        stopRecognitionRef.current = stop;
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((s) => s + 1);
        }, 1000);
      }
    }
  }

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecognitionRef.current?.();
      if (transcribeTimeoutRef.current) clearTimeout(transcribeTimeoutRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // --- DRAW SCREEN ---
  if (phase === "draw") {
    return (
      <>
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ position: "absolute", top: "16px", left: "16px", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "inherit" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Tilbake
          </button>

          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <div style={{ marginBottom: "24px" }}>
              <Blobb state="idle" size={130} />
            </div>
            <div style={{
              display: "inline-block",
              backgroundColor: "var(--accent-bg)",
              borderRadius: "var(--r-full)",
              padding: "4px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--accent-dark)",
              marginBottom: "16px",
            }}>
              {subjectLabel}
            </div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "10px", letterSpacing: "-0.5px" }}>
              Klar for eksamen?
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
              Blobb trekker et tema og stiller deg spørsmål. Svar høyt eller skriv svaret ditt.
            </p>
            <button
              onClick={startExam}
              style={{
                width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
                backgroundColor: "var(--accent)", color: "#fff",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
                cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            >
              Trekk tema og start
            </button>
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
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: "320px" }}>
          <Blobb state={blobbState} size={130} />
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginTop: "24px", marginBottom: "10px", letterSpacing: "-0.5px" }}>
            Eksamen ferdig!
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.5 }}>
            Blobb har vurdert svarene dine.
          </p>
          <button
            onClick={() => router.push("/exam/feedback")}
            style={{
              width: "100%", padding: "14px", borderRadius: "var(--r-full)", border: "none",
              backgroundColor: "var(--accent)", color: "#fff",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "15px",
              cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            Se karakter og tilbakemelding
          </button>
        </div>
      </div>
    );
  }

  // --- CONVERSATION SCREEN ---
  const isExaminerTurn = isStreaming || isSpeaking || phase === "grading";
  // Asymptotic progress — approaches 100% but never reaches it, so there's no fixed endpoint
  const progressFill = exchangeCount / (exchangeCount + 4);

  return (
    <div style={{ backgroundColor: "var(--bg)", height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <button
          onClick={() => { stopSpeaking(); router.push("/dashboard"); }}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "inherit" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Avslutt
        </button>

        {/* Progress bar */}
        <div style={{
          flex: 1,
          height: "4px",
          backgroundColor: "var(--border)",
          borderRadius: "var(--r-full)",
          margin: "0 16px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progressFill * 100}%`,
            backgroundColor: "var(--accent)",
            borderRadius: "var(--r-full)",
            transition: "width 400ms ease-out",
          }} />
        </div>

        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-light)", flexShrink: 0 }}>
          {exchangeCount} svar
        </span>
      </div>

      {/* Blobb + topic */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <Blobb state={blobbState} size={56} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", color: "var(--ink-light)", marginBottom: "3px" }}>
            {subjectLabel}{topicName ? ` — ${topicName}` : ""}
          </p>
          {isStreaming && (
            <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Blobb tenker...</p>
          )}
          {isSpeaking && !isStreaming && (
            <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Blobb snakker...</p>
          )}
          {phase === "grading" && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Vurderer svarene dine...</p>
          )}
          {!isExaminerTurn && phase === "conversation" && (
            <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 600 }}>Din tur</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "student" ? "flex-end" : "flex-start",
            maxWidth: "82%",
            backgroundColor: m.role === "student" ? "var(--accent)" : "var(--surface)",
            color: m.role === "student" ? "#fff" : "var(--text)",
            border: m.role === "student" ? "1px solid var(--accent-dark)" : "1px solid var(--border)",
            borderRadius: m.role === "student"
              ? "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)"
              : "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px",
            fontSize: "14px",
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
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
            padding: "12px 16px",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--text)",
          }}>
            {streamingText}
            <span style={{
              display: "inline-block",
              width: "2px",
              height: "14px",
              backgroundColor: "var(--accent)",
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
            backgroundColor: "var(--accent-bg)",
            border: "1.5px dashed var(--accent)",
            borderRadius: "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)",
            padding: "12px 16px",
            fontSize: "14px",
            color: "var(--accent-dark)",
            lineHeight: 1.6,
          }}>
            {liveTranscript}
          </div>
        )}
      </div>

      {/* Mic error banner */}
      {micError && (
        <div style={{
          backgroundColor: "var(--error-bg)",
          borderTop: "1px solid var(--error)",
          padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
          flexShrink: 0,
        }}>
          <p style={{ fontSize: "13px", color: "var(--error)", lineHeight: 1.4 }}>{micError}</p>
          <button onClick={() => setMicError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", fontSize: "18px", flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* Input area */}
      {phase === "conversation" && !isExaminerTurn && (
        <div style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--border)",
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
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r-lg)",
                fontSize: "14px",
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
                  backgroundColor: "var(--accent)",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            )}
            {/* Mic button — shows different states clearly */}
            {isRequestingMic ? (
              <div style={{
                width: "56px", height: "56px", borderRadius: "var(--r-full)",
                backgroundColor: "var(--bg-alt)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>Venter...</span>
              </div>
            ) : isTranscribing ? (
              <div style={{
                width: "56px", height: "56px", borderRadius: "var(--r-full)",
                backgroundColor: "var(--accent-bg)", border: "2px solid var(--accent)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: "2px",
              }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-dark)", textAlign: "center", lineHeight: 1.2 }}>Tolker...</span>
              </div>
            ) : (
              <button
                onClick={() => void toggleRecording()}
                disabled={isRequestingMic}
                style={{
                  width: "56px", height: "56px",
                  borderRadius: "var(--r-full)",
                  backgroundColor: isRecording ? "oklch(58% 0.18 22)" : "var(--accent)",
                  border: "none",
                  boxShadow: isRecording
                    ? "0 0 0 6px oklch(94% 0.06 22)"
                    : "0 2px 12px rgba(0,0,0,0.15)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                  transition: "all 0.2s ease",
                  gap: "1px",
                }}
                aria-label={isRecording ? "Stop innspilling" : "Start innspilling"}
              >
                {isRecording ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                    <span style={{ fontSize: "9px", color: "white", fontWeight: 700 }}>{recordingSeconds}s</span>
                  </>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grading overlay */}
      {phase === "grading" && (
        <div style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "20px 16px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>
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
