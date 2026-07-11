import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { popIn } from "~/lib/animations";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

type Props = {
  children: React.ReactNode;
  /** Frame at which the stamp slams in. */
  delay?: number;
  color?: string;
  rotate?: number;
  fontSize?: number;
  sub?: string;
};

/**
 * Rubber-stamp slam: overshoots from large→1 with a hard double border and a
 * rotation, like an ink stamp hitting paper. Great for verdicts ("ПОМИЛКА",
 * "ВЖЕ ЧИННЕ"). Light-mode by default.
 */
export const Stamp: React.FC<Props> = ({
  children,
  delay = 0,
  color = light.danger,
  rotate = -8,
  fontSize = 84,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Slam: scale from 2.4 down to 1 quickly, settling with the spring.
  const s = popIn(frame, fps, delay, { damping: 12, mass: 0.7, stiffness: 200 });
  const scale = interpolate(s, [0, 1], [2.4, 1]);
  const opacity = interpolate(frame, [delay, delay + 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          border: `7px solid ${color}`,
          color,
          fontWeight: 900,
          fontSize,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "10px 34px",
          borderRadius: 14,
          boxShadow: `inset 0 0 0 3px ${color}33`,
        }}
      >
        {children}
      </div>
      {sub ? (
        <span style={{ color, fontSize: fontSize * 0.34, fontWeight: 700 }}>{sub}</span>
      ) : null}
    </div>
  );
};
