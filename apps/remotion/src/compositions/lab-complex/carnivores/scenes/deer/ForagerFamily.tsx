import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { HominidPencil, Plant, Grass } from "~/characters";
import { fadeIn } from "~/lib/animations";
import { colors } from "../../paper";

const GROUND = 660;
const PLANTS = [120, 250, 380, 520, 650, 780];

/** Vegans: forever running around gathering tiny plants, never resting. */
export const ForagerFamily: React.FC = () => {
  const frame = useCurrentFrame();

  const hominidX = (i: number) => {
    const t = frame * 0.05 + i * 2.1;
    return 130 + (Math.sin(t) * 0.5 + 0.5) * 620;
  };
  const facing = (i: number): 1 | -1 => (Math.cos(frame * 0.05 + i * 2.1) >= 0 ? 1 : -1);

  const collected = Math.floor(frame / 6);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: GROUND, width: "100%", height: 200, background: colors.bgAlt }} />
      <Grass width={880} y={GROUND} />

      {/* plants blink out as they're picked, then regrow */}
      {PLANTS.map((px, i) => (
        <Plant key={i} x={px} y={GROUND + 4} phase={i} gone={(frame + i * 17) % 90 < 26} />
      ))}

      {[0, 1, 2].map((i) => {
        const x = hominidX(i);
        return (
          <React.Fragment key={i}>
            <HominidPencil x={x} y={GROUND + 4} scale={0.7} color={colors.success} facing={facing(i)} spear={false} hold="🌿" action="eat" phase={i * 1.7} />
            <div style={{ position: "absolute", left: x + 24, top: GROUND - 150, fontSize: 26 }}>💦</div>
          </React.Fragment>
        );
      })}

      <div style={{ position: "absolute", left: 24, top: 100, fontSize: 30, fontWeight: 800, color: colors.success }}>
        зібрано рослинок: {collected}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 24, width: "100%", textAlign: "center", fontSize: 34, fontWeight: 800, color: colors.text, opacity: fadeIn(frame, 30, 20) }}>
        збирають без упину
      </div>
    </AbsoluteFill>
  );
};
