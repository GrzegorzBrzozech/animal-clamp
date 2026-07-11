import React from "react";
import { useCurrentFrame } from "remotion";
import { usePalette } from "~/theme/palette";

type Props = {
  size?: number;
  color?: string;
  /** Phase offset so multiple cells don't wobble in sync. */
  phase?: number;
  /** Draw simple eyes to give the cell character. */
  face?: boolean;
  /** "angry" eyes + spikes for a predator. */
  hostile?: boolean;
  label?: string;
  style?: React.CSSProperties;
};

/**
 * An organic, wobbling single-celled organism. Fully deterministic
 * (motion derived from the frame via sin/cos). Reusable for any "cell" beat.
 */
export const Cell: React.FC<Props> = ({
  size = 220,
  color,
  phase = 0,
  face = true,
  hostile = false,
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const pal = usePalette();
  const t = frame / 18 + phase;
  const fill = color ?? pal.primary;

  // Morph the blob outline by animating each corner radius.
  const r = (k: number) => 50 + Math.sin(t + k) * 12;
  const borderRadius =
    `${r(0)}% ${r(1.7)}% ${r(3.1)}% ${r(4.4)}% / ` +
    `${r(0.8)}% ${r(2.3)}% ${r(3.9)}% ${r(5.2)}%`;
  const breathe = 1 + Math.sin(t * 1.3) * 0.03;

  const eyeY = hostile ? "42%" : "40%";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...style }}>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius,
          background: `radial-gradient(circle at 38% 34%, ${fill}, ${fill}cc 60%, ${fill}88)`,
          boxShadow: `0 0 ${size * 0.18}px ${fill}55, inset 0 0 ${size * 0.2}px #00000040`,
          transform: `scale(${breathe})`,
        }}
      >
        {/* ribosome specks */}
        {[
          [30, 60],
          [62, 45],
          [50, 70],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size * 0.06,
              height: size * 0.06,
              borderRadius: "50%",
              background: "#ffffff33",
            }}
          />
        ))}
        {face ? (
          <>
            {[36, 56].map((x, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: eyeY,
                  width: size * 0.1,
                  height: size * 0.1,
                  borderRadius: "50%",
                  background: "#0E1116",
                  transform: hostile ? `rotate(${i === 0 ? -20 : 20}deg) scaleY(0.7)` : "none",
                }}
              />
            ))}
          </>
        ) : null}
      </div>
      {label ? (
        <span style={{ fontSize: 28, fontWeight: 600, color: pal.text }}>{label}</span>
      ) : null}
    </div>
  );
};
