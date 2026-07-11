import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { Cell } from "~/components";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes, spacing } from "../paper";

const ExchangeArrow: React.FC<{ label: string; color: string; reverse?: boolean; delay: number; top: number }> = ({ label, color, reverse, delay, top }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 16);
  // a particle travels along the arrow
  const p = interpolate((frame - delay) % 45, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = reverse ? 1 - p : p;
  return (
    <div style={{ position: "absolute", top, left: 0, width: "100%", opacity }}>
      <div style={{ position: "relative", height: 60, display: "flex", alignItems: "center" }}>
        <div style={{ height: 4, width: "100%", background: `${color}66` }} />
        <span style={{ position: "absolute", left: `${x * 100}%`, transform: "translateX(-50%)", fontSize: 30 }}>{reverse ? "♻️" : "🍽️"}</span>
        <span style={{ position: "absolute", width: "100%", textAlign: "center", top: -38, color, fontSize: 26, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
};

export const SymbiosisScene: React.FC = () => (
  <Background gradientTo={colors.bgAlt}>
    <Scene gap={spacing.lg}>
      <AnimatedText size={fontSizes.title} color={colors.success} delay={0}>Симбіоз — це добро</AnimatedText>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 420, marginTop: spacing.md }}>
        <Cell size={230} color={colors.success} phase={0} label="бактерія А" />
        <Cell size={230} color={colors.primary} phase={2} label="бактерія Б" />
        <ExchangeArrow label="їжа →" color={colors.success} delay={30} top={70} />
        <ExchangeArrow label="← відходи" color={colors.primary} reverse delay={55} top={150} />
      </div>
      <AnimatedText size={fontSizes.body} color={colors.textMuted} delay={80}>
        синтрофія: відходи однієї — їжа для іншої
      </AnimatedText>
    </Scene>
  </Background>
);
