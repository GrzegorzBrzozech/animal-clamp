import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, GrandThrone, KingPencil, PersonPencil, KneelingPersonPencil, INK } from "~/characters";
import { blackcraft } from "~/lib/fonts";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fade = (f: number, s: number, d = 20) =>
  interpolate(f, [s, s + d], [0, 1], clamp);

// ── Bowing person: crossfades PersonPencil (standing) → KneelingPersonPencil ──
const BowingPerson: React.FC<{
  left: number; topStand: number; kneelAt: number; delay: number; figSize: number;
}> = ({ left, topStand, kneelAt, delay, figSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ fps, frame: frame - 20 - delay * 0.3, config: { damping: 20 }, from: 0, to: 1 });
  const kneel  = interpolate(frame, [kneelAt + delay, kneelAt + delay + 28], [0, 1], clamp);

  const groundY   = topStand + figSize;
  const kneelSize = figSize * (140 / 220);
  const kneelTop  = groundY - kneelSize * (132 / 140);

  return (
    <div style={{ position: "absolute", opacity: appear }}>
      <div style={{ position: "absolute", left, top: topStand, opacity: 1 - kneel }}>
        <PersonPencil size={figSize} facing={-1} pose="stand" />
      </div>
      <div style={{ position: "absolute", left, top: kneelTop, opacity: kneel }}>
        <KneelingPersonPencil size={kneelSize} facing={-1} />
      </div>
    </div>
  );
};

// ── King's speech bubble — over the people (right side of screen) ────────────
const KingSpeechBubble: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{
    position: "absolute",
    left: 780,
    top: "37%",
    transform: "translateY(-50%)",
    opacity,
    pointerEvents: "none",
  }}>
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Tail points LEFT toward the king/throne */}
      <svg
        style={{ position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", overflow: "visible", marginRight: -2 }}
        width={52} height={64} viewBox="0 0 52 64"
      >
        <polygon points="52,0 0,32 52,64" fill={INK} />
        <polygon points="52,9 10,32 52,55" fill="#F5ECD4" />
      </svg>
      <div style={{
        background: "#F5ECD4",
        border: `4px solid ${INK}`,
        borderRadius: 32,
        padding: "28px 60px",
        fontSize: 122,
        fontFamily: blackcraft.fontFamily,
        color: INK,
        width: 1060,
        lineHeight: 1.3,
        textAlign: "center" as const,
      }}>
        Ниць перед начальством!
      </div>
    </div>
  </div>
);

// ── Scene ─────────────────────────────────────────────────────────────────────
const FIG_SIZE  = 250;
const GROUND    = 840;
const STAND_TOP = GROUND - FIG_SIZE;
const KNEEL_AT  = 42;

const FIGURES = [
  { left: 790,  delay: 60  },
  { left: 950,  delay: 65  },
  { left: 1110, delay: 80 },
  { left: 1270, delay: 78  },
  { left: 1430, delay: 68  },
  { left: 1580, delay: 74 },
];

export const PowerScene: React.FC = () => {
  const frame = useCurrentFrame();

  const throneOp     = fade(frame, 0, 10);
  const kingOp       = fade(frame, 5, 25);
  const bubbleOp     = fade(frame, 38, 22);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Throne occupies left 1/3 — left margin 100px, width 640px */}
      <GrandThrone opacity={throneOp} style={{ left: 100, top: 100, width: 640, height: 740 }} />

      {/* King seated on throne */}
      <div style={{ position: "absolute", left: 290, top: 420, opacity: kingOp }}>
        <KingPencil size={310} />
      </div>

      {/* Speech bubble looms over all bowing figures */}
      <KingSpeechBubble opacity={bubbleOp} />

      {/* Ground line + earth hatching */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="earthHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={INK} strokeWidth="1.8" />
          </pattern>
          <linearGradient id="earthFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="earthMask">
            <rect x="0" y={GROUND} width="1920" height={1080 - GROUND} fill="url(#earthFade)" />
          </mask>
        </defs>
        {/* Horizon line */}
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={`${INK}55`} strokeWidth={3} opacity={fade(frame, 20, 25)} />
        {/* Hatched earth — dense at horizon, fades to nothing at bottom */}
        <rect
          x="0" y={GROUND} width="1920" height={1080 - GROUND}
          fill="url(#earthHatch)"
          fillOpacity={0.28}
          mask="url(#earthMask)"
          opacity={fade(frame, 20, 25)}
        />
      </svg>

      {/* Bowing people */}
      {FIGURES.map((f, i) => (
        <BowingPerson key={i} left={f.left} topStand={STAND_TOP} kneelAt={KNEEL_AT} delay={f.delay} figSize={FIG_SIZE} />
      ))}
    </AbsoluteFill>
  );
};
