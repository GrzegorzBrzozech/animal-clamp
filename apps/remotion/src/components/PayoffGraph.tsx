import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fadeIn } from "~/lib/animations";
import { usePalette } from "~/theme/palette";

type Props = {
  /** Frame at which the curve starts drawing. */
  delay?: number;
  width?: number;
  height?: number;
};

/**
 * Payoff of predation vs. share of predators in the population.
 * A descending curve that crosses zero — high payoff when rare, loss when common.
 * The moving dot rides the curve from left to right.
 */
export const PayoffGraph: React.FC<Props> = ({ delay = 0, width = 1200, height = 620 }) => {
  const frame = useCurrentFrame();
  const pal = usePalette();
  const padL = 110;
  const padB = 110;
  const zeroY = height - padB - (height - padB - 60) * 0.45; // y of payoff = 0

  // Curve points: payoff high at x=0, dropping below zero at right.
  const pts = Array.from({ length: 41 }, (_, i) => {
    const fx = i / 40;
    const x = padL + fx * (width - padL - 40);
    const payoff = Math.pow(1 - fx, 1.7) * 1.1 - 0.45; // 1.. .. -0.45
    const y = zeroY - payoff * (height - padB - 60) * 0.9;
    return [x, y];
  });

  const drawn = Math.round(interpolate(frame, [delay, delay + 60], [0, pts.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const path = pts.slice(0, Math.max(2, drawn)).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const dotIdx = Math.min(pts.length - 1, Math.max(0, drawn - 1));
  const [dx, dy] = pts[dotIdx];
  const axisOpacity = fadeIn(frame, delay, 14);
  const dotColor = dy > zeroY ? pal.danger : pal.success;

  return (
    <svg width={width} height={height}>
      {/* zero line / profit-loss split */}
      <line x1={padL} y1={zeroY} x2={width - 40} y2={zeroY} stroke={pal.border} strokeWidth={2} strokeDasharray="8 8" opacity={axisOpacity} />
      <text x={width - 50} y={zeroY - 16} fill={pal.success} fontSize={26} textAnchor="end" opacity={axisOpacity}>прибуток ▲</text>
      <text x={width - 50} y={zeroY + 40} fill={pal.danger} fontSize={26} textAnchor="end" opacity={axisOpacity}>збиток ▼</text>

      {/* axes */}
      <line x1={padL} y1={40} x2={padL} y2={height - padB} stroke={pal.textMuted} strokeWidth={3} opacity={axisOpacity} />
      <line x1={padL} y1={height - padB} x2={width - 40} y2={height - padB} stroke={pal.textMuted} strokeWidth={3} opacity={axisOpacity} />
      <text x={padL - 20} y={70} fill={pal.textMuted} fontSize={26} textAnchor="end" opacity={axisOpacity}>вигода</text>
      <text x={width - 40} y={height - padB + 44} fill={pal.textMuted} fontSize={26} textAnchor="end" opacity={axisOpacity}>частка хижаків →</text>

      {/* curve */}
      <path d={path} fill="none" stroke={pal.secondary} strokeWidth={6} strokeLinecap="round" />
      {/* moving marker */}
      <circle cx={dx} cy={dy} r={16} fill={dotColor} stroke="#fff" strokeWidth={3} />
    </svg>
  );
};
