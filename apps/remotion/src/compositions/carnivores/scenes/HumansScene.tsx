import React from "react";
import { useCurrentFrame } from "remotion";
import { Background, AnimatedText } from "~/components";
import { TalkingHead } from "~/components";
import { fadeIn } from "~/lib/animations";
import { AbsoluteFill } from "remotion";
import { colors, fontSizes, radii, spacing } from "../paper";

const LowerThird: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 16);
  return (
    <div style={{ opacity, position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: spacing.md, background: colors.surface, border: `2px solid ${colors.border}`, borderRadius: radii.lg, padding: `${spacing.sm}px ${spacing.lg}px`, fontSize: 60 }}>
      {children}
    </div>
  );
};

export const HumansScene: React.FC = () => (
  <Background>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70 }}>
      <AnimatedText size={fontSizes.heading} delay={0}>Ті самі закони — на людях</AnimatedText>
    </AbsoluteFill>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
      <TalkingHead variant="full" delay={10} caption="Термодинаміка не перестає діяти, бо ми винайшли мораль." />
    </AbsoluteFill>
    <LowerThird delay={70}>
      <span>🧍</span><span style={{ fontSize: 40, color: colors.textMuted }}>проти</span><span>🐔🐄</span>
      <span style={{ width: 2, height: 50, background: colors.border, margin: `0 ${spacing.sm}px` }} />
      <span>🧍</span><span style={{ fontSize: 40, color: colors.danger }}>проти</span><span>🧍</span>
    </LowerThird>
  </Background>
);
