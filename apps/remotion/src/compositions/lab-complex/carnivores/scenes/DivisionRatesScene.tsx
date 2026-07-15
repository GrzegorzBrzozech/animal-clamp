import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { Background, AnimatedText } from "~/components";
import { fadeIn, popIn } from "~/lib/animations";
import { colors, fontSizes, radii, spacing } from "../paper";

/* ------------------------------------------------------------------ *
 * Timing (frames, relative to this scene's Sequence)                  *
 * ------------------------------------------------------------------ */
const LEGEND_HOLD = 70;
const LEGEND_FADE = 25;
const SIM_START = 95;
const SIM_END = 620;
const SIM_FRAMES = SIM_END - SIM_START;
const SUMMARY_START = 640;

/* ------------------------------------------------------------------ *
 * Biology — TRUE doubling over an 8-hour window.                      *
 *   Red  (E. coli):   doubles every 20 min → 2^(8h) = 2^24 cells.     *
 *   Blue (cyanobact): doubles every 8 h    → 2^1   = 2 cells.         *
 * 16.7M dots can't be drawn, so the dots are a representative sample  *
 * that fills the whole frame; the COUNTER shows the real number.      *
 * ------------------------------------------------------------------ */
const W = 1920;
const H = 1080;
const SIM_HOURS = 8;
const RED_FINAL = 2 ** ((SIM_HOURS * 60) / 20); // 16 777 216 — blue ends at 2

type Pt = { x: number; y: number };

// Two peaceful cells: founder present from the start, its single daughter
// buds at the 8-hour mark.
const BLUE_CELLS: Pt[] = [
  { x: W * 0.8, y: H * 0.52 },
  { x: W * 0.8 + 64, y: H * 0.52 + 44 },
];

/**
 * Build the red field: a lightly-jittered grid covering the WHOLE frame,
 * excluding any spot too close to a blue cell, ordered outward from the seed
 * so the colony visibly spreads. Grid spacing guarantees no overlaps.
 */
function buildRedField(seed: Pt, rngSeed: number): Pt[] {
  const SPACING = 40;
  const JITTER = 6;
  const BLUE_CLEAR = 64;
  let s = rngSeed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const pts: Pt[] = [];
  for (let y = SPACING; y <= H - SPACING; y += SPACING) {
    for (let x = SPACING; x <= W - SPACING; x += SPACING) {
      const px = x + (rnd() * 2 - 1) * JITTER;
      const py = y + (rnd() * 2 - 1) * JITTER;
      let ok = true;
      for (const b of BLUE_CELLS) {
        const dx = b.x - px;
        const dy = b.y - py;
        if (dx * dx + dy * dy < BLUE_CLEAR * BLUE_CLEAR) ok = false;
      }
      if (ok) pts.push({ x: px, y: py });
    }
  }
  const d2 = (a: Pt) => (a.x - seed.x) ** 2 + (a.y - seed.y) ** 2;
  pts.sort((a, b) => d2(a) - d2(b));
  return pts;
}

const RED_CELLS = buildRedField({ x: W * 0.4, y: H * 0.55 }, 7);
const RED_MAX = RED_CELLS.length;

// Accelerating fill: few cells early, exploding toward the end (convex growth),
// reaching full frame exactly at the 8-hour mark.
const redBirth = (i: number) =>
  SIM_START + Math.pow(i / RED_MAX, 0.6) * SIM_FRAMES;
const BLUE_BIRTH = [SIM_START, SIM_START + 0.95 * SIM_FRAMES];

const fmt = (n: number) =>
  Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* ------------------------------------------------------------------ */

const RedColony: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {RED_CELLS.map((c, i) => {
        const born = redBirth(i);
        if (frame < born) return null;
        const sc = spring({ frame: frame - born, fps, config: { damping: 12, mass: 0.4 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              boxSizing: "border-box",
              borderRadius: "50%",
              background: colors.danger,
              border: "2px solid #ffb0b0",
              transform: `scale(${sc})`,
            }}
          />
        );
      })}
    </>
  );
};

const BlueColony: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {BLUE_CELLS.map((c, i) => {
        if (frame < BLUE_BIRTH[i]) return null;
        const sc = spring({ frame: frame - BLUE_BIRTH[i], fps, config: { damping: 12, mass: 0.4 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: 34,
              height: 34,
              marginLeft: -17,
              marginTop: -17,
              boxSizing: "border-box",
              borderRadius: "50%",
              background: colors.primary,
              border: "3px solid #a8ccff",
              boxShadow: `0 0 16px ${colors.primary}, 0 0 0 4px ${colors.bg}`,
              transform: `scale(${sc})`,
            }}
          />
        );
      })}
    </>
  );
};

