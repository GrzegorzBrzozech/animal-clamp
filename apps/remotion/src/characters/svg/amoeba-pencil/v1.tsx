import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "../types";
import { INK, PAPER, PencilDefs, Part } from "../_pencil";

const VB = 180;

const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/**
 * AmoebaV1 — pencil-on-paper amoeba (macket "амеба"): a morphing lobed blob with
 * nucleus, vacuole, speckle and a satellite drop; hatched tone. The one rounded
 * character. Kept as a version — do not overwrite; add v2 alongside.
 */
export const AmoebaV1: React.FC<CreatureProps & { color?: string }> = ({ x, y, size, phase = 0, hurt = false, color }) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * 0.05 + phase;
  const tone = hurt ? "#9AA0A6" : (color ?? INK);

  const N = 14;
  const cx = 90;
  const cy = 88;
  const pts: number[][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const lobe = i % 2 === 0;
    const wob = Math.sin(t + i * 1.3) * 5;
    const rad = (lobe ? 62 : 44) + wob;
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  let d = `M ${mid(pts[N - 1], pts[0]).join(",")} `;
  for (let i = 0; i < N; i++) {
    const cur = pts[i];
    const m = mid(cur, pts[(i + 1) % N]);
    d += `Q ${cur[0]},${cur[1]} ${m[0]},${m[1]} `;
  }
  d += "Z";

  const dots = [
    [70, 60],
    [104, 64],
    [62, 96],
    [112, 100],
    [86, 116],
    [76, 78],
    [100, 82],
  ];

  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: "translate(-50%, -50%)" }}>
      <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3} />

        <Part width={4.6} hatch={{ gap: 7, color: tone }}>
          <path d={d} />
        </Part>

        {dots.map(([dx, dy], i) => (
          <circle key={i} cx={dx} cy={dy} r={i % 2 ? 1.8 : 2.6} fill={INK} opacity={0.5} />
        ))}

        <Part width={3.4}>
          <circle cx={108} cy={106} r={10} />
        </Part>

        <Part width={4}>
          <circle cx={84} cy={84} r={17} />
        </Part>
        {hurt ? (
          <g stroke={INK} strokeWidth={3} strokeLinecap="round">
            <line x1={77} y1={77} x2={91} y2={91} />
            <line x1={91} y1={77} x2={77} y2={91} />
          </g>
        ) : (
          <>
            <circle cx={84} cy={84} r={6} fill={INK} />
            <circle cx={87} cy={81} r={2} fill={PAPER} />
          </>
        )}

        <Part width={3.4} hatch={{ gap: 5, color: tone }}>
          <circle cx={150} cy={140} r={9} />
        </Part>
      </svg>
    </div>
  );
};
