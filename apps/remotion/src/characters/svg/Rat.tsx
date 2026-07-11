import React from "react";
import { useCurrentFrame } from "remotion";
import { Eye } from "./_parts";
import { drained, type CreatureProps } from "./types";

const VB_W = 154;
const VB_H = 96;
const FUR = "#9AA1AC";
const FUR_DARK = "#7E8590";
const PINK = "#E6A6B0";

/** A side-view rat (mammalian predator). Faces right; long curled tail, legs scuttle. */
export const Rat: React.FC<CreatureProps> = ({ x, y, size, facing = 1, hurt = false, phase = 0, moving = false }) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.5 : 0.16) + phase; // freeze when caught
  const step = Math.sin(t * 2) * (moving ? 6 : 2);
  const fur = hurt ? drained : FUR;
  const width = size * (VB_W / VB_H);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* tail */}
        <path d="M34 60 C2 64 6 22 30 26" fill="none" stroke={fur} strokeWidth={5} strokeLinecap="round" />
        {/* legs */}
        <rect x={56} y={74} width={7} height={16} rx={3} fill={FUR_DARK} transform={`rotate(${step} 59 74)`} />
        <rect x={96} y={74} width={7} height={16} rx={3} fill={FUR_DARK} transform={`rotate(${-step} 99 74)`} />
        {/* body */}
        <ellipse cx={72} cy={58} rx={48} ry={27} fill={fur} />
        {/* head */}
        <ellipse cx={116} cy={52} rx={25} ry={21} fill={fur} />
        {/* ear */}
        <circle cx={110} cy={30} r={12} fill={fur} />
        <circle cx={110} cy={30} r={6} fill={PINK} />
        {/* snout + nose */}
        <ellipse cx={138} cy={56} rx={10} ry={8} fill={fur} />
        <circle cx={146} cy={57} r={3.5} fill={hurt ? "#5B6168" : PINK} />
        {/* whiskers */}
        <g stroke="#ffffff66" strokeWidth={1.5}>
          <line x1={146} y1={57} x2={134} y2={50} />
          <line x1={146} y1={57} x2={134} y2={62} />
        </g>
        {/* eye */}
        <Eye cx={122} cy={47} r={5} hurt={hurt} look={hurt ? 0 : 1.5} />
      </svg>
    </div>
  );
};
