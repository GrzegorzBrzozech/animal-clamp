import React from "react";
import { PredationPair } from "~/components";
import { AmoebaPencil, PASTEL } from "~/characters";

/** Lane: multicellular (cell colony) preys on a single cell. */
export const PairMulticellular: React.FC<{ y: number; delay?: number }> = ({ y, delay = 0 }) => (
  <PredationPair
    delay={delay}
    y={y}
    predatorRestX={720}
    preyX={1060}
    attackX={940}
    labelSize={26}
    labelWidth={320}
    predatorGap={110}
    preyGap={85}
    predatorLabel="Багатоклітинний"
    preyLabel="Одноклітинний"
    renderPredator={(cx, cy) => (
      <>
        {/* a little colony of cells clustered together */}
        <AmoebaPencil x={cx - 34} y={cy + 18} size={96} color={PASTEL.green} phase={0.4} />
        <AmoebaPencil x={cx + 30} y={cy + 24} size={104} color={PASTEL.green} phase={1.1} />
        <AmoebaPencil x={cx} y={cy - 22} size={110} color={PASTEL.green} phase={2.0} />
      </>
    )}
    renderPrey={(hurt, _ff, x, yy) => <AmoebaPencil x={x} y={yy} size={hurt ? 62 : 74} color={PASTEL.pink} hurt={hurt} phase={0.7} />}
  />
);
