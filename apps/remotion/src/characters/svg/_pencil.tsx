import React from "react";

/**
 * Shared "bold pencil on paper" style system for code-drawn characters.
 *
 * The look has three ingredients, all deterministic (SVG filters use a fixed
 * `seed`, so lines never "boil" frame to frame):
 *   1. a warm paper background (see `PaperBackground`);
 *   2. wobbly hand-drawn outlines (the `rough*` displacement filters);
 *   3. a faint graphite grain inside fills (`grain` filter).
 *
 * Characters draw with `INK` strokes + pastel `PASTEL.*` fills, wrap their art
 * in <g filter={`url(#${roughId})`}> and drop one <PencilDefs/> per <svg>.
 */

/** Graphite, not pure black — reads as pencil. */
export const INK = "#3A352E";
export const INK_SOFT = "#3A352E99";
/** Warm cream paper. */
export const PAPER = "#EDE7D6";
export const PAPER_DARK = "#E2DBC6";

/** Muted pastel accents to optionally tint a creature. */
export const PASTEL = {
  green: "#AFCBA3",
  pink: "#E8B9B7",
  blue: "#A9C5D8",
  yellow: "#E7D49C",
  brown: "#C9A98A",
  gray: "#BFC2BE",
} as const;

/** Three roughen filters so an outline drawn three times gets three wobbles. */
export const ROUGH_A = "pencil-rough-a";
export const ROUGH_B = "pencil-rough-b";
export const ROUGH_C = "pencil-rough-c";
export const GRAIN = "pencil-grain";

/**
 * Filter defs. Render exactly one per <svg>. `scale` controls how wobbly the
 * outlines/hatching are (higher = rougher, "drawn over several times" edges).
 */
export const PencilDefs: React.FC<{ scale?: number }> = ({ scale = 3.4 }) => (
  <defs>
    <filter id={ROUGH_A} x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={4} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={ROUGH_B} x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} seed={19} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale * 1.25} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={ROUGH_C} x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={31} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale * 0.85} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* Faint graphite speckle multiplied over fills. */}
    <filter id={GRAIN} x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={11} result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" result="ga" />
      <feComposite in="ga" in2="SourceGraphic" operator="in" result="speck" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="speck" />
      </feMerge>
    </filter>
  </defs>
);

/**
 * Sketchy outline drawn as THREE overlapping pencil passes (wobbles A/B/C, each
 * slightly offset) so edges read as "наведено кілька разів". Children are plain
 * SVG shapes (polygon/path/circle/line); keep geometry FACETED (straight
 * segments, sharp corners). `fill` is rarely used now — tone comes from <Hatch>;
 * pass a fill only for solid bits (eyes, paper highlights).
 */
export const Sketch: React.FC<{
  fill?: string;
  stroke?: string;
  width?: number;
  children: React.ReactNode;
}> = ({ fill = "none", stroke = INK, width = 4.5, children }) => {
  const clone = (extra: Record<string, unknown>) =>
    React.Children.map(children, (c) => (React.isValidElement(c) ? React.cloneElement(c, extra) : c));
  return (
    <>
      {fill !== "none" ? (
        <g filter={`url(#${ROUGH_C})`} fill={fill} stroke="none">
          {clone({ stroke: "none" })}
        </g>
      ) : null}
      <g filter={`url(#${ROUGH_A})`} fill="none" stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round">
        {clone({ fill: "none" })}
      </g>
      <g
        filter={`url(#${ROUGH_B})`}
        fill="none"
        stroke={stroke}
        strokeWidth={width * 0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.6}
        transform="translate(0.6 -0.4)"
      >
        {clone({ fill: "none" })}
      </g>
      <g
        filter={`url(#${ROUGH_C})`}
        fill="none"
        stroke={stroke}
        strokeWidth={width * 0.7}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.42}
        transform="translate(-0.5 0.5)"
      >
        {clone({ fill: "none" })}
      </g>
    </>
  );
};

