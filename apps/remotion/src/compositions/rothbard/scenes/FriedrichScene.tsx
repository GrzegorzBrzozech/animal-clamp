import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PaperBackground, PagePencil, StampMark } from "~/characters";
import { INK } from "~/characters/svg/_pencil";
import { AnimatedText, PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

export const FriedrichScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pageIn = spring({ fps, frame: frame - 40, config: { damping: 14 } });
  const sign = interpolate(frame, [82, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampIn = spring({ fps, frame: frame - 115, config: { damping: 9, mass: 0.6 } });
  const commentIn = spring({ fps, frame: frame - 140, config: { damping: 12, mass: 0.5 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 460, top: 240, transform: "translateX(-50%)" }}>
        <PhotoPin src="projects/rothbard/00-10_friedrich-der-grosse.jpg" width={470} height={620} delay={6} rotate={-3} caption="Фрідріх Великий" />
      </div>

      {/* the law being signed */}
      <div style={{ position: "absolute", left: 1230, top: 470, transform: `translate(-50%,-50%) rotate(-4deg) scale(${pageIn})`, opacity: pageIn }}>
        <PagePencil size={330} lines={4} />
      </div>
      {/* signature scribble */}
      <svg viewBox="0 0 260 80" width={260} height={80} style={{ position: "absolute", left: 1150, top: 520, overflow: "visible", opacity: pageIn }}>
        <path
          d="M6,50 q20,-40 34,-4 q8,26 22,-2 q10,-24 26,6 q10,20 40,-16 q30,-30 60,10"
          fill="none"
          stroke={colors.primary}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`${sign * 300} 400`}
        />
      </svg>
      <div style={{ position: "absolute", left: 1260, top: 460, transform: `translate(-50%,-50%) rotate(12deg) scale(${stampIn})`, opacity: stampIn }}>
        <StampMark size={120} color={colors.danger} check />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="94%">
          Закон про{"\n"}<span style={{ color: colors.primary }}>обов'язкову освіту</span>
        </AnimatedText>
      </div>
      <div style={{ position: "absolute", left: 1230, top: 690, transform: "translate(-50%,-50%)", fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: INK, opacity: stampIn }}>
        1763
      </div>

      {/* YouTube comment — anachronistic joke */}
      <div style={{
        position: "absolute",
        left: 1140,
        bottom: 130,
        opacity: commentIn,
        transform: `scale(${commentIn}) rotate(-1.5deg)`,
        transformOrigin: "bottom left",
        background: "#ffffff",
        borderRadius: 14,
        padding: "18px 28px",
        boxShadow: "0 6px 28px #00000028",
        border: "1.5px solid #e0e0e0",
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
      }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#b0b0b0", flexShrink: 0 }} />
        <div style={{ fontFamily: "sans-serif" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#606060", marginBottom: 6 }}>@Friedrich_der_Große</div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#0f0f0f" }}>der erste, verdammt</div>
          <div style={{ fontSize: 20, color: "#909090", marginTop: 10 }}>👍 1 763 &nbsp;&nbsp; Відповісти</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
