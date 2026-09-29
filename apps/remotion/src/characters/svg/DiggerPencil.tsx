import React from "react";
import { INK, PASTEL, PencilDefs, Part, ROUGH_A } from "./_pencil";
import { PersonPencil } from "./PersonPencil";

/**
 * A worker DIGGING — `PersonPencil` in the "present" pose with a shovel welded
 * to the outstretched hand, driven by a caller-supplied `swing` (0…1). Shared
 * because "labour = effort spent" turns up in every economics/history explainer.
 *
 * The stroke is VERTICAL, the way one actually digs: the shovel is hoisted clear
 * of the ground and then driven straight down into the pit. Only a few degrees
 * of tilt are mixed in so it doesn't look mechanical — it is deliberately NOT a
 * sideways pendulum swing.
 *
 * `swing` 0 → blade lifted above ground level; 1 → blade driven down into the pit.
 * Drive it from the frame, e.g. `0.5 - 0.5 * Math.cos(frame * 0.16)`.
 */

// PersonPencil viewBox geometry (canonical — see PersonPencil.tsx).
const VB_W = 170;
const VB_H = 220;
// pose="present" puts the right hand at viewBox (136, 95).
const HAND_VX = 136;
const HAND_VY = 95;

/** Blade travel above the resting position, as a fraction of `size`. */
const LIFT = 0.2;
/** Extra travel below the resting position (the blade sinking into the pit). */
const PLUNGE = 0.03;

export const DiggerPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  /** 0 = shovel raised, 1 = shovel driven down. */
  swing?: number;
  /** Coloured-pencil tint for the worker's clothes. */
  color?: string;
  /** Coloured-pencil tint for the shovel blade. */
  shovelColor?: string;
  style?: React.CSSProperties;
}> = ({ size, facing = 1, swing = 0, color = PASTEL.blue, shovelColor = PASTEL.gray, style }) => {
  const figW = size * (VB_W / VB_H);
  const handX = (HAND_VX / VB_W) * figW;
  const handY = (HAND_VY / VB_H) * size;

  // Shovel geometry, in figure pixels, measured from the hand.
  const shaft = size * 0.52;
  const bladeW = size * 0.11;
  const bladeH = size * 0.16;

  // The worker sinks a little into the stroke; the shovel carries that same
  // offset on top of its own travel, so the grip never leaves the hand.
  const dip = swing * size * 0.022;
  // VERTICAL travel: hoisted at swing 0, driven into the pit at swing 1.
  const dy = dip + (-LIFT + swing * (LIFT + PLUNGE)) * size;
  // A few degrees of tilt only — the motion itself is up/down, not a pendulum.
  const tilt = -7 + swing * 12;

  const tipX = handX;
  const tipY = handY + shaft;
  const shaftTopY = handY - size * 0.13;

  return (
    <div style={{ position: "relative", width: figW, height: size, ...style }}>
      <div style={{ transform: `translateY(${dip}px)` }}>
        <PersonPencil size={size} facing={facing} pose="present" color={color} />
      </div>

      <svg
        viewBox={`0 0 ${figW} ${size}`}
        width={figW}
        height={size}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
          transform: facing === -1 ? "scaleX(-1)" : undefined,
        }}
      >
        <PencilDefs scale={2.8} />
        <g transform={`translate(0 ${dy}) rotate(${tilt} ${handX} ${handY})`}>
          {/* shaft + T-grip (the shaft runs on past the hand, so the hand reads
              as sliding along it through the stroke).
              NOTE: the x's/y's differ on purpose — a perfectly vertical or
              horizontal line has a zero-area bbox and the objectBoundingBox
              pencil filter drops it silently. */}
          <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={size * 0.026} fill="none" strokeLinecap="round">
            <line x1={handX - size * 0.012} y1={shaftTopY} x2={tipX + size * 0.012} y2={tipY} />
            <line
              x1={handX - size * 0.05}
              y1={shaftTopY - size * 0.005}
              x2={handX + size * 0.05}
              y2={shaftTopY + size * 0.005}
            />
          </g>
          {/* blade */}
          <Part width={size * 0.02} hatch={{ gap: 5, color: shovelColor }}>
            <polygon
              points={`${tipX - bladeW},${tipY} ${tipX + bladeW},${tipY} ${tipX + bladeW * 0.7},${tipY + bladeH} ${tipX - bladeW * 0.7},${tipY + bladeH}`}
            />
          </Part>
        </g>
      </svg>
    </div>
  );
};
