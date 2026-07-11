import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { HominidPencil, PaperBackground, INK } from "~/characters";

const VEGAN = "#3E6E9E"; // blue colour-pencil
const HUNTER = "#C0584E"; // red colour-pencil
const GROUND = 900;

/**
 * Paper showcase: vegans (blue, holding greens, no spear, munching) face off
 * against hunters (red, spear + meat) — the new pencil hominids, colour-coded,
 * with the food icons kept in their hands. Idle uses the livelier weight-shift +
 * blink + eat action (not the old vertical bob).
 */
export const VegansVsHunters: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const vegans = [
    { x: 360, scale: 2.0, phase: 0.0 },
    { x: 560, scale: 2.3, phase: 0.6 },
    { x: 760, scale: 2.0, phase: 1.2 },
  ];
  const hunters = [
    { x: 1160, scale: 2.0, phase: 0.3 },
    { x: 1360, scale: 2.3, phase: 0.9 },
    { x: 1560, scale: 2.0, phase: 1.5 },
  ];

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* soft ground line */}
      <div style={{ position: "absolute", left: 120, right: 120, top: GROUND + 8, height: 3, background: "#3A352E", opacity: 0.25, borderRadius: 2 }} />

      <Title text="Вегани" x={560} color={VEGAN} opacity={intro} />
      <Title text="Хижаки" x={1360} color={HUNTER} opacity={intro} />
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 470,
          transform: "translate(-50%,-50%)",
          color: INK,
          fontFamily: "Montserrat, sans-serif",
          fontSize: 64,
          fontWeight: 900,
          opacity: intro,
        }}
      >
        vs
      </div>

      {vegans.map((v, i) => (
        <HominidPencil key={`v${i}`} x={v.x} y={GROUND} scale={v.scale} facing={1} color={VEGAN} spear={false} hold="🌿" action="eat" phase={v.phase} />
      ))}
      {hunters.map((h, i) => (
        <HominidPencil key={`h${i}`} x={h.x} y={GROUND} scale={h.scale} facing={-1} color={HUNTER} spear hold="🍖" phase={h.phase} />
      ))}
    </AbsoluteFill>
  );
};

const Title: React.FC<{ text: string; x: number; color: string; opacity: number }> = ({ text, x, color, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 150,
      transform: "translateX(-50%)",
      color,
      fontFamily: "Montserrat, sans-serif",
      fontSize: 52,
      fontWeight: 800,
      letterSpacing: 1,
      opacity,
    }}
  >
    {text}
  </div>
);
