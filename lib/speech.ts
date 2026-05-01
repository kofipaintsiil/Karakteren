let currentAudio: HTMLAudioElement | null = null;

export async function speak(text: string, lang = "nb-NO"): Promise<void> {
  stopSpeaking();
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok && res.headers.get("content-type")?.includes("audio")) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      return new Promise((resolve) => {
        const audio = new Audio(url);
        currentAudio = audio;
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play().catch(() => resolve());
      });
    }
  } catch {}
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
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
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length > 0) trySpeak();
    else window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
  });
}

export function stopSpeaking() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function unlockAudio(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    void ctx.close();
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

  recorder.start(250);
  return () => { if (recorder.state !== "inactive") recorder.stop(); };
}
