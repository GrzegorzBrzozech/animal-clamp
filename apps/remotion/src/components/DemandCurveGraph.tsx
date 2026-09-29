import React from "react";
import { INK, PAPER, PencilDefs, ROUGH_A, Sketch } from "~/characters/svg/_pencil";
import { usePalette } from "~/theme/palette";
import { montserrat } from "~/lib/fonts";

/**
 * A DEMAND SCHEDULE drawn in pencil: price on the vertical axis, quantity on the
 * horizontal one, plus a projection line that slides down the curve so a scene
 * can say "the lower the price, the more units get bought".
 *
 * Presentational and frame-agnostic — the caller owns the animation and passes a
 * fractional `active` index into `steps` (e.g. `2.4` = between step 3 and 4).
 * Colours come from the active palette, so it works on paper and on dark.
 */

export type DemandStep = {
  /** Price of that unit, in whatever unit the caller labels. */
  price: number;
  /** How many units are bought at that price. */
  qty: number;
  /** Optional short caption for the need this unit satisfies. */
  label?: string;
};

type Props = {
  steps: DemandStep[];
  /** Fractional index into `steps`; the projection line rides to it. */
  active: number;
  /** 0…1 — how much of the curve is drawn. */
  curveDraw?: number;
  width?: number;
  height?: number;
  maxPrice?: number;
  maxQty?: number;
  priceAxisLabel?: string;
  qtyAxisLabel?: string;
  /** Format the price tick / read-out. */
  formatPrice?: (p: number) => string;
  style?: React.CSSProperties;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Plot padding inside the graph's viewBox — exported so callers can align art to the axes. */
export const DEMAND_PAD = { L: 130, R: 70, T: 56, B: 86 } as const;

/** x of a quantity inside the graph's viewBox — use it to line things up under the x-axis. */
export const demandQtyX = (qty: number, width: number, maxQty: number) =>
  DEMAND_PAD.L + (qty / maxQty) * (width - DEMAND_PAD.L - DEMAND_PAD.R);

/** y of the x-axis inside the graph's viewBox. */
export const demandAxisY = (height: number) => height - DEMAND_PAD.B;

export const DemandCurveGraph: React.FC<Props> = ({
  steps,
  active,
  curveDraw = 1,
  width = 1000,
  height = 560,
  maxPrice,
  maxQty,
  priceAxisLabel = "ціна",
  qtyAxisLabel = "кількість одиниць →",
  formatPrice = (p) => `$${p}`,
  style,
}) => {
  const pal = usePalette();
  const { L: padL, R: padR, T: padT, B: padB } = DEMAND_PAD;

  const pMax = maxPrice ?? Math.max(...steps.map((s) => s.price)) * 1.15;
  const qMax = maxQty ?? Math.max(...steps.map((s) => s.qty)) * 1.15;

  const X = (q: number) => padL + (q / qMax) * (width - padL - padR);
  const Y = (p: number) => height - padB - (p / pMax) * (height - padB - padT);

  // Curve points, ordered by rising quantity (falling price).
  const ordered = [...steps].sort((a, b) => a.qty - b.qty);
  const shown = Math.max(2, Math.round(curveDraw * ordered.length));
  const curve = ordered
    .slice(0, shown)
    .map((s, i) => `${i === 0 ? "M" : "L"}${X(s.qty)},${Y(s.price)}`)
    .join(" ");

  // Current read-out: interpolate between the two bracketing steps.
  const clamped = Math.min(steps.length - 1, Math.max(0, active));
  const i0 = Math.floor(clamped);
  const i1 = Math.min(steps.length - 1, i0 + 1);
  const t = clamped - i0;
  const curPrice = lerp(steps[i0].price, steps[i1].price, t);
  const curQty = lerp(steps[i0].qty, steps[i1].qty, t);
  const cx = X(curQty);
  const cy = Y(curPrice);

  const axisColor: string = pal.text;
  const gridColor: string = pal.border;
  const curveColor: string = pal.primary;
  const markColor: string = pal.danger;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ overflow: "visible", fontFamily: montserrat.fontFamily, ...style }}
    >
      <PencilDefs scale={2.4} />

      {/* price ticks + faint gridlines.
          The gridline y's differ by a pixel on purpose: a perfectly flat line has
          a zero-area bbox, and the objectBoundingBox pencil filter would drop it. */}
      {steps.map((s) => (
        <g key={`tick-${s.price}`}>
          <g
            filter={`url(#${ROUGH_A})`}
            stroke={gridColor}
            strokeWidth={2.4}
            strokeDasharray="7 11"
            fill="none"
          >
            <line x1={padL} y1={Y(s.price) - 1} x2={width - padR} y2={Y(s.price) + 1} />
          </g>
          <text
            x={padL - 20}
            y={Y(s.price) + 10}
            textAnchor="end"
            fontSize={28}
            fontWeight={700}
            fill={axisColor}
            opacity={0.75}
          >
            {formatPrice(s.price)}
          </text>
        </g>
      ))}

      {/* quantity ticks */}
      {steps.map((s) => (
        <text
          key={`q-${s.qty}`}
          x={X(s.qty)}
          y={height - padB + 42}
          textAnchor="middle"
          fontSize={28}
          fontWeight={700}
          fill={axisColor}
          opacity={0.75}
        >
          {s.qty}
        </text>
      ))}

      {/* axes */}
      <Sketch width={5} stroke={axisColor}>
        <polyline points={`${padL},${padT - 24} ${padL},${height - padB} ${width - padR + 20},${height - padB}`} />
      </Sketch>
      {/* arrow heads */}
      <Sketch width={4.4} stroke={axisColor}>
        <polyline points={`${padL - 11},${padT - 12} ${padL},${padT - 28} ${padL + 11},${padT - 12}`} />
      </Sketch>
      <Sketch width={4.4} stroke={axisColor}>
        <polyline
          points={`${width - padR + 8},${height - padB - 11} ${width - padR + 24},${height - padB} ${width - padR + 8},${height - padB + 11}`}
        />
      </Sketch>

      <text
        x={padL - 26}
        y={padT - 30}
        textAnchor="end"
        fontSize={32}
        fontWeight={900}
        fill={axisColor}
      >
        {priceAxisLabel}
      </text>
      <text
        x={width - padR + 22}
        y={height - padB + 68}
        textAnchor="end"
        fontSize={30}
        fontWeight={900}
        fill={axisColor}
      >
        {qtyAxisLabel}
      </text>

      {/* the demand curve */}
      <g filter={`url(#${ROUGH_A})`}>
        <path d={curve} fill="none" stroke={curveColor} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* projection lines: price → curve → quantity */}
      <g filter={`url(#${ROUGH_A})`} stroke={markColor} strokeWidth={4.4} strokeDasharray="14 10" fill="none">
        <line x1={padL} y1={cy} x2={cx} y2={cy} />
        <line x1={cx} y1={cy} x2={cx} y2={height - padB} />
      </g>

      {/* the rider on the curve */}
      <circle cx={cx} cy={cy} r={16} fill={markColor} stroke={PAPER} strokeWidth={5} />

      {/* current read-out beside the rider. Both numbers are FLOORED so the
          read-out never claims a unit the caller has not shown as bought yet. */}
      <text
        x={cx + 30}
        y={cy - 18}
        fontSize={34}
        fontWeight={900}
        fill={markColor}
        stroke={PAPER}
        strokeWidth={6}
        paintOrder="stroke"
      >
        {formatPrice(Math.floor(curPrice))} → {Math.floor(curQty)}
      </text>

      {/* label of the need the last bought unit satisfies (top-right: the curve
          never reaches that corner, so nothing is covered) */}
      {steps[Math.floor(clamped)].label ? (
        <text
          x={width - padR}
          y={padT + 6}
          textAnchor="end"
          fontSize={30}
          fontWeight={700}
          fill={INK}
          opacity={0.85}
        >
          {steps[Math.floor(clamped)].label}
        </text>
      ) : null}
    </svg>
  );
};
