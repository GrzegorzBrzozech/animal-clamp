import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

const TRAITS = [
  { emoji: "🎯", label: "Нішевий", sub: "малі тиражі", highlight: false },
  { emoji: "💶", label: "Дорогий", sub: "преміум-ціна", highlight: false },
  { emoji: "🔧", label: "iFixit 10 / 10", sub: "ідеальна ремонтопридатність", highlight: true },
];

/** "Нішевий, дорогий, 10 з 10 за iFixit." — modularity photo + trait chips. */
export const FairphoneTraitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const imgIn = popIn(frame, fps, 2, { damping: 18 });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 70,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          transform: `scale(${imgIn})`,
          borderRadius: radii.lg,
          overflow: "hidden",
          border: `3px solid ${light.border}`,
          boxShadow: "0 24px 50px rgba(0,0,0,0.14)",
        }}
      >
        <Img
          src={staticFile("projects/eu-manufacturers/fairphone5-modular.jpg")}
          style={{ width: 560, height: 520, objectFit: "cover", display: "block" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {TRAITS.map((t, i) => {
          const enter = popIn(frame, fps, 10 + i * 12, { damping: 16 });
          const accent = t.highlight ? light.success : light.text;
          return (
            <div
              key={t.label}
              style={{
                transform: `scale(${enter})`,
                opacity: fadeIn(frame, 10 + i * 12, 10),
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: t.highlight ? "#E8F7EE" : light.bgAlt,
                border: `${t.highlight ? 3 : 2}px solid ${t.highlight ? light.success : light.border}`,
                borderRadius: 20,
                padding: "20px 30px",
                minWidth: 540,
              }}
            >
              <span style={{ fontSize: 56 }}>{t.emoji}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 46, fontWeight: 900, color: accent, lineHeight: 1.05 }}>{t.label}</span>
                <span style={{ fontSize: 28, fontWeight: 500, color: light.textMuted }}>{t.sub}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
