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

    // SpeechSynthesis fallback — onend is unreliable on iOS, so always set a timeout
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      // iOS sometimes never fires onend — fallback timer
      const safetyTimer = setTimeout(resolve, estimatedDurationMs(text) + 1500);
      const done = () => { clearTimeout(safetyTimer); resolve(); };
      const trySpeak = () => {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;
        utt.rate = 0.92;
        utt.pitch = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const norVoice =
          voices.find((v) => v.name.toLowerCase().includes("nora")) ??
          voices.find((v) => v.name.toLowerCase().includes("malin")) ??
          voices.find((v) => v.lang.startsWith("nb") || v.lang.startsWith("no"));
        if (norVoice) utt.voice = norVoice;
        utt.onend = done;
        utt.onerror = done;
        window.speechSynthesis.speak(utt);
      };
      if (window.speechSynthesis.getVoices().length > 0) trySpeak();
      else window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
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
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  if (typeof MediaRecorder === "undefined") {
    onError?.("Nettleseren din støtter ikke opptak. Prøv Chrome eller Safari 14.3+.");
    return null;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err: unknown) {
    const name = (err as { name?: string })?.name;
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      onError?.("Mikrofonillatelse nektet. Åpne nettleserinnstillinger og tillat mikrofon for denne siden.");
    } else if (name === "NotFoundError") {
      onError?.("Ingen mikrofon funnet på enheten.");
    } else {
      onError?.("Kunne ikke starte mikrofon. Sjekk at du er på HTTPS og har gitt tillatelse.");
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

    // If blob is suspiciously small, audio was silent or too short
    if (blob.size < 2000) { onTranscript(""); return; }

    const form = new FormData();
    form.append("audio", blob, `audio.${ext}`);
    form.append("lang", lang.startsWith("en") ? "en" : "no");
    try {
      const res = await fetch("/api/stt", { method: "POST", body: form });
      const { text } = res.ok ? await res.json() : { text: "" };
      onTranscript(text ?? "");
    } catch {
      onTranscript("");
    }
  };

  // No timeslice — collect all data at once on stop (more reliable on iOS)
  recorder.start();
  return () => { if (recorder.state !== "inactive") recorder.stop(); };
}
