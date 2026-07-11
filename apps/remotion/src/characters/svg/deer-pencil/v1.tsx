import React from "react";
import { useCurrentFrame } from "remotion";
import { INK, PAPER, PencilDefs, Part, Hatch, ROUGH_A } from "../_pencil";

export type DeerPencilProps = {
  /** Feet anchor on the parent (px). */
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  /** Coloured-pencil tint; omit for pure graphite. */
  color?: string;
  /** "stand" = alive; "down" = taken down (rotated, ✖ eye, drained). */
  state?: "stand" | "down";
};

const VB_W = 210;
const VB_H = 200;

/**
 * DeerV1 — pencil-on-paper deer (macket "олень"): faceted body, thin angular
 * legs, branching antlers; hatched tone. Feet-anchored. Kept as a version — do
 * not overwrite; add v2 alongside.
 */
export const DeerV1: React.FC<DeerPencilProps> = ({ x, y, scale = 1, facing = 1, color, state = "stand" }) => {
  const frame = useCurrentFrame();
  const down = state === "down";
  const breathe = down ? 0 : Math.sin(frame * 0.12) * 1.4;
  const tone = down ? "#9AA0A6" : (color ?? INK);
  const w = 4.4;

  const body = "48,96 132,90 152,104 146,130 60,136 38,116";
  const neck = "130,98 158,56 178,62 150,114";
  const head = "160,54 196,62 192,78 162,78";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 210,
        height: 200,
        transform: `translate(-50%, -100%) scale(${scale}) scaleX(${facing}) rotate(${down ? 80 : 0}deg)`,
        transformOrigin: "bottom center",
        opacity: down ? 0.9 : 1,
      }}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={210} height={200} style={{ overflow: "visible", transform: `translateY(${breathe}px)` }}>
        <PencilDefs scale={3} />

        <g filter={`url(#${ROUGH_A})`} fill="none" stroke={INK} strokeWidth={w + 1.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="62,128 58,160 56,188" />
          <polyline points="80,130 84,160 84,188" />
          <polyline points="128,124 126,158 124,188" />
          <polyline points="146,122 150,158 152,188" />
        </g>

        <Part width={w}>
          <polygon points="48,100 36,96 44,114" />
        </Part>

        <Part width={w} hatch={{ gap: 7, color: tone }}>
          <polygon points={body} />
        </Part>
        <Hatch gap={4} cross color={tone} opacity={0.6}>
          <polygon points="60,118 146,118 146,130 60,136" />
        </Hatch>

        <Part width={w} hatch={{ gap: 7, color: tone }}>
          <polygon points={neck} />
        </Part>
        <Part width={w} hatch={{ gap: 7, color: tone }}>
          <polygon points={head} />
        </Part>

        <Part width={w}>
          <polygon points="166,56 158,40 178,50" />
        </Part>

        <g filter={`url(#${ROUGH_A})`} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="172,52 168,30 164,12" />
          <polyline points="169,34 156,26" />
          <polyline points="166,18 158,8" />
          <polyline points="182,52 188,30 194,10" />
          <polyline points="186,32 200,26" />
          <polyline points="191,20 200,8" />
        </g>

        <circle cx={193} cy={70} r={3} fill={INK} />

        {down ? (
          <g stroke={INK} strokeWidth={3} strokeLinecap="round">
            <line x1={172} y1={62} x2={182} y2={72} />
            <line x1={182} y1={62} x2={172} y2={72} />
          </g>
        ) : (
          <>
            <circle cx={178} cy={67} r={4.5} fill={INK} />
            <circle cx={180} cy={65} r={1.6} fill={PAPER} />
          </>
        )}
      </svg>
    </div>
  );
};
