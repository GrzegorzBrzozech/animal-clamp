import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PAPER, PencilDefs, Part, Hatch, ROUGH_A } from "../_pencil";

const VB_W = 150;
const VB_H = 134;

/**
 * FrogV1 — pencil-on-paper frog (macket): faceted angular body, big round eyes,
 * hatched tone (graphite by default, optional `color`), breathes + blinks.
 * `hurt` = victim state. Kept as a version — do not overwrite; add v2 alongside.
 */
export const FrogV1: React.FC<CreatureProps & { color?: string }> = ({
  x,
  y,
  size,
  facing = 1,
  phase = 0,
  hurt = false,
  moving = false,
  color,
}) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.3 : 0.11) + phase;
  const breathe = hurt ? 1 : 1 + Math.sin(t) * 0.03;
  const blinkPhase = (frame + phase * 20) % 96;
  const blink = hurt ? 1 : blinkPhase < 5 ? 0.12 : 1;
  const tone = hurt ? "#9AA0A6" : (color ?? INK);
  const width = size * (VB_W / VB_H);
  const w = 4.6;

  const body = "30,92 44,62 58,52 92,52 106,62 120,92 100,118 50,118";

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3.4} />

        <Part width={w}>
          <polygon points="20,118 8,128 22,126 26,132 32,124 40,128 36,118" />
          <polygon points="130,118 142,128 128,126 124,132 118,124 110,128 114,118" />
        </Part>

        <g transform={`translate(75 90) scale(1 ${breathe}) translate(-75 -90)`}>
          <Part width={w}>
            <polygon points="34,86 16,104 46,112" />
            <polygon points="116,86 134,104 104,112" />
          </Part>

          <Part width={w} hatch={{ gap: 7, color: tone }}>
            <polygon points={body} />
          </Part>
          <Hatch gap={4} cross color={tone} opacity={0.7}>
            <polygon points="40,98 116,96 100,118 50,118" />
          </Hatch>
          <Hatch gap={2.4} cross color={INK} opacity={0.9}>
            <circle cx={52} cy={78} r={6} />
            <circle cx={48} cy={92} r={5} />
            <circle cx={62} cy={88} r={4} />
          </Hatch>
          <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="48,92 75,103 102,92" />
          </g>
          <circle cx={67} cy={70} r={2.4} fill={INK} />
          <circle cx={83} cy={70} r={2.4} fill={INK} />
        </g>

        <Part width={w}>
          <circle cx={52} cy={44} r={19} />
          <circle cx={98} cy={44} r={19} />
        </Part>
        {hurt ? (
          <g stroke={INK} strokeWidth={4} strokeLinecap="round">
            <line x1={45} y1={37} x2={59} y2={51} />
            <line x1={59} y1={37} x2={45} y2={51} />
            <line x1={91} y1={37} x2={105} y2={51} />
            <line x1={105} y1={37} x2={91} y2={51} />
          </g>
        ) : (
          <>
            <g transform={`translate(52 46) scale(1 ${blink}) translate(-52 -46)`}>
              <circle cx={52} cy={46} r={8.5} fill={INK} />
              <circle cx={55} cy={43} r={3} fill={PAPER} />
            </g>
            <g transform={`translate(98 46) scale(1 ${blink}) translate(-98 -46)`}>
              <circle cx={98} cy={46} r={8.5} fill={INK} />
              <circle cx={101} cy={43} r={3} fill={PAPER} />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};
