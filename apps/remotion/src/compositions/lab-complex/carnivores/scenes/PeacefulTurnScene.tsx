import React from "react";
import { useCurrentFrame, interpolate, interpolateColors, AbsoluteFill } from "remotion";
import { Background, AnimatedText } from "~/components";
import { FrogPencil, Plant, Grass, Sun } from "~/characters";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes } from "../paper";

const GROUND = 760;
const CRITTERS = [
  { fromX: 360, toX: 360, phase: 0, sunBask: false },
  { fromX: 760, toX: 760, phase: 1.1, sunBask: false },
  { fromX: 1180, toX: 1480, phase: 2.0, sunBask: true }, // this one goes to the sun
];

export const PeacefulTurnScene: React.FC = () => {
  const frame = useCurrentFrame();
  // red predator → green peaceful
  const color = interpolateColors(frame, [40, 120], [colors.danger, colors.success]);
  const turned = frame >= 120;

  return (
    <Background gradientTo={colors.bgAlt}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 46 }}>
        <AnimatedText size={fontSizes.heading} delay={0} color={turned ? colors.success : colors.text} style={{ textShadow: "0 2px 12px #3a352e22" }}>
          {turned ? "…їдять траву або навіть сонце" : "Хижаки стають мирними"}
        </AnimatedText>
      </AbsoluteFill>

      <Sun x={1640} y={210} r={56} />

      <div style={{ position: "absolute", left: 0, top: GROUND, width: "100%", height: 320, background: colors.bgAlt }} />
      <Grass width={1920} y={GROUND} />
      {[200, 520, 760, 1020].map((px, i) => (
        <Plant key={i} x={px} y={GROUND + 6} phase={i} />
      ))}

      {CRITTERS.map((c, i) => {
        const y = interpolate(frame, [20, 110], [250, c.sunBask ? 360 : GROUND - 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = interpolate(frame, [20, 110], [c.fromX, c.toX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const basking = c.sunBask && turned;
        return (
          <React.Fragment key={i}>
            {basking ? (
              <div style={{ position: "absolute", left: x, top: y, width: 180, height: 180, marginLeft: -90, marginTop: -90, borderRadius: "50%", background: `radial-gradient(circle, ${colors.secondary}55, transparent 70%)`, opacity: fadeIn(frame, 120, 20) }} />
            ) : null}
            <FrogPencil x={x} y={y} size={110} color={color} phase={c.phase} moving={frame < 110} />
          </React.Fragment>
        );
      })}
    </Background>
  );
};
