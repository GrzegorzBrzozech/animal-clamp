import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { montserrat } from "~/lib/fonts";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes, fontWeights, radii, spacing } from "~/theme";

const Pan: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: spacing.xs,
      background: colors.surface,
      border: `2px solid ${color}`,
      borderRadius: radii.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
      minWidth: 320,
    }}
  >
    <span
      style={{
        fontFamily: montserrat.fontFamily,
        fontSize: fontSizes.caption,
        color: colors.textMuted,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: montserrat.fontFamily,
        fontSize: fontSizes.heading,
        fontWeight: fontWeights.bold,
        color,
      }}
    >
      {value}
    </span>
  </div>
);

export const BalanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beam tilts when the narration reaches "коли ж одна сторона..." (~15s in).
  const tipStart = 15 * fps;
  const tilt = interpolate(frame, [tipStart, tipStart + 30], [0, -9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const verdictOpacity = fadeIn(frame, tipStart + 24, 20);
  const balanced = frame < tipStart;

  return (
    <Background>
      <Scene gap={spacing.lg}>
        <AnimatedText size={fontSizes.title} delay={0}>
          Балансовий рахунок
        </AnimatedText>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.xl,
            transform: `rotate(${tilt}deg)`,
            transformOrigin: "center",
          }}
        >
          <Pan label="Зробив для інших" value="＋" color={colors.success} />
          <div style={{ fontSize: 80, color: colors.textMuted }}>⚖️</div>
          <Pan label="Отримав натомість" value="－" color={colors.danger} />
        </div>

        <div
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: fontSizes.heading,
            fontWeight: fontWeights.bold,
            opacity: verdictOpacity,
            color: balanced ? colors.success : colors.danger,
          }}
        >
          {balanced ? "Баланс → дружба" : "Дисбаланс → розрив"}
        </div>
      </Scene>
    </Background>
  );
};
