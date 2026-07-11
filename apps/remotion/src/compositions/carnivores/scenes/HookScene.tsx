import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { BigNumber, TalkingHead } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const HookScene: React.FC = () => (
  <Background gradientTo={colors.bgAlt}>
    <Scene gap={spacing.md} align="flex-start" justify="center" style={{ paddingLeft: 140 }}>
      <AnimatedText size={fontSizes.heading} align="left" delay={0}>
        — Коли з'явилося <span style={{ color: colors.danger }}>зло</span>?
      </AnimatedText>
      <div style={{ display: "flex", gap: spacing.lg, alignItems: "baseline" }}>
        <BigNumber value={3.5} decimals={1} suffix=" млрд" color={colors.danger} size={120} delay={18} caption="років тому" />
      </div>
      <AnimatedText size={fontSizes.heading} align="left" delay={48}>
        — А <span style={{ color: colors.success }}>добро</span>?
      </AnimatedText>
      <BigNumber value={4} suffix=" млрд" color={colors.success} size={120} delay={62} caption="років тому" />
      <AnimatedText size={fontSizes.body} align="left" color={colors.secondary} delay={95}>
        То пів мільярда років був Едемський сад?!
      </AnimatedText>
    </Scene>
    <TalkingHead variant="pip" delay={6} />
  </Background>
);
