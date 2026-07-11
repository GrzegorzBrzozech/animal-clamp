import React from "react";
import { useCurrentFrame } from "remotion";
import { INK, PencilDefs, Part, ROUGH_A } from "../_pencil";
import type { HominidPencilProps } from "./types";

const VB_W = 200;
const VB_H = 254;

// Head trapezoid: NARROW at top, WIDE at the jaw (as in the macket).
const HEAD = "64,46 106,46 120,106 50,106";
const TORSO = "46,112 126,112 112,160 60,160";
const L_ARM = "44,114 35,117 35,193 49,198 52,150 54,114";
const R_ARM = "124,114 135,113 152,146 152,175 138,178 123,148";
const L_LEG = "62,196 80,196 78,237 64,237";
const R_LEG = "104,196 122,196 120,237 106,237";
const L_FOOT = "60,234 82,234 82,247 46,249 44,242";
const R_FOOT = "102,234 124,234 142,249 140,242 102,247";
const CLOTH = "56,156 118,160 120,182 126,200 110,192 100,212 86,196 72,212 62,194 56,180";
const HAIR_CAP = "52,66 48,44 56,46 64,42 74,44 84,42 96,44 106,42 116,46 122,48 120,66 108,56 92,58 76,58 60,56";
const LOCKS = ["50,46 43,18 60,44", "66,44 71,12 80,42", "84,44 91,20 96,42", "100,44 111,16 116,42", "112,44 123,26 122,48"];

/**
 * HominidV1 — first macket-matching pass: jaw-wide trapezoid head, spiky hair,
 * tiny nose, no ears, straight legs, solid spear shaft. Kept for version
 * comparison (see hominid/ + the HominidVersions lab). Do not delete.
 */
export const HominidV1: React.FC<HominidPencilProps> = ({ x, y, scale = 1, facing = 1, color, idle = true, phase = 0 }) => {
  const frame = useCurrentFrame();
  const bob = idle ? Math.sin(frame * 0.06 + phase) * 1.4 : 0;
  const w = 4.4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: VB_W,
        height: VB_H,
        transform: `translate(-50%, -100%) scale(${scale}) scaleX(${facing})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={VB_W} height={VB_H} style={{ overflow: "visible", transform: `translateY(${bob}px)` }}>
        <PencilDefs scale={2.6} />

        <Part width={w}>
          <polygon points={L_LEG} />
          <polygon points={R_LEG} />
        </Part>
        <Part width={w}>
          <polygon points={L_FOOT} />
          <polygon points={R_FOOT} />
        </Part>
        <g stroke={INK} strokeWidth={2} strokeLinecap="round">
          <line x1={52} y1={247} x2={51} y2={253} />
          <line x1={60} y1={247} x2={59} y2={253} />
          <line x1={68} y1={246} x2={67} y2={252} />
          <line x1={126} y1={247} x2={127} y2={253} />
          <line x1={118} y1={247} x2={119} y2={253} />
          <line x1={110} y1={246} x2={111} y2={252} />
        </g>

        <Part width={w}>
          <polygon points={L_ARM} />
        </Part>
        <Part width={w}>
          <polygon points={R_ARM} />
        </Part>

        <Part width={w}>
          <polygon points={TORSO} />
        </Part>
        <circle cx={72} cy={136} r={2.4} fill={INK} opacity={0.6} />

        <Part width={w} hatch={{ gap: 3.2, cross: true, color: color ?? INK, opacity: 0.85 }}>
          <polygon points={CLOTH} />
        </Part>
        {[
          [78, 176],
          [98, 182],
          [110, 172],
          [86, 196],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={4.5} ry={5.5} fill={INK} />
        ))}

        <Part width={3} base={INK}>
          <polygon points="148,48 156,48 155,247 149,247" />
        </Part>
        <Part width={w} hatch={{ gap: 3.4, color: INK, opacity: 0.4 }}>
          <polygon points="152,4 165,30 158,42 152,54 146,42 139,30" />
        </Part>

        <Part width={w}>
          <polygon points="35,192 35,206 40,212 44,204 48,212 52,204 54,208 54,194" />
        </Part>
        <Part width={w}>
          <polygon points="138,150 164,150 164,172 138,172" />
        </Part>
        <g stroke={INK} strokeWidth={2} strokeLinecap="round">
          <line x1={145} y1={152} x2={145} y2={170} />
          <line x1={152} y1={152} x2={152} y2={170} />
          <line x1={159} y1={152} x2={159} y2={170} />
        </g>

        <Part width={w}>
          <polygon points={HEAD} />
        </Part>

        <Part width={w - 0.6} hatch={{ gap: 2.4, cross: true, color: INK, opacity: 0.9 }}>
          <polygon points={HAIR_CAP} />
          {LOCKS.map((p, i) => (
            <polygon key={i} points={p} />
          ))}
        </Part>

        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={w + 1} strokeLinecap="round">
          <line x1={66} y1={64} x2={84} y2={70} />
          <line x1={102} y1={70} x2={120} y2={64} />
        </g>
        <circle cx={79} cy={80} r={3} fill={INK} />
        <circle cx={105} cy={80} r={3} fill={INK} />
        <g filter={`url(#${ROUGH_A})`} fill="none" stroke={INK} strokeWidth={w - 1} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="92,84 92,94 98,94" />
        </g>
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={w} strokeLinecap="round">
          <line x1={80} y1={101} x2={104} y2={101} />
        </g>
      </svg>
    </div>
  );
};
