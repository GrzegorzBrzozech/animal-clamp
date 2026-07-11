import React from "react";
import { useCurrentFrame } from "remotion";
import { Background, Scene, AnimatedText, Card } from "~/components";
import { montserrat } from "~/lib/fonts";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes, fontWeights, spacing } from "~/theme";

const ExchangeItem: React.FC<{ icon: string; label: string; delay: number }> = ({
  icon,
  label,
  delay,
}) => (
  <Card delay={delay} style={{ width: 360 }}>
    <div style={{ fontSize: 110 }}>{icon}</div>
    <div
      style={{
        fontFamily: montserrat.fontFamily,
        fontSize: fontSizes.body,
        fontWeight: fontWeights.semibold,
        color: colors.text,
        textAlign: "center",
      }}
    >
      {label}
    </div>
  </Card>
);

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const arrowOpacity = fadeIn(frame, 55, 18);

  return (
    <Background gradientTo={colors.bgAlt}>
      <Scene gap={spacing.lg}>
        <AnimatedText
          size={fontSizes.hero}
          weight={fontWeights.black}
          color={colors.primary}
          delay={0}
        >
          Frendcoin
        </AnimatedText>
        <AnimatedText size={fontSizes.body} color={colors.textMuted} delay={14}>
          система негрошових розрахунків між людьми
        </AnimatedText>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.lg,
            marginTop: spacing.md,
          }}
        >
          <ExchangeItem icon="🚗" label="Позичив машину" delay={30} />
          <div
            style={{
              fontSize: 90,
              color: colors.secondary,
              opacity: arrowOpacity,
            }}
          >
            ⇄
          </div>
          <ExchangeItem icon="🔧" label="Полагодив дах" delay={42} />
        </div>
      </Scene>
    </Background>
  );
};
