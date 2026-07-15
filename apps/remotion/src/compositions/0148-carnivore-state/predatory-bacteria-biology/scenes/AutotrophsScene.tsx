import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, DoublingBadge } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const INPUTS = [
  { glyph: "🫧", label: "CO₂" },
  { glyph: "💧", label: "вода" },
  { glyph: "⛰", label: "мінерали" },
  { glyph: "🧪", label: "аміак" },
  { glyph: "☀️", label: "сонячне світло" },
];

export const AutotrophsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagIn = spring({ fps, frame: frame - 16, config: { damping: 13 } });
  // cell "будує все сам" assembles after the raw inputs are listed (~6s)
  const cellIn = spring({ fps, frame: frame - 185, config: { damping: 12, mass: 0.9 } });
  // slow "self-build" wobble to convey laborious synthesis
  const wobble = Math.sin(frame / 9) * 3;

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Ранг-тег */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 90,
          transform: `translateX(-50%) scale(${tagIn}) rotate(-2deg)`,
          opacity: tagIn,
          background: colors.secondary,
          color: "#FBF7EC",
          fontWeight: fontWeights.black,
          fontSize: 34,
          padding: "8px 24px",
          borderRadius: 12,
          boxShadow: "0 6px 16px #00000030",
        }}
      >
        🥉 найповільніші
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
        <AnimatedText
          size={fontSizes.heading}
          weight={fontWeights.black}
          delay={6}
          align="center"
          maxWidth="90%"
          style={{ margin: "0 auto" }}
        >
          Автотрофи — <span style={{ color: colors.secondary }}>усе роблять самі</span>
        </AnimatedText>
      </div>

      {/* Inputs → factory cell */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 360,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* raw inputs stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {INPUTS.map((it, i) => {
            const s = spring({ fps, frame: frame - (90 + i * 40), config: { damping: 14 } });
            return (
              <div
                key={it.label}
                style={{
                  transform: `scale(${s})`,
                  opacity: s,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#FBF7EC",
                  border: `2.5px solid ${colors.border}`,
                  borderRadius: 14,
                  padding: "12px 24px",
                  minWidth: 220,
                }}
              >
                <span style={{ fontSize: 44 }}>{it.glyph}</span>
                <span style={{ fontSize: 34, fontWeight: fontWeights.black, color: colors.text }}>{it.label}</span>
              </div>
            );
          })}
        </div>

        <span style={{ fontSize: 72, fontWeight: 900, color: colors.secondary, opacity: cellIn }}>→</span>

        {/* self-building cell */}
        <div
          style={{
            width: 390,
            height: 390,
            borderRadius: "50%",
            background: `${colors.secondary}18`,
            border: `6px solid ${colors.secondary}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${cellIn}) rotate(${wobble}deg)`,
            boxShadow: "0 10px 28px #00000022",
          }}
        >
          <span style={{ fontSize: 180 }}>🏗</span>
          <span style={{ fontSize: 30, fontWeight: fontWeights.black, color: colors.secondary, marginTop: 6 }}>
            будує все сам
          </span>
        </div>
      </div>

      {/* Doubling badges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 50,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <DoublingBadge time="10 год" label="Нітрозомонас — енергія з аміаку" color={colors.secondary} delay={250} size={58} />
        <DoublingBadge time="1 доба" label="Prochlorococcus — ціанобактерія" color={colors.secondary} delay={370} size={58} />
      </div>
    </AbsoluteFill>
  );
};
