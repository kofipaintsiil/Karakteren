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
type InputMode = "voice" | "text";

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

// Design tokens (Karakteren design spec)
const KR = {
  bg:         "#FAF8F4",
  bgAlt:      "#F2EDE6",
  ink:        "#141414",
  inkMid:     "#555048",
  inkLight:   "#9B948A",
  card:       "#FFFFFF",
  border:     "rgba(0,0,0,0.08)",
  accent:     "oklch(65% 0.14 70)",
  accentDark: "oklch(52% 0.14 70)",
  accentBg:   "oklch(96% 0.04 70)",
  green:      "oklch(62% 0.14 150)",
  red:        "oklch(58% 0.18 22)",
  redBg:      "oklch(96% 0.06 22)",
  r:          "14px",
  rLg:        "20px",
  rFull:      "999px",
  fontDisplay:"'Syne', system-ui, sans-serif",
  fontBody:   "'Inter', system-ui, sans-serif",
};

function MicIcon({ size = 28, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ExamPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const subject = params.get("subject") ?? "matematikk";
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const presetTopic = params.get("topic");

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
  const [limitInfo, setLimitInfo] = useState({ used: 0, limit: 3, isPremium: false });
  const [typedAnswer, setTypedAnswer] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>("voice");

  const stopRecognitionRef = useRef<(() => void) | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcribeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

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
      if (res.status === 429) {
        const data = await res.json();
        setLimitInfo({ used: data.used ?? 0, limit: data.limit ?? 3, isPremium: data.isPremium ?? false });
        setShowUpgrade(true);
        setIsStreaming(false);
        return null;
      }
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
    const { allowed, isPremium: premium, used, limit } = await canStartExam();
    if (!allowed) { setLimitInfo({ used, limit, isPremium: premium }); setShowUpgrade(true); return; }

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
    let result = trimmed;
    try {
      const res = await fetch("/api/correct-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, alternatives: alts, subject, topic: topicName }),
      });
      if (res.ok) {
        const { text: corrected } = await res.json();
        if (corrected) result = corrected;
      }
    } catch {}
    setIsTranscribing(false);
    await handleStudentAnswer(result);
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
        setLiveTranscript((finalText + interim).trim());
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
        <div className="exam-outer" style={{ fontFamily: KR.fontBody }}>
        <div className="exam-card">
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: KR.inkLight, fontFamily: "inherit", padding: 0, WebkitTapHighlightColor: "transparent" }}
            >
              <BackChevron />
              Tilbake
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "16px" }}>

              <div style={{
                backgroundColor: presetTopic ? KR.ink : KR.card,
                border: `1px solid ${presetTopic ? KR.ink : KR.border}`,
                borderRadius: KR.rLg,
                padding: "32px 24px",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}>
                {presetTopic ? (
                  <>
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontFamily: KR.fontBody }}>Trukket tema</p>
                    <p style={{ fontFamily: KR.fontDisplay, fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px" }}>{presetTopic}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: KR.fontBody }}>{subjectLabel}</p>
                  </>
                ) : (
                  <>
                    <Blobb state="idle" size={100} />
                    <div style={{ backgroundColor: KR.accentBg, borderRadius: KR.rFull, padding: "4px 16px", fontSize: "13px", fontWeight: 600, color: KR.accentDark, fontFamily: KR.fontBody }}>
                      {subjectLabel}
                    </div>
                    <h1 style={{ fontFamily: KR.fontDisplay, fontSize: "1.4rem", fontWeight: 800, color: KR.ink, letterSpacing: "-0.5px", margin: 0 }}>
                      Klar for eksamen?
                    </h1>
                    <p style={{ fontSize: "14px", color: KR.inkMid, lineHeight: 1.6, fontFamily: KR.fontBody, margin: 0 }}>
                      Blobb trekker et tema og stiller deg spørsmål. Svar høyt eller skriv.
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={startExam}
                style={{
                  width: "100%", padding: "15px", borderRadius: KR.rFull, border: "none",
                  backgroundColor: KR.accent, color: "#fff",
                  fontFamily: KR.fontBody, fontWeight: 700, fontSize: "15px",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {presetTopic ? "Start eksamen →" : "Trekk tema og start"}
              </button>
            </div>
          </div>
        </div>
        </div>
        {showUpgrade && <UpgradeModal used={limitInfo.used} limit={limitInfo.limit} isPremium={limitInfo.isPremium} onClose={() => setShowUpgrade(false)} />}
      </>
    );
  }

  // ── DONE SCREEN ──
  if (phase === "done") {
    return (
      <div className="exam-outer" style={{ fontFamily: KR.fontBody }}>
      <div className="exam-card">
        <div style={{ padding: "14px 20px" }}>
          <button onClick={() => router.push("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: KR.inkLight, fontFamily: "inherit", padding: 0, WebkitTapHighlightColor: "transparent" }}>
            <BackChevron />
            Dashboard
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <Blobb state={blobbState} size={120} />
          <h1 style={{ fontFamily: KR.fontDisplay, fontSize: "1.5rem", fontWeight: 800, color: KR.ink, marginTop: "24px", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Eksamen ferdig!
          </h1>
          <p style={{ fontSize: "14px", color: KR.inkMid, marginBottom: "32px", lineHeight: 1.5 }}>
            Blobb har vurdert svarene dine.
          </p>
          <button
            onClick={() => router.push("/exam/feedback")}
            style={{ width: "100%", maxWidth: "340px", padding: "15px", borderRadius: KR.rFull, border: "none", backgroundColor: KR.accent, color: "#fff", fontFamily: KR.fontBody, fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", WebkitTapHighlightColor: "transparent" }}
          >
            Se karakter og tilbakemelding
          </button>
        </div>
      </div>
      </div>
    );
  }

  // ── CONVERSATION SCREEN ──
  const isExaminerTurn = isStreaming || isSpeaking || phase === "grading";

  // 3-segment progress: each segment covers ~2 exchanges
  const segments = [0, 1, 2];
  const completedSegments = Math.min(segments.length, Math.floor(exchangeCount / 2));

  // Last examiner message for question card
  const lastExaminerMsg = [...messages].reverse().find((m) => m.role === "examiner");
  const questionText = streamingText || lastExaminerMsg?.text || "";

  const mm = String(Math.floor(recordingSeconds / 60)).padStart(2, "0");
  const ss = String(recordingSeconds % 60).padStart(2, "0");

  return (
    <div className="exam-outer" style={{ fontFamily: KR.fontBody }}>
    <div className="exam-card">

      {/* ── Header ── */}
      <div style={{
        padding: "16px 24px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${KR.border}`,
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "13px", color: KR.ink, fontFamily: KR.fontBody }}>{subjectLabel}</div>
          {topicName && <div style={{ fontSize: "11px", color: KR.inkLight, fontFamily: KR.fontBody }}>{topicName}</div>}
        </div>

        {/* 3-segment progress bar */}
        <div style={{ display: "flex", gap: "4px" }}>
          {segments.map((i) => (
            <div key={i} style={{
              width: "28px", height: "4px", borderRadius: "2px",
              background: i < completedSegments ? KR.green : i === completedSegments ? KR.accent : KR.border,
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>

        <button
          onClick={() => { stopSpeaking(); router.push("/dashboard"); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: KR.inkLight, fontFamily: KR.fontBody, fontSize: "12px", padding: 0, WebkitTapHighlightColor: "transparent" }}
        >
          Avslutt
        </button>
      </div>

      {/* ── Blobb area ── */}
      <div style={{ padding: "20px 24px 12px", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <Blobb state={blobbState} size={90} />
          {(isStreaming || phase === "grading") && (
            <div style={{ position: "absolute", top: 0, right: -14, display: "flex", gap: "3px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: KR.accent, opacity: 0.7,
                  animation: `pulse 1s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        {phase === "grading" && (
          <div style={{ marginTop: "8px", fontFamily: KR.fontBody, fontSize: "13px", color: KR.inkMid, fontStyle: "italic" }}>
            Setter karakter...
          </div>
        )}
        {isStreaming && phase !== "grading" && (
          <div style={{ marginTop: "8px", fontFamily: KR.fontBody, fontSize: "13px", color: KR.inkMid, fontStyle: "italic" }}>
            Hmm, la meg tenke...
          </div>
        )}
        {isSpeaking && !isStreaming && (
          <div style={{ marginTop: "8px", fontFamily: KR.fontBody, fontSize: "13px", color: KR.inkMid, fontStyle: "italic" }}>
            Snakker...
          </div>
        )}
      </div>

      {/* ── Question card ── */}
      {questionText && (
        <div style={{
          margin: "0 24px",
          background: KR.card,
          border: `1px solid ${KR.border}`,
          borderRadius: KR.rLg,
          padding: "20px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div style={{ fontFamily: KR.fontBody, fontSize: "11px", color: KR.inkLight, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Spørsmål</div>
            {lastExaminerText && !isSpeaking && !isStreaming && phase === "conversation" && (
              <button
                onClick={() => examinerSpeak(lastExaminerText)}
                style={{ display: "flex", alignItems: "center", gap: "3px", background: "none", border: `1px solid ${KR.border}`, borderRadius: KR.rFull, padding: "3px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: KR.inkLight, fontFamily: KR.fontBody, WebkitTapHighlightColor: "transparent" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                Hør
              </button>
            )}
          </div>
          <p style={{ fontFamily: KR.fontBody, fontSize: "15px", color: KR.ink, lineHeight: 1.6, margin: 0 }}>
            {questionText}
            {streamingText && (
              <span style={{ display: "inline-block", width: "2px", height: "13px", backgroundColor: KR.accent, marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
            )}
          </p>
        </div>
      )}

      {/* ── Live transcript bubble ── */}
      {liveTranscript && (
        <div style={{
          margin: "8px 24px 0",
          background: KR.accentBg,
          border: `1.5px solid ${KR.accent}`,
          borderRadius: KR.r,
          padding: "12px 16px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: KR.accent, animation: "blink 1s step-end infinite", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: KR.accentDark, fontFamily: KR.fontBody }}>Tar opp · {mm}:{ss}</span>
          </div>
          <p style={{ fontFamily: KR.fontBody, fontSize: "14px", color: KR.ink, margin: 0, lineHeight: 1.5 }}>{liveTranscript}</p>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* ── Mic error ── */}
      {micError && (
        <div style={{ backgroundColor: "oklch(97% 0.03 22)", borderTop: "1px solid oklch(88% 0.06 22)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", color: "oklch(45% 0.15 22)", lineHeight: 1.4, fontFamily: KR.fontBody }}>{micError}</p>
          <button onClick={() => setMicError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(55% 0.15 22)", fontSize: "20px", lineHeight: 1, flexShrink: 0, padding: "0 2px" }}>×</button>
        </div>
      )}

      {/* ── Input area ── */}
      {phase === "conversation" && !isExaminerTurn && (
        <div style={{
          padding: "12px 24px",
          paddingBottom: `calc(12px + env(safe-area-inset-bottom))`,
          borderTop: `1px solid ${KR.border}`,
          backgroundColor: KR.bg,
          flexShrink: 0,
        }}>
          {/* Mode toggle pill */}
          <div style={{ display: "flex", background: KR.bgAlt, borderRadius: KR.rFull, padding: "3px", marginBottom: "16px" }}>
            {(["voice", "text"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setInputMode(m)}
                style={{
                  flex: 1, padding: "7px", borderRadius: KR.rFull, border: "none",
                  background: inputMode === m ? KR.card : "transparent",
                  color: inputMode === m ? KR.ink : KR.inkMid,
                  fontFamily: KR.fontBody, fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", transition: "all 0.2s ease",
                  boxShadow: inputMode === m ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {m === "voice" ? "🎤 Tale" : "⌨️ Tekst"}
              </button>
            ))}
          </div>

          {inputMode === "voice" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <button
                onClick={toggleRecording}
                style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: isRecording ? KR.red : KR.accent,
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isRecording ? `0 0 0 8px ${KR.redBg}` : "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
                aria-label={isRecording ? "Stop innspilling" : "Start innspilling"}
              >
                {isTranscribing ? (
                  <span style={{ fontSize: "8px", fontWeight: 700, color: "white", textAlign: "center", lineHeight: 1.3, fontFamily: KR.fontBody }}>{"AI\nfikser"}</span>
                ) : isRecording ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                ) : (
                  <MicIcon size={28} color="white" />
                )}
              </button>

              {isRecording ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: KR.red, animation: "pulse 1s infinite", flexShrink: 0 }} />
                  <span style={{ fontFamily: KR.fontBody, fontSize: "13px", color: KR.red, fontWeight: 600 }}>{mm}:{ss}</span>
                  <button
                    onClick={toggleRecording}
                    style={{
                      background: KR.accent, border: "none", cursor: "pointer",
                      color: "white", borderRadius: KR.rFull, padding: "8px 18px",
                      fontFamily: KR.fontBody, fontWeight: 600, fontSize: "13px",
                      WebkitTapHighlightColor: "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Send svar
                  </button>
                </div>
              ) : (
                <span style={{ fontFamily: KR.fontBody, fontSize: "12px", color: KR.inkLight }}>Trykk for å snakke</span>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && typedAnswer.trim()) {
                    e.preventDefault();
                    void handleStudentAnswer(typedAnswer);
                  }
                }}
                placeholder="Skriv svaret ditt her..."
                style={{
                  width: "100%", minHeight: "100px", padding: "14px",
                  fontFamily: KR.fontBody, fontSize: "14px", lineHeight: 1.5,
                  border: `1.5px solid ${typedAnswer ? KR.accent : KR.border}`,
                  borderRadius: KR.r, resize: "none",
                  background: KR.card, color: KR.ink,
                  outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
              />
              {typedAnswer.length > 10 && (
                <button
                  onClick={() => void handleStudentAnswer(typedAnswer)}
                  style={{
                    alignSelf: "flex-end",
                    background: KR.accent, border: "none", cursor: "pointer",
                    color: "white", borderRadius: KR.rFull, padding: "14px 28px",
                    fontFamily: KR.fontBody, fontWeight: 600, fontSize: "15px",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.15s ease",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  }}
                >
                  Send svar →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {phase === "grading" && (
        <div style={{ borderTop: `1px solid ${KR.border}`, padding: "18px 24px", textAlign: "center", flexShrink: 0, paddingBottom: `calc(18px + env(safe-area-inset-bottom))` }}>
          <p style={{ fontFamily: KR.fontBody, fontSize: "14px", fontWeight: 600, color: KR.inkMid }}>Blobb setter karakter...</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="exam-outer">
        <div className="exam-card" style={{ alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#9B948A", fontFamily: "'Inter', system-ui, sans-serif" }}>Laster...</span>
        </div>
      </div>
    }>
      <ExamPageInner />
    </Suspense>
  );
}
