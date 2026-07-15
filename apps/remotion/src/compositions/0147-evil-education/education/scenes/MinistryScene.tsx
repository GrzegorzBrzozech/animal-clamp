import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, BuildingPencil, StampMark } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

const ITEMS = [
  { label: "перелік обов'язкових предметів", stampAt: 132 },
  { label: "стандарти освіти", stampAt: 188 },
  { label: "мінімальна кількість годин", stampAt: 205 },
];

const ChecklistRow: React.FC<{ label: string; stampAt: number; appearAt: number }> = ({ label, stampAt, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ fps, frame: frame - appearAt, config: { damping: 16 } });
  // Stamp thump: overshoot scale from big → 1.
  const st = spring({ fps, frame: frame - stampAt, config: { damping: 9, mass: 0.7 } });
  const stampScale = frame < stampAt ? 2.2 : interpolate(st, [0, 1], [2.2, 1]);
  const stampShown = frame >= stampAt;
  const shake = stampShown ? Math.sin((frame - stampAt) * 1.2) * Math.max(0, 1 - (frame - stampAt) / 8) * 4 : 0;
  const stamped = frame >= stampAt + 4;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.md,
        opacity: appear,
        transform: `translateX(${(1 - appear) * 40}px) translateX(${shake}px)`,
        background: colors.surface,
        border: `3px solid ${colors.border}`,
        borderRadius: 18,
        padding: "18px 26px",
        width: 720,
      }}
    >
      <div style={{ width: 64, height: 64, flexShrink: 0, position: "relative" }}>
        {stampShown ? (
          <div style={{ transform: `scale(${stampScale})`, transformOrigin: "center" }}>
            <StampMark size={64} color={colors.success} />
          </div>
        ) : (
          <div style={{ width: 64, height: 64, border: `4px solid ${colors.border}`, borderRadius: 12 }} />
        )}
      </div>
      <span
        style={{
          fontSize: fontSizes.body,
          fontWeight: fontWeights.bold,
          color: stamped ? colors.text : colors.textMuted,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const MinistryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const buildIn = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xl, padding: spacing.xl }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.md, opacity: buildIn, transform: `translateY(${(1 - buildIn) * 40}px)` }}>
          <BuildingPencil size={300} />
          <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.text, textAlign: "center", maxWidth: 340 }}>
            Міністерство освіти{"\n"}і науки
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={20} align="left" maxWidth={720}>
            затверджує програми
          </AnimatedText>
          {ITEMS.map((it, i) => (
            <ChecklistRow key={it.label} label={it.label} stampAt={it.stampAt} appearAt={40 + i * 20} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
