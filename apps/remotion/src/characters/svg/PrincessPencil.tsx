import React from "react";
import { INK, PAPER, PencilDefs, Part, Sketch, ROUGH_A } from "./_pencil";

const VB_W = 170;
const VB_H = 255;
const GOLD = "#C8A824";
const GOLD_DARK = "#8B6810";
const DRESS = "#F0EBE0";
const DRESS_SHADOW = "#DDD3C0";

/**
 * Pencil-on-paper princess figure: gold tiara, white A-line dress.
 * Faces viewer (centered head — symmetrical look).
 */
export const PrincessPencil: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const width = Math.round(size * VB_W / VB_H);
  return (
    <div style={{ position: "relative", width, height: size, ...style }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3.2} />

        {/* Bell-shaped skirt (back) — widens dramatically from waist to hem */}
        <Part hatch={{ gap: 8, color: DRESS_SHADOW, opacity: 0.7 }} stroke={INK} width={4}>
          <polygon points="67,148 103,148 165,248 5,248" />
        </Part>

        {/* Bodice — narrow torso, Part knockout trims skirt top behind it */}
        <Part hatch={{ gap: 6, color: DRESS, opacity: 0.88 }} stroke={INK} width={4}>
          <polygon points="64,101 106,101 103,148 67,148" />
        </Part>

        {/* Arms alongside bodice */}
        <Sketch width={4}>
          <polyline points="64,110 52,148" />
          <polyline points="106,110 118,148" />
        </Sketch>
        <circle cx={51} cy={151} r={6} fill={PAPER} stroke={INK} strokeWidth={3.5} />
        <circle cx={119} cy={151} r={6} fill={PAPER} stroke={INK} strokeWidth={3.5} />

        {/* Tiara — drawn before head so head knockout trims the band naturally */}
        <Part hatch={{ gap: 4, color: GOLD, opacity: 0.90 }} stroke={GOLD_DARK} width={2.5}>
          {/* 3 delicate peaks: center tallest (y=20), flanking (y=32), slender band y=44-54 */}
          <polygon points="62,54 62,42 70,32 78,42 85,20 92,42 100,32 108,42 108,54" />
        </Part>

        {/* Head — centered on x=85 */}
        <Part width={5}>
          <circle cx={85} cy={75} r={26} />
        </Part>

        {/* Eyes (centered, facing viewer) */}
        <circle cx={78} cy={70} r={3} fill={INK} />
        <circle cx={92} cy={70} r={3} fill={INK} />

        {/* Gentle smile */}
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round">
          <path d="M79,86 q6,5 12,0" />
        </g>
      </svg>
    </div>
  );
};
