import React from "react";
import { interpolate, random } from "remotion";
import { INK, PAPER, PASTEL, PencilDefs, Part, Hatch, Sketch, ROUGH_A } from "./_pencil";

/**
 * Reusable pencil-on-paper ECONOMICS objects (macket look), shared across
 * economics explainers: the sand pile / gold bar comparison, sacks of a good,
 * price tags, thought bubbles, and the "needs" a good can satisfy (house, road,
 * sandbox, beach, crate).
 *
 * Each renders a standalone <svg> whose HEIGHT is `size` (width derives from the
 * object's aspect); place it in a flex or absolute-positioned parent. Faceted
 * geometry, graphite outline, optional coloured-pencil hatch. Fully
 * deterministic — no randomness, no state.
 */

type Obj = {
  /** Rendered height in px (width derives from the object's aspect). */
  size: number;
  /** Coloured-pencil tint for the fill hatch. */
  color?: string;
  style?: React.CSSProperties;
};

/** Warm sand tone. */
export const SAND = PASTEL.brown;
/** Old-gold tone (matches the paper palette's `secondary`). */
export const GOLD = "#B07E2B";

const FONT = "Montserrat, sans-serif";

/**
 * IMPORTANT — the pencil `rough*` filters use the default `objectBoundingBox`
 * filter units, so a filtered <g> whose contents have a ZERO-area bbox (a single
 * perfectly horizontal or vertical <line>) renders NOTHING. Every axis-aligned
 * line below is therefore nudged by a pixel on the other axis — which also
 * matches the hand-drawn look, since nothing is ever perfectly straight.
 */

