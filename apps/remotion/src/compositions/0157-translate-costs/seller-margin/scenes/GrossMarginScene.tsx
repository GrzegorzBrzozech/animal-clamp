import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, ReceiptCard } from "~/components";
import { fadeIn } from "~/lib/animations";
import { colors, fontWeights } from "../paper";

/**
 * 25–36 s · Концепція 2 — Валова маржа. Revision 3: the old crossfade-label
 * trick ("36–39% від закупівлі" → "26–28% від виручки") never actually
 * showed the math, so it read as an assertion, not a calculation. This
 * version shows the real division: 37 ÷ 137 = 27% — the same receipt, plus
 * the arithmetic that gets you from one % framing to the other.
 */
export const GrossMarginScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op1 = fadeIn(frame, 140, 14);
  const op2 = fadeIn(frame, 158, 14);
  const op3 = fadeIn(frame, 176, 14);
  const op4 = fadeIn(frame, 194, 14);
  const resultS = spring({ fps, frame: frame - 212, config: { damping: 12, mass: 0.7 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={58} weight={900} delay={10} color={colors.text}>
          Валова маржа: <span style={{ color: colors.secondary }}>26–28%</span>
        </AnimatedText>
      </div>

      <div style={{ position: "absolute", left: 170, top: 400 }}>
        <ReceiptCard
          header="АТБ-МАРКЕТ"
          delay={5}
          width={620}
          rotate={-1}
          rows={[
            { label: "Ціна на полиці", value: "137,00 грн", delay: 20 },
            { label: "Торгова націнка", value: "37,00 грн", delay: 40, color: colors.secondary },
          ]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 880,
          top: 420,
          display: "flex",
          alignItems: "baseline",
          gap: 22,
          fontWeight: fontWeights.bold,
        }}
      >
        <span style={{ fontSize: 66, color: colors.text, opacity: op1 }}>37грн</span>
        <span style={{ fontSize: 66, color: colors.textMuted, opacity: op2 }}>÷</span>
        <span style={{ fontSize: 66, color: colors.text, opacity: op3 }}>137грн </span>
        <span style={{ fontSize: 66, color: colors.textMuted, opacity: op4 }}>=</span>
        <span
          style={{
            fontSize: 150,
            fontWeight: fontWeights.black,
            color: colors.secondary,
            opacity: resultS,
            transform: `scale(${resultS})`,
            transformOrigin: "left center",
          }}
        >
          27%
        </span>
      </div>
    </AbsoluteFill>
  );
};
