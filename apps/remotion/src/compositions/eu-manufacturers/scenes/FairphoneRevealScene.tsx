import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from "remotion";
import { fadeIn, popIn, slideIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** "В Євросоюзі є справжній виробник — нідерландський Fairphone." */
export const FairphoneRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const imgIn = popIn(frame, fps, 4, { damping: 18 });
  const float = Math.sin((frame / fps) * 1.4) * 10;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 720 }}>
        <div
          style={{
            opacity: fadeIn(frame, 0, 14),
            transform: `translateX(${slideIn(frame, 0, 16, -40)}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontSize: 34,
            fontWeight: 800,
            color: "#fff",
            background: light.primary,
            borderRadius: radii.pill,
            padding: "10px 26px",
            width: "fit-content",
          }}
        >
          🇳🇱 Нідерланди
        </div>
        <div
          style={{
            opacity: fadeIn(frame, 8, 16),
            fontSize: 110,
            fontWeight: 900,
            color: light.text,
            lineHeight: 1,
          }}
        >
          Fairphone
        </div>
        <div
          style={{
            opacity: fadeIn(frame, 16, 16),
            fontSize: 44,
            fontWeight: 600,
            color: light.textMuted,
          }}
        >
          Справжній виробник смартфонів з ЄС
        </div>
      </div>

      <Img
        src={staticFile("projects/eu-manufacturers/fairphone6.png")}
        style={{
          width: 540,
          height: 540,
          objectFit: "contain",
          opacity: interpolate(imgIn, [0, 1], [0, 1]),
          transform: `scale(${imgIn}) translateY(${float}px)`,
          filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.18))",
        }}
      />
    </div>
  );
};
