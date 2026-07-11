import React from "react";

/**
 * A reusable eye. Normal = white sclera + dark pupil (optionally just a dot).
 * Hurt = an ✖ so the creature reads clearly as a victim, not a friend.
 */
export const Eye: React.FC<{
  cx: number;
  cy: number;
  r: number;
  hurt?: boolean;
  /** Horizontal pupil shift (look direction). */
  look?: number;
  /** Draw the white sclera ring; false = solid dot eye. */
  sclera?: boolean;
}> = ({ cx, cy, r, hurt, look = 0, sclera = true }) => {
  if (hurt) {
    const d = r * 0.95;
    return (
      <g stroke="#15181D" strokeWidth={Math.max(2, r * 0.45)} strokeLinecap="round">
        <line x1={cx - d} y1={cy - d} x2={cx + d} y2={cy + d} />
        <line x1={cx + d} y1={cy - d} x2={cx - d} y2={cy + d} />
      </g>
    );
  }
  return (
    <g>
      {sclera ? <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#15181D" strokeWidth={r * 0.16} /> : null}
      <circle cx={cx + look} cy={cy} r={sclera ? r * 0.55 : r} fill="#15181D" />
    </g>
  );
};
