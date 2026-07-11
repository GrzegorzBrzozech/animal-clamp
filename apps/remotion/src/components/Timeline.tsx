import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { useVideoConfig } from "remotion";
import { radii } from "~/theme";
import { usePalette } from "~/theme/palette";

export type Marker = {
  /** Position along the bar, 0 (left) .. 1 (right). */
  at: number;
  label: string;
  sub?: string;
  color?: string;
  /** Frame at which the marker pops in. */
  delay: number;
};

type Props = {
  markers: Marker[];
  /** Optional colored zone between two positions [from, to]. */
  zone?: { from: number; to: number; color: string; delay: number; label?: string };
  width?: number;
};

/** Horizontal time axis with pop-in markers and an optional highlighted zone. */
export const Timeline: React.FC<Props> = ({ markers, zone, width = 1500 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const lineGrow = fadeIn(frame, 0, 16);

  return (
    <div style={{ position: "relative", width, height: 200 }}>
      {/* base line */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          height: 6,
          width: `${lineGrow * 100}%`,
          background: pal.border,
          borderRadius: radii.pill,
        }}
      />
      {zone ? (
        <div
          style={{
            position: "absolute",
            top: 94,
            left: `${zone.from * 100}%`,
            width: `${(zone.to - zone.from) * 100 * fadeIn(frame, zone.delay, 20)}%`,
            height: 18,
            background: `${zone.color}55`,
            border: `2px solid ${zone.color}`,
            borderRadius: radii.pill,
          }}
        >
          {zone.label ? (
            <span
              style={{
                position: "absolute",
                top: 28,
                width: "100%",
                textAlign: "center",
                color: zone.color,
                fontSize: 26,
                fontWeight: 600,
                opacity: fadeIn(frame, zone.delay + 10, 16),
              }}
            >
              {zone.label}
            </span>
          ) : null}
        </div>
      ) : null}

      {markers.map((m, i) => {
        const scale = popIn(frame, fps, m.delay);
        const c = m.color ?? pal.primary;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 100,
              left: `${m.at * 100}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 24px ${c}`,
              }}
            />
            <span style={{ marginTop: 14, fontSize: 40, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>
              {m.label}
            </span>
            {m.sub ? (
              <span style={{ fontSize: 24, color: pal.textMuted, whiteSpace: "nowrap" }}>{m.sub}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
