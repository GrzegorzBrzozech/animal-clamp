import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, KingPencil, PoliticianPencil, INK } from "~/characters";
import { blackcraft } from "~/lib/fonts";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp);

// "+1 Up" badge positioned above a specific figure, floats up and fades
const PlusOneUp: React.FC<{ at: number; centerX: number; top: number }> = ({ at, centerX, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ fps, frame: frame - at, config: { damping: 12, mass: 0.7 }, from: 0, to: 1 });
  const floatY = interpolate(frame, [at, at + 60], [0, -90], clamp);
  const fadeOut = interpolate(frame, [at + 35, at + 70], [1, 0], clamp);

  return (
    <div style={{
      position: "absolute",
      left: centerX,
      top,
      transform: `translateX(-50%) translateY(${floatY}px) scale(${appear})`,
      transformOrigin: "center bottom",
      opacity: appear * fadeOut,
      pointerEvents: "none",
      zIndex: 10,
    }}>
      <div style={{
        fontFamily: blackcraft.fontFamily,
        fontSize: 90,
        color: "#f59e0b",
        textShadow: `3px 3px 0 ${INK}, -2px -2px 0 ${INK}, 2px -2px 0 ${INK}, -2px 2px 0 ${INK}`,
        whiteSpace: "nowrap",
        letterSpacing: 4,
      }}>
        +1 UP
      </div>
    </div>
  );
};

const GROUND = 820;

// 50% larger than original (400 / 380)
const KING_SIZE = 600;
const POL_SIZE = 570;

// KingPencil: VB_W=170, VB_H=245 → width = size * 170/245
const KING_W = Math.round(KING_SIZE * 170 / 245);
// PoliticianPencil (person part): VB_W=170, VB_H=220
const POL_W = Math.round(POL_SIZE * 170 / 220);

const KING_CENTER_X = 470;
const POL_CENTER_X = 1440;

export const PowerLongevityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kingSpring = spring({ fps, frame: frame - 0, config: { damping: 16, mass: 1.1 }, from: 0, to: 1 });
  const polSpring = spring({ fps, frame: frame - 15, config: { damping: 16, mass: 1.1 }, from: 0, to: 1 });

  // "У буквальному сенсі" starts at 1.64s → frame 49
  const PLUS_AT = 29;

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Ground line + hatch */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="plGround" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={INK} strokeWidth="1.8" />
          </pattern>
          <linearGradient id="plEarthFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="plEarthMask">
            <rect x="0" y={GROUND} width="1920" height={1080 - GROUND} fill="url(#plEarthFade)" />
          </mask>
        </defs>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={`${INK}55`} strokeWidth={3} opacity={fade(frame, 5, 20)} />
        <rect x="0" y={GROUND} width="1920" height={1080 - GROUND}
          fill="url(#plGround)" fillOpacity={0.28} mask="url(#plEarthMask)" opacity={fade(frame, 5, 20)} />
      </svg>

      {/* King — left of center */}
      <div style={{
        position: "absolute",
        left: KING_CENTER_X - KING_W / 2,
        top: GROUND - KING_SIZE,
        transform: `scale(${kingSpring})`,
        transformOrigin: "bottom center",
        opacity: kingSpring,
      }}>
        <KingPencil size={KING_SIZE} />
      </div>

      {/* Politician — right of center, at tribune */}
      <div style={{
        position: "absolute",
        left: POL_CENTER_X - POL_W / 2 -100,
        top: GROUND - 700,
        transform: `scale(${polSpring})`,
        transformOrigin: "bottom center",
        opacity: polSpring,
      }}>
        <PoliticianPencil size={POL_SIZE} facing={1} pose="stand" tribune={true} />
      </div>

      {/* +1 Up above king */}
      <PlusOneUp at={PLUS_AT} centerX={KING_CENTER_X} top={GROUND - KING_SIZE - 20} />

      {/* +1 Up above politician */}
      <PlusOneUp at={PLUS_AT + 8} centerX={POL_CENTER_X} top={GROUND - POL_SIZE - 20} />
    </AbsoluteFill>
  );
};
