// Singleton AudioContext — unlocked once on first user gesture, reused for all playback.
// This is the key to iOS Safari audio: HTMLAudioElement.play() after an async fetch is blocked,
// but a pre-unlocked AudioContext can decode and play blobs at any time.
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new Ctx();
  }
  return audioCtx;
}

async function playBlob(blob: Blob): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return playWithElement(blob);

  // Resume context if suspended (iOS may suspend it again)
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch {}
  }

  try {
    const arrayBuf = await blob.arrayBuffer();
    const audioBuf = await ctx.decodeAudioData(arrayBuf);
    return new Promise((resolve) => {
      if (currentSource) { try { currentSource.stop(); } catch {} }
      const src = ctx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(ctx.destination);
      currentSource = src;
      src.onended = () => { currentSource = null; resolve(); };
      src.start(0);
    });
  } catch {
    return playWithElement(blob);
  }
}

// HTMLAudioElement fallback (works on desktop, sometimes blocked on iOS)
function playWithElement(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
    audio.play().catch(() => resolve());
  });
}

// Estimate reading time so we always resolve even if audio/speech events fail
function estimatedDurationMs(text: string): number {
  return Math.max(2000, (text.split(" ").length / 2.5) * 1000);
}

export async function speak(text: string, lang = "nb-NO"): Promise<void> {
  stopSpeaking();

  const timeout = estimatedDurationMs(text) + 3000;

  const doSpeak = async (): Promise<void> => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok && res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        await playBlob(blob);
        return;
      }
    } catch {}

    // SpeechSynthesis fallback
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

      // Poll — onvoiceschanged is unreliable on iOS
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
  };

  // Hard cap — speak() must ALWAYS resolve so the UI never gets stuck
  return Promise.race([
    doSpeak(),
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ]);
}

export function stopSpeaking() {
  if (currentSource) {
    try { currentSource.stop(); } catch {}
    currentSource = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Must be called synchronously from a user gesture (onClick).
// Unlocks the shared AudioContext so all subsequent async playback works on iOS.
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  // Play silent buffer to fully unlock
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch {}
}

// ─── Web Speech API (free, real-time, works on iOS/Android/Chrome) ───────────

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

// ─── MediaRecorder + Whisper fallback ────────────────────────────────────────

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function mimeToExt(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

export async function startRecording(
  onTranscript: (text: string) => void,
  lang = "nb-NO",
  onError?: (msg: string) => void,
  onInterim?: (text: string) => void,
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  // ── Try Web Speech API first (free, real-time, works on iOS/Android) ──
  const webSpeechStop = startWebSpeech(
    onTranscript,
    onInterim ?? (() => {}),
    lang,
    onError,
  );
  if (webSpeechStop) return webSpeechStop;

  // ── Fallback: MediaRecorder + Whisper ──
  if (typeof MediaRecorder === "undefined") {
    onError?.("Nettleseren din støtter ikke taleinnspilling. Prøv Chrome eller Safari.");
    return null;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err: unknown) {
    const name = (err as { name?: string })?.name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      onError?.("Mikrofonillatelse nektet. Åpne nettleserinnstillinger og tillat mikrofon.");
    } else if (name === "NotFoundError") {
      onError?.("Ingen mikrofon funnet på enheten.");
    } else {
      onError?.("Kunne ikke starte mikrofon.");
    }
    return null;
  }

  const mimeType = getSupportedMimeType();
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  recorder.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop());
    const actualMime = recorder.mimeType || mimeType || "audio/webm";
    const ext = mimeToExt(actualMime);
    const blob = new Blob(chunks, { type: actualMime });

    if (blob.size < 1000) {
      onError?.(`Lydopptak var tomt (${blob.size} bytes). Sjekk at mikrofon er aktiv.`);
      onTranscript("");
      return;
    }

    const form = new FormData();
    form.append("audio", blob, `audio.${ext}`);
    form.append("lang", lang.startsWith("en") ? "en" : "no");
    try {
      const res = await fetch("/api/stt", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        onError?.(`STT feil ${res.status}: ${body.error ?? "ukjent feil"}`);
        onTranscript("");
        return;
      }
      const { text } = await res.json();
      onTranscript(text ?? "");
    } catch (e) {
      onError?.(`Nettverksfeil: ${(e as Error).message}`);
      onTranscript("");
    }
  };

  recorder.start();
  return () => { if (recorder.state !== "inactive") recorder.stop(); };
}
