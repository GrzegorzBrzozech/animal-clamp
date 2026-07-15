import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, AnimatedText } from "~/components";
import { colors, fontSizes } from "../../paper";

/** Title beat: the general thesis before the four concrete predation pairs. */
export const PredationIntroScene: React.FC = () => (
  <Background>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 160 }}>
      <AnimatedText size={fontSizes.title} color={colors.danger} delay={0} style={{ textAlign: "center", textShadow: "0 2px 12px #3a352e22" }}>
        Нові види з'являються як хижаки на вже існуючих
      </AnimatedText>
    </AbsoluteFill>
  </Background>
);
