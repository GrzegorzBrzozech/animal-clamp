import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PAPER, PencilDefs, Sketch, Part, Hatch } from "../_pencil";

const VB_W = 200;
const VB_H = 130;

/**
 * RatV1 — pencil-on-paper rat (macket "далекий предок"): faceted hunched body,
 * pointed snout, round ear, curling tail; hatched tone. Faces right.
 * `hurt` = victim state. Kept as a version — do not overwrite; add v2 alongside.
 */
export const RatV1: React.FC<CreatureProps & { color?: string }> = ({
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
  const t = hurt ? phase : frame * (moving ? 0.5 : 0.16) + phase;
  const step = hurt ? 0 : Math.sin(t * 2) * (moving ? 7 : 2.5);
  const tone = hurt ? "#9AA0A6" : (color ?? INK);
  const width = size * (VB_W / VB_H);
  const w = 4.4;

  const body = "46,86 40,66 52,50 90,46 120,54 128,82 90,92";
  const head = "118,54 170,68 174,78 150,86 122,82";

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3.2} />

        <Sketch width={3}>
          <polyline points="44,74 22,72 8,58 16,42 32,40" />
        </Sketch>

        <Part width={w}>
          <polygon points={`${62 - step},86 ${56 - step},110 ${68 - step},110 ${74},90`} />
        </Part>

        <Part width={w} hatch={{ gap: 7, color: tone }}>
          <polygon points={body} />
        </Part>
        <Hatch gap={4} cross color={tone} opacity={0.65}>
          <polygon points="50,82 126,82 110,92 60,92" />
        </Hatch>
        <g stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.7}>
          <line x1={66} y1={56} x2={70} y2={62} />
          <line x1={82} y1={52} x2={86} y2={58} />
          <line x1={98} y1={54} x2={102} y2={60} />
          <line x1={112} y1={60} x2={116} y2={66} />
        </g>

        <Part width={w}>
          <polygon points={`${118 + step},84 ${112 + step},110 ${124 + step},110 ${130},88`} />
        </Part>

        <Part width={w} hatch={{ gap: 7, color: tone }}>
          <polygon points={head} />
        </Part>

        <Part width={w} hatch={{ gap: 3, color: INK, opacity: 0.45 }}>
          <polygon points="128,52 122,34 144,42" />
        </Part>

        <circle cx={173} cy={77} r={3.5} fill={INK} />
        <g stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
          <line x1={171} y1={77} x2={150} y2={70} />
          <line x1={171} y1={78} x2={150} y2={85} />
        </g>

        {hurt ? (
          <g stroke={INK} strokeWidth={3} strokeLinecap="round">
            <line x1={136} y1={62} x2={146} y2={72} />
            <line x1={146} y1={62} x2={136} y2={72} />
          </g>
        ) : (
          <>
            <circle cx={141} cy={67} r={5.5} fill={INK} />
            <circle cx={143} cy={65} r={1.8} fill={PAPER} />
          </>
        )}
      </svg>
    </div>
  );
};
