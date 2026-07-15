import React from "react";
import { PredationPair } from "~/components";
import { FrogPencil, FishPencil, WormPencil } from "~/characters";

/** Lane: amphibian (frog) preys on a fish AND an invertebrate (worm). */
export const PairAmphibian: React.FC<{ y: number; delay?: number }> = ({ y, delay = 0 }) => (
  <PredationPair
    delay={delay}
    y={y}
    predatorRestX={720}
    preyX={1060}
    attackX={940}
    labelSize={26}
    labelWidth={340}
    predatorGap={120}
    preyGap={95}
    predatorLabel="Земноводне"
    preyLabel="Риба, безхребетне"
    renderPredator={(cx, cy) => <FrogPencil x={cx} y={cy} size={150} facing={1} moving={false} />}
    renderPrey={(hurt, _ff, x, yy) => (
      <>
        <FishPencil x={x} y={yy - 10} size={hurt ? 60 : 66} facing={-1} hurt={hurt} moving={!hurt} />
        <WormPencil x={x + 70} y={yy + 26} size={hurt ? 52 : 58} facing={-1} hurt={hurt} moving={!hurt} phase={1.2} />
      </>
    )}
  />
);
