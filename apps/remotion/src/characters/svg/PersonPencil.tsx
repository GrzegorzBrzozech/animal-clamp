import React from "react";
import { INK, PAPER, PASTEL, PencilDefs, Part, Sketch, ROUGH_A } from "./_pencil";

const VB_W = 170;
const VB_H = 220;

export type PersonPose = "stand" | "megaphone" | "salute" | "present";

/**
 * Reusable pencil-on-paper PERSON (macket look): faceted figure with posable
 * arms. Faces right by default (`facing={-1}` mirrors). Poses:
 *   - "megaphone": one arm raised holding a megaphone (+ shout waves)
 *   - "salute": hand to the forehead
 *   - "present": arm extended forward (handing something over)
 * `color` tints the clothes (torso). `shout` opens the mouth. Deterministic.
 */
export const PersonPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  pose?: PersonPose;
  color?: string;
  shout?: boolean;
  tie?: boolean;
  style?: React.CSSProperties;
  /** Extra wave count for the megaphone (animate by passing a frame-derived n). */
  waves?: number;
}> = ({ size, facing = 1, pose = "stand", color = PASTEL.blue, shout = false, tie = false, style, waves = 3 }) => {
  const width = size * (VB_W / VB_H);

  // Shoulder anchors.
  const SR = "88,84";
  const SL = "42,84";

  const rightArm: Record<PersonPose, string> = {
    stand: "88,84 96,132",
    megaphone: "88,84 112,70 128,58",
    salute: "88,84 104,60 84,40",
    present: "88,84 118,96 140,96",
  };
  const leftArm: Record<PersonPose, string> = {
    stand: "42,84 34,132",
    megaphone: "42,84 34,128",
    salute: "42,84 34,128",
    present: "42,84 34,128",
  };
  const handR: Record<PersonPose, [number, number]> = {
    stand: [96, 132],
    megaphone: [128, 58],
    salute: [84, 40],
    present: [140, 96],
  };

  const [hrx, hry] = handR[pose];

  return (
    <div style={{ position: "relative", width, height: size, ...style }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible", transform: `scaleX(${facing})` }}>
        <PencilDefs scale={3.2} />

        {/* legs */}
        <Sketch width={5}>
          <polyline points="54,156 50,212" />
          <polyline points="80,156 84,212" />
        </Sketch>

        {/* torso (clothes) */}
        <Part width={5} hatch={{ gap: 6, color }}>
          <polygon points={`${SL} ${SR} 82,156 52,156`} />
        </Part>
        {tie ? (
          <Sketch width={3} stroke={INK}>
            <polygon points="63,86 73,86 68,124" />
          </Sketch>
        ) : null}

        {/* arms */}
        <Sketch width={5}>
          <polyline points={leftArm[pose]} />
          <polyline points={rightArm[pose]} />
        </Sketch>
        {/* hand */}
        <circle cx={hrx} cy={hry} r={6} fill={PAPER} stroke={INK} strokeWidth={4} />

        {/* head */}
        <Part width={5}>
          <circle cx={66} cy={44} r={26} />
        </Part>
        {/* face (facing right) */}
        <circle cx={74} cy={40} r={3} fill={INK} />
        <circle cx={86} cy={40} r={3} fill={INK} />
        {shout ? (
          <ellipse cx={82} cy={56} rx={7} ry={9} fill={INK} />
        ) : (
          <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
            <line x1={76} y1={56} x2={90} y2={56} />
          </g>
        )}

        {/* megaphone + shout waves */}
        {pose === "megaphone" ? (
          <>
            <Part width={4} hatch={{ gap: 5, cross: true, color: PASTEL.yellow, opacity: 0.7 }}>
              <polygon points="128,48 128,70 162,82 162,36" />
            </Part>
            <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
              {Array.from({ length: Math.max(0, waves) }).map((_, i) => (
                <path key={i} d={`M${170 + i * 12},${40 + i * 2} q10,19 0,38`} opacity={0.8 - i * 0.18} />
              ))}
            </g>
          </>
        ) : null}
      </svg>
    </div>
  );
};
