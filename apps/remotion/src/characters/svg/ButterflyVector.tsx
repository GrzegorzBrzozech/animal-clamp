import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "~/theme";
import { Eye } from "./_parts";
import { drained, type CreatureProps } from "./types";

const VB_W = 100;
const VB_H = 96;
const BODY = "#2E2620";

/**
 * A front-view, code-drawn butterfly (insect prey). Wings flap; hurt = drooped
 * & drained. Vector counterpart to the downloaded Lottie "butterfly" — both are
 * kept; pick whichever fits a scene.
 */
export const ButterflyVector: React.FC<CreatureProps> = ({ x, y, size, facing = 1, hurt = false, phase = 0, moving = false }) => {
  const frame = useCurrentFrame();
  const t = frame * (moving ? 0.45 : 0.22) + phase;
  const flap = 0.5 + 0.5 * Math.abs(Math.sin(t)); // 0.5..1 perspective flap
  const wing = hurt ? drained : colors.secondary;
  const spot = hurt ? "#6E7872" : colors.danger;
  const width = size * (VB_W / VB_H);

  // flap squashes wings horizontally toward the body; hurt droops them down instead
  const wingTransform = hurt ? "rotate(20 50 32)" : `translate(50 0) scale(${flap} 1) translate(-50 0)`;

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* antennae */}
        <g stroke={BODY} strokeWidth={2.5} fill="none" strokeLinecap="round">
          <path d="M50 20 Q40 6 34 2" />
          <path d="M50 20 Q60 6 66 2" />
        </g>
        <circle cx={34} cy={2} r={3} fill={BODY} />
        <circle cx={66} cy={2} r={3} fill={BODY} />

        <g transform={wingTransform}>
          {/* upper wings */}
          <ellipse cx={28} cy={36} rx={24} ry={28} fill={wing} stroke="#00000022" strokeWidth={2} />
          <ellipse cx={72} cy={36} rx={24} ry={28} fill={wing} stroke="#00000022" strokeWidth={2} />
          {/* lower wings */}
          <ellipse cx={33} cy={70} rx={17} ry={20} fill={wing} opacity={0.92} stroke="#00000022" strokeWidth={2} />
          <ellipse cx={67} cy={70} rx={17} ry={20} fill={wing} opacity={0.92} stroke="#00000022" strokeWidth={2} />
          {/* spots */}
          <circle cx={28} cy={34} r={6} fill={spot} />
          <circle cx={72} cy={34} r={6} fill={spot} />
        </g>

        {/* body + head */}
        <ellipse cx={50} cy={52} rx={5} ry={30} fill={BODY} />
        <circle cx={50} cy={24} r={7} fill={BODY} />
        <Eye cx={46} cy={23} r={2.6} hurt={hurt} sclera={false} />
        <Eye cx={54} cy={23} r={2.6} hurt={hurt} sclera={false} />
      </svg>
    </div>
  );
};
