import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { Cell, Timeline } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const PredationAppearsScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Predator lunges right toward prey; prey is consumed (shrinks + fades).
  const lunge = interpolate(frame, [60, 95], [0, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const preyScale = interpolate(frame, [85, 115], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const preyOpacity = interpolate(frame, [90, 115], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Background>
      <Scene gap={spacing.xl}>
        <AnimatedText size={fontSizes.title} color={colors.danger} delay={0}>3,5 млрд — перше зло</AnimatedText>
        <Timeline
          markers={[
            { at: 0.12, label: "4,0", color: colors.success, delay: 6 },
            { at: 0.4, label: "3,7", color: colors.success, delay: 14 },
            { at: 0.72, label: "3,5 млрд", sub: "хижацтво", color: colors.danger, delay: 30 },
          ]}
          width={1300}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 120, height: 280 }}>
          <div style={{ transform: `translateX(${lunge}px)` }}>
            <Cell size={230} color={colors.danger} hostile phase={0} label="хижак" />
          </div>
          <div style={{ transform: `scale(${preyScale})`, opacity: preyOpacity }}>
            <Cell size={190} color={colors.primary} phase={3} label="жертва" />
          </div>
        </div>
      </Scene>
    </Background>
  );
};
