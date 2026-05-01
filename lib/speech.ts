let currentAudio: HTMLAudioElement | null = null;

export async function speak(text: string, lang = "nb-NO"): Promise<void> {
  stopSpeaking();

  // Try API (OpenAI) if available
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
  } catch {
    // fall through
  }

  // Browser TTS — uses iOS "Nora" / macOS Norwegian voices, sounds natural
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

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
    }
  });
}

export function stopSpeaking() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Speech recognition — async to allow getUserMedia permission request first
type RecognitionCallback = (transcript: string, isFinal: boolean) => void;

export async function startRecognition(
  onResult: RecognitionCallback,
  onEnd: () => void,
  lang = "nb-NO"
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  // iOS Safari requires getUserMedia to be called before SpeechRecognition
  // will activate the microphone. This must be the first await in the
  // user-gesture call chain.
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
  } catch {
    // Permission denied or getUserMedia not supported — fall through and try anyway
  }

  let stopped = false;

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;   // iOS Safari does not support continuous:true
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += t;
      else interim += t;
    }
    if (final) onResult(final, true);
    else if (interim) onResult(interim, false);
  };

  recognition.onend = () => {
    if (stopped) { onEnd(); return; }
    try { recognition.start(); } catch { stopped = true; onEnd(); }
  };

  recognition.onerror = (e: any) => {
    if (stopped) return;
    if (e.error === "no-speech") {
      try { recognition.start(); } catch { stopped = true; onEnd(); }
    } else {
      stopped = true;
      onEnd();
    }
  };

  try {
    recognition.start();
  } catch {
    return null;
  }

  return () => {
    stopped = true;
    try { recognition.stop(); } catch {}
  };
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}
