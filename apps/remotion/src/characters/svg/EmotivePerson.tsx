import React from "react";
import { INK, PAPER } from "./_pencil";
import { PersonPencil, type PersonPose } from "./PersonPencil";

// PersonPencil viewBox geometry (canonical, do not change).
const VB_W = 170;
const VB_H = 220;
// Neutral mouth: line x1=76 y1=56 x2=90 y2=56 (facing=1 / un-mirrored).
// Mouth center vb-x = 83, half-width = 7, y = 56.
const MOUTH_CX = 83;
const MOUTH_HW = 7;
const MOUTH_Y = 56;

/**
 * PersonPencil with face-level emotion overlay.
 * Instead of a badge above the head, the expression is drawn directly on the
 * figure: a smile (happy) or frown (sad) replaces the neutral mouth line.
 *
 * Props:
 *   happyProgress — 0..1 opacity of the smile overlay
 *   sadProgress   — 0..1 opacity of the frown overlay
 *
 * Both can be non-zero simultaneously for a smooth transition.
 * At happyProgress=sadProgress=0 the figure shows the default neutral face.
 */
export const EmotivePerson: React.FC<{
  size: number;
  facing?: 1 | -1;
  pose?: PersonPose;
  color?: string;
  shout?: boolean;
  happyProgress?: number;
  sadProgress?: number;
}> = ({
  size,
  facing = 1,
  pose = "stand",
  color,
  shout = false,
  happyProgress = 0,
  sadProgress = 0,
}) => {
  const figW = size * (VB_W / VB_H);

  // Mouth coordinates in pixel-space (overlay SVG uses pixel coords).
  // For facing=-1, PersonPencil applies scaleX(-1) inside its SVG, so the
  // visual mouth appears mirrored: from x=(170-90)/170*figW to (170-76)/170*figW.
  const mouthCX_px =
    facing === 1
      ? (MOUTH_CX / VB_W) * figW
      : figW - (MOUTH_CX / VB_W) * figW;
  const mouthHW_px = (MOUTH_HW / VB_W) * figW;
  const mouthY_px  = (MOUTH_Y / VB_H) * size;
  // Smile / frown arc depth.
  const depth_px   = (9 / VB_H) * size;
  // Cover rect to hide PersonPencil's neutral line (with some jitter padding).
  const coverX     = mouthCX_px - mouthHW_px - 4;
  const coverW     = mouthHW_px * 2 + 8;
  const coverOp    = Math.min(1, Math.max(happyProgress, sadProgress));

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <PersonPencil size={size} facing={facing} pose={pose} color={color} shout={shout} />

      {coverOp > 0.02 && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: figW,
            height: size,
            pointerEvents: "none",
          }}
          viewBox={`0 0 ${figW} ${size}`}
        >
          {/* Cover the original neutral mouth line */}
          <rect
            x={coverX}
            y={mouthY_px - 5}
            width={coverW}
            height={11}
            fill={PAPER}
            opacity={coverOp}
          />

          {/* Happy smile — ∪ shape: control point BELOW corners (y + depth) */}
          {happyProgress > 0.02 && (
            <path
              d={`M ${mouthCX_px - mouthHW_px} ${mouthY_px} Q ${mouthCX_px} ${mouthY_px + depth_px} ${mouthCX_px + mouthHW_px} ${mouthY_px}`}
              fill="none"
              stroke={INK}
              strokeWidth={2.8}
              strokeLinecap="round"
              opacity={happyProgress}
            />
          )}

          {/* Sad frown — ∩ shape: control point ABOVE corners (y - depth) */}
          {sadProgress > 0.02 && (
            <path
              d={`M ${mouthCX_px - mouthHW_px} ${mouthY_px} Q ${mouthCX_px} ${mouthY_px - depth_px} ${mouthCX_px + mouthHW_px} ${mouthY_px}`}
              fill="none"
              stroke={INK}
              strokeWidth={2.8}
              strokeLinecap="round"
              opacity={sadProgress}
            />
          )}
        </svg>
      )}
    </div>
  );
};
