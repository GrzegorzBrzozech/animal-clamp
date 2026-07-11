import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { PayoffGraph } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const FrequencyPayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Caption flips from "вигідно" to "збитково" as the dot crosses zero.
  const loss = frame > 70;
  const captionOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Background gradientTo={colors.bgAlt}>
      <Scene gap={spacing.sm}>
        <AnimatedText size={fontSizes.title} delay={0}>Чому не всі — хижаки?</AnimatedText>
        <PayoffGraph delay={16} width={1180} height={560} />
        <div style={{ opacity: captionOpacity, fontSize: fontSizes.body, fontWeight: 700, color: loss ? colors.danger : colors.success }}>
          {loss ? "хижаків багато → працюємо в мінус" : "хижаків мало → вигода величезна"}
        </div>
      </Scene>
    </Background>
  );
};
