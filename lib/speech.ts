// Silent WAV — used to unlock HTMLAudioElement during user gesture
const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

// Single HTMLAudioElement unlocked once via user gesture; stays unlocked for
// all subsequent .play() calls on the same element, even after async gaps.
// This is the only reliable way to play audio on iOS after an async fetch.
let unlockedAudio: HTMLAudioElement | null = null;

let currentSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx || audioCtx.state === "closed") audioCtx = new Ctx();
  return audioCtx;
}

// Returns true only if audio was audibly played.
async function playBlob(blob: Blob): Promise<boolean> {
  // 1. Pre-unlocked HTMLAudioElement — most reliable path on iOS
  if (unlockedAudio) {
    const url = URL.createObjectURL(blob);
    const audio = unlockedAudio;
    return new Promise((resolve) => {
      const cleanup = () => { try { URL.revokeObjectURL(url); } catch {} };
      audio.onended = () => { cleanup(); resolve(true); };
      audio.onerror = () => { cleanup(); resolve(false); };
      audio.src = url;
      audio.load();
      audio.play().catch(() => { cleanup(); resolve(false); });
    });
  }

  // 2. AudioContext fallback (desktop)
  const ctx = getAudioContext();
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch {}
  }
  if (ctx.state !== "running") return false;
  try {
    const buf = await blob.arrayBuffer();
    const audioBuf = await ctx.decodeAudioData(buf);
    return new Promise((resolve) => {
      if (currentSource) { try { currentSource.stop(); } catch {} }
      const src = ctx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(ctx.destination);
      currentSource = src;
      src.onended = () => { currentSource = null; resolve(true); };
      src.start(0);
    });
  } catch {
    return false;
  }
}

function estimatedDurationMs(text: string): number {
  return Math.max(2000, (text.split(" ").length / 2.5) * 1000);
}

function speakWithSynthesis(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const safetyTimer = setTimeout(resolve, estimatedDurationMs(text) + 2000);
    const done = () => { clearTimeout(safetyTimer); resolve(); };

    const trySpeak = (voices: SpeechSynthesisVoice[]) => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = lang;
      utt.rate = 0.9;
      utt.pitch = 1.0;
      const norVoice =
        voices.find((v) => v.name.toLowerCase().includes("nora")) ??
        voices.find((v) => v.name.toLowerCase().includes("malin")) ??
        voices.find((v) => v.lang.startsWith("nb") || v.lang.startsWith("no"));
      if (norVoice) utt.voice = norVoice;
      utt.onend = done;
      utt.onerror = done;
      window.speechSynthesis.speak(utt);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { trySpeak(voices); return; }

    let tries = 0;
    const poll = setInterval(() => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0 || tries++ > 30) { clearInterval(poll); trySpeak(v); }
    }, 100);
    window.speechSynthesis.onvoiceschanged = () => {
      clearInterval(poll);
      trySpeak(window.speechSynthesis.getVoices());
    };
  });
}

export async function speak(text: string, lang = "nb-NO"): Promise<void> {
  stopSpeaking();

  const doSpeak = async (): Promise<void> => {
    try {
      const voicePref = typeof window !== "undefined"
        ? (localStorage.getItem("examiner-voice") as "male" | "female" | null) ?? "female"
        : "female";
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: voicePref }),
      });
      if (res.ok && res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        const played = await playBlob(blob);
        if (played) return;
        // playBlob failed silently (e.g. AudioContext suspended) — fall through
      }
    } catch {}

    // SpeechSynthesis fallback — always tried if TTS API or playback failed
    await speakWithSynthesis(text, lang);
  };

  const timeout = estimatedDurationMs(text) + 3000;
  return Promise.race([
    doSpeak(),
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ]);
}

export function stopSpeaking() {
  if (unlockedAudio) {
    try { unlockedAudio.pause(); unlockedAudio.currentTime = 0; } catch {}
  }
  if (currentSource) {
    try { currentSource.stop(); } catch {}
    currentSource = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }
}

// Must be called synchronously from a user gesture (onClick).
// Unlocks HTMLAudioElement so subsequent async .play() calls work on iOS.
export function unlockAudio(): void {
  if (typeof window === "undefined") return;

  // Unlock HTMLAudioElement
  if (!unlockedAudio) unlockedAudio = new Audio();
  unlockedAudio.src = SILENT_WAV;
  unlockedAudio.volume = 0.001;
  unlockedAudio.play().catch(() => {});

  // SpeechSynthesis primer
  if (window.speechSynthesis) {
    try {
      const primer = new SpeechSynthesisUtterance(".");
      primer.volume = 0.01;
      primer.rate = 10;
      window.speechSynthesis.speak(primer);
    } catch {}
  }

  // AudioContext unlock (desktop)
  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    try {
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch {}
  }
}

// ── Web Speech API (recording) ────────────────────────────────────────────────

function getRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const SR = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
  if (!SR) return null;
  return new SR();
}

function startWebSpeech(
  onTranscript: (text: string) => void,
  onInterim: (text: string) => void,
  lang: string,
  onError?: (msg: string) => void,
): (() => void) | null {
  const recognition = getRecognition();
  if (!recognition) return null;

  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let finalText = "";

  recognition.onresult = (e: SpeechRecognitionEvent) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += t;
      else interim += t;
    }
    if (interim) onInterim(interim);
  };

  recognition.onend = () => { onTranscript(finalText.trim()); };

  recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
    if (e.error === "no-speech") { onTranscript(""); return; }
    if (e.error === "not-allowed") {
      onError?.("Mikrofonillatelse nektet. Åpne nettleserinnstillinger og tillat mikrofon.");
    } else {
      onError?.(`Talegjenkjenning feilet: ${e.error}`);
    }
    onTranscript("");
  };

  try {
    recognition.start();
  } catch {
    return null;
  }

  return () => { try { recognition.stop(); } catch {} };
}

export async function startRecording(
  onTranscript: (text: string) => void,
  lang = "nb-NO",
  onError?: (msg: string) => void,
  onInterim?: (text: string) => void,
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  const webSpeechStop = startWebSpeech(
    onTranscript,
    onInterim ?? (() => {}),
    lang,
    onError,
  );
  if (webSpeechStop) return webSpeechStop;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    onError?.("Taleinnspilling på iPhone/iPad krever Safari. Åpne appen i Safari og prøv igjen.");
  } else {
    onError?.("Nettleseren din støtter ikke taleinnspilling. Åpne i Chrome eller Safari og prøv igjen.");
  }
  return null;
}
