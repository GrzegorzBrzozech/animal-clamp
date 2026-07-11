import React from "react";
import { PredationPair } from "~/components";
import { AmoebaPencil, PASTEL } from "~/characters";

/** Lane: eukaryote (amoeba) preys on a prokaryote (bacterium). */
export const PairEukaryote: React.FC<{ y: number; delay?: number }> = ({ y, delay = 0 }) => (
  <PredationPair
    delay={delay}
    y={y}
    predatorRestX={720}
    preyX={1060}
    attackX={940}
    labelSize={26}
    labelWidth={300}
    predatorGap={110}
    preyGap={85}
    predatorLabel="Еукаріот"
    preyLabel="Прокаріот"
    renderPredator={(cx, cy) => <AmoebaPencil x={cx} y={cy} size={156} color={PASTEL.blue} />}
    renderPrey={(hurt, _ff, x, yy) => <AmoebaPencil x={x} y={yy} size={hurt ? 66 : 78} color={PASTEL.pink} hurt={hurt} phase={1.5} />}
  />
);
