import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Background, AnimatedText } from "~/components";
import { colors, fontSizes } from "../paper";
import { PairEukaryote } from "./predation/PairEukaryote";
import { PairMulticellular } from "./predation/PairMulticellular";
import { PairAmphibian } from "./predation/PairAmphibian";
import { PairMammal } from "./predation/PairMammal";

/**
 * The four predation pairs as ONE accumulating block. Each lane switches on at
 * its own `atSec` (seconds after this scene starts — aligned to when the
 * narration names it) and then STAYS, so the pairs pile up and only clear when
 * the whole scene ends. Tweak a pair's entrance by editing its `atSec`; move the
 * whole block via `predationChase.startSec` in plan.ts.
 */
const LANES = [
  { Comp: PairEukaryote, y: 300, atSec: 5.74 }, // "Еукаріоти полюють на прокаріот"
  { Comp: PairMulticellular, y: 478, atSec: 8.08 }, // "...багатоклітинні — на одноклітинні"
  { Comp: PairAmphibian, y: 656, atSec: 11.24 }, // "земноводні хапають...безхребетних"
  { Comp: PairMammal, y: 834, atSec: 14.52 }, // "ссавці...мисливці на комах"
];

export const PredationChaseScene: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Background>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 24 }}>
        <AnimatedText size={fontSizes.heading - 6} color={colors.danger} delay={0} style={{ textShadow: "0 2px 12px #3a352e22" }}>
          Нові види з'являються як хижаки
        </AnimatedText>
      </AbsoluteFill>

      {LANES.map((lane, i) => {
        const Comp = lane.Comp;
        return <Comp key={i} y={lane.y} delay={Math.round(lane.atSec * fps)} />;
      })}
    </Background>
  );
};
