import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, BuildingPencil, PersonPencil, HeadPencil } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

// Scene-local word timing (conclusion starts 76.70s):
//   "…міністерство визначає, що має знати учень"  ≈ f0–90   (minister shouts)
//   "а приватна школа знаходить найкращі шляхи"    ≈ f95–165 (teacher salutes)
//   "як доставити ці знання в конкретну голову"    ≈ f168–235 (knowledge → head)
const SALUTE_AT = 95;
const TURN_AT = 165;
const SEND_AT = 172;

const TOKENS = ["📚", "💡", "✏️"];
// teacher present-hand ≈ (1150,600) → head centre ≈ (1540,470)
const FROM = { x: 1150, y: 600 };
const TO = { x: 1540, y: 470 };

export const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const monIn = spring({ fps, frame, config: { damping: 14 } });
  const teacherIn = spring({ fps, frame: frame - 20, config: { damping: 14 } });
  const headIn = spring({ fps, frame: frame - 30, config: { damping: 14 } });

  const teacherPose = frame < SALUTE_AT ? "stand" : frame < TURN_AT ? "salute" : "present";
  const teacherFacing: 1 | -1 = frame < TURN_AT ? -1 : 1;

  const bubbleIn = spring({ fps, frame: frame - 10, config: { damping: 12 } });
  const bubbleOut = interpolate(frame, [84, 94], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const saluteAck = interpolate(frame, [SALUTE_AT + 8, SALUTE_AT + 20, TURN_AT - 5, TURN_AT], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const megaWaves = (Math.floor(frame / 6) % 3) + 1;
  const glow = interpolate(frame, [200, 235], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* ── ministry (left): building + minister shouting through a megaphone ── */}
      <div style={{ position: "absolute", left: 210, top: 300, transform: `translate(-50%,-50%) scale(${monIn})`, opacity: monIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <BuildingPencil size={180} />
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.primary, marginTop: 4 }}>міністерство</span>
      </div>
      <div style={{ position: "absolute", left: 910, top: 300, transform: `translate(-50%,-50%) scale(${monIn})`, opacity: monIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <BuildingPencil size={180} />
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.success, marginTop: 4 }}>приватна школа</span>
      </div>
      <div style={{ position: "absolute", left: 360, top: 640, transform: `translate(-50%,-50%) scale(${monIn})`, opacity: monIn, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <PersonPencil size={300} facing={1} pose="megaphone" color={colors.primary} tie shout waves={megaWaves} />
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.primary, marginTop: 4 }}>міністр</span>
      </div>

      {/* minister's shout bubble */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 360,
          transform: `translate(0,-50%) scale(${bubbleIn})`,
          opacity: bubbleIn * bubbleOut,
          background: colors.surface,
          border: `4px solid ${colors.primary}`,
          borderRadius: 20,
          padding: "16px 26px",
          fontSize: fontSizes.body,
          fontWeight: fontWeights.black,
          color: colors.text,
          whiteSpace: "nowrap",
        }}
      >ХАЙ ВИВЧЕ ЩО ТАКЕ ГЕОГРАФІЯ!<div style={{ position: "absolute", left: -18, top: "60%", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderRight: `18px solid ${colors.primary}` }} />
      </div>

      {/* ── private school (centre): teacher salutes, then delivers ── */}
      <div style={{ position: "absolute", left: 1050, top: 620, transform: `translate(-50%,-50%) scale(${teacherIn})`, opacity: teacherIn, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <PersonPencil size={300} facing={teacherFacing} pose={teacherPose} color={colors.success} />
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.success, marginTop: 4 }}>вчитель</span>
      </div>
      {/* salute acknowledgement */}
      <div style={{ position: "absolute", left: 980, top: 430, opacity: saluteAck, fontSize: 44, fontWeight: 900, color: colors.success }}>🫡</div>

      {/* ── student's head (right): receives the knowledge ── */}
      <div style={{ position: "absolute", left: 1560, top: 470, transform: `translate(-50%,-50%) scale(${headIn})`, opacity: headIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ filter: `drop-shadow(0 0 ${glow * 36}px #B07E2Baa)` }}>
          <HeadPencil size={300} openTop />
        </div>
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.text }}>учень</span>
      </div>

      {/* knowledge flying from teacher into the head */}
      <AbsoluteFill>
        {TOKENS.map((tk, i) => {
          const p = interpolate(frame, [SEND_AT + i * 18, SEND_AT + 44 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (p <= 0 || p >= 1) return null;
          const x = interpolate(p, [0, 1], [FROM.x, TO.x]);
          const y = interpolate(p, [0, 1], [FROM.y, TO.y]) - Math.sin(p * Math.PI) * 80; // arc
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontSize: 52, opacity: Math.sin(p * Math.PI) * 1.2 }}>
              {tk}
            </div>
          );
        })}
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={200} slide={0} maxWidth="94%">
          Міністерство — <span style={{ color: colors.primary }}>ЩО</span>, школа — <span style={{ color: colors.success }}>ЯК</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
