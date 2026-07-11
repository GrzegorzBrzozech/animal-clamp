import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** [laughing] "Так! Якщо порівнювати з українськими виробниками телефонів." */
export const YesUkraineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yes = popIn(frame, fps, 2, { damping: 13 });

  const Box: React.FC<{
    flag: string;
    name: string;
    value: string;
    delay: number;
    color: string;
  }> = ({ flag, name, value, delay, color }) => (
    <div
      style={{
        transform: `scale(${popIn(frame, fps, delay, { damping: 16 })})`,
        background: light.bgAlt,
        border: `2px solid ${light.border}`,
        borderRadius: radii.lg,
        padding: "30px 44px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        minWidth: 420,
      }}
    >
      <span style={{ fontSize: 36, fontWeight: 700, color: light.text }}>
        {flag} {name}
      </span>
      <span style={{ fontSize: 96, fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          transform: `scale(${yes})`,
          background: light.success,
          color: "#fff",
          fontSize: 60,
          fontWeight: 900,
          borderRadius: radii.pill,
          padding: "12px 50px",
        }}
      >
        ТАК 😄
      </div>
      <div style={{ opacity: fadeIn(frame, 10, 14), fontSize: 36, color: light.textMuted, fontWeight: 600 }}>
        …якщо порівнювати з українськими виробниками телефонів
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 6 }}>
        <Box flag="🇳🇱" name="Fairphone" value="1" delay={20} color={light.primary} />
        <div style={{ alignSelf: "center", fontSize: 60, opacity: fadeIn(frame, 26, 10) }}>🆚</div>
        <Box flag="🇺🇦" name="Виробники" value="0" delay={32} color={light.danger} />
      </div>
    </div>
  );
};
