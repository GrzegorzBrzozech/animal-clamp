import React from "react";
import { useCurrentFrame } from "remotion";
import { Eye } from "./_parts";
import { drained, type CreatureProps } from "./types";

const VB_W = 138;
const VB_H = 52;
const SEGMENTS = 7;
const BODY = "#E0879F";
const BODY_DARK = "#C76A85";

/** A segmented worm (invertebrate prey). Head on the right; body undulates. */
export const Worm: React.FC<CreatureProps> = ({ x, y, size, facing = 1, hurt = false, phase = 0, moving = false }) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.32 : 0.16) + phase; // freeze when caught
  const amp = hurt ? 1.5 : 6;
  const body = hurt ? drained : BODY;
  const width = size * (VB_W / VB_H);

  const seg = (i: number) => {
    const cx = 16 + i * 17;
    const cy = 28 + Math.sin(t + i * 0.9) * amp;
    const r = 13 - (SEGMENTS - 1 - i) * 0.6; // head (right) slightly larger
    return { cx, cy, r };
  };

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size, transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const s = seg(i);
          return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={i % 2 ? BODY_DARK : body} stroke="#00000022" strokeWidth={1.5} />;
        })}
        {/* head detail on the rightmost segment */}
        {(() => {
          const h = seg(SEGMENTS - 1);
          return (
            <g>
              <Eye cx={h.cx + 2} cy={h.cy - 4} r={3.5} hurt={hurt} sclera={false} />
              <Eye cx={h.cx + 6} cy={h.cy + 3} r={3.5} hurt={hurt} sclera={false} />
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
