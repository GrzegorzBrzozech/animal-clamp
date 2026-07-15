import React from "react";
import { INK, PAPER, PencilDefs, Part, Sketch, ROUGH_A } from "./_pencil";

const VB_W = 170;
const VB_H = 245;
const GOLD = "#C8A824";
const GOLD_DARK = "#8B6810";
const CRIMSON = "#8B1A1A";
const CRIMSON_DARK = "#5A0000";
const FUR = "#F2EDE0";

/**
 * Pencil-on-paper king figure: gold crown, crimson mantle, fur collar.
 * Faces right (same convention as PersonPencil).
 */
export const KingPencil: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const width = Math.round(size * VB_W / VB_H);
  return (
    <div style={{ position: "relative", width, height: size, ...style }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3.2} />

        {/* Legs (back-most) */}
        <Sketch width={5}>
          <polyline points="54,183 50,237" />
          <polyline points="80,183 84,237" />
        </Sketch>

        {/* Crimson mantle — wide cloak widening toward hem */}
        <Part hatch={{ gap: 5, color: CRIMSON, opacity: 0.68 }} stroke={CRIMSON_DARK} width={4}>
          <polygon points="42,111 88,111 112,183 22,183" />
        </Part>

        {/* Fur collar at shoulder — appears in front of mantle top */}
        <Part hatch={{ gap: 3, color: FUR, opacity: 0.88 }} stroke={INK} width={2.5}>
          <polygon points="40,105 90,105 95,124 35,124" />
        </Part>

        {/* Hands peeking out below mantle edges */}
        <circle cx={22} cy={172} r={7} fill={PAPER} stroke={INK} strokeWidth={4} />
        <circle cx={110} cy={172} r={7} fill={PAPER} stroke={INK} strokeWidth={4} />

        {/* Crown — drawn before head so head Part knockout neatly trims the band */}
        <Part hatch={{ gap: 4, color: GOLD, opacity: 0.92 }} stroke={GOLD_DARK} width={3}>
          {/* 3 teeth: center peak y=6, side peaks y=18; band base y=40-54 */}
          <polygon points="44,54 44,38 52,18 60,38 66,6 72,38 80,18 88,38 88,54" />
        </Part>

        {/* Head — Part knockout covers mantle/collar behind neck and crown band */}
        <Part width={5}>
          <circle cx={66} cy={75} r={26} />
        </Part>

        {/* Eyes (facing right) */}
        <circle cx={74} cy={70} r={3} fill={INK} />
        <circle cx={86} cy={70} r={3} fill={INK} />

        {/* Slight smile */}
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M75,85 q5,4 11,0" />
        </g>

        {/* Beard below chin */}
        <Sketch width={3} stroke={`${INK}AA`}>
          <polyline points="57,97 61,105 66,108 71,105 75,97" />
        </Sketch>
      </svg>
    </div>
  );
};
