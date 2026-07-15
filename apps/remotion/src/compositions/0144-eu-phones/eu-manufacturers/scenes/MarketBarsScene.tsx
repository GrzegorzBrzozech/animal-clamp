import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn, slideIn } from "~/lib/animations";
import { MarketBars, type BarItem } from "~/components";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

const ITEMS: BarItem[] = [
  { label: "🇰🇷 Samsung", value: 35, color: "#1428A0" },
  { label: "🇺🇸 Apple", value: 27, color: "#555555" },
  { label: "🇨🇳 Xiaomi", value: 16, color: "#FF6900" },
  { label: "🇨🇳 Motorola", value: 6, color: "#E1002A" },
  { label: "🇨🇳 Honor", value: 3, color: "#CF0A2C" },
  { label: "🇪🇺 EU-бренди", value: 0.5, color: light.primary, valueLabel: "0,5" },
];

/** Closing punch: the top-5 EU market — no EU brand among them. */
export const MarketBarsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          opacity: fadeIn(frame, 0, 14),
          transform: `translateY(${slideIn(frame, 0, 16, -24)}px)`,
          fontSize: 56,
          fontWeight: 900,
          color: light.text,
          textAlign: "center",
        }}
      >
        П'ятірка лідерів ринку ЄС · 2025
      </div>
      <div style={{ opacity: fadeIn(frame, 6, 14), fontSize: 26, color: light.textMuted, marginTop: -16 }}>
        Частка ринку · джерело: Counterpoint Research, 2025
      </div>

      <MarketBars items={ITEMS} delay={6} rowStagger={44} grow={22} width={1500} />

      <div
        style={{
          opacity: fadeIn(frame, 250, 16),
          fontSize: 38,
          fontWeight: 800,
          color: light.danger,
        }}
      >
        Жодного EU-бренду в топ-5
      </div>
    </div>
  );
};
