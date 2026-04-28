"use client";

export type BlobbState =
  | "idle"
  | "listening"
  | "thinking"
  | "talking"
  | "happy"
  | "disappointed"
  | "hint";

interface BlobbProps {
  state?: BlobbState;
  size?: number;
}

const stateColors: Record<BlobbState, string> = {
  idle: "var(--color-coral)",
  listening: "oklch(0.58 0.17 200)",
  thinking: "oklch(0.60 0.16 270)",
  talking: "var(--color-coral)",
  happy: "var(--color-yellow)",
  disappointed: "oklch(0.55 0.10 55)",
  hint: "oklch(0.62 0.16 155)",
};

const stateExpressions: Record<BlobbState, { eyes: string; mouth: string; label: string }> = {
  idle: { eyes: "● ●", mouth: "―", label: "Klar" },
  listening: { eyes: "◉ ◉", mouth: "○", label: "Lytter..." },
  thinking: { eyes: "◔ ◔", mouth: "~", label: "Tenker..." },
  talking: { eyes: "▲ ▲", mouth: "D", label: "Snakker" },
  happy: { eyes: "^ ^", mouth: "D", label: "Bra jobba!" },
  disappointed: { eyes: "- -", mouth: "∩", label: "Hmm..." },
  hint: { eyes: "◉ ●", mouth: "○", label: "Hint" },
};

export default function Blobb({ state = "idle", size = 120 }: BlobbProps) {
  const color = stateColors[state];
  const expr = stateExpressions[state];

  const animationClass =
    state === "idle"
      ? "blobb-idle"
      : state === "thinking"
      ? "blobb-spin"
      : state === "happy"
      ? "blobb-bounce"
      : state === "talking"
      ? "blobb-wobble"
      : "";

  return (
    <>
      <style>{`
        @keyframes blobb-idle {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          40% { transform: translateY(-6px) scale(0.97, 1.03); }
          60% { transform: translateY(-4px) scale(0.98, 1.02); }
        }
        @keyframes blobb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes blobb-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-14px) scale(0.95, 1.05); }
          50% { transform: translateY(-8px) scale(1.02, 0.98); }
          75% { transform: translateY(-12px) scale(0.96, 1.04); }
        }
        @keyframes blobb-wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-4deg) scale(1.03, 0.97); }
          75% { transform: rotate(4deg) scale(0.97, 1.03); }
        }
        .blobb-idle { animation: blobb-idle 3s ease-in-out infinite; }
        .blobb-spin { animation: blobb-spin 2s linear infinite; }
        .blobb-bounce { animation: blobb-bounce 0.6s ease-in-out infinite; }
        .blobb-wobble { animation: blobb-wobble 0.5s ease-in-out infinite; }
      `}</style>

      <div
        className={animationClass}
        style={{ width: size, height: size, position: "relative", display: "inline-block" }}
        role="img"
        aria-label={`Blobb: ${expr.label}`}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body blob */}
          <path
            d="M50 8 C68 6, 88 18, 92 36 C96 54, 90 74, 72 86 C54 98, 28 96, 14 80 C0 64, 4 40, 16 26 C28 12, 32 10, 50 8Z"
            fill={color}
            style={{ transition: "fill 300ms ease-out" }}
          />
          {/* Eyes */}
          <circle cx="36" cy="44" r={state === "happy" ? 4 : 5} fill="oklch(1 0 0)" />
          <circle cx="64" cy="44" r={state === "happy" ? 4 : 5} fill="oklch(1 0 0)" />
          {state !== "happy" && state !== "disappointed" && (
            <>
              <circle cx="37" cy="45" r="2.5" fill="oklch(0.17 0.012 55)" />
              <circle cx="65" cy="45" r="2.5" fill="oklch(0.17 0.012 55)" />
            </>
          )}
          {state === "thinking" && (
            <>
              <path d="M33 42 Q36 39, 39 42" fill="none" stroke="oklch(0.17 0.012 55)" strokeWidth="1.5" />
              <path d="M61 42 Q64 39, 67 42" fill="none" stroke="oklch(0.17 0.012 55)" strokeWidth="1.5" />
            </>
          )}
          {state === "happy" && (
            <>
              <path d="M30 44 Q36 40, 42 44" fill="none" stroke="oklch(0.17 0.012 55)" strokeWidth="2" />
              <path d="M58 44 Q64 40, 70 44" fill="none" stroke="oklch(0.17 0.012 55)" strokeWidth="2" />
            </>
          )}
          {/* Mouth */}
          {state === "happy" ? (
            <path d="M36 60 Q50 72, 64 60" fill="none" stroke="oklch(1 0 0)" strokeWidth="2.5" strokeLinecap="round" />
          ) : state === "disappointed" ? (
            <path d="M38 67 Q50 58, 62 67" fill="none" stroke="oklch(1 0 0)" strokeWidth="2.5" strokeLinecap="round" />
          ) : state === "listening" || state === "hint" ? (
            <circle cx="50" cy="63" r="4" fill="oklch(1 0 0 / 0.6)" />
          ) : (
            <path d="M40 62 Q50 68, 60 62" fill="none" stroke="oklch(1 0 0)" strokeWidth="2" strokeLinecap="round" />
          )}
          {/* Arms */}
          <ellipse cx="18" cy="62" rx="7" ry="4" fill={color} transform="rotate(-30 18 62)" style={{ transition: "fill 300ms ease-out" }} />
          <ellipse cx="82" cy="62" rx="7" ry="4" fill={color} transform="rotate(30 82 62)" style={{ transition: "fill 300ms ease-out" }} />
          {/* Hint hand */}
          {state === "hint" && (
            <path d="M30 55 Q22 48, 26 42" fill="none" stroke="oklch(1 0 0 / 0.7)" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </div>
    </>
  );
}
