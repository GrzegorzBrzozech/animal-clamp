import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PencilDefs, Part, Hatch, ROUGH_A } from "../_pencil";

const VB_W = 104;
const VB_H = 100;

/**
 * ButterflyV1 — pencil-on-paper butterfly (insect prey): front view, faceted
 * angular wings flap; hatched tone. Kept as a version — do not overwrite.
 */
export const ButterflyV1: React.FC<CreatureProps & { color?: string }> = ({
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
  const t = frame * (moving ? 0.45 : 0.22) + phase;
  const flap = hurt ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(t));
  const tone = hurt ? "#9AA0A6" : (color ?? INK);
  const width = size * (VB_W / VB_H);
  const wingPts = ["50,30 18,14 6,36 24,52 50,46", "54,30 86,14 98,36 80,52 54,46", "50,48 26,58 30,82 50,72", "54,48 78,58 74,82 54,72"];
  const w = 3.6;
  const wingTransform = hurt ? "rotate(18 52 34)" : `translate(52 0) scale(${flap} 1) translate(-52 0)`;

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={2.2} />
        <g stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" filter={`url(#${ROUGH_A})`}>
          <polyline points="52,22 42,8 36,4" />
          <polyline points="52,22 62,8 68,4" />
        </g>
        <circle cx={36} cy={4} r={3} fill={INK} />
        <circle cx={68} cy={4} r={3} fill={INK} />

        <g transform={wingTransform}>
          <Part width={w} hatch={{ gap: 5, color: tone }}>
            {wingPts.map((p, i) => (
              <polygon key={i} points={p} />
            ))}
          </Part>
          <Hatch gap={2.4} cross color={INK} opacity={0.85}>
            <circle cx={26} cy={34} r={6} />
            <circle cx={78} cy={34} r={6} />
          </Hatch>
        </g>

        <Part width={2} base={INK}>
          <polygon points="49,26 55,26 54,80 50,80" />
        </Part>
        <circle cx={52} cy={24} r={6} fill={INK} />
      </svg>
    </div>
  );
};
