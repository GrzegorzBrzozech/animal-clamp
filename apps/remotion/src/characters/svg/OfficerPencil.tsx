import React from "react";
import { INK, PASTEL, PencilDefs, Part, Sketch } from "./_pencil";
import { PersonPencil, type PersonPose } from "./PersonPencil";

/** Dark navy — recognisable police uniform colour. */
const OFFICER_BLUE = "#3E6E9E";

// ── Accessories (local, not exported) ────────────────────────────────────────

/**
 * Peaked police cap, front view.
 * Crown: gentle trapezoid — bottom ≈ head width, top ≈ 15% wider.
 * Brim: wider horizontal bar that overhangs on both sides.
 */
const PoliceCap: React.FC<{ size: number }> = ({ size }) => {
  const w = Math.round(size * 2.6);
  return (
    <svg width={w} height={size} viewBox="0 0 78 30" style={{ overflow: "visible" }}>
      <PencilDefs scale={2} />
      {/* crown — bottom 52 u (≈ head width), top 60 u (≈ 15% wider) */}
      <Part hatch={{ gap: 4, color: OFFICER_BLUE, opacity: 0.9 }}>
        <polygon points="9,3 69,3 65,22 13,22" />
      </Part>
      {/* brim overhangs the crown on both sides */}
      <Part hatch={{ gap: 5, color: OFFICER_BLUE, opacity: 0.75 }}>
        <polygon points="2,22 76,22 76,30 2,30" />
      </Part>
      <Sketch width={2.5}>
        <line x1={13} y1={22} x2={65} y2={22} />
      </Sketch>
      {/* Yellow 7-pointed star centered on crown */}
      <polygon
        points="39,6.5 39.95,10.02 43.30,8.57 41.14,11.51 44.36,13.22 40.72,13.37 41.39,16.96 39,14.2 36.61,16.96 37.28,13.37 33.64,13.22 36.86,11.51 34.70,8.57 38.05,10.02"
        fill="#F5C200"
        stroke={INK}
        strokeWidth={0.8}
      />
    </svg>
  );
};

/** Simple straight police nightstick with grip texture and knob. */
const NightstickPencil: React.FC<{ size: number }> = ({ size }) => {
  const w = Math.round(size * 0.22);
  return (
    <svg width={w} height={size} viewBox="0 0 22 100" style={{ overflow: "visible" }}>
      <PencilDefs scale={2.4} />
      <Part hatch={{ gap: 4, color: PASTEL.gray, opacity: 0.9 }}>
        <polygon points="7,0 15,0 15,78 7,78" />
      </Part>
      <Sketch width={2}>
        <line x1={8} y1={18} x2={14} y2={18} />
        <line x1={8} y1={26} x2={14} y2={26} />
        <line x1={8} y1={34} x2={14} y2={34} />
      </Sketch>
      <Part hatch={{ gap: 3, cross: true, color: INK, opacity: 0.5 }}>
        <polygon points="4,78 18,78 18,100 4,100" />
      </Part>
    </svg>
  );
};

// ── Geometry helpers ──────────────────────────────────────────────────────────

// PersonPencil base viewBox: 170 × 220.
// All constants below are fractions of those dimensions.

const VB_W = 170;
const VB_H = 220;

// Head: centre (66, 44), radius 26 (all viewBox units).
const HEAD_VX = 66;
const HEAD_VY = 44;
const HEAD_VR = 26;

// Hand anchors per pose (viewBox coords, facing=1 / un-mirrored).
const HAND_VP: Record<string, [number, number]> = {
  stand:    [96,  132],
  present:  [140,  96],
  salute:   [84,   40],
  megaphone:[128,  58],
};

/**
 * PersonPencil + police cap + optional nightstick overlay.
 *
 * Accessories are positioned using geometry derived from the base viewBox so
 * they track the body correctly at any `size`. The nightstick is optimised
 * for `pose="present"` (arm extended) — raised at −70° like a readied swing.
 *
 * Default: facing=-1 (faces left), pose="present".
 */
export const OfficerPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  pose?: PersonPose;
  color?: string;
  /** Show the nightstick (default true). */
  baton?: boolean;
}> = ({ size, facing = -1, pose = "present", color = OFFICER_BLUE, baton = true }) => {
  const personW = size * (VB_W / VB_H);

  // Mirror x-coords for facing=-1 (CSS scaleX(-1) mirrors about element centre).
  const mx = (vx: number) =>
    facing === 1 ? (vx / VB_W) * personW : personW - (vx / VB_W) * personW;
  const my = (vy: number) => (vy / VB_H) * size;

  // Head
  const headX = mx(HEAD_VX);
  const headY = my(HEAD_VY);
  const headR = my(HEAD_VR);

  // Cap: crown/brim junction (y=22 of 30 viewBox units) aligns with head top.
  const capSize = size * 0.13;
  const capW    = capSize * 2.6;
  const capLeft = headX - capW / 2;
  const capTop  = headY - headR - capSize * (22 / 30);

  // Nightstick: grip (bottom of the stick) pinned to the active hand.
  const [hvx, hvy] = HAND_VP[pose] ?? HAND_VP.stand;
  const handX = mx(hvx);
  const handY = my(hvy);
  const batonH = size * 0.44;
  const batonW = Math.round(batonH * 0.22);

  return (
    <div style={{ position: "relative", width: personW, height: size }}>
      <PersonPencil size={size} facing={facing} pose={pose} color={color} />

      {/* Cap sits on top of the head. */}
      <div style={{ position: "absolute", left: capLeft, top: capTop }}>
        <PoliceCap size={capSize} />
      </div>

      {/* Nightstick: grip at hand, shaft raised at −70° (ready to swing). */}
      {baton && (
        <div style={{
          position: "absolute",
          left: handX - batonW / 2,
          top: handY - batonH,
          transform: "rotate(-70deg)",
          transformOrigin: "bottom center",
        }}>
          <NightstickPencil size={batonH} />
        </div>
      )}
    </div>
  );
};
