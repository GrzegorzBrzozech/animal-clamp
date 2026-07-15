import React from "react";
import { PASTEL, PencilDefs, Part, Sketch } from "./_pencil";
import { PersonPencil, type PersonPose } from "./PersonPencil";

// Tribune / lectern — local to this character, not exported.
const TribunePencil: React.FC<{ size: number }> = ({ size }) => (
  <svg width={Math.round(size * 0.75)} height={size} viewBox="0 0 75 100" style={{ overflow: "visible" }}>
    <PencilDefs scale={2.8} />
    <Part hatch={{ gap: 5, color: PASTEL.brown, opacity: 0.75 }}>
      <polygon points="0,14 75,0 75,24 0,38" />
    </Part>
    <Part hatch={{ gap: 7, color: PASTEL.brown, opacity: 0.55 }}>
      <polygon points="0,38 75,24 75,100 0,100" />
    </Part>
    <Sketch width={2.5}>
      <line x1={6} y1={62} x2={69} y2={54} />
    </Sketch>
  </svg>
);

/**
 * PersonPencil + lectern overlay.
 *
 * The base PersonPencil handles all body proportions; this component adds:
 *   - a tie (via the base `tie` prop)
 *   - a TribunePencil rendered in front of (on top of) the lower body
 *
 * The lectern is positioned using body geometry derived from the base
 * viewBox (170 × 220). Set `tribune={false}` to get a plain suited person.
 */
export const PoliticianPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  pose?: PersonPose;
  color?: string;
  /** Show the lectern in front of the lower body (default true). */
  tribune?: boolean;
}> = ({ size, facing = 1, pose = "stand", color = PASTEL.gray, tribune = true }) => {
  const personW = size * (170 / 220);

  // Torso horizontal center in viewBox: midpoint of "42,84 88,84" = x=65.
  // After facing=-1 mirror (scaleX about element center): x → 170-65 = 105.
  const torsoCX =
    facing === 1
      ? (65 / 170) * personW
      : (105 / 170) * personW;

  // Tribune covers from approximately the waist downward.
  // 0.53 ≈ y=116/220 (just below the arm-end in "stand" pose).
  const tribuSize = size * 0.72;
  const tribuW    = tribuSize * 0.75;
  const tribuLeft = torsoCX - tribuW / 2;
  const tribuTop  = size * 0.53;

  return (
    <div style={{ position: "relative", width: personW, height: size }}>
      {/* Person renders first → tribune renders on top of the lower body. */}
      <PersonPencil size={size} facing={facing} pose={pose} tie color={color} />
      {tribune && (
        <div style={{ position: "absolute", left: tribuLeft, top: tribuTop }}>
          <TribunePencil size={tribuSize} />
        </div>
      )}
    </div>
  );
};
