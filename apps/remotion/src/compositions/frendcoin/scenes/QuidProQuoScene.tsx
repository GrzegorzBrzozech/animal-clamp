import React from "react";
import { Background, Scene, AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "~/theme";

export const QuidProQuoScene: React.FC = () => {
  return (
    <Background gradientTo={colors.surface}>
      <Scene gap={spacing.md}>
        <div style={{ fontSize: 130 }}>🏛️</div>
        <AnimatedText size={fontSizes.caption} color={colors.textMuted} delay={6}>
          Найдавніший соціальний закон
        </AnimatedText>
        <AnimatedText
          size={fontSizes.hero}
          weight={fontWeights.black}
          color={colors.secondary}
          delay={16}
          style={{ fontStyle: "italic" }}
        >
          «quid pro quo»
        </AnimatedText>
        <AnimatedText size={fontSizes.body} delay={30}>
          послуга за послугу
        </AnimatedText>
      </Scene>
    </Background>
  );
};
