import React from "react";
import { PredationPair } from "~/components";
import { RatPencil, ButterflyPencil } from "~/characters";

/** Lane: reptile/mammal (rat) preys on an insect (butterfly). */
export const PairMammal: React.FC<{ y: number; delay?: number }> = ({ y, delay = 0 }) => (
  <PredationPair
    delay={delay}
    y={y}
    predatorRestX={720}
    preyX={1060}
    attackX={940}
    labelSize={26}
    labelWidth={300}
    predatorGap={120}
    preyGap={95}
    predatorLabel="Ссавець"
    preyLabel="Комаха"
    renderPredator={(cx, cy) => <RatPencil x={cx} y={cy} size={150} facing={1} moving={false} />}
    renderPrey={(hurt, _ff, x, yy) => <ButterflyPencil x={x} y={yy} size={hurt ? 64 : 70} hurt={hurt} moving={!hurt} />}
  />
);
