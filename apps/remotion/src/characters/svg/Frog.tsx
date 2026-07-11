import React from "react";
import { useCurrentFrame } from "remotion";
import { Eye } from "./_parts";
import { drained, type CreatureProps } from "./types";

const VB_W = 116;
const VB_H = 86;
const SKIN = "#5BBE6A";
const SKIN_DARK = "#3E9E52";

/** A squat frog/salamander (predator). Eyes bulge on top; wide mouth. */
export const Frog: React.FC<CreatureProps> = ({ x, y, size, facing = 1, hurt = false, phase = 0, moving = false }) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.35 : 0.13) + phase; // freeze when caught
  const breathe = 1 + Math.sin(t) * 0.04;
  const skin = hurt ? drained : SKIN;
  const skinDark = hurt ? "#6F7E73" : SKIN_DARK;
  const width = size * (VB_W / VB_H);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* hind feet */}
        <ellipse cx={26} cy={78} rx={16} ry={7} fill={skinDark} />
        <ellipse cx={90} cy={78} rx={16} ry={7} fill={skinDark} />
        <g transform={`translate(58 52) scale(1 ${breathe}) translate(-58 -52)`}>
          {/* body */}
          <ellipse cx={58} cy={50} rx={48} ry={28} fill={skin} />
          <ellipse cx={58} cy={60} rx={40} ry={16} fill="#ffffff22" />
          {/* wide mouth */}
          <path d="M22 50 Q58 70 94 50" fill="none" stroke={skinDark} strokeWidth={4} strokeLinecap="round" />
          {/* nostrils */}
          <circle cx={52} cy={34} r={2} fill={skinDark} />
          <circle cx={64} cy={34} r={2} fill={skinDark} />
        </g>
        {/* eye domes on top */}
        <circle cx={37} cy={20} r={16} fill={skin} />
        <circle cx={79} cy={20} r={16} fill={skin} />
        <Eye cx={37} cy={18} r={9} hurt={hurt} look={hurt ? 0 : 2} />
        <Eye cx={79} cy={18} r={9} hurt={hurt} look={hurt ? 0 : 2} />
      </svg>
    </div>
  );
};
