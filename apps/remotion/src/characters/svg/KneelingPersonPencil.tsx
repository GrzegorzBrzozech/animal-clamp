import React from "react";
import { INK, PAPER, PASTEL, PencilDefs, Part, Sketch, ROUGH_A } from "./_pencil";

const VB_W = 170;
const VB_H = 140; // shorter than standing 220 — figure is kneeling

/**
 * Kneeling pencil-on-paper PERSON (same visual style as PersonPencil): figure
 * bowing deeply forward on both knees. Faces right by default (`facing={-1}`
 * mirrors via scaleX to face left — toward a throne, authority figure, etc.).
 *
 * Sizing: for a figure that matches a PersonPencil of `standingSize`, pass
 *   size = standingSize * (140 / 220)
 * Width = size * (170/140) which equals standingSize * (170/220) — the same
 * pixel width as the standing figure, so both align side-by-side on a ground line.
 *
 * Ground contact points: y=132 in viewBox (shins resting on floor).
 */
export const KneelingPersonPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  color?: string;
}> = ({ size, facing = 1, color = PASTEL.blue }) => {
  const width = size * (VB_W / VB_H);

  return (
    <div style={{ position: "relative", width, height: size }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible", transform: `scaleX(${facing})` }}
      >
        <PencilDefs scale={3.2} />

        {/* ── Legs — thighs going up to hips, shins along ground ── */}
        <Sketch width={5}>
          <polyline points="60,106 118,132 50,132" />
          <polyline points="54,108 88,132 40,132" />
        </Sketch>

        {/* ── Torso — angled strongly forward, person bowing ── */}
        <Part width={5} hatch={{ gap: 6, color }}>
          <polygon points="58,88 120,72 120,98 58,114" />
        </Part>

        {/* ── Arms ── */}
        <Sketch width={5}>
          {/* Back arm (left, behind body) */}
          <polyline points="58,90 44,124" />
          {/* Front arm (right, reaching forward) */}
          <polyline points="120,76 140,108" />
        </Sketch>
        {/* Hand of front arm */}
        <circle cx={140} cy={108} r={6} fill={PAPER} stroke={INK} strokeWidth={4} />

        {/* ── Head — bowed forward at lower-right (facing right) ── */}
        {/* Head circle r=26, same as PersonPencil */}
        <Part width={5}>
          <circle cx={136} cy={100} r={26} />
        </Part>
        {/* Eyes — same relative offsets as PersonPencil (+8,−4) and (+20,−4) */}
        <circle cx={144} cy={96} r={3} fill={INK} />
        <circle cx={156} cy={96} r={3} fill={INK} />
        {/* Mouth — same relative offset (+10..+24, +12) as PersonPencil */}
        <g
          filter={`url(#${ROUGH_A})`}
          stroke={INK}
          strokeWidth={3.4}
          fill="none"
          strokeLinecap="round"
        >
          <line x1={146} y1={112} x2={160} y2={112} />
        </g>
      </svg>
    </div>
  );
};
