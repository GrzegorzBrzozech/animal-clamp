import React from "react";
import { INK, PAPER, PASTEL, PencilDefs, Part, Hatch, Sketch, ROUGH_A } from "./_pencil";

/**
 * Reusable pencil-on-paper SCHOOL / SCIENCE objects (macket look), shared across
 * education & science videos. Each renders a standalone <svg> sized by `size`;
 * place it in a flex or absolute-positioned parent. Faceted, graphite outline,
 * optional coloured-pencil hatch. All deterministic (no per-frame randomness).
 */

type Obj = {
  /** Rendered height in px (width derives from the object's aspect). */
  size: number;
  /** Coloured-pencil tint for the fill hatch (default graphite INK). */
  color?: string;
  style?: React.CSSProperties;
};

const wrap = (vbW: number, vbH: number, size: number, style: React.CSSProperties | undefined, children: React.ReactNode) => (
  <svg
    viewBox={`0 0 ${vbW} ${vbH}`}
    width={size * (vbW / vbH)}
    height={size}
    style={{ overflow: "visible", ...style }}
  >
    <PencilDefs scale={3.2} />
    {children}
  </svg>
);

/** Closed upright textbook. `color` tints the cover. */
export const BookPencil: React.FC<Obj & { spineLabel?: boolean }> = ({ size, color = PASTEL.blue, style, spineLabel = true }) =>
  wrap(120, 150, size, style, (
    <>
      {/* spine (left) */}
      <Part width={4.2} hatch={{ gap: 5, cross: true, color, opacity: 0.9 }}>
        <polygon points="14,22 26,14 26,136 14,144" />
      </Part>
      {/* front cover */}
      <Part width={4.6} hatch={{ gap: 6, color }}>
        <polygon points="26,14 104,20 104,140 26,136" />
      </Part>
      {/* title band + page edge */}
      {spineLabel ? (
        <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
          <line x1={40} y1={46} x2={92} y2={50} />
          <line x1={40} y1={62} x2={80} y2={65} />
        </g>
      ) : null}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.7}>
        <line x1={104} y1={26} x2={108} y2={30} />
        <line x1={104} y1={70} x2={108} y2={74} />
        <line x1={104} y1={114} x2={108} y2={118} />
      </g>
    </>
  ));

