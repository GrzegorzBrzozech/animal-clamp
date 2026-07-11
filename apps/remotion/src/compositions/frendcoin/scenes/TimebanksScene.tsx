import React from "react";
import { Background, Scene, AnimatedText, Card } from "~/components";
import { montserrat } from "~/lib/fonts";
import { colors, fontSizes, fontWeights, spacing } from "~/theme";

export const TimebanksScene: React.FC = () => {
  return (
    <Background>
      <Scene gap={spacing.lg}>
        <AnimatedText size={fontSizes.caption} color={colors.textMuted} delay={0}>
          Та сама ідея сьогодні
        </AnimatedText>
        <AnimatedText
          size={fontSizes.hero}
          weight={fontWeights.black}
          color={colors.primary}
          delay={10}
        >
          Timebanks
        </AnimatedText>

        <Card delay={28} style={{ width: 560 }}>
          <div style={{ fontSize: 90 }}>⏳</div>
          <div
            style={{
              fontFamily: montserrat.fontFamily,
              fontSize: fontSizes.body,
              fontWeight: fontWeights.semibold,
              color: colors.secondary,
            }}
          >
            «година за годину»
          </div>
        </Card>
      </Scene>
    </Background>
  );
};
