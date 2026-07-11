import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, PagePencil, StampMark } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const SchoolNode: React.FC<{ x: number; icon: string; label: string; color: string; delay: number }> = ({ x, icon, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 210,
        transform: `translateX(-50%) scale(${s})`,
        opacity: s,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: colors.surface,
        border: `5px solid ${color}`,
        borderRadius: 22,
        padding: "22px 40px",
      }}
    >
      <div style={{ fontSize: 96 }}>{icon}</div>
      <div style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color }}>{label}</div>
    </div>
  );
};

export const DpaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [55, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const examIn = spring({ fps, frame: frame - 95, config: { damping: 14 } });
  const stampScale = frame < 130 ? 2.2 : interpolate(spring({ fps, frame: frame - 130, config: { damping: 9 } }), [0, 1], [2.2, 1]);
  const stampShown = frame >= 130;

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* converging arrows */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="dpa-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={colors.text} />
          </marker>
        </defs>
        {[
          { d: "M470,330 C560,560 780,600 900,690", },
          { d: "M1450,330 C1360,560 1140,600 1020,690" },
        ].map((a, i) => (
          <path
            key={i}
            d={a.d}
            fill="none"
            stroke={colors.text}
            strokeWidth={7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            markerEnd="url(#dpa-arrow)"
          />
        ))}
      </svg>

      <SchoolNode x={470} icon="🏫" label="приватна" color={colors.success} delay={5} />
      <SchoolNode x={1450} icon="🏛️" label="державна" color={colors.primary} delay={20} />

      {/* central exam sheet */}
      <div style={{ position: "absolute", left: 960, top: 760, transform: `translate(-50%,-50%) scale(${examIn})`, opacity: examIn }}>
        <div style={{ position: "relative" }}>
          <PagePencil size={300} lines={5} color="#E7D49C" />
          <div style={{ position: "absolute", top: 34, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 900, color: colors.text }}>ДПА</div>
          {stampShown ? (
            <div style={{ position: "absolute", right: -20, top: 90, transform: `scale(${stampScale})` }}>
              <StampMark size={120} color={colors.danger} label="ОДНА" />
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={150} slide={0} maxWidth="94%">
          ДПА — <span style={{ color: colors.danger }}>Одна-єдина, унітарна, неподільна</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