const wrap = (
  vbW: number,
  vbH: number,
  size: number,
  style: React.CSSProperties | undefined,
  children: React.ReactNode,
) => (
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

/* ────────────────────────────────────────────────────────────────────────── */

/**
 * A big heap of sand — the "worthless but plentiful" good.
 *
 * `label` plants a little pennant in the crest carrying a unit number, so a row
 * of heaps reads as "1st, 2nd, 3rd… unit of the same good" (same idea as the
 * number printed on `SandSackPencil`).
 */
export const SandPilePencil: React.FC<Obj & { label?: string }> = ({ size, color = SAND, style, label }) =>
  wrap(260, 150, size, style, (
    <>
      {/* the mound */}
      <Part width={5} hatch={{ gap: 6, color }}>
        <polygon points="8,142 56,88 104,58 150,38 198,76 234,106 252,142" />
      </Part>
      {/* shaded left flank for volume */}
      <Hatch gap={4} cross color={color} opacity={0.55}>
        <polygon points="8,142 56,88 104,58 150,38 118,142" />
      </Hatch>
      {/* contour ridges */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.7}>
        <polyline points="150,40 138,74 156,104 142,138" />
        <polyline points="64,104 96,110 118,132" />
        <polyline points="186,88 206,110 200,138" />
      </g>
      {/* loose grains at the foot */}
      <g fill={INK} opacity={0.7}>
        <circle cx={16} cy={146} r={2.4} />
        <circle cx={34} cy={148} r={1.8} />
        <circle cx={244} cy={147} r={2.2} />
      </g>
      {/* ground line (nudged: a flat line would have a zero-area filter bbox) */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
        <line x1={0} y1={143} x2={260} y2={145} />
      </g>
      {/* numbered pennant planted in the crest */}
      {label ? (
        <>
          {/* pole (x's differ: a vertical line has a zero-area filter bbox) */}
          <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
            <line x1={149} y1={56} x2={151} y2={4} />
          </g>
          <Part width={4.2} hatch={{ gap: 7, color: PASTEL.yellow, opacity: 0.5 }}>
            <polygon points="151,4 246,4 236,27 246,50 151,50" />
          </Part>
          <text
            x={194}
            y={41}
            textAnchor="middle"
            fontFamily={FONT}
            fontWeight={900}
            fontSize={40}
            fill={INK}
          >
            {label}
          </text>
        </>
      ) : null}
    </>
  ));

/** A cast gold ingot — the "scarce and dear" good. */
export const GoldBarPencil: React.FC<Obj> = ({ size, color = GOLD, style }) =>
  wrap(200, 140, size, style, (
    <>
      {/* top face */}
      <Part width={5} hatch={{ gap: 5, color }}>
        <polygon points="58,38 142,38 168,68 32,68" />
      </Part>
      {/* front face (darker) */}
      <Part width={5} hatch={{ gap: 4, cross: true, color, opacity: 0.8 }}>
        <polygon points="32,68 168,68 180,118 20,118" />
      </Part>
      {/* struck mark + shine */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85}>
        <line x1={72} y1={50} x2={128} y2={50} />
        <polyline points="52,86 60,104 74,86" />
      </g>
      <g filter={`url(#${ROUGH_A})`} stroke={PAPER} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
        <line x1={122} y1={86} x2={150} y2={80} />
      </g>
    </>
  ));

/** A sack of a bulk good (sand, grain…). `label` prints a number on the cloth. */
export const SandSackPencil: React.FC<Obj & { label?: string }> = ({ size, color = SAND, style, label }) =>
  wrap(160, 190, size, style, (
    <>
      {/* body — narrow at the tied neck, bulging at the bottom */}
      <Part width={5} hatch={{ gap: 6, color }}>
        <polygon points="42,52 118,52 150,116 140,160 20,160 10,116" />
      </Part>
      {/* bottom shadow */}
      <Hatch gap={4} cross color={color} opacity={0.5}>
        <polygon points="20,160 140,160 146,124 14,124" />
      </Hatch>
      {/* gathered cloth above the tie */}
      <Part width={4.4} hatch={{ gap: 5, color, opacity: 0.7 }}>
        <polygon points="60,14 100,14 108,48 52,48" />
      </Part>
      {/* the tie + creases in the gathered cloth */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4.2} fill="none" strokeLinecap="round">
        <line x1={46} y1={47} x2={114} y2={50} />
        <line x1={68} y1={20} x2={92} y2={42} />
        <line x1={92} y1={20} x2={68} y2={42} />
      </g>
      {label ? (
        <text
          x={80}
          y={124}
          textAnchor="middle"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={52}
          fill={INK}
          opacity={0.85}
        >
          {label}
        </text>
      ) : null}
    </>
  ));

/** A hanging price tag. `text` is the price ("$", "$$$", "8 ₴"…). */
export const PriceTagPencil: React.FC<Obj & { text: string }> = ({ size, color = PASTEL.yellow, style, text }) =>
  wrap(150, 82, size, style, (
    <>
      <Part width={4.4} hatch={{ gap: 7, color, opacity: 0.75 }}>
        <polygon points="24,8 142,8 142,74 24,74 6,41" />
      </Part>
      <circle cx={22} cy={41} r={5.4} fill={PAPER} stroke={INK} strokeWidth={3} />
      <text
        x={88}
        y={57}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={text.length > 3 ? 32 : 40}
        fill={INK}
      >
        {text}
      </text>
    </>
  ));

/** A dress — a good whose worth is plainly in the eye of the beholder. */
export const DressPencil: React.FC<Obj> = ({ size, color = PASTEL.pink, style }) =>
  wrap(150, 190, size, style, (
    <>
      {/* skirt */}
      <Part width={5} hatch={{ gap: 6, color }}>
        <polygon points="46,78 104,78 138,168 12,168" />
      </Part>
      {/* bodice */}
      <Part width={4.6} hatch={{ gap: 4, cross: true, color, opacity: 0.75 }}>
        <polygon points="52,34 98,34 104,80 46,80" />
      </Part>
      {/* straps + waist + hem folds */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
        <polyline points="58,34 66,16" />
        <polyline points="92,34 84,16" />
      </g>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.7}>
        <polyline points="70,86 62,164" />
        <polyline points="86,86 96,164" />
      </g>
    </>
  ));

/** A stretch of road running into the distance. */
export const RoadPencil: React.FC<Obj> = ({ size, color = PASTEL.gray, style }) =>
  wrap(220, 130, size, style, (
    <>
      <Part width={5} hatch={{ gap: 7, color }}>
        <polygon points="80,18 140,18 208,116 12,116" />
      </Part>
      {/* centre dashes, widening toward the viewer (x nudged: see the note above) */}
      <g filter={`url(#${ROUGH_A})`} stroke={PAPER} strokeWidth={9} fill="none" strokeLinecap="round">
        <line x1={109} y1={26} x2={111} y2={44} />
        <line x1={109} y1={58} x2={111} y2={80} />
        <line x1={109} y1={94} x2={111} y2={114} />
      </g>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
        <line x1={109} y1={26} x2={111} y2={44} />
        <line x1={109} y1={58} x2={111} y2={80} />
        <line x1={109} y1={94} x2={111} y2={114} />
      </g>
    </>
  ));

/** A children's sandbox: board frame, sand inside, a little bucket. */
export const SandboxPencil: React.FC<Obj> = ({ size, color = SAND, style }) =>
  wrap(200, 130, size, style, (
    <>
      {/* back board */}
      <Part width={4.2} hatch={{ gap: 6, color: PASTEL.brown, opacity: 0.7 }}>
        <polygon points="26,50 174,50 174,66 26,66" />
      </Part>
      {/* sand bed */}
      <Part width={4} hatch={{ gap: 4, color }}>
        <polygon points="30,64 170,64 158,104 42,104" />
      </Part>
      {/* bucket */}
      <Part width={3.6} hatch={{ gap: 5, cross: true, color: PASTEL.blue, opacity: 0.8 }}>
        <polygon points="72,70 96,70 92,96 76,96" />
      </Part>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M72,70 q12,-16 24,0" />
      </g>
      {/* front board + side posts */}
      <Part width={4.6} hatch={{ gap: 6, color: PASTEL.brown, opacity: 0.8 }}>
        <polygon points="20,96 180,96 180,114 20,114" />
      </Part>
      <Part width={4}>
        <polygon points="14,46 30,46 30,120 14,120" />
      </Part>
      <Part width={4}>
        <polygon points="170,46 186,46 186,120 170,120" />
      </Part>
    </>
  ));

/** A sandy beach with a couple of waves and a parasol. */
export const BeachPencil: React.FC<Obj> = ({ size, color = SAND, style }) =>
  wrap(230, 130, size, style, (
    <>
      {/* sea */}
      <Part width={4.2} hatch={{ gap: 7, color: PASTEL.blue, opacity: 0.8 }}>
        <polygon points="0,18 230,18 230,60 0,60" />
      </Part>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" opacity={0.75}>
        <path d="M14,32 q14,-8 28,0 q14,8 28,0 q14,-8 28,0" />
        <path d="M96,46 q14,-8 28,0 q14,8 28,0 q14,-8 28,0" />
      </g>
      {/* sand */}
      <Part width={5} hatch={{ gap: 5, color }}>
        <polygon points="0,58 230,52 230,124 0,124" />
      </Part>
      {/* parasol (pole x nudged: see the note above) */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4.4} fill="none" strokeLinecap="round">
        <line x1={159} y1={64} x2={161} y2={112} />
      </g>
      <Part width={4.4} hatch={{ gap: 5, cross: true, color: "#BC5147", opacity: 0.75 }}>
        <polygon points="124,66 160,40 196,66" />
      </Part>
    </>
  ));

/** A dug pit in the ground with the spoil heaped beside it. */
export const SandPitPencil: React.FC<Obj> = ({ size, color = SAND, style }) =>
  wrap(280, 150, size, style, (
    <>
      {/* ground (nudged: see the note above) */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4.6} fill="none" strokeLinecap="round">
        <line x1={0} y1={95} x2={280} y2={97} />
      </g>
      {/* spoil heap on the left */}
      <Part width={4.6} hatch={{ gap: 6, color }}>
        <polygon points="4,96 34,62 68,80 92,96" />
      </Part>
      {/* the pit */}
      <Part width={5} base={PAPER} hatch={{ gap: 3.4, cross: true, color: INK, opacity: 0.7 }}>
        <polygon points="112,96 216,96 198,144 130,144" />
      </Part>
      {/* depth strokes */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6}>
        <line x1={132} y1={100} x2={140} y2={140} />
        <line x1={196} y1={100} x2={188} y2={140} />
      </g>
    </>
  ));

/* ────────────────────────────────────────────────────────────────────────── */

const SPRAY_VB_W = 380;
const SPRAY_VB_H = 170;
/** Grains are thrown from the BOTTOM CENTRE of the viewBox (the pit rim). */
const SPRAY_X0 = SPRAY_VB_W / 2;
const SPRAY_Y0 = 150;
/**
 * How long grains stay airborne, in phase radians (~15 frames at 0.16 rad/frame).
 * Exported so a scene can time a "the dirt settles into a growing pile" beat to
 * finish exactly when the thrown grains land (see `LaborTheoryScene`).
 */
export const SPRAY_LIFE = 2.4;
/** Downward acceleration, viewBox units per radian². */
const SPRAY_G = 150;

/**
 * Sand thrown out of a pit at the moment a shovel strikes it.
 *
 * The caller passes the SAME continuous dig phase (in radians) that drives the
 * shovel's `swing`, and this component works out which strike it is on and how
 * long ago that strike landed — so nothing has to be wired up twice. Grains are
 * drawn only in a short window right after each impact, fly out along a
 * parabola, and fade as they land.
 *
 * Convention (matches `swing = 0.5 - 0.5 * cos(cyclePhase)`): the blade is fully
 * driven down when `cos(cyclePhase) = -1`, i.e. at `cyclePhase = π + 2πk`.
 *
 * Place the component so that the BOTTOM CENTRE of its box sits on the pit rim.
 * Per-grain angle/speed/size come from `random('sand-spray-…')` — deterministic,
 * but re-rolled every strike so no two throws look alike.
 */
export const SandSprayPencil: React.FC<Obj & { cyclePhase: number; count?: number }> = ({
  size,
  color = SAND,
  style,
  cyclePhase,
  count = 10,
}) => {
  // Time since the first strike, then folded into the current 2π dig cycle.
  const since = cyclePhase - Math.PI;
  const strike = Math.floor(since / (2 * Math.PI));
  const t = since - strike * 2 * Math.PI;
  if (since < 0 || t > SPRAY_LIFE) return null;

  const fade = interpolate(t, [0, SPRAY_LIFE * 0.6, SPRAY_LIFE], [1, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // A short burst of impact strokes right at the rim.
  const kick = interpolate(t, [0, 0.55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const grains: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = random(`sand-spray-a-${i}-${strike}`);
    const r2 = random(`sand-spray-b-${i}-${strike}`);
    const r3 = random(`sand-spray-c-${i}-${strike}`);
    const dir = i % 2 === 0 ? 1 : -1;
    const ang = ((40 + r1 * 42) * Math.PI) / 180; // 40…82° above the horizon
    const v = 132 + r2 * 62;
    const vx = dir * Math.cos(ang) * v * (0.7 + r3 * 0.5);
    const vy = -Math.sin(ang) * v;
    const px = SPRAY_X0 + vx * t;
    const py = SPRAY_Y0 + vy * t + 0.5 * SPRAY_G * t * t;
    if (py > SPRAY_Y0 + 4) continue; // it has already landed
    grains.push(
      <circle
        key={i}
        cx={px}
        cy={py}
        r={3.6 + r3 * 4.6}
        fill={color}
        stroke={INK}
        strokeWidth={1.6}
      />,
    );
  }

  return wrap(SPRAY_VB_W, SPRAY_VB_H, size, style, (
    <g opacity={fade}>
      {kick > 0 ? (
        <g
          filter={`url(#${ROUGH_A})`}
          stroke={INK}
          strokeWidth={2.6}
          fill="none"
          strokeLinecap="round"
          opacity={kick * 0.7}
        >
          <line x1={SPRAY_X0 - 24} y1={146} x2={SPRAY_X0 - 52} y2={126} />
          <line x1={SPRAY_X0 + 24} y1={146} x2={SPRAY_X0 + 52} y2={126} />
          <line x1={SPRAY_X0 - 1} y1={142} x2={SPRAY_X0 + 1} y2={114} />
        </g>
      ) : null}
      {grains}
    </g>
  ));
};

/* ────────────────────────────────────────────────────────────────────────── */

/** A braced wooden crate — "тримати про запас". */
export const CratePencil: React.FC<Obj> = ({ size, color = PASTEL.brown, style }) =>
  wrap(170, 130, size, style, (
    <>
      <Part width={5} hatch={{ gap: 7, color }}>
        <polygon points="18,32 152,32 152,112 18,112" />
      </Part>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
        <line x1={18} y1={48} x2={152} y2={48} />
        <line x1={18} y1={48} x2={152} y2={112} />
        <line x1={152} y1={48} x2={18} y2={112} />
      </g>
      {/* lid overhang */}
      <Part width={4.4} hatch={{ gap: 5, cross: true, color, opacity: 0.6 }}>
        <polygon points="10,20 160,20 160,34 10,34" />
      </Part>
    </>
  ));

/**
 * A jar of a dairy good (the "сметана" from `seller-margin`) — foil lid,
 * glass body, a plain label band. Kept deliberately generic (no brand text)
 * so it reads as "a jar of the product", not a specific package.
 */
export const JarPencil: React.FC<Obj> = ({ size, color = PASTEL.blue, style }) =>
  wrap(120, 170, size, style, (
    <>
      {/* foil lid */}
      <Part width={4.6} hatch={{ gap: 5, cross: true, color: SAND, opacity: 0.75 }}>
        <polygon points="20,14 100,14 104,34 16,34" />
      </Part>
      {/* glass body */}
      <Part width={5} base={PAPER} hatch={{ gap: 6, color: INK, opacity: 0.18 }}>
        <polygon points="22,34 98,34 106,150 14,150" />
      </Part>
      {/* label band */}
      <Part width={4} hatch={{ gap: 5, color, opacity: 0.7 }}>
        <polygon points="16,84 104,84 102,120 18,120" />
      </Part>
      {/* rim + shine */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8}>
        <line x1={20} y1={34} x2={100} y2={34} />
      </g>
      <g filter={`url(#${ROUGH_A})`} stroke={PAPER} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85}>
        <line x1={30} y1={44} x2={26} y2={140} />
      </g>
    </>
  ));

/** A long-handled shovel. Used stand-alone or by `DiggerPencil`. */
export const ShovelPencil: React.FC<Obj> = ({ size, color = PASTEL.gray, style }) =>
  wrap(70, 190, size, style, (
    <>
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round">
        <line x1={35} y1={10} x2={35} y2={122} />
        <line x1={19} y1={10} x2={51} y2={10} />
      </g>
      <Part width={4.6} hatch={{ gap: 5, color }}>
        <polygon points="16,122 54,122 47,172 23,172" />
      </Part>
    </>
  ));

/**
 * A hand-drawn thought bubble carrying a short piece of text — used to show what
 * a buyer privately reckons a good is worth ("$", "$$$"). `tailSide` puts the
 * trailing dots on the left (`-1`) or right (`1`) of the cloud.
 */
export const ThoughtBubblePencil: React.FC<
  Obj & { text: string; tailSide?: 1 | -1; textColor?: string }
> = ({ size, color = PASTEL.yellow, style, text, tailSide = -1, textColor = INK }) =>
  wrap(230, 176, size, style, (
    <>
      {/* trailing dots */}
      <g transform={tailSide === -1 ? undefined : "translate(230 0) scale(-1 1)"}>
        <Part width={4}>
          <circle cx={52} cy={140} r={12} />
        </Part>
        <Part width={3.4}>
          <circle cx={26} cy={164} r={8} />
        </Part>
      </g>
      {/* the cloud (faceted, hand-drawn) */}
      <Part width={5} hatch={{ gap: 9, color, opacity: 0.55 }}>
        <polygon points="22,58 42,26 78,12 116,22 152,10 192,32 208,64 196,102 158,120 104,128 56,116 24,92" />
      </Part>
      <text
        x={112}
        y={84}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={text.length > 2 ? 54 : 66}
        fill={textColor}
      >
        {text}
      </text>
    </>
  ));

/** A struck coin, face up. `value` prints the denomination on the face. */
export const CoinPencil: React.FC<Obj & { value: string }> = ({ size, color = "#B8B4A6", style, value }) =>
  wrap(200, 200, size, style, (
    <>
      <Part width={5} hatch={{ gap: 6, cross: true, color, opacity: 0.6 }}>
        <circle cx={100} cy={101} r={92} />
      </Part>
      {/* milled edge ring + inner rim */}
      <g filter={`url(#${ROUGH_A})`} stroke={INK} strokeWidth={2.4} fill="none" opacity={0.7}>
        <circle cx={100} cy={100} r={76} />
      </g>
      <text
        x={100}
        y={124}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={value.length > 2 ? 52 : 68}
        fill={INK}
      >
        {value}
      </text>
    </>
  ));

/** Small helper: a pencil "=" / "vs" divider between two compared objects. */
export const VersusMark: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 120,
  color = INK,
  style,
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible", ...style }}>
    <PencilDefs scale={3} />
    <Sketch width={6} stroke={color}>
      <polyline points="30,26 62,50 30,74" />
    </Sketch>
    <Sketch width={6} stroke={color}>
      <polyline points="62,26 94,50 62,74" />
    </Sketch>
  </svg>
);
