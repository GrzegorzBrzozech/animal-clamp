import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { popIn } from "~/lib/animations";
import { usePalette } from "~/theme/palette";

type Props = {
  value: number;
  delay?: number;
  /** Frames over which the number counts up. */
  countFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: string;
  size?: number;
  caption?: string;
};

/** Counts up from 0 to `value` with a spring entrance. */
export const BigNumber: React.FC<Props> = ({
  value,
  delay = 0,
  countFrames = 40,
  prefix = "",
  suffix = "",
  decimals = 0,
  color,
  size = 160,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const scale = popIn(frame, fps, delay, { damping: 14, mass: 0.6 });
  const n = interpolate(frame, [delay, delay + countFrames], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})` }}>
      <span style={{ fontSize: size, fontWeight: 900, color: color ?? pal.secondary, lineHeight: 1 }}>
        {prefix}
        {n.toFixed(decimals)}
        {suffix}
      </span>
      {caption ? (
        <span style={{ fontSize: 34, color: pal.textMuted, marginTop: 8 }}>{caption}</span>
      ) : null}
    </div>
  );
};