/** Round rubber-stamp impression: double ring + a ✓ (or short text). */
export const StampMark: React.FC<Obj & { label?: string; check?: boolean }> = ({
  size,
  color = "#BC5147",
  style,
  label,
  check = true,
}) =>
  wrap(100, 100, size, style, (
    <g transform="rotate(-8 50 50)">
      <Sketch width={5} stroke={color}>
        <circle cx={50} cy={50} r={42} />
      </Sketch>
      <Sketch width={2.6} stroke={color}>
        <circle cx={50} cy={50} r={33} />
      </Sketch>
      {label ? (
        <text
          x={50}
          y={58}
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontWeight={900}
          fontSize={label.length > 5 ? 18 : 26}
          fill={color}
        >
          {label}
        </text>
      ) : check ? (
        <g filter={`url(#${ROUGH_A})`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="30,52 44,68 72,32" />
        </g>
      ) : null}
    </g>
  ));

/** Erlenmeyer flask with liquid (chemistry). */
export const FlaskPencil: React.FC<Obj> = ({ size, color = PASTEL.green, style }) =>
  wrap(100, 130, size, style, (
    <>
      {/* liquid (lower body) */}
      <Hatch gap={4} color={color} opacity={0.95}>
        <polygon points="30,78 70,78 86,112 14,112" />
      </Hatch>
      {/* glass body + neck outline */}
      <Sketch width={4.6} stroke={INK}>
        <polygon points="42,12 58,12 58,52 86,112 14,112 42,52" />
      </Sketch>
      {/* neck rim */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4.6} fill="none" strokeLinecap="round">
        <line x1={40} y1={12} x2={60} y2={12} />
        <line x1={30} y1={78} x2={70} y2={78} />
      </g>
      {/* bubbles */}
      <circle cx={44} cy={96} r={3} fill={PAPER} stroke={INK} strokeWidth={2} />
      <circle cx={58} cy={102} r={2.4} fill={PAPER} stroke={INK} strokeWidth={2} />
    </>
  ));

/** Government / ministry building: steps, columns, pediment. */
export const BuildingPencil: React.FC<Obj> = ({ size, color = "#BFC2BE", style }) =>
  wrap(220, 160, size, style, (
    <>
      {/* pediment */}
      <Part width={4.6} hatch={{ gap: 7, color }}>
        <polygon points="20,52 110,16 200,52" />
      </Part>
      {/* architrave */}
      <Part width={4.4} hatch={{ gap: 6, cross: true, color, opacity: 0.6 }}>
        <polygon points="26,52 194,52 194,66 26,66" />
      </Part>
      {/* columns */}
      {[40, 74, 108, 142, 176].map((cx) => (
        <Part key={cx} width={3.8} hatch={{ gap: 6, color }}>
          <polygon points={`${cx - 8},68 ${cx + 8},68 ${cx + 8},128 ${cx - 8},128`} />
        </Part>
      ))}
      {/* base steps */}
      <Part width={4.6} hatch={{ gap: 7, cross: true, color, opacity: 0.5 }}>
        <polygon points="10,128 210,128 210,140 10,140" />
      </Part>
      <Sketch width={4.6}>
        <polygon points="4,152 216,152 210,140 10,140" />
      </Sketch>
    </>
  ));

/** A single sheet of paper / document with ruled text lines and a title band. */
export const PagePencil: React.FC<Obj & { lines?: number; sealed?: boolean }> = ({
  size,
  color = PASTEL.yellow,
  style,
  lines = 5,
  sealed = false,
}) =>
  wrap(120, 150, size, style, (
    <>
      <Part width={4.4} hatch={{ gap: 9, color, opacity: 0.5 }}>
        <polygon points="16,12 104,12 104,138 16,138" />
      </Part>
      {/* title band */}
      <Hatch gap={3.5} cross color={INK} opacity={0.75}>
        <polygon points="28,26 92,26 92,40 28,40" />
      </Hatch>
      {/* ruled text */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.2} fill="none" strokeLinecap="round" opacity={0.8}>
        {Array.from({ length: lines }).map((_, i) => (
          <line key={i} x1={28} y1={58 + i * 15} x2={i % 2 ? 82 : 94} y2={58 + i * 15} />
        ))}
      </g>
      {sealed ? <StampMark size={44} color="#BC5147" label="ДПА" style={{ position: "absolute" }} /> : null}
    </>
  ));

/** Ancient rolled manuscript / scroll with faded script and a wax seal. */
export const ManuscriptPencil: React.FC<Obj & { seal?: boolean }> = ({ size, color = PASTEL.brown, style, seal = true }) =>
  wrap(210, 140, size, style, (
    <>
      {/* parchment sheet */}
      <Part width={4.4} hatch={{ gap: 7, color, opacity: 0.55 }}>
        <polygon points="34,26 176,20 180,116 30,110" />
      </Part>
      {/* faded old script (wavy lines) */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.75}>
        {[44, 62, 80, 98].map((y, i) => (
          <path key={i} d={`M48,${y} q20,-5 40,0 q20,5 40,0 q16,-4 30,1`} />
        ))}
      </g>
      {/* left roll */}
      <Part width={4.8}>
        <polygon points="14,14 36,22 32,114 10,108" />
      </Part>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
        <path d="M14,18 q10,-8 20,0" />
        <path d="M12,108 q10,8 20,2" />
      </g>
      {/* right roll */}
      <Part width={4.8}>
        <polygon points="176,20 198,12 202,106 180,116" />
      </Part>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
        <path d="M180,22 q10,-8 20,-2" />
        <path d="M182,114 q10,6 20,-2" />
      </g>
      {/* wax seal */}
      {seal ? (
        <>
          <circle cx={106} cy={120} r={15} fill="#BC5147" stroke={INK} strokeWidth={3} />
          <path d="M99,120 l5,5 l9,-9" stroke={PAPER} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
    </>
  ));

/** A cosy house (home schooling) with roof, door, window and a little chimney. */
export const HousePencil: React.FC<Obj & { heart?: boolean }> = ({ size, color = PASTEL.yellow, style, heart = false }) =>
  wrap(160, 150, size, style, (
    <>
      {/* chimney */}
      <Part width={4}>
        <polygon points="112,30 128,30 128,58 112,52" />
      </Part>
      {/* roof */}
      <Part width={5} hatch={{ gap: 6, color: PASTEL.brown, opacity: 0.85 }}>
        <polygon points="80,14 150,64 10,64" />
      </Part>
      {/* walls */}
      <Part width={5} hatch={{ gap: 7, color }}>
        <polygon points="26,64 134,64 134,138 26,138" />
      </Part>
      {/* door */}
      <Part width={4} hatch={{ gap: 5, cross: true, color: PASTEL.brown, opacity: 0.7 }}>
        <polygon points="66,92 94,92 94,138 66,138" />
      </Part>
      <circle cx={88} cy={116} r={2.6} fill={INK} />
      {/* window */}
      <Sketch width={4}>
        <polygon points="38,78 58,78 58,98 38,98" />
        <polyline points="48,78 48,98" />
        <polyline points="38,88 58,88" />
      </Sketch>
      {/* heart over the door (home = learning at home) */}
      {heart ? (
        <path
          d="M108,80 q4,-7 10,-2 q6,-5 10,2 q3,6 -10,14 q-13,-8 -10,-14"
          filter={`url(#${ROUGH_A})`}
          fill="#BC5147"
          stroke={INK}
          strokeWidth={2.6}
        />
      ) : null}
    </>
  ));

/** Head in profile (facing right) with a brain squiggle — the "конкретна голова". */
export const HeadPencil: React.FC<Obj & { openTop?: boolean }> = ({ size, color = PASTEL.pink, style, openTop = false }) =>
  wrap(140, 150, size, style, (
    <>
      {/* neck + head silhouette, facing right */}
      <Part width={4.8} hatch={{ gap: 8, color, opacity: 0.7 }}>
        <polygon
          points={
            openTop
              ? "30,44 60,22 96,26 116,50 118,84 100,92 104,116 60,116 58,92 30,84"
              : "30,44 58,20 96,22 118,44 120,84 100,92 104,116 60,116 58,92 30,84"
          }
        />
      </Part>
      {/* nose + mouth (right side = face) */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="118,56 128,66 116,72" />
        <line x1={104} y1={82} x2={116} y2={82} />
      </g>
      <circle cx={100} cy={52} r={3} fill={INK} />
      {/* brain squiggle */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round" opacity={0.85}>
        <path d="M52,52 q10,-12 22,-2 q12,-10 22,2 q10,10 -2,18 q6,14 -14,12 q-16,6 -22,-8 q-12,-8 -6,-24" />
      </g>
    </>
  ));
