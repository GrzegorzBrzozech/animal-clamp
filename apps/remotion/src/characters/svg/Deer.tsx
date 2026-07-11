import React from "react";
import { useCurrentFrame } from "remotion";

type Props = {
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  /** "stand" = alive; "down" = taken down (lying, X eye). */
  state?: "stand" | "down";
};

/** A simple quadruped deer silhouette. */
export const Deer: React.FC<Props> = ({ x, y, scale = 1, facing = 1, state = "stand" }) => {
  const frame = useCurrentFrame();
  const down = state === "down";
  const breathe = down ? 0 : Math.sin(frame * 0.12) * 1.5;
  const fur = "#9C6B3F";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 200,
        height: 160,
        transform: `translate(-50%, -100%) scale(${scale}) scaleX(${facing}) rotate(${down ? 78 : 0}deg)`,
        transformOrigin: "bottom center",
        opacity: down ? 0.85 : 1,
      }}
    >
      <svg width={200} height={160} style={{ overflow: "visible", transform: `translateY(${breathe}px)` }}>
        {/* legs */}
        {[55, 80, 130, 155].map((lx, i) => (
          <line key={i} x1={lx} y1={95} x2={lx + (i < 2 ? -4 : 4)} y2={150} stroke={fur} strokeWidth={9} strokeLinecap="round" />
        ))}
        {/* body */}
        <ellipse cx={100} cy={85} rx={62} ry={32} fill={fur} />
        {/* neck + head */}
        <line x1={150} y1={80} x2={172} y2={40} stroke={fur} strokeWidth={20} strokeLinecap="round" />
        <ellipse cx={176} cy={34} rx={22} ry={15} fill={fur} />
        {/* antlers */}
        <line x1={168} y1={24} x2={158} y2={2} stroke={fur} strokeWidth={4} strokeLinecap="round" />
        <line x1={160} y1={12} x2={150} y2={6} stroke={fur} strokeWidth={4} strokeLinecap="round" />
        <line x1={184} y1={24} x2={194} y2={2} stroke={fur} strokeWidth={4} strokeLinecap="round" />
        <line x1={192} y1={12} x2={202} y2={6} stroke={fur} strokeWidth={4} strokeLinecap="round" />
        {/* eye */}
        {down ? (
          <text x={180} y={40} fontSize={20} textAnchor="middle">✖️</text>
        ) : (
          <circle cx={182} cy={32} r={3} fill="#111" />
        )}
      </svg>
    </div>
  );
};
