import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

export type BarItem = {
  label: string;
  value: number;
  color: string;
  /** Override the printed value text (e.g. "0,5" or "<1"). */
  valueLabel?: string;
};

type Props = {
  items: BarItem[];
  /** Max value mapped to full bar width. Defaults to the largest value. */
  max?: number;
  /** Frame at which bars begin growing (stagger per row). */
  delay?: number;
  /** Frames between consecutive rows starting to grow. */
  rowStagger?: number;
  /** Frames each bar takes to grow. */
  grow?: number;
  suffix?: string;
  width?: number;
  /** Width reserved for the label column. */
  labelWidth?: number;
  barHeight?: number;
};

/**
 * Animated horizontal bar chart on a light background — flat, rounded bars that
 * grow with a per-row stagger and count up their value. Mirrors the source
 * market-share chart. Reusable for any ranked comparison.
 */
export const MarketBars: React.FC<Props> = ({
  items,
  max,
  delay = 0,
  rowStagger = 7,
  grow = 26,
  suffix = "%",
  width = 1400,
  labelWidth = 300,
  barHeight = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const peak = max ?? Math.max(...items.map((d) => d.value));
  const trackWidth = width - labelWidth - 130;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, width, fontFamily: montserrat.fontFamily }}>
      {items.map((d, i) => {
        const rowDelay = delay + i * rowStagger;
        const enter = popIn(frame, fps, rowDelay, { damping: 18 });
        const progress = interpolate(frame, [rowDelay, rowDelay + grow], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const w = (d.value / peak) * trackWidth * progress;
        const shown = d.value * progress;
        const valueText = d.valueLabel ?? `${shown.toFixed(d.value < 1 ? 1 : 0)}`;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              opacity: enter,
              transform: `translateX(${(1 - enter) * -24}px)`,
            }}
          >
            <div
              style={{
                width: labelWidth,
                textAlign: "right",
                fontSize: 34,
                fontWeight: 800,
                color: light.text,
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                width: trackWidth,
                height: barHeight,
                background: light.bgAlt,
                borderRadius: radii.pill,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: Math.max(w, barHeight),
                  height: barHeight,
                  background: d.color,
                  borderRadius: radii.pill,
                }}
              />
            </div>
            <div
              style={{
                width: 80,
                fontSize: 36,
                fontWeight: 900,
                color: light.text,
                opacity: fadeIn(frame, rowDelay + grow - 8, 10),
              }}
            >
              {valueText}
              {suffix}
            </div>
          </div>
        );
      })}
    </div>
  );
};
