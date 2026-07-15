import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, PhotoPin, BigNumber } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const PROBLEMS = [
  { label: "не розуміли наказів", at: 180 },
  { label: "не могли читати карти", at: 230 },
  { label: "жодної лояльності до держави", at: 267 },
];

const Problem: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - at, config: { damping: 13 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: s, transform: `translateX(${(1 - s) * -26}px)` }}>
      <span style={{ fontSize: 40, color: colors.danger, fontWeight: 900 }}>✕</span>
      <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text }}>{label}</span>
    </div>
  );
};

export const DesertionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const noteOpacity = interpolate(frame, [80, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 460, top: 210, transform: "translateX(-50%)" }}>
        <PhotoPin src="projects/rothbard/00-18_prussian-military.jpg" width={620} height={660} delay={6} rotate={-2.5} caption="Прусська армія" />
      </div>

      <div style={{ position: "absolute", left: 1240, top: 380, transform: "translate(-50%,-50%)" }}>
        <BigNumber value={30} delay={30} suffix="%" size={220} color={colors.danger} caption="дезертирство" />
      </div>
      <div style={{ position: "absolute", left: 1240, top: 530, transform: "translateX(-50%)", opacity: noteOpacity, fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, textAlign: "center" }}>
        (не рахуючи СЗЧ)
      </div>

      <div style={{ position: "absolute", left: 900, top: 620, display: "flex", flexDirection: "column", gap: 22 }}>
        {PROBLEMS.map((p) => (
          <Problem key={p.label} label={p.label} at={p.at} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0}>
          Проблеми армії:
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
