import React from "react";
import { INK, PAPER, PencilDefs, Part, Sketch } from "./_pencil";

/**
 * Pencil-style road barrier (шлагбаум).
 *
 * angle = -80 → boom points up   (open  — allows passage)
 * angle =   0 → boom horizontal  (closed — blocks passage)
 *
 * color: boom tint. Convention: green = open, red = closed.
 * size:  height in px; width scales at 2.6× (matches 520×200 viewBox ratio).
 */
export const BarrierPencil: React.FC<{
  size?: number;
  angle?: number;
  color?: string;
}> = ({ size = 200, angle = 0, color = "#C0392B" }) => {
  const w = size * 2.6;
  // viewBox matches NotSimpleScene's Barrier geometry exactly (pivot = 44,56)
  return (
    <svg viewBox="0 0 520 200" width={w} height={size} style={{ overflow: "visible" }}>
      <PencilDefs scale={2} />

      {/* Post — static, full pencil treatment */}
      <Part hatch={{ gap: 5, color: "#8B7355", opacity: 0.55 }}>
        <polygon points="18,40 44,40 44,190 18,190" />
      </Part>

      {/* Rotating boom + counterweight */}
      <g transform={`rotate(${angle} 44 56)`}>
        {/* Boom body — plain fill + Sketch outline so rotate works safely */}
        <rect x={44} y={44} width={440} height={26} rx={7} fill={color} opacity={0.82} />
        {/* White diagonal stripes */}
        {[70, 140, 210, 280, 350, 420].map((x) => (
          <rect key={x} x={x} y={44} width={34} height={26} fill={PAPER} opacity={0.78} />
        ))}
        <Sketch width={4.5}>
          <polygon points="44,44 484,44 484,70 44,70" />
        </Sketch>

        {/* Counterweight (left stub, heavier colour) */}
        <rect x={18} y={44} width={26} height={26} rx={4} fill={INK} opacity={0.55} />
        <Sketch width={3}>
          <polygon points="18,44 44,44 44,70 18,70" />
        </Sketch>
      </g>

      {/* Pivot disc — drawn last so it sits on top */}
      <circle cx={44} cy={56} r={13} fill={PAPER} stroke={INK} strokeWidth={5} />
    </svg>
  );
};
