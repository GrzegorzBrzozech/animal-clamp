import React from "react";
import { INK, PAPER, PASTEL, PencilDefs, Part, Sketch, Hatch, ROUGH_A } from "../_pencil";
import type { WomanPencilProps, WomanPose } from "./types";

const VB_W = 190;
const VB_H = 220;

/** Body landmarks — narrow shoulders → cinched waist → bell hem (hourglass). */
const SL = "74,84"; // left shoulder
const SR = "116,84"; // right shoulder
const BODICE = `${SL} ${SR} 106,126 84,126`;
const SKIRT = "84,124 106,124 140,196 128,202 95,197 62,202 50,196";
/** Long hair: faceted mantle behind the head with a notch left open for the face. */
const HAIR =
  "95,11 108,13 120,21 130,44 132,78 126,116 112,132 100,124 106,74 100,56 90,56 84,74 90,124 78,132 64,116 58,78 60,44 70,21 82,13";
/** Side-swept bangs drawn OVER the skull — hairline dips to the left, well above the eyes. */
const FRINGE = "71,46 76,24 95,13 114,24 120,36 105,33 90,38 80,44";

/**
 * Reusable pencil-on-paper WOMAN (macket look) — the standard female figure
 * next to `PersonPencil`. Same graphite/faceted language, explicitly feminine
 * silhouette: narrow shoulders, cinched waist and a bell-shaped dress whose hem
 * hides the legs (only ankles + shoes peek out, so she lands on the same
 * ground line as `PersonPencil`), long faceted hair falling past the shoulders,
 * round lashed eyes and a hint of blush.
 *
 * Faces right by default (`facing={-1}` mirrors). `color` tints the dress,
 * `hairColor` the hair. Poses: "stand", "present" (arm extended forward).
 * Props mirror `PersonPencil` (`size, facing, pose, color, style`) so she is a
 * drop-in replacement. Deterministic — no state, no randomness.
 */
export const WomanV1: React.FC<WomanPencilProps> = ({
  size,
  facing = 1,
  pose = "stand",
  color = PASTEL.pink,
  hairColor = INK,
  style,
}) => {
  const width = size * (VB_W / VB_H);

  // Arms are occluding <Part>s (tapered strips), not bare strokes, so they read
  // cleanly on top of the hair that falls past the shoulders.
  const rightArm: Record<WomanPose, string> = {
    stand: "112,86 120,88 130,138 121,140",
    present: "112,86 118,94 150,98 168,99 168,109 148,108 113,97",
  };
  const handR: Record<WomanPose, [number, number]> = {
    stand: [126, 143],
    present: [171, 104],
  };
  const [hrx, hry] = handR[pose];

  return (
    <div style={{ position: "relative", width, height: size, ...style }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible", transform: `scaleX(${facing})` }}
      >
        <PencilDefs scale={3.2} />

        {/* ── back-to-front ─────────────────────────────────────────────── */}

        {/* long hair, behind the body — the bodice/head knock out what's over them */}
        {/* steep hatch angle = strands falling with the hair, not a lattice */}
        <Part width={4.6} hatch={{ gap: 4, angle: -72, color: hairColor, opacity: 0.7 }}>
          <polygon points={HAIR} />
        </Part>

        {/* ankles + shoes, behind the hem */}
        <Sketch width={4.5}>
          <polyline points="87,188 84,205" />
          <polyline points="103,188 106,205" />
        </Sketch>
        <Part width={4} hatch={{ gap: 4, color: INK, opacity: 0.55 }}>
          <polygon points="80,204 88,204 90,212 74,212" />
          <polygon points="102,204 110,204 116,212 100,212" />
        </Part>

        {/* skirt — bell/A-line, hem hides the legs */}
        <Part width={5} hatch={{ gap: 6, color }}>
          <polygon points={SKIRT} />
        </Part>
        {/* fold shading on the shaded flank + two fold creases */}
        <Hatch gap={4} cross color={color} opacity={0.55}>
          <polygon points="84,126 93,126 66,199 52,196" />
        </Hatch>
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6}>
          <polyline points="89,132 75,190" />
          <polyline points="101,132 115,190" />
        </g>

        {/* bodice — narrows to the waist */}
        <Part width={5} hatch={{ gap: 5, cross: true, color, opacity: 0.8 }}>
          <polygon points={BODICE} />
        </Part>
        {/* waist belt + V-neck (endpoints offset so the group keeps a non-zero bbox) */}
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
          <polyline points="84,123 106,125" />
          <polyline points="84,85 95,97 106,85" />
        </g>

        {/* arms — occluding parts, so the hair behind them is knocked out */}
        <Part width={4.4}>
          <polygon points="78,86 70,88 60,138 69,140" />
        </Part>
        <Part width={4.4}>
          <polygon points={rightArm[pose]} />
        </Part>
        <circle cx={64} cy={143} r={5.5} fill={PAPER} stroke={INK} strokeWidth={3.6} />
        <circle cx={hrx} cy={hry} r={5.5} fill={PAPER} stroke={INK} strokeWidth={3.6} />

        {/* head — occludes the hair over the face */}
        <Part width={5}>
          <circle cx={95} cy={47} r={25} />
        </Part>

        {/* bangs over the skull */}
        <Part width={3.6} hatch={{ gap: 3.5, angle: -60, color: hairColor, opacity: 0.7 }}>
          <polygon points={FRINGE} />
        </Part>

        {/* blush on the cheek */}
        <Hatch gap={5} color={PASTEL.pink} opacity={0.55}>
          <polygon points="101,57 111,56 109,63 102,63" />
        </Hatch>

        {/* big round eyes: INK pupil + PAPER glint, plus a lash (facing right) */}
        <circle cx={95} cy={51} r={4.4} fill={INK} />
        <circle cx={109} cy={51} r={4.2} fill={INK} />
        <circle cx={93.4} cy={49.4} r={1.5} fill={PAPER} />
        <circle cx={107.5} cy={49.5} r={1.4} fill={PAPER} />
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
          {/* one lash on the outer corner of each eye */}
          <polyline points="91,48 87,45" />
          <polyline points="113,47 117,44" />
        </g>

        {/* gentle smile */}
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M96,62 q6,5 11,-2" />
        </g>
      </svg>
    </div>
  );
};
