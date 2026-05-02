"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Blobb, { BlobbState } from "@/components/Blobb";
import { pickRandomTopic } from "@/lib/mock-examiner";
import { speak, stopSpeaking, unlockAudio } from "@/lib/speech";
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
  const presetTopic = params.get("topic"); // passed from eksamen page — skip redraw

  const [phase, setPhase] = useState<Phase>("draw");
  const [topicName, setTopicName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [blobbState, setBlobbState] = useState<BlobbState>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastExaminerText, setLastExaminerText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ used: 0, limit: 3 });
  const [typedAnswer, setTypedAnswer] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcribeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRecognitionRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, liveTranscript, streamingText]);

  const examinerSpeak = useCallback(async (text: string, nextState: BlobbState = "listening") => {
    setLastExaminerText(text);
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

  async function callGrade(currentMessages: Message[], currentTopic: string) {
    try {
      const res = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic: currentTopic, messages: currentMessages, phase: "grade" }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }

  async function startExam() {
    unlockAudio();
    const { allowed, used, limit } = await canStartExam();
    if (!allowed) { setLimitInfo({ used, limit }); setShowUpgrade(true); return; }

    const name = presetTopic ?? pickRandomTopic(subject).name;
    setTopicName(name);
    setPhase("conversation");
    setExchangeCount(0);

    const aiResult = await streamExaminerResponse("opening", [], name);
    const openingText = aiResult?.text ?? pickRandomTopic(subject).opening;
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
      await examinerSpeak(aiText, "thinking");
      setPhase("grading");
      setBlobbState("thinking");
      const result = await callGrade(messagesWithAI, topicName);
      const grade = result?.grade ?? 4;
      const feedback = result?.feedback ?? "Eksamen fullført.";
      const strengths: string[] = result?.strengths ?? [];
      const improvements: string[] = result?.improvements ?? [];
      const sessionResult: SessionResult = { grade, feedback, strengths, improvements, subject: subjectLabel, topic: topicName, messages: messagesWithAI };
      sessionStorage.setItem("examResult", JSON.stringify(sessionResult));
      saveSession({ subject: subjectLabel, topic: topicName, grade, feedback, strengths, improvements, messages: messagesWithAI });
      setBlobbState(grade >= 5 ? "happy" : grade >= 3 ? "idle" : "disappointed");
      setPhase("done");
    } else {
      await examinerSpeak(aiText);
    }
  }

  async function runAICorrection(text: string, alts: string[] = []) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTypedAnswer(trimmed);
    setIsTranscribing(true);
    try {
      const res = await fetch("/api/correct-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, alternatives: alts, subject, topic: topicName }),
      });
      if (res.ok) {
        const { text: corrected } = await res.json();
        if (corrected) setTypedAnswer(corrected);
      }
    } catch {}
    setIsTranscribing(false);
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecognitionRef.current?.();
      stopRecognitionRef.current = null;
      return;
    }

    setMicError(null);
    setLiveTranscript("");
    setTypedAnswer("");

    const SR: typeof SpeechRecognition | undefined =
      typeof window !== "undefined"
        ? (window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition)
        : undefined;

    if (!SR) {
      const mob = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setMicError(mob ? "Taleinnspilling krever Safari på iPhone." : "Nettleseren støtter ikke taleinnspilling. Prøv Chrome eller Safari.");
      return;
    }

    const SRClass = SR;
    let shouldContinue = true;
    let activeRec: SpeechRecognition | null = null;
    let finalText = "";
    let finalAlts: string[] = [];

    function finishRecording() {
      if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null; }
      setRecordingSeconds(0);
      setIsRecording(false);
      setLiveTranscript("");
      const text = finalText.trim();
      if (text) { void runAICorrection(text, finalAlts); }
      else { setMicError("Ingen tale registrert — snakk høyt og tydelig, og prøv igjen."); }
    }

    function startSession() {
      const rec = new SRClass();
      activeRec = rec;
      rec.lang = subject === "engelsk" ? "en-US" : "nb-NO";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 3;

      rec.onresult = (e: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalText += e.results[i][0].transcript + " ";
            const alts: string[] = [];
            for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
            finalAlts = alts;
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        setTypedAnswer(finalText.trim());
        setLiveTranscript(interim);
      };

      rec.onend = () => {
        if (shouldContinue) { try { startSession(); return; } catch {} }
        finishRecording();
      };

      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        if (e.error === "not-allowed") {
          shouldContinue = false;
          setMicError("Mikrofonillatelse nektet. Gå til Innstillinger → Safari → Mikrofon og tillat tilgang.");
        }
        shouldContinue = false;
      };

      try { rec.start(); } catch { if (shouldContinue) { shouldContinue = false; finishRecording(); } }
    }

    startSession();
    stopRecognitionRef.current = () => { shouldContinue = false; try { activeRec?.stop(); } catch {} };
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
  }

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecognitionRef.current?.();
      if (transcribeTimeoutRef.current) clearTimeout(transcribeTimeoutRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // ── DRAW / READY SCREEN ──
  if (phase === "draw") {
    return (
      <>
        <div style={{ backgroundColor: "var(--bg)", minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: "Inter, system-ui, sans-serif" }}>
          {/* Top bar */}
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "inherit", padding: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Tilbake
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
            <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Topic card */}
              <div style={{
                backgroundColor: presetTopic ? "var(--text)" : "var(--surface)",
                border: `1px solid ${presetTopic ? "var(--text)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)",
                padding: "28px 20px",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              }}>
                {presetTopic ? (
                  <>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Trukket tema</p>
                    <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px" }}>{presetTopic}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{subjectLabel}</p>
                  </>
                ) : (
                  <>
                    <Blobb state="idle" size={100} />
                    <div style={{ backgroundColor: "var(--accent-bg)", borderRadius: "var(--r-full)", padding: "4px 16px", fontSize: "13px", fontWeight: 600, color: "var(--accent-dark)" }}>
                      {subjectLabel}
                    </div>
                    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>
                      Klar for eksamen?
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      Blobb trekker et tema og stiller deg spørsmål. Svar høyt eller skriv.
                    </p>
                  </>
                )}
              </div>

              {/* Start button */}
              <button
                onClick={startExam}
                style={{
                  width: "100%", padding: "15px", borderRadius: "var(--r-full)", border: "none",
                  backgroundColor: "var(--accent)", color: "#fff",
                  fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px",
                  cursor: "pointer", boxShadow: "0 2px 16px rgba(0,0,0,0.14)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {presetTopic ? "Start eksamen →" : "Trekk tema og start"}
              </button>
            </div>
          </div>
        </div>
        {showUpgrade && <UpgradeModal used={limitInfo.used} limit={limitInfo.limit} onClose={() => setShowUpgrade(false)} />}
      </>
    );
  }

  // ── DONE SCREEN ──
  if (phase === "done") {
    return (
      <div style={{ backgroundColor: "var(--bg)", minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ padding: "14px 16px" }}>
          <button onClick={() => router.push("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "inherit", padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", textAlign: "center" }}>
          <Blobb state={blobbState} size={120} />
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginTop: "24px", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Eksamen ferdig!
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.5 }}>
            Blobb har vurdert svarene dine.
          </p>
          <button
            onClick={() => router.push("/exam/feedback")}
            style={{ width: "100%", maxWidth: "340px", padding: "15px", borderRadius: "var(--r-full)", border: "none", backgroundColor: "var(--accent)", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}
          >
            Se karakter og tilbakemelding
          </button>
        </div>
      </div>
    );
  }

  // ── CONVERSATION SCREEN ──
  const isExaminerTurn = isStreaming || isSpeaking || phase === "grading";
  const progressFill = exchangeCount / (exchangeCount + 4);

  return (
    <div style={{ backgroundColor: "var(--bg)", height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 16px", height: "52px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button
          onClick={() => { stopSpeaking(); router.push("/dashboard"); }}
          style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "inherit", flexShrink: 0, padding: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Avslutt
        </button>

        <div style={{ flex: 1, height: "3px", backgroundColor: "var(--border)", borderRadius: "var(--r-full)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressFill * 100}%`, backgroundColor: "var(--accent)", borderRadius: "var(--r-full)", transition: "width 400ms ease-out" }} />
        </div>

        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-faint)", flexShrink: 0 }}>
          {exchangeCount} svar
        </span>
      </div>

      {/* ── Blobb row ── */}
      <div style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <Blobb state={blobbState} size={44} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subjectLabel}{topicName ? ` · ${topicName}` : ""}
          </p>
          {isStreaming && <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Blobb tenker...</p>}
          {isSpeaking && !isStreaming && <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Blobb snakker...</p>}
          {phase === "grading" && <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Setter karakter...</p>}
          {!isExaminerTurn && phase === "conversation" && (
            <p style={{ fontSize: "13px", fontWeight: 600, color: "oklch(0.55 0.14 150)" }}>Din tur</p>
          )}
        </div>

        {lastExaminerText && !isSpeaking && !isStreaming && phase === "conversation" && (
          <button
            onClick={() => examinerSpeak(lastExaminerText)}
            style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "1px solid var(--border)", borderRadius: "var(--r-full)", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            Hør igjen
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "student" ? "flex-end" : "flex-start",
            maxWidth: "84%",
            backgroundColor: m.role === "student" ? "var(--accent)" : "var(--surface)",
            color: m.role === "student" ? "#fff" : "var(--text)",
            border: `1px solid ${m.role === "student" ? "var(--accent-dark)" : "var(--border)"}`,
            borderRadius: m.role === "student" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "11px 15px",
            fontSize: "14px",
            lineHeight: 1.55,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            {m.text}
          </div>
        ))}

        {streamingText && (
          <div style={{ alignSelf: "flex-start", maxWidth: "84%", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px", padding: "11px 15px", fontSize: "14px", lineHeight: 1.55, color: "var(--text)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {streamingText}
            <span style={{ display: "inline-block", width: "2px", height: "13px", backgroundColor: "var(--accent)", marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
          </div>
        )}

        {liveTranscript && (
          <div style={{ alignSelf: "flex-end", maxWidth: "84%", backgroundColor: "var(--accent-bg)", border: "1.5px dashed var(--accent)", borderRadius: "18px 18px 4px 18px", padding: "11px 15px", fontSize: "14px", color: "var(--accent-dark)", lineHeight: 1.55 }}>
            {liveTranscript}
          </div>
        )}
      </div>

      {/* ── Mic error ── */}
      {micError && (
        <div style={{ backgroundColor: "oklch(97% 0.03 22)", borderTop: "1px solid oklch(88% 0.06 22)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", color: "oklch(45% 0.15 22)", lineHeight: 1.4 }}>{micError}</p>
          <button onClick={() => setMicError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(55% 0.15 22)", fontSize: "18px", lineHeight: 1, flexShrink: 0, padding: "0 2px" }}>×</button>
        </div>
      )}

      {/* ── Input area ── */}
      {phase === "conversation" && !isExaminerTurn && (
        <div style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", padding: "10px 16px", paddingBottom: "calc(10px + env(safe-area-inset-bottom))", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && typedAnswer.trim() && !isRecording) handleStudentAnswer(typedAnswer); }}
              placeholder={isRecording ? "Snakker..." : "Skriv svaret ditt..."}
              disabled={isRecording || isTranscribing}
              style={{
                flex: 1,
                minHeight: "44px",
                maxHeight: "120px",
                padding: "11px 14px",
                backgroundColor: "var(--bg)",
                border: `1.5px solid ${isRecording ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)",
                fontSize: "14px",
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s",
                resize: "none",
              }}
            />

            {typedAnswer.trim() && !isRecording && !isTranscribing && (
              <button
                onClick={() => handleStudentAnswer(typedAnswer)}
                style={{ width: "44px", height: "44px", borderRadius: "var(--r-lg)", backgroundColor: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", WebkitTapHighlightColor: "transparent" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            )}

            {isTranscribing ? (
              <div style={{ width: "52px", height: "44px", borderRadius: "var(--r-lg)", backgroundColor: "var(--accent-bg)", border: "1.5px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--accent-dark)", textAlign: "center", lineHeight: 1.2 }}>AI{"\n"}fikser</span>
              </div>
            ) : (
              <button
                onClick={toggleRecording}
                style={{
                  width: "52px", height: "52px",
                  borderRadius: "var(--r-full)",
                  backgroundColor: isRecording ? "oklch(52% 0.19 22)" : "var(--accent)",
                  border: "none",
                  boxShadow: isRecording ? "0 0 0 5px oklch(92% 0.07 22)" : "0 2px 12px rgba(0,0,0,0.15)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, gap: "1px",
                  transition: "all 0.18s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
                aria-label={isRecording ? "Stop innspilling" : "Start innspilling"}
              >
                {isRecording ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                    <span style={{ fontSize: "8px", color: "white", fontWeight: 700 }}>{recordingSeconds}s</span>
                  </>
                ) : (
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {phase === "grading" && (
        <div style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", padding: "18px 16px", textAlign: "center", flexShrink: 0, paddingBottom: "calc(18px + env(safe-area-inset-bottom))" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>Blobb setter karakter...</p>
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