/**
 * Pencil tonal fill: parallel hand-drawn strokes clipped to a shape. Darker tone
 * = smaller `gap` or `cross` (cross-hatch). Default colour is graphite (`INK`);
 * pass `color` for a coloured-pencil hatch. Children are the clip shape(s).
 *
 *   <Hatch gap={7}>{<polygon points="…" />}</Hatch>           // light graphite
 *   <Hatch gap={4} cross>{<polygon points="…" />}</Hatch>     // dark shadow zone
 *   <Hatch color={PASTEL.blue}>{…}</Hatch>                    // blue colour pencil
 */
export const Hatch: React.FC<{
  angle?: number;
  gap?: number;
  color?: string;
  width?: number;
  cross?: boolean;
  opacity?: number;
  children: React.ReactNode;
}> = ({ angle = -40, gap = 7, color = INK, width = 1.4, cross = false, opacity = 0.8, children }) => {
  const id = "clip-" + React.useId().replace(/[:]/g, "");
  const S = 320; // generous span; clipped to the shape regardless of viewBox
  const ks: number[] = [];
  for (let k = -S; k <= 2 * S; k += gap) ks.push(k);
  const c = S / 2;
  const Lines = ({ a }: { a: number }) => (
    <g transform={`rotate(${a} ${c} ${c})`}>
      {ks.map((k, i) => (
        <line key={i} x1={-S} y1={k} x2={2 * S} y2={k} />
      ))}
    </g>
  );
  return (
    <>
      <clipPath id={id}>{children}</clipPath>
      <g clipPath={`url(#${id})`} opacity={opacity}>
        <g filter={`url(#${ROUGH_A})`} stroke={color} strokeWidth={width} strokeLinecap="round">
          <Lines a={angle} />
          {cross ? <Lines a={angle + 78} /> : null}
        </g>
      </g>
    </>
  );
};

/**
 * A body PART with occlusion. Draws, in order: an opaque PAPER knockout of the
 * shape (hides the seams of parts drawn BEHIND it), then optional `hatch` tone,
 * then the 3-pass outline. Draw parts BACK-TO-FRONT so each one cleanly covers
 * what's under it — this is what keeps overlapping limbs legible instead of a
 * tangle of crossing lines. Children are closed shapes (polygon/path/circle).
 *
 *   <Part>{<polygon points="…" />}</Part>                       // bare skin (paper)
 *   <Part hatch={{ gap: 3, cross: true, color: tone }}>{…}</Part> // shaded cloth
 */
export const Part: React.FC<{
  hatch?: { gap?: number; cross?: boolean; color?: string; opacity?: number; angle?: number } | false;
  width?: number;
  stroke?: string;
  /** Knockout colour (default paper). */
  base?: string;
  children: React.ReactNode;
}> = ({ hatch = false, width = 4.5, stroke = INK, base = PAPER, children }) => {
  const fillClone = React.Children.map(children, (c) =>
    React.isValidElement(c) ? React.cloneElement(c, { fill: base, stroke: "none" } as Record<string, unknown>) : c,
  );
  return (
    <>
      <g filter={`url(#${ROUGH_C})`} fill={base} stroke="none">
        {fillClone}
      </g>
      {hatch ? (
        <Hatch gap={hatch.gap} cross={hatch.cross} color={hatch.color} opacity={hatch.opacity} angle={hatch.angle}>
          {children}
        </Hatch>
      ) : null}
      <Sketch width={width} stroke={stroke}>
        {children}
      </Sketch>
    </>
  );
};

/** Full-frame warm paper sheet with a subtle fibre grain. Drop behind a scene. */
export const PaperBackground: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: PAPER }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="paper-fibre">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves={3} seed={2} result="f" />
          <feColorMatrix in="f" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id="paper-speck">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={6} result="s" />
          <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={PAPER_DARK} filter="url(#paper-fibre)" />
      <rect width="100%" height="100%" filter="url(#paper-speck)" />
    </svg>
  </div>
);
