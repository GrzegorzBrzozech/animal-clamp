import React from "react";
import { montserrat } from "~/lib/fonts";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Props = {
  channel: string;
  title: string;
  corner?: Corner;
  style?: React.CSSProperties;
};

const CORNER_STYLE: Record<Corner, React.CSSProperties> = {
  "top-left": { top: 36, left: 36 },
  "top-right": { top: 36, right: 36, textAlign: "right" },
  "bottom-left": { bottom: 36, left: 36 },
  "bottom-right": { bottom: 36, right: 36, textAlign: "right" },
};

/**
 * Small always-on attribution overlay for real B-roll used full-bleed
 * (channel name + video title) — e.g. `MediaKenBurns` footage that isn't a
 * `PhotoPin` insert with its own caption. Stays visible for the whole shot,
 * no entrance animation: it's a credit, not a narrative beat.
 */
export const SourceCredit: React.FC<Props> = ({ channel, title, corner = "bottom-left", style }) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      fontFamily: montserrat.fontFamily,
      color: "#FFFFFFCC",
      textShadow: "0 1px 4px #00000090",
      ...CORNER_STYLE[corner],
      ...style,
    }}
  >
    <span style={{ fontSize: 22, fontWeight: 800 }}>{channel}</span>
    <span style={{ fontSize: 18, fontWeight: 500, opacity: 0.85 }}>«{title}»</span>
  </div>
);
