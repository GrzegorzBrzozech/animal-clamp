import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "~/theme";

type Props = {
  x: number;
  y: number;
  size?: number;
  color?: string;
  /** Angry eyes + frowny mouth for a predator. */
  hostile?: boolean;
  facing?: 1 | -1;
  /** Wobble/phase offset. */
  phase?: number;
  /** true = little legs scuttle faster (moving). */
  moving?: boolean;
};

/**
 * A small blob creature with eyes and tiny legs — the "bacterium with a face"
 * grown up. Deterministic wobble. Color/hostility make it predator or prey.
 */
export const Critter: React.FC<Props> = ({
  x,
  y,
  size = 90,
  color = colors.primary,
  hostile = false,
  facing = 1,
  phase = 0,
  moving = false,
}) => {
  const frame = useCurrentFrame();
  const t = frame * (moving ? 0.45 : 0.18) + phase;
  const squash = 1 + Math.sin(t * 1.4) * 0.05;
  const legSwing = Math.sin(t * 2) * (moving ? 6 : 2);
  const eyeY = hostile ? 0.42 : 0.4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scaleX(${facing})`,
      }}
    >
      {/* legs */}
      {[-1, 1].map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            bottom: -size * 0.12,
            left: `${50 + s * 22}%`,
            width: 6,
            height: size * 0.22,
            background: color,
            borderRadius: 4,
            transform: `translateX(-50%) rotate(${s * legSwing}deg)`,
            transformOrigin: "top center",
          }}
        />
      ))}
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 34%, ${color}, ${color}cc 62%, ${color}88)`,
          border: `3px solid #ffffff55`,
          boxShadow: `0 0 ${size * 0.25}px ${color}66`,
          transform: `scaleY(${squash})`,
        }}
      />
      {/* eyes */}
      {[38, 60].map((ex, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${ex}%`,
            top: `${eyeY * 100}%`,
            width: size * 0.11,
            height: size * 0.11,
            borderRadius: "50%",
            background: "#0E1116",
            transform: hostile ? `rotate(${i === 0 ? -22 : 22}deg) scaleY(0.7)` : "none",
          }}
        />
      ))}
      {/* mouth */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: hostile ? "64%" : "60%",
          width: size * 0.2,
          height: size * 0.1,
          marginLeft: -size * 0.1,
          borderRadius: hostile ? "0 0 2px 2px" : "0 0 40px 40px",
          border: `3px solid #0E1116`,
          borderTop: hostile ? `3px solid #0E1116` : "none",
          transform: hostile ? "rotate(180deg)" : "none",
        }}
      />
    </div>
  );
};
