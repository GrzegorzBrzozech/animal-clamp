import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "~/theme";
import { Eye } from "./_parts";
import { drained, type CreatureProps } from "./types";

const VB_W = 120;
const VB_H = 80;

/** A side-view fish (prey). Faces right by default; tail sways. */
export const Fish: React.FC<CreatureProps> = ({ x, y, size, facing = 1, hurt = false, phase = 0, moving = false }) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.3 : 0.14) + phase; // freeze when caught
  const tailSway = Math.sin(t) * (hurt ? 4 : 14);
  const body = hurt ? drained : colors.primary;
  const width = size * (VB_W / VB_H);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <g transform={hurt ? "rotate(8 60 40)" : undefined}>
          {/* tail */}
          <g transform={`rotate(${tailSway} 16 40)`}>
            <polygon points="20,40 -6,12 -6,68" fill={body} />
          </g>
          {/* fins */}
          <polygon points="48,18 76,18 60,2" fill={body} opacity={0.85} />
          <polygon points="48,62 72,62 58,76" fill={body} opacity={0.85} />
          {/* body */}
          <ellipse cx={58} cy={40} rx={46} ry={25} fill={body} />
          <ellipse cx={58} cy={48} rx={40} ry={14} fill="#ffffff22" />
          {/* gill */}
          <path d="M82 24 Q76 40 82 56" fill="none" stroke="#00000033" strokeWidth={3} />
          {/* eye + mouth */}
          <Eye cx={96} cy={33} r={6} hurt={hurt} look={hurt ? 0 : 1.5} />
          <path d="M104 46 q8 1 10 5" fill="none" stroke="#15181D" strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
