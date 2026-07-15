import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { popIn } from "~/lib/animations";
import { montserrat } from "~/lib/fonts";
import { usePalette } from "~/theme/palette";

type Props = {
  /** Big time value, e.g. "20 хв", "4 год", "1 доба". */
  time: string;
  /** Small line under the time, e.g. "на поділ". */
  label?: string;
  /** Accent color (defaults to palette secondary). */
  color?: string;
  /** Delay in frames before the animation starts. */
  delay?: number;
  size?: number;
};

/**
 * A stopwatch chip announcing a cell's doubling / division time. Pencil-on-paper
 * card with a ⏱ glyph, a big colored time, and a muted caption. Deterministic;
 * reusable for any microbiology / growth-rate explainer.
 */
export const DoublingBadge: React.FC<Props> = ({ time, label = "на поділ", color, delay = 0, size = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const s = popIn(frame, fps, delay, { damping: 14, mass: 0.7 });
  const accent = color ?? pal.secondary;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 26px",
        background: "#FBF7EC",
        border: `3px solid ${accent}`,
        borderRadius: 16,
        boxShadow: "0 8px 20px #00000022",
        transform: `scale(${s})`,
        transformOrigin: "left center",
        fontFamily: montserrat.fontFamily,
      }}
    >
      <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>⏱</span>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: size, fontWeight: 900, color: accent }}>{time}</span>
        {label ? (
          <span style={{ fontSize: size * 0.32, fontWeight: 700, color: pal.textMuted, marginTop: 4 }}>{label}</span>
        ) : null}
      </div>
    </div>
  );
};
