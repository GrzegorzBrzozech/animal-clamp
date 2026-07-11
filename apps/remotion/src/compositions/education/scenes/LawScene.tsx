import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, PagePencil } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

const YEARS = Array.from({ length: 12 }, (_, i) => i + 1);

const YearCell: React.FC<{ n: number; delay: number; isNew: boolean }> = ({ n, delay, isNew }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 13, mass: 0.5 } });
  const on = frame >= delay;
  return (
    <div
      style={{
        width: 88,
        height: 108,
        borderRadius: 14,
        border: `4px solid ${isNew ? colors.success : colors.primary}`,
        background: on ? (isNew ? "#4E8A5A22" : "#3E6E9E1A") : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 52,
        fontWeight: fontWeights.black,
        color: isNew ? colors.success : colors.text,
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
        opacity: on ? 1 : 0,
      }}
    >
      {n}
    </div>
  );
};

export const LawScene: React.FC = () => {
  const frame = useCurrentFrame();
  // "було 11" strike-through reveal
  const strike = interpolate(frame, [235, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: spacing.lg, padding: spacing.xl }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacing.lg }}>
          <div style={{ transform: "rotate(-4deg)" }}>
            <PagePencil size={210} lines={5} />
          </div>
          <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} align="left" maxWidth={760}>
            Закон «Про повну загальну{"\n"}середню освіту»
          </AnimatedText>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: spacing.sm }}>
          {YEARS.map((n) => (
            <YearCell key={n} n={n} delay={45 + n * 12} isNew={n === 12} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: spacing.md, marginTop: spacing.sm }}>
          <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={200} slide={0}>
            12 років у школі
          </AnimatedText>
          <div style={{ position: "relative", opacity: interpolate(frame, [210, 230], [0, 1], { extrapolateRight: "clamp" }) }}>
            <span style={{ fontSize: fontSizes.body, color: colors.textMuted, fontWeight: fontWeights.bold }}>було 11</span>
            <div
              style={{
                position: "absolute",
                left: -4,
                right: -4,
                top: "50%",
                height: 5,
                background: colors.danger,
                borderRadius: 3,
                transform: `scaleX(${strike})`,
                transformOrigin: "left",
              }}
            />
          </div>
          <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={260} slide={0} color={colors.success}>
            з 2027
          </AnimatedText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
