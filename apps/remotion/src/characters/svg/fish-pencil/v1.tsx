import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PAPER, PencilDefs, Part, Hatch } from "../_pencil";

const VB_W = 130;
const VB_H = 86;

/**
 * FishV1 — pencil-on-paper fish (prey): faceted body, triangular tail, fins;
 * hatched tone, tail sways. Faces right. Kept as a version — do not overwrite.
 */
export const FishV1: React.FC<CreatureProps & { color?: string }> = ({
  x,
  y,
  size,
  facing = 1,
  hurt = false,
  phase = 0,
  moving = false,
  color,
}) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.3 : 0.14) + phase;
  const sway = Math.sin(t) * (hurt ? 4 : 13);
  const tone = hurt ? "#9AA0A6" : (color ?? INK);
  const width = size * (VB_W / VB_H);
  const w = 4;

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={2.4} />
        <g transform={hurt ? "rotate(8 65 43)" : undefined}>
          <g transform={`rotate(${sway} 30 43)`}>
            <Part width={w} hatch={{ gap: 5, color: tone }}>
              <polygon points="30,43 4,18 8,68" />
            </Part>
          </g>
          <Part width={w}>
            <polygon points="56,22 84,22 66,6" />
            <polygon points="56,64 80,64 64,78" />
          </Part>
          <Part width={w} hatch={{ gap: 5.5, color: tone }}>
            <polygon points="28,42 60,22 100,30 116,44 100,58 60,64" />
          </Part>
          <Hatch gap={3.5} cross color={tone} opacity={0.6}>
            <polygon points="28,42 60,52 100,46 100,58 60,64" />
          </Hatch>
          <g stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round">
            <polyline points="92,30 86,44 92,58" />
          </g>
          {hurt ? (
            <g stroke={INK} strokeWidth={2.6} strokeLinecap="round">
              <line x1={100} y1={36} x2={108} y2={44} />
              <line x1={108} y1={36} x2={100} y2={44} />
            </g>
          ) : (
            <>
              <circle cx={104} cy={40} r={4.5} fill={INK} />
              <circle cx={106} cy={38} r={1.5} fill={PAPER} />
            </>
          )}
          <line x1={112} y1={48} x2={120} y2={50} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
