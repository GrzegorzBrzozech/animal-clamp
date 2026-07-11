import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "~/theme";

/** A little plant that can be "eaten" (scale to 0 via `eaten`). */
export const Plant: React.FC<{ x: number; y: number; scale?: number; phase?: number; gone?: boolean }> = ({
  x,
  y,
  scale = 1,
  phase = 0,
  gone = false,
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.1 + phase) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${gone ? 0 : scale})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg width={40} height={50} style={{ overflow: "visible", transform: `rotate(${sway}deg)`, transformOrigin: "bottom center" }}>
        <line x1={20} y1={50} x2={20} y2={18} stroke={colors.success} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={11} cy={20} rx={9} ry={5} fill={colors.success} transform="rotate(-35 11 20)" />
        <ellipse cx={29} cy={20} rx={9} ry={5} fill={colors.success} transform="rotate(35 29 20)" />
        <circle cx={20} cy={12} r={6} fill={colors.secondary} />
      </svg>
    </div>
  );
};

/** A ground strip of grass tufts. */
export const Grass: React.FC<{ width: number; y: number }> = ({ width, y }) => {
  const blades = Math.floor(width / 26);
  return (
    <div style={{ position: "absolute", left: 0, top: y, width }}>
      {Array.from({ length: blades }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * 26 + 8,
            bottom: 0,
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: `${14 + (i % 3) * 6}px solid ${colors.success}`,
          }}
        />
      ))}
    </div>
  );
};

/** Sun with slowly rotating rays. */
export const Sun: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 60 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <svg width={r * 3} height={r * 3} style={{ overflow: "visible" }}>
        <g transform={`translate(${r * 1.5} ${r * 1.5}) rotate(${frame * 0.6})`}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * (r + 8)}
                y1={Math.sin(a) * (r + 8)}
                x2={Math.cos(a) * (r + 28)}
                y2={Math.sin(a) * (r + 28)}
                stroke={colors.secondary}
                strokeWidth={6}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={0} cy={0} r={r} fill={colors.secondary} />
        </g>
      </svg>
    </div>
  );
};
