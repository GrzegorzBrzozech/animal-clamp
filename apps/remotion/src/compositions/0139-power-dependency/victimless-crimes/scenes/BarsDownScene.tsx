import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PaperBackground, EmotivePerson, INK } from "~/characters";
import { colors, fontSizes, fontWeights } from "../paper";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp);

const BAR_COUNT = 9;
const BAR_W = 28;
const FRAME_W = 1920;
const FRAME_H = 1080;

const GROUND = 762;
const FIG_SIZE = 120;

export const BarsDownScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Bars drop fast from top (y offset goes from -FRAME_H to 0)
  const barsY = interpolate(frame, [0, 18], [-FRAME_H, 0], clamp);
  const barsShadow = interpolate(frame, [0, 18], [0, 1], clamp);

  // Sad faces arrive immediately as bars fall
  const sadProgress = interpolate(frame, [8, 28], [0, 1], clamp);
  const figOp = fade(frame, 0, 10);

  const textOp = fade(frame, 22, 20);

  const gap = (FRAME_W - BAR_COUNT * BAR_W) / (BAR_COUNT + 1);
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => gap + i * (gap + BAR_W));

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Figures behind bars */}
      <div style={{ position: "absolute", left: 660, top: GROUND - FIG_SIZE, opacity: figOp }}>
        <EmotivePerson size={FIG_SIZE} facing={1} sadProgress={sadProgress} />
      </div>
      <div style={{ position: "absolute", left: 870, top: GROUND - FIG_SIZE, opacity: figOp }}>
        <EmotivePerson size={FIG_SIZE} facing={-1} sadProgress={sadProgress} />
      </div>
      <div style={{ position: "absolute", left: 1080, top: GROUND - FIG_SIZE, opacity: figOp }}>
        <EmotivePerson size={FIG_SIZE} facing={1} sadProgress={sadProgress} />
      </div>

      {/* Ground */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: GROUND,
          width: FRAME_W,
          height: 4,
          background: `${INK}44`,
        }}
      />

      {/* Bars — SVG positioned over everything */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: barsY,
          width: FRAME_W,
          height: FRAME_H,
          pointerEvents: "none",
        }}
        viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      >
        {/* Drop shadow under bars */}
        <rect x={0} y={FRAME_H - 12} width={FRAME_W} height={12} fill={`${INK}${Math.round(barsShadow * 0.25 * 255).toString(16).padStart(2, "0")}`} />

        {/* Horizontal top bar */}
        <rect x={0} y={0} width={FRAME_W} height={48} fill={INK} />
        {/* Horizontal bottom bar */}
        <rect x={0} y={FRAME_H - 48} width={FRAME_W} height={48} fill={INK} />

        {/* Vertical bars */}
        {bars.map((x, i) => (
          <rect key={i} x={x} y={0} width={BAR_W} height={FRAME_H} fill={INK} />
        ))}
      </svg>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOp,
        }}
      >
        <span
          style={{
            fontSize: fontSizes.heading,
            fontWeight: fontWeights.black,
            color: "#EDE7D6",
            letterSpacing: 3,
            textShadow: "0 2px 8px #00000066",
          }}
        >
          Але{" "}
          <span style={{ color: colors.danger }}>держава</span>
          {" "}може посадити за грати
        </span>
      </div>
    </AbsoluteFill>
  );
};
