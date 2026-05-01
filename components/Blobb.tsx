"use client";

import { useEffect, useState } from "react";

export type BlobbMood = "idle" | "thinking" | "talking" | "happy" | "grumpy";
// Legacy alias
export type BlobbState = BlobbMood | "listening" | "disappointed" | "hint";

interface BlobbProps {
  mood?: BlobbMood;
  state?: BlobbState; // legacy prop — maps to mood
  size?: number;
  animate?: boolean;
}

const MOODS: Record<BlobbMood, {
  path: string;
  eyeL: { x: number; y: number };
  eyeR: { x: number; y: number };
  mouthD: string;
  color: string;
}> = {
  idle: {
    path: "M50,15 C72,12 88,28 85,50 C82,72 68,88 46,87 C24,86 10,70 12,48 C14,26 28,18 50,15 Z",
    eyeL: { x: 33, y: 44 }, eyeR: { x: 58, y: 41 },
    mouthD: "M35,62 Q50,70 62,62",
    color: "#E8B89A",
  },
  thinking: {
    path: "M50,12 C75,10 92,30 88,54 C84,76 65,92 42,88 C20,84 8,65 11,42 C14,20 30,14 50,12 Z",
    eyeL: { x: 31, y: 46 }, eyeR: { x: 57, y: 42 },
    mouthD: "M36,64 Q48,60 60,65",
    color: "#D4A882",
  },
  talking: {
    path: "M50,14 C73,11 90,27 87,51 C84,73 66,90 44,88 C22,86 9,68 12,45 C15,24 29,17 50,14 Z",
    eyeL: { x: 32, y: 43 }, eyeR: { x: 58, y: 40 },
    mouthD: "M34,61 Q50,74 63,60",
    color: "#E8B89A",
  },
  happy: {
    path: "M50,16 C70,13 86,26 84,48 C82,70 66,86 46,85 C26,84 12,68 14,47 C16,27 30,19 50,16 Z",
    eyeL: { x: 33, y: 43 }, eyeR: { x: 57, y: 41 },
    mouthD: "M33,60 Q50,76 64,59",
    color: "#F0C9A8",
  },
  grumpy: {
    path: "M50,13 C76,10 93,31 89,56 C85,78 63,94 40,89 C18,84 6,62 10,40 C14,18 32,16 50,13 Z",
    eyeL: { x: 30, y: 48 }, eyeR: { x: 57, y: 44 },
    mouthD: "M36,66 Q50,59 61,66",
    color: "#C89878",
  },
};

function stateToMood(state: BlobbState): BlobbMood {
  if (state === "listening" || state === "hint") return "idle";
  if (state === "disappointed") return "grumpy";
  return state as BlobbMood;
}

export default function Blobb({ mood, state, size = 100, animate = true }: BlobbProps) {
  const resolvedMood: BlobbMood = mood ?? (state ? stateToMood(state) : "idle");
  const [tick, setTick] = useState(0);
  const [blinkOpen, setBlinkOpen] = useState(true);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick(p => p + 1), 50);
    return () => clearInterval(id);
  }, [animate]);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [animate]);

  const m = MOODS[resolvedMood];
  const floatY = animate ? Math.sin(tick * 0.08) * 2 : 0;
  const scaleX = animate ? 1 + Math.sin(tick * 0.06) * 0.008 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `translateY(${floatY}px) scaleX(${scaleX})`, display: "block" }}
    >
      {/* Shadow */}
      <ellipse cx="50" cy="95" rx="22" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* Body */}
      <path d={m.path} fill={m.color} style={{ transition: "d 0.4s ease, fill 0.3s ease" }} />

      {/* Highlight */}
      <ellipse cx="38" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-20,38,28)" />

      {/* Eyes */}
      <ellipse cx={m.eyeL.x} cy={m.eyeL.y} rx="5" ry={blinkOpen ? 5.5 : 1.5} fill="#1a1a1a" style={{ transition: "ry 0.1s" }} />
      <circle cx={m.eyeL.x + 1.5} cy={m.eyeL.y - 1.5} r="1.5" fill="white" />
      <ellipse cx={m.eyeR.x} cy={m.eyeR.y} rx="4.5" ry={blinkOpen ? 5 : 1.5} fill="#1a1a1a" style={{ transition: "ry 0.1s" }} />
      <circle cx={m.eyeR.x + 1.5} cy={m.eyeR.y - 1.5} r="1.5" fill="white" />

      {/* Eyebrows — grumpy */}
      {resolvedMood === "grumpy" && (
        <g>
          <line x1={m.eyeL.x - 5} y1={m.eyeL.y - 9} x2={m.eyeL.x + 5} y2={m.eyeL.y - 6} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1={m.eyeR.x - 5} y1={m.eyeR.y - 6} x2={m.eyeR.x + 5} y2={m.eyeR.y - 9} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {/* Eyebrow — thinking */}
      {resolvedMood === "thinking" && (
        <line x1={m.eyeR.x - 5} y1={m.eyeR.y - 9} x2={m.eyeR.x + 5} y2={m.eyeR.y - 12} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
      )}

      {/* Mouth */}
      <path d={m.mouthD} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />

      {/* Open mouth — talking */}
      {resolvedMood === "talking" && (
        <path d="M34,61 Q50,78 63,60 Q50,72 34,61 Z" fill="#8B4A4A" opacity="0.6" />
      )}

      {/* Blush — happy */}
      {resolvedMood === "happy" && (
        <g opacity="0.4">
          <ellipse cx="24" cy="55" rx="5" ry="3" fill="#E8606A" />
          <ellipse cx="70" cy="52" rx="5" ry="3" fill="#E8606A" />
        </g>
      )}
    </svg>
  );
}
