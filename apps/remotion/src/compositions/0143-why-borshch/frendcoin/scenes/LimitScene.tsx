import React from "react";
import { useCurrentFrame } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { montserrat } from "~/lib/fonts";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes, fontWeights, radii, spacing } from "~/theme";

const Contrast: React.FC<{
  icon: string;
  title: string;
  desc: string;
  color: string;
  delay: number;
}> = ({ icon, title, desc, color, delay }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, delay, 20);
  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.sm,
        background: colors.surface,
        border: `2px solid ${color}`,
        borderRadius: radii.lg,
        padding: spacing.lg,
        width: 460,
      }}
    >
      <div style={{ fontSize: 80 }}>{icon}</div>
      <div
        style={{
          fontFamily: montserrat.fontFamily,
          fontSize: fontSizes.heading,
          fontWeight: fontWeights.bold,
          color,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: montserrat.fontFamily,
          fontSize: fontSizes.caption,
          color: colors.textMuted,
          textAlign: "center",
        }}
      >
        {desc}
      </div>
    </div>
  );
};

export const LimitScene: React.FC = () => {
  return (
    <Background gradientTo={colors.bgAlt}>
      <Scene gap={spacing.lg}>
        <AnimatedText size={fontSizes.title} delay={0}>
          Чому не масштабується?
        </AnimatedText>

        <div style={{ display: "flex", gap: spacing.lg, marginTop: spacing.md }}>
          <Contrast
            icon="💵"
            title="Гроші"
            desc="універсальний курс для мільйонів незнайомців"
            color={colors.success}
            delay={24}
          />
          <Contrast
            icon="🤝"
            title="Frendcoin"
            desc="забезпечений лише особистою довірою"
            color={colors.secondary}
            delay={48}
          />
        </div>

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.semibold}
          color={colors.danger}
          delay={80}
        >
          Довіра не масштабується — звідси межа росту.
        </AnimatedText>
      </Scene>
    </Background>
  );
};
