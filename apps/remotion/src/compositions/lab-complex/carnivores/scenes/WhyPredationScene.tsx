import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { TalkingHead } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const WhyPredationScene: React.FC = () => (
  <Background gradientTo={colors.bgAlt}>
    <Scene gap={spacing.lg} align="flex-start" style={{ paddingLeft: 140 }}>
      <AnimatedText size={fontSizes.heading} align="left" delay={0}>Хижацтво вигідне</AnimatedText>
      <div style={{ display: "flex", alignItems: "center", gap: spacing.md, flexWrap: "wrap" }}>
        <AnimatedText size={84} weight={900} color={colors.secondary} delay={20} slide={0}>ВИГОДА</AnimatedText>
        <AnimatedText size={84} weight={900} color={colors.textMuted} delay={32} slide={0}>=</AnimatedText>
        <AnimatedText size={84} weight={900} color={colors.success} delay={44} slide={0}>НАДБАННЯ</AnimatedText>
        <AnimatedText size={84} weight={900} color={colors.textMuted} delay={56} slide={0}>−</AnimatedText>
        <AnimatedText size={84} weight={900} color={colors.danger} delay={68} slide={0}>ЗУСИЛЛЯ</AnimatedText>
      </div>
    </Scene>
    <TalkingHead variant="pip" delay={6} />
  </Background>
);
