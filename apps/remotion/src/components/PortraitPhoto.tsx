import React from "react";
import { Img, staticFile } from "remotion";
import { montserrat } from "~/lib/fonts";
import { INK, PASTEL, PencilDefs, Part, Sketch } from "~/characters/svg/_pencil";

/**
 * A framed REAL PHOTOGRAPH in the pencil-on-paper look: hand-drawn moulding, the
 * photo sitting in the canvas opening, and a name plaque underneath. The frame
 * geometry is carried over verbatim from the drawn-face original (now archived at
 * `~/characters/svg/_archive/PortraitPencil.tsx`), so a gallery mixing the two
 * still reads as one set.
 *
 * Deliberately STATIC — reveal (pop-in / fade / tilt) belongs to the scene that
 * places it. Unlike `PhotoPin`, there is NO Ken-Burns zoom: a framed portrait
 * hanging on a wall does not creep.
 *
 *   <PortraitPhoto size={380} src="projects/x/portraits/smith.jpg" label="Адам Сміт" />
 */

const VB_W = 200;
const VB_H = 264;
/** The canvas opening inside the moulding, in viewBox units. */
const CANVAS = { x: 24, y: 24, w: 152, h: 174 } as const;
const CANVAS_PTS = `${CANVAS.x},${CANVAS.y} ${CANVAS.x + CANVAS.w},${CANVAS.y} ${
  CANVAS.x + CANVAS.w
},${CANVAS.y + CANVAS.h} ${CANVAS.x},${CANVAS.y + CANVAS.h}`;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/**
 * Deliberately NOT measured from the live DOM/font (no `textLength` /
 * `lengthAdjust="spacingAndGlyphs"`): that SVG auto-fit trick re-measures the
 * text against whatever font is loaded AT PAINT TIME, and Remotion's video
 * render parallelises frames across multiple browser pages — on frames where
 * Montserrat hadn't finished loading yet in that particular page, the text got
 * measured with fallback-font metrics and rendered shifted out of the plaque.
 * Invisible in Studio (one long-lived, already-warm tab) but a visible jump
 * frame-to-frame in the exported video. A pure function of the label length
 * can't race with anything, so it's pixel-stable on every frame everywhere.
 */
const plaqueFontSize = (size: number, label: string) => {
  const availablePx = size * (148 / 264);
  return Math.min(size * 0.052, availablePx / (label.length * 0.62));
};

export const PortraitPhoto: React.FC<{
  /** Rendered height in px (width derives from the frame's aspect). */
  size: number;
  /** Path under `public/`, e.g. "projects/marginal-utility/portraits/smith.jpg". */
  src: string;
  /** Name on the plaque. Auto-fits the plaque width. */
  label?: string;
  /** Tint for the frame moulding. */
  frameColor?: string;
  /**
   * How the photo is anchored inside the (portrait, ~0.87 aspect) opening.
   * "center top" keeps the head when a taller-than-the-opening image is cropped.
   */
  objectPosition?: React.CSSProperties["objectPosition"];
  /**
   * STATIC framing zoom, anchored on `objectPosition` — use it to pull in on the
   * sitter's head when the source is a full seated portrait, instead of editing
   * the (public-domain, better left untouched) original. 1 = no zoom.
   *
   * This is a fixed framing choice, NOT a Ken-Burns move: it never animates.
   */
  crop?: number;
  /** Dim the whole portrait (e.g. an idea that has been superseded). */
  opacity?: number;
  style?: React.CSSProperties;
}> = ({
  size,
  src,
  label,
  frameColor = PASTEL.brown,
  objectPosition = "center top",
  crop = 1,
  opacity = 1,
  style,
}) => {
  const width = size * (VB_W / VB_H);

  return (
    <div style={{ position: "relative", width, height: size, opacity, ...style }}>
      {/* BELOW the photo: the moulding (its paper knockout would cover the
          photo otherwise) plus the name plaque. */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={width}
        height={size}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <PencilDefs scale={3} />

        <Part width={5.2} hatch={{ gap: 6, cross: true, color: frameColor, opacity: 0.7 }}>
          <polygon points="8,8 192,8 192,214 8,214" />
        </Part>

        {label ? (
          <Part width={4.2} hatch={{ gap: 6, color: frameColor, opacity: 0.5 }}>
            <polygon points="26,222 174,222 174,256 26,256" />
          </Part>
        ) : null}
      </svg>

      {/* the plaque name, as plain HTML text — see `plaqueFontSize` for why
          this isn't an SVG `textLength`-fitted `<text>`. */}
      {label ? (
        <div
          style={{
            position: "absolute",
            left: pct(26, VB_W),
            top: pct(222, VB_H),
            width: pct(148, VB_W),
            height: pct(34, VB_H),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: montserrat.fontFamily,
            fontWeight: 900,
            fontSize: plaqueFontSize(size, label),
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}

      {/* the photograph, inset into the canvas opening */}
      <div
        style={{
          position: "absolute",
          left: pct(CANVAS.x, VB_W),
          top: pct(CANVAS.y, VB_H),
          width: pct(CANVAS.w, VB_W),
          height: pct(CANVAS.h, VB_H),
          overflow: "hidden",
          background: "#1E1B16",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            transform: crop === 1 ? undefined : `scale(${crop})`,
            transformOrigin: typeof objectPosition === "string" ? objectPosition : undefined,
          }}
        />
      </div>

      {/* ABOVE the photo: the hand-drawn ink edge of the opening, so the photo
          is bounded by a pencil line rather than a clean rectangle. */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={width}
        height={size}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      >
        <PencilDefs scale={3} />
        <Sketch width={4} stroke={INK}>
          <polygon points={CANVAS_PTS} />
        </Sketch>
      </svg>
    </div>
  );
};
