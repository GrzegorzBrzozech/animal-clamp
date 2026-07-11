import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PAPER, PencilDefs, Part } from "../_pencil";

const VB_W = 150;
const VB_H = 56;
const SEGMENTS = 7;

/**
 * WormV1 — pencil-on-paper worm (invertebrate prey): occluding segmented body
 * that undulates; head on the right. Kept as a version — do not overwrite.
 */
export const WormV1: React.FC<CreatureProps & { color?: string }> = ({
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
  const t = hurt ? phase : frame * (moving ? 0.32 : 0.16) + phase;
  const amp = hurt ? 1.5 : 6;
  const tone = hurt ? "#9AA0A6" : (color ?? INK);
  const width = size * (VB_W / VB_H);

  const seg = (i: number) => ({
    cx: 18 + i * 18,
    cy: 30 + Math.sin(t + i * 0.9) * amp,
    r: 13 - (SEGMENTS - 1 - i) * 0.5,
  });
  const head = seg(SEGMENTS - 1);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={2} />
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const s = seg(i);
          return (
            <Part key={i} width={3.4} hatch={{ gap: 4, color: tone }}>
              <circle cx={s.cx} cy={s.cy} r={s.r} />
            </Part>
          );
        })}
        {hurt ? (
          <g stroke={INK} strokeWidth={2.2} strokeLinecap="round">
            <line x1={head.cx - 3} y1={head.cy - 6} x2={head.cx + 3} y2={head.cy} />
            <line x1={head.cx + 3} y1={head.cy - 6} x2={head.cx - 3} y2={head.cy} />
          </g>
        ) : (
          <>
            <circle cx={head.cx + 2} cy={head.cy - 4} r={2.4} fill={INK} />
            <circle cx={head.cx + 5} cy={head.cy + 3} r={2.4} fill={INK} />
            <circle cx={head.cx + 3} cy={head.cy - 5} r={0.8} fill={PAPER} />
          </>
        )}
      </svg>
    </div>
  );
};
