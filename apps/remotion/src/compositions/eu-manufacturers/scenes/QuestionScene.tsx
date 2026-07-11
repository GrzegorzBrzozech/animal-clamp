import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** [thoughtful] "Чи набув бренд відповідної популярності?" */
export const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = popIn(frame, fps, 2, { damping: 12, mass: 0.7 });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          transform: `scale(${mark})`,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: light.primary,
          color: "#fff",
          fontSize: 150,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${light.primary}55`,
        }}
      >
        ?
      </div>
      <div
        style={{
          opacity: fadeIn(frame, 12, 16),
          fontSize: 64,
          fontWeight: 900,
          color: light.text,
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        Чи набув бренд популярності?
      </div>
    </div>
  );
};
