import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { Timeline } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const GoodTimelineScene: React.FC = () => (
  <Background>
    <Scene gap={spacing.xl}>
      <AnimatedText size={fontSizes.title} delay={0}>200 млн років миру</AnimatedText>
      <Timeline
        markers={[
          { at: 0.12, label: "4,0 млрд", sub: "життя", color: colors.success, delay: 10 },
          { at: 0.5, label: "3,7 млрд", sub: "симбіоз = добро", color: colors.success, delay: 40 },
        ]}
        zone={{ from: 0.12, to: 0.5, color: colors.success, delay: 55, label: "мир і злагода" }}
      />
    </Scene>
  </Background>
);
