import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const CliffhangerScene: React.FC = () => (
  <Background gradientTo={colors.bgAlt}>
    <Scene gap={spacing.md}>
      <AnimatedText size={fontSizes.caption} color={colors.textMuted} delay={0}>далі буде…</AnimatedText>
      <AnimatedText size={fontSizes.hero} weight={900} color={colors.secondary} delay={10}>
        Про це — у наступному відео!
      </AnimatedText>
    </Scene>
  </Background>
);
