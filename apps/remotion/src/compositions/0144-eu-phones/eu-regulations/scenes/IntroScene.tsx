import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, popIn, slideIn } from "~/lib/animations";
import { EUEmblem } from "~/components";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** Four chips that fly in and stack — "a whole package of rules". */
const CHIPS = [
  { emoji: "🔌", label: "Type-C" },
  { emoji: "🔧", label: "Ecodesign" },
  { emoji: "⚖️", label: "Право на ремонт" },
  { emoji: "🔋", label: "Знімна батарея" },
];

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const emblem = popIn(frame, fps, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div style={{ transform: `scale(${emblem})` }}>
        <EUEmblem size={200} />
      </div>

      <div
        style={{
          opacity: fadeIn(frame, 10, 16),
          transform: `translateY(${slideIn(frame, 10, 16, 28)}px)`,
          fontSize: 72,
          fontWeight: 900,
          color: light.text,
          textAlign: "center",
          maxWidth: 1300,
          lineHeight: 1.1,
        }}
      >
        Не одне правило — <span style={{ color: light.primary }}>цілий пакет</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 8,
          width: 1760,
          justifyContent: "center",
          flexWrap: "nowrap",
        }}
      >
        {CHIPS.map((c, i) => {
          const enter = popIn(frame, fps, 30 + i * 8, { damping: 16 });
          return (
            <div
              key={c.label}
              style={{
                transform: `scale(${enter})`,
                background: light.bgAlt,
                border: `2px solid ${light.border}`,
                borderRadius: 18,
                padding: "14px 22px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 30,
                fontWeight: 700,
                color: light.text,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 38 }}>{c.emoji}</span>
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
