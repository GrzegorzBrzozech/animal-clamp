import React from "react";
import { INK, PencilDefs, Part } from "./_pencil";
import { PersonPencil, type PersonPose } from "./PersonPencil";

const ARMY_GREEN = "#3E5E2E";

const VB_W = 170;
const VB_H = 220;
const HEAD_VX = 66;
const HEAD_VY = 44;
const HEAD_VR = 26;

function star5Points(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const oa = (i * 72 - 90) * (Math.PI / 180);
    const ia = oa + 36 * (Math.PI / 180);
    pts.push(`${(cx + R * Math.cos(oa)).toFixed(2)},${(cy + R * Math.sin(oa)).toFixed(2)}`);
    pts.push(`${(cx + r * Math.cos(ia)).toFixed(2)},${(cy + r * Math.sin(ia)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/**
 * Helmet dome (half-ellipse, military style). viewBox 84×30.
 * Dome arc from (4,28) to (80,28) rising to peak ≈(42,2). Brim at y=25–30.
 */
const MilitaryDomeHelmet: React.FC<{ size: number }> = ({ size }) => {
  const w = Math.round(size * 2.8);
  return (
    <svg width={w} height={size} viewBox="0 0 84 30" style={{ overflow: "visible" }}>
      <PencilDefs scale={2} />
      <Part hatch={{ gap: 4, color: ARMY_GREEN, opacity: 0.92 }}>
        <path d="M 4,28 A 38,26 0 0 0 80,28 Z" />
      </Part>
      <Part hatch={{ gap: 5, color: ARMY_GREEN, opacity: 0.82 }}>
        <polygon points="0,25 84,25 84,30 0,30" />
      </Part>
    </svg>
  );
};

/**
 * PersonPencil dressed as a soldier: army-green uniform + dome helmet + red star.
 */
export const MilitaryPencil: React.FC<{
  size: number;
  facing?: 1 | -1;
  pose?: PersonPose;
}> = ({ size, facing = -1, pose = "stand" }) => {
  const personW = size * (VB_W / VB_H);

  const mx = (vx: number) =>
    facing === 1 ? (vx / VB_W) * personW : personW - (vx / VB_W) * personW;
  const my = (vy: number) => (vy / VB_H) * size;

  const headX = mx(HEAD_VX);
  const headY = my(HEAD_VY);
  const headR = my(HEAD_VR);

  const helmetSize = size * 0.15;
  const helmetW    = helmetSize * 2.8;
  const helmetLeft = headX - helmetW / 2;
  const helmetTop  = headY - headR - helmetSize * (28 / 30);

  // Star sits at the brim of the dome (headY - headR = top of head)
  const starCY = headY - headR + headR * 0.55;
  const starR  = headR * 0.30;

  return (
    <div style={{ position: "relative", width: personW, height: size }}>
      <PersonPencil size={size} facing={facing} pose={pose} color={ARMY_GREEN} />
      <div style={{ position: "absolute", left: helmetLeft, top: helmetTop }}>
        <MilitaryDomeHelmet size={helmetSize} />
      </div>
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: personW, height: size, overflow: "visible", pointerEvents: "none" }}
      >
        <polygon
          points={star5Points(headX, starCY, starR, starR * 0.4)}
          fill="#CC2200"
          stroke={INK}
          strokeWidth={Math.max(0.8, starR * 0.1)}
        />
      </svg>
    </div>
  );
};
