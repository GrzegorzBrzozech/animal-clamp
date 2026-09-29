/**
 * ARCHIVED — not exported from `~/characters` any more.
 *
 * The drawn-face version of the framed portrait. Superseded by
 * `~/components/PortraitPhoto` (`src/components/PortraitPhoto.tsx`), which keeps
 * this exact frame geometry — moulding, canvas, name plaque — but puts a REAL
 * photograph inside the canvas instead of an archetypal drawn face. Swapped for
 * the `marginal-utility` composition, where the client wanted the actual faces
 * of Smith / Ricardo / Marx / Menger.
 *
 * Kept because the drawn version is still the right answer for figures we have
 * no photograph or painting of. To bring it back: move this file up to
 * `svg/PortraitPencil.tsx`, restore the `./_pencil` import path, and re-add the
 * export in `characters/index.ts`.
 */
import React from "react";
import { INK, PAPER, PASTEL, PencilDefs, Part, Hatch, Sketch, ROUGH_A } from "../_pencil";

/**
 * Reusable pencil-on-paper FRAMED PORTRAIT (macket look) — a compact bust in a
 * picture frame with a name plaque, for historical figures we have no photograph
 * of (economists, philosophers, rulers). NOT a full-body figure: use
 * `PersonPencil` for that.
 *
 * The face is a deliberate "blank" archetype; identity comes from the hair and
 * facial-hair combination plus the plaque, so a whole gallery of thinkers stays
 * visually coherent. Faceted geometry, graphite outline, optional tint.
 * Deterministic — no randomness, no state.
 *
 *   <PortraitPencil size={420} label="Адам Сміт" hair="wig" beard="none" />
 *   <PortraitPencil size={420} label="Карл Маркс" hair="bushy" beard="full" />
 */

const VB_W = 200;
const VB_H = 264;

export type PortraitHair = "wig" | "short" | "bushy" | "balding" | "none";
export type PortraitBeard = "none" | "full" | "mustache" | "sideburns";

/** One or more faceted polygons per hairstyle (drawn as one occluding part). */
const HAIR: Record<PortraitHair, string[]> = {
  // 18th-century powdered wig: high crown, straight-cut sides.
  wig: ["62,74 66,48 84,32 116,32 134,48 138,74 146,110 130,116 128,72 100,54 72,72 70,116 54,110"],
  short: ["70,58 84,42 116,42 130,58 134,74 116,58 84,58 66,74"],
  // wild 19th-century mane.
  bushy: ["54,74 62,38 84,26 100,42 120,24 140,38 148,74 152,100 134,72 100,54 66,72 50,100"],
  // receding hairline: two side tufts, bare crown.
  balding: [
    "62,106 62,74 72,58 86,52 78,70 74,106",
    "138,106 138,74 128,58 114,52 122,70 126,106",
  ],
  none: [],
};

const BEARD: Record<PortraitBeard, string | null> = {
  none: null,
  full: "72,110 128,110 130,136 114,152 86,152 70,136",
  mustache: "84,114 116,114 120,124 80,124",
  sideburns: "64,86 76,86 78,110 66,110",
};

