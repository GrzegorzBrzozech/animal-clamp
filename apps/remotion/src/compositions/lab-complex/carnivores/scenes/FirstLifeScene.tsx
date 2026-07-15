import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Background, Scene, AnimatedText } from "~/components";
import { Cell } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

export const FirstLifeScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Photon flies into the cell, which brightens.
  const photonX = interpolate(frame, [40, 80], [-420, -130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photonOpacity = interpolate(frame, [40, 78, 84], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Background>
      <Scene gap={spacing.lg}>
        <AnimatedText size={fontSizes.title} delay={0}>4 млрд років тому — перше життя</AnimatedText>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 320 }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(${photonX}px, -50%)`, fontSize: 70, opacity: photonOpacity }}>☀️</div>
          <div style={{ filter: `brightness(${1 + glow * 0.5})` }}>
            <Cell size={240} color={colors.success} />
          </div>
        </div>
        <AnimatedText size={fontSizes.body} color={colors.textMuted} delay={95}>
          добро = користь живому організму
        </AnimatedText>
      </Scene>
    </Background>
  );
};
