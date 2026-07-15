import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { Stamp } from "~/components";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** [annoyed] "А отут помилка, наклеп на святу Європейщину!" */
export const CorrectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = popIn(frame, fps, 2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div style={{ opacity: fadeIn(frame, 2, 10), fontSize: 96 }}>😠</div>

      <div
        style={{
          position: "relative",
          transform: `scale(${card})`,
          background: light.bgAlt,
          border: `2px dashed ${light.border}`,
          borderRadius: 24,
          padding: "44px 60px",
          fontSize: 52,
          fontWeight: 700,
          color: light.textMuted,
          maxWidth: 1100,
          textAlign: "center",
          textDecoration: frame > 20 ? "line-through" : "none",
          textDecorationColor: light.danger,
          textDecorationThickness: 6,
        }}
      >
        «В Європі немає своїх виробників смартфонів»
      </div>

      <div style={{ marginTop: 6 }}>
        <Stamp color={light.danger} rotate={-9} fontSize={96} delay={18} sub="наклеп на святу Європейщину">
          Помилка
        </Stamp>
      </div>
    </div>
  );
};
