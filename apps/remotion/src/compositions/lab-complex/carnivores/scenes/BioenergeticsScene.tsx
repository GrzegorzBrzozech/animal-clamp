import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { EnergyBalance, TalkingHead } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const BioenergeticsScene: React.FC = () => (
  <Background gradientTo={colors.bgAlt}>
    <Scene gap={spacing.lg} align="flex-start" style={{ paddingLeft: 140 }}>
      <AnimatedText size={fontSizes.title} align="left" delay={0}>Закон біоенергетики</AnimatedText>
      <EnergyBalance delay={24} />
      <AnimatedText size={fontSizes.caption} color={colors.textMuted} align="left" delay={90}>
        надлишок калорій → виживання гарантоване
      </AnimatedText>
    </Scene>
    <TalkingHead variant="pip" delay={6} />
  </Background>
);
