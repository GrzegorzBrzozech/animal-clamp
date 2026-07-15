import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { INK, PAPER, PencilDefs, Sketch } from "./_pencil";

interface SeagullProps {
  /** World x of the seagull centre (CSS px on the 1920-wide canvas). */
  x: number;
  /** World y of the seagull centre (CSS px). */
  y: number;
  /** Uniform scale factor (default 1 = ~120 px wingspan at 1x). */
  scale?: number;
  /** Facing direction: 1 = right, -1 = left (default -1). */
  facing?: 1 | -1;
  /** Animation phase offset in seconds (so multiple seagulls don't flap in sync). */
  phase?: number;
}

/**
 * Simple pencil-style seagull. Wings flap on a 0.7 s loop.
 * Body is a small ellipse; wings are two bezier arcs that rise and fall.
 */
export const Seagull: React.FC<SeagullProps> = ({ x, y, scale = 1, facing = -1, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;

  // Wing-flap: -1 (up) → 0 (level) → 1 (down) oscillation
  const flap = Math.sin((t / 0.7) * Math.PI * 2);
  const wingY = flap * 22; // tip travels ±22 units up/down

  const W = 60; // half-wingspan
  const bx = 0, by = 0; // body centre
  const bodyRx = 16, bodyRy = 7;

  // Left wing tip (mirrored to right with facing flip)
  const lx1 = -W * 0.5, ly1 = wingY * 0.6;
  const lx2 = -W, ly2 = wingY;
  // Inner trailing edge
  const lx3 = -W * 0.35, ly3 = wingY * 0.3 + 10;

  // Right wing (mirror)
  const rx1 = W * 0.5, ry1 = wingY * 0.6;
  const rx2 = W, ry2 = wingY;
  const rx3 = W * 0.35, ry3 = wingY * 0.3 + 10;

  const leftWing = `M0,0 Q${lx1},${ly1} ${lx2},${ly2} Q${lx3},${ly3} 0,5 Z`;
  const rightWing = `M0,0 Q${rx1},${ry1} ${rx2},${ry2} Q${rx3},${ry3} 0,5 Z`;

  const sx = scale;
  const sy = scale;

  return (
    <svg
      style={{
        position: "absolute",
        left: x - W * sx,
        top: y - 40 * sy,
        width: W * 2 * sx,
        height: 80 * sy,
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox={`${-W} -40 ${W * 2} 80`}
    >
      <PencilDefs scale={1.8} />
      <g transform={`scale(${facing}, 1)`}>
        {/* body */}
        <Sketch fill={PAPER} width={3}>
          <ellipse cx={bx} cy={by} rx={bodyRx} ry={bodyRy} />
        </Sketch>
        {/* head */}
        <Sketch fill={PAPER} width={2.5}>
          <ellipse cx={bodyRx - 4} cy={by - 8} rx={9} ry={8} />
        </Sketch>
        {/* wings */}
        <Sketch fill={PAPER} width={3}>
          <path d={leftWing} />
        </Sketch>
        <Sketch fill={PAPER} width={3}>
          <path d={rightWing} />
        </Sketch>
        {/* eye */}
        <circle cx={bodyRx + 1} cy={by - 10} r={2} fill={INK} />
      </g>
    </svg>
  );
};
