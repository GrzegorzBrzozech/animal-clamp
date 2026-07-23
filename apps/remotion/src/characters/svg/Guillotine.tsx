import React from "react";
import { INK, PencilDefs, Part, Sketch } from "./_pencil";

const WOOD = "#9A7230";
const STEEL = "#A8B0BC";

/**
 * Classic guillotine (pencil style) with severed head in basket.
 * viewBox 160×340; y=340 = ground level.
 * Position with `top = GROUND - 340` at the scene's 1× scale,
 * or override via `style`.
 */
export const Guillotine: React.FC<{
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ opacity = 1, style }) => (
  <svg
    viewBox="0 0 160 340"
    style={{
      position: "absolute",
      left: 1680,
      top: 80,
      width: 320,
      height: 680,
      opacity,
      overflow: "visible",
      ...style,
    }}
  >
    <PencilDefs scale={3.5} />

    {/* ── Left post ─────────────────────────────────────────── */}
    <Part hatch={{ gap: 6, color: WOOD, opacity: 0.78 }}>
      <polygon points="2,28 30,28 30,310 2,310" />
    </Part>

    {/* ── Right post ────────────────────────────────────────── */}
    <Part hatch={{ gap: 6, color: WOOD, opacity: 0.78 }}>
      <polygon points="130,28 158,28 158,310 130,310" />
    </Part>

    {/* ── Top crossbeam ─────────────────────────────────────── */}
    <Part hatch={{ gap: 5, color: WOOD, opacity: 0.86 }}>
      <polygon points="0,0 160,0 160,30 0,30" />
    </Part>

    {/* ── Pulley ────────────────────────────────────────────── */}
    <Part hatch={{ gap: 3, color: "#C0C0C0", opacity: 0.9 }}>
      <circle cx={80} cy={15} r={11} />
    </Part>

    {/* ── Rope ──────────────────────────────────────────────── */}
    <Sketch width={2.5}>
      <line x1={80} y1={26} x2={80} y2={50} />
    </Sketch>

    {/* ── Angled blade ──────────────────────────────────────── */}
    <Part hatch={{ gap: 3, cross: true, color: STEEL, opacity: 0.94 }} stroke={INK} width={3}>
      <polygon points="30,40 130,40 130,70 30,96" />
    </Part>
    <Sketch width={5}>
      <polyline points="30,96 130,70" />
    </Sketch>
    <Sketch width={2} stroke="#E8EAF0">
      <line x1={42} y1={90} x2={118} y2={66} />
    </Sketch>

    {/* ── Channel guides ────────────────────────────────────── */}
    <Sketch width={2.5}>
      <line x1={30} y1={30} x2={30} y2={280} />
      <line x1={130} y1={30} x2={130} y2={280} />
    </Sketch>

    {/* ── Cross-brace ───────────────────────────────────────── */}
    <Sketch width={2}>
      <line x1={30} y1={200} x2={130} y2={222} />
    </Sketch>

    {/* ── Lunette (neck clamp) ──────────────────────────────── */}
    <Part width={3.5}>
      <path d="M 44,274 Q 80,244 116,274 L 116,294 L 44,294 Z" />
    </Part>

    {/* ── Severed head — tilted 50° CCW, sad expression ─────── */}
    <g transform="rotate(-50, 80, 310)">
      <Part hatch={{ gap: 7, color: INK, opacity: 0.18 }}>
        <circle cx={80} cy={310} r={24} />
      </Part>
      <Sketch width={2.8}>
        <circle cx={80} cy={310} r={24} />
      </Sketch>
      {/* Left eye X */}
      <Sketch width={3}>
        <line x1={68} y1={300} x2={76} y2={308} />
        <line x1={76} y1={300} x2={68} y2={308} />
      </Sketch>
      {/* Right eye X */}
      <Sketch width={3}>
        <line x1={84} y1={300} x2={92} y2={308} />
        <line x1={92} y1={300} x2={84} y2={308} />
      </Sketch>
      {/* Sad mouth — corners droop */}
      <Sketch width={1.8}>
        <path d="M 70,318 Q 80,313 90,318" fill="none" />
      </Sketch>
    </g>
  </svg>
);