export const PortraitPencil: React.FC<{
  /** Rendered height in px (width derives from the frame's aspect). */
  size: number;
  /** Name on the plaque. Auto-fits the plaque width. */
  label?: string;
  hair?: PortraitHair;
  beard?: PortraitBeard;
  /** Coloured-pencil tint for the coat. */
  color?: string;
  /** Tint for the frame moulding. */
  frameColor?: string;
  /** Dim the whole portrait (e.g. an idea that has been superseded). */
  opacity?: number;
  style?: React.CSSProperties;
}> = ({
  size,
  label,
  hair = "short",
  beard = "none",
  color = PASTEL.gray,
  frameColor = PASTEL.brown,
  opacity = 1,
  style,
}) => {
  const hairShapes = HAIR[hair];
  const beardPts = BEARD[beard];
  const mouthHidden = beard === "full";

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={size * (VB_W / VB_H)}
      height={size}
      style={{ overflow: "visible", opacity, ...style }}
    >
      <PencilDefs scale={3} />

      {/* frame moulding */}
      <Part width={5.2} hatch={{ gap: 6, cross: true, color: frameColor, opacity: 0.7 }}>
        <polygon points="8,8 192,8 192,214 8,214" />
      </Part>
      {/* the canvas inside the frame */}
      <Part width={4}>
        <polygon points="24,24 176,24 176,198 24,198" />
      </Part>
      {/* soft canvas tone behind the sitter */}
      <Hatch gap={11} color={INK} opacity={0.3}>
        <polygon points="24,24 176,24 176,198 24,198" />
      </Hatch>

      {/* shoulders / coat — geometry stays inside the canvas rect (no clip needed) */}
      <Part width={5} hatch={{ gap: 5, color }}>
        <polygon points="34,196 52,150 148,150 166,196" />
      </Part>
      {/* collar + lapels */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
        <polyline points="82,152 100,178 118,152" />
      </g>

      {/* neck */}
      <Part width={4.4}>
        <polygon points="86,130 114,130 114,158 86,158" />
      </Part>

      {/* head */}
      <Part width={5}>
        <polygon points="78,52 122,52 136,72 134,110 118,132 82,132 66,110 64,72" />
      </Part>
      {/* cheek shading */}
      <Hatch gap={7} color={INK} opacity={0.4}>
        <polygon points="64,74 78,54 82,132 66,110" />
      </Hatch>

      {/* eyes + brows */}
      <circle cx={87} cy={90} r={3.4} fill={INK} />
      <circle cx={113} cy={90} r={3.4} fill={INK} />
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3.4} fill="none" strokeLinecap="round">
        <polyline points="79,81 95,79" />
        <polyline points="105,79 121,81" />
        {/* nose */}
        <polyline points="100,96 106,110 94,112" />
        {!mouthHidden ? <line x1={89} y1={122} x2={111} y2={122} /> : null}
      </g>

      {/* facial hair (over the jaw) */}
      {beardPts ? (
        <>
          <Part width={4.4} hatch={{ gap: 3.6, cross: true, color: INK, opacity: 0.65 }}>
            <polygon points={beardPts} />
          </Part>
          {beard === "sideburns" ? (
            <Part width={4.4} hatch={{ gap: 3.6, cross: true, color: INK, opacity: 0.65 }}>
              <polygon points="124,86 136,86 134,110 122,110" />
            </Part>
          ) : null}
        </>
      ) : null}

      {/* hair / wig (over the skull) */}
      {hairShapes.map((pts) => (
        <Part key={pts} width={4.6} hatch={{ gap: 4.4, cross: true, color: INK, opacity: 0.6 }}>
          <polygon points={pts} />
        </Part>
      ))}
      {hair === "wig" ? (
        // the wig's rolled side curls
        <>
          <Part width={4} hatch={{ gap: 4, color: INK, opacity: 0.5 }}>
            <circle cx={60} cy={106} r={13} />
          </Part>
          <Part width={4} hatch={{ gap: 4, color: INK, opacity: 0.5 }}>
            <circle cx={140} cy={106} r={13} />
          </Part>
        </>
      ) : null}

      {/* name plaque */}
      {label ? (
        <>
          <Part width={4.2} hatch={{ gap: 6, color: frameColor, opacity: 0.5 }}>
            <polygon points="26,222 174,222 174,256 26,256" />
          </Part>
          <text
            x={100}
            y={246}
            textAnchor="middle"
            fontFamily="Montserrat, sans-serif"
            fontWeight={900}
            fontSize={22}
            fill={INK}
            textLength={132}
            lengthAdjust="spacingAndGlyphs"
          >
            {label}
          </text>
        </>
      ) : null}
    </svg>
  );
};

/** Thin decorative hanging wire above a portrait (optional garnish). */
export const PortraitWire: React.FC<{ width: number; drop?: number; color?: string }> = ({
  width,
  drop = 40,
  color = INK,
}) => (
  <svg viewBox={`0 0 ${width} ${drop}`} width={width} height={drop} style={{ overflow: "visible" }}>
    <PencilDefs scale={2.4} />
    <Sketch width={3} stroke={color}>
      <polyline points={`8,${drop} ${width / 2},4 ${width - 8},${drop}`} />
    </Sketch>
    <circle cx={width / 2} cy={4} r={5} fill={PAPER} stroke={color} strokeWidth={3} />
  </svg>
);
