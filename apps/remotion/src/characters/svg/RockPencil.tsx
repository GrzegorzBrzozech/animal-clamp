import React from "react";
import { INK } from "./_pencil";

/** Lumpy blob, roughly unit radius — the base silhouette shared by rocks and tree crowns. */
export const ROCK_SHAPE: [number, number][] = [
  [-1, -0.15], [-0.55, -0.9], [0.15, -1], [0.7, -0.55],
  [1, 0.15], [0.55, 0.85], [-0.25, 1], [-0.9, 0.5],
];

export interface RockPencilProps {
  x: number;
  y: number;
  r: number;
}

/** A single pencil-style stone: light-to-dark shaded fill for volume, plus a ground shadow. */
export const RockPencil: React.FC<RockPencilProps> = ({ x, y, r }) => {
  const gradId = `rockShade-${React.useId().replace(/[:]/g, "")}`;
  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BAB0A0" />
          <stop offset="100%" stopColor="#726A5E" />
        </linearGradient>
      </defs>
      <ellipse cx={x} cy={y + r * 0.72} rx={r * 1.1} ry={r * 0.32} fill={INK} opacity={0.18} />
      <g transform={`translate(${x}, ${y}) scale(${r})`}>
        <polygon
          points={ROCK_SHAPE.map((p) => p.join(",")).join(" ")}
          fill={`url(#${gradId})`}
          stroke={INK}
          strokeWidth={3 / r}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
};