const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [SIM_START, SIM_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hours = progress * SIM_HOURS;
  const handAngle = (hours / 12) * 360;
  const R = 64;
  const hh = Math.floor(hours);
  const mm = Math.floor((hours - hh) * 60);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
      <svg width={R * 2 + 16} height={R * 2 + 16}>
        <circle cx={R + 8} cy={R + 8} r={R} fill={colors.surface} stroke={colors.border} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={R + 8 + Math.sin(a) * (R - 9)}
              y1={R + 8 - Math.cos(a) * (R - 9)}
              x2={R + 8 + Math.sin(a) * (R - 2)}
              y2={R + 8 - Math.cos(a) * (R - 2)}
              stroke={colors.textMuted}
              strokeWidth={2}
            />
          );
        })}
        <line
          x1={R + 8}
          y1={R + 8}
          x2={R + 8 + Math.sin((handAngle * Math.PI) / 180) * (R - 20)}
          y2={R + 8 - Math.cos((handAngle * Math.PI) / 180) * (R - 20)}
          stroke={colors.secondary}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={R + 8} cy={R + 8} r={6} fill={colors.secondary} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", textShadow: "0 2px 8px #3a352e22" }}>
        <span style={{ fontSize: 52, fontWeight: 900, color: colors.text }}>{hh} год</span>
        <span style={{ fontSize: 30, color: colors.textMuted }}>{String(mm).padStart(2, "0")} хв</span>
      </div>
    </div>
  );
};

const Tally: React.FC<{ value: string; label: string; color: string; big?: boolean }> = ({
  value,
  label,
  color,
  big,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: spacing.sm, textShadow: "0 2px 10px #3a352e22" }}>
    <div style={{ width: 24, height: 24, borderRadius: "50%", background: color, flexShrink: 0 }} />
    <span style={{ fontSize: big ? 64 : 30, fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    <span style={{ fontSize: 30, color: colors.textMuted }}>{label}</span>
  </div>
);

const LegendRow: React.FC<{ color: string; title: string; rate: string }> = ({ color, title, rate }) => (
  <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: color, boxShadow: `0 0 18px ${color}` }} />
    <span style={{ fontSize: fontSizes.body, fontWeight: 700, color: colors.text }}>{title}</span>
    <span style={{ fontSize: fontSizes.caption, color: colors.textMuted }}>поділ: {rate}</span>
  </div>
);

export const DivisionRatesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [SIM_START, SIM_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const realRed = Math.min(RED_FINAL, 2 ** (((progress * SIM_HOURS * 60) / 20)));
  const realBlue = frame >= BLUE_BIRTH[1] ? 2 : 1;

  const bigLegend = interpolate(frame, [0, 18, LEGEND_HOLD, LEGEND_HOLD + LEGEND_FADE], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const simOpacity = fadeIn(frame, SIM_START - 12, 18);
  const showSummary = frame >= SUMMARY_START;
  const summaryScale = popIn(frame, fps, SUMMARY_START, { damping: 14 });
  const sumRed = Math.min(RED_FINAL, 2 ** interpolate(frame, [SUMMARY_START, SUMMARY_START + 45], [0, 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <Background>
      {/* Red sea fills the WHOLE frame, behind every label */}
      <AbsoluteFill style={{ opacity: simOpacity }}>
        <RedColony />
        <BlueColony />
      </AbsoluteFill>

      {/* Top overlay: title, clock, live tallies (sit on top of the cells) */}
      <AbsoluteFill style={{ opacity: simOpacity, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 40, left: 60 }}>
          <Clock />
        </div>
        <div style={{ position: "absolute", top: 44, right: 60, display: "flex", flexDirection: "column", gap: spacing.sm, alignItems: "flex-end" }}>
          <Tally value={fmt(realRed)} label="хижаків" color={colors.danger} big />
          <Tally value={String(realBlue)} label="мирних" color={colors.primary} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 46 }}>
        <AnimatedText size={fontSizes.heading} delay={0} style={{ textShadow: "0 2px 12px #3a352e22" }}>
          Хижак росте швидше
        </AnimatedText>
      </AbsoluteFill>

      {/* Big intro legend (fades out before the field fills) */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: bigLegend }}>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.lg, background: colors.surface, border: `2px solid ${colors.border}`, borderRadius: radii.lg, padding: spacing.xl }}>
          <LegendRow color={colors.danger} title="Хижак · кишкова паличка" rate="кожні 20 хв" />
          <LegendRow color={colors.primary} title="Мирна · ціанобактерія" rate="кожні 8 год" />
        </div>
      </AbsoluteFill>

      {/* Final tally */}
      {showSummary ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "#0E1116dd" }}>
          <div
            style={{
              transform: `scale(${summaryScale})`,
              display: "flex",
              alignItems: "center",
              gap: spacing.xl,
              background: colors.surface,
              border: `2px solid ${colors.border}`,
              borderRadius: radii.lg,
              padding: `${spacing.lg}px ${spacing.xl}px`,
              boxShadow: "0 30px 80px #3a352e1f",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 120, fontWeight: 900, color: colors.danger, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {fmt(sumRed)}
              </span>
              <span style={{ fontSize: 34, color: colors.textMuted }}>хижаків</span>
            </div>
            <span style={{ fontSize: 60, color: colors.textMuted }}>проти</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 120, fontWeight: 900, color: colors.primary, lineHeight: 1 }}>2</span>
              <span style={{ fontSize: 34, color: colors.textMuted }}>мирних</span>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </Background>
  );
};
