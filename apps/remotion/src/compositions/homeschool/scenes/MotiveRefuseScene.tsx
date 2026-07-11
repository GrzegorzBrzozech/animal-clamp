import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PaperBackground, BuildingPencil, PersonPencil } from "~/characters";
import { INK, PASTEL } from "~/characters/svg/_pencil";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const SCHOOL_X = 960;
const SCHOOL_Y = 570;
const CHILD_Y = 610;
// Child starts at school right edge; coins start at school left edge.
const CHILD_START_X = SCHOOL_X + 140;  // 1100
const COIN_START_X  = SCHOOL_X - 140;  // 820

// ─── DRIVER ──────────────────────────────────────────────────────────────────
// Positive driver  →  child moves right from right edge,  coins fly left from left edge.
//
// Timeline (30 fps, scene ~190 frames):
//   0   …25   school appears; child & coins at edges (driver = 0)
//   25  …70   child exits right (+250px → x=1350),  coins fly left (→ x=570)
//   70  …85   STOP — driver holds; child turns LEFT immediately
//   85  …120  child slowly drifts back (−170px → x=1180),  coins drift right (→ x=740)
//   120 …125  child turns RIGHT
//   125 …185  child runs right (+600px → x=1780),  coins fly far left (→ x=180)
// ─────────────────────────────────────────────────────────────────────────────

// Coin stream: each coin lags the "front" by a different factor,
// creating a natural scatter tail.
const COIN_DEFS = [
  { lag: 1.00, dy: -25, r: 27 },
  { lag: 0.80, dy:  20, r: 23 },
  { lag: 0.62, dy: -75, r: 21 },
  { lag: 0.46, dy:  45, r: 19 },
  { lag: 0.30, dy: -50, r: 17 },
];

const Coin: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={PASTEL.yellow} stroke={INK} strokeWidth={4} />
    <circle cx={cx} cy={cy} r={r * 0.7} fill="none" stroke={INK} strokeWidth={2} opacity={0.6} />
    <text x={cx} y={cy + r * 0.38} textAnchor="middle" fontSize={r * 0.9} fontWeight={900}
          fill={INK} fontFamily="Montserrat, sans-serif">₴</text>
  </g>
);

export const MotiveRefuseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const schoolIn = spring({ fps, frame, config: { damping: 14 } });

  // Single driver — distance both characters have moved away from their school edge
  const driver = interpolate(
    frame,
    [ 25,   70,   85,  120,  125,  185],
    [  0,  250,  250,   80,   80,  680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const childX = CHILD_START_X + driver;

  // Turn immediately when stopping (frame 70); turn right when running again (frame 125)
  const childFacing: 1 | -1 = frame >= 70 && frame < 125 ? -1 : 1;

  // Bob only while actually moving
  const isMoving =
    (frame >= 25 && frame < 70) ||
    (frame >= 85 && frame < 120) ||
    frame >= 125;
  const bob = isMoving ? Math.sin(frame * 0.75) * 5 : 0;

  // Coins fade in once child starts moving
  const coinOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* School — vertical center of screen */}
      <div style={{
        position: "absolute",
        left: SCHOOL_X,
        top: SCHOOL_Y,
        transform: `translate(-50%,-50%) scale(${schoolIn})`,
        opacity: schoolIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        <BuildingPencil size={280} />
        <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.primary }}>
          школа
        </span>
      </div>

      {/* Child — exits right, returns, then runs away */}
      <div style={{
        position: "absolute",
        left: childX,
        top: CHILD_Y,
        transform: `translate(-50%,-50%) translateY(${bob}px)`,
      }}>
        <PersonPencil size={190} facing={childFacing} color={colors.success} pose="stand" />
      </div>

      {/* Money stream — mirror of child, flies left */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g opacity={coinOpacity}>
          {COIN_DEFS.map((c, i) => (
            <Coin
              key={i}
              cx={COIN_START_X - driver * c.lag}
              cy={SCHOOL_Y + c.dy - 60}
              r={c.r}
            />
          ))}
        </g>
      </svg>

      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={4} slide={0} maxWidth="92%">
          Менше учнів — <span style={{ color: colors.danger }}>менше грошей</span>
        </AnimatedText>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 160, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={70} slide={0} color={colors.textMuted}>
          Чекайте, а як же безплатність?! Це шо, і тут капіталізм?!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
