import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { fadeIn, popIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** "І ні… частка ринку — менше відсотка." */
export const NoShareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const no = popIn(frame, fps, 2, { damping: 13 });
  const sliver = interpolate(frame, [24, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trackW = 1300;

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
          transform: `scale(${no})`,
          background: light.danger,
          color: "#fff",
          fontSize: 60,
          fontWeight: 900,
          borderRadius: radii.pill,
          padding: "12px 50px",
        }}
      >
        І НІ 😐
      </div>
      <div style={{ opacity: fadeIn(frame, 10, 14), fontSize: 36, color: light.textMuted, fontWeight: 600 }}>
        …якщо порівнювати з усіма іншими на ринку
      </div>

      <div style={{ position: "relative", width: trackW, marginTop: 16, opacity: fadeIn(frame, 18, 12) }}>
        <div style={{ width: trackW, height: 60, background: light.bgAlt, borderRadius: radii.pill }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: Math.max(10, trackW * 0.006 * sliver),
            height: 60,
            background: light.primary,
            borderRadius: radii.pill,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -64,
            left: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            opacity: fadeIn(frame, 30, 12),
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 900, color: light.primary }}>&lt; 1%</span>
          <span style={{ fontSize: 30, fontWeight: 600, color: light.textMuted }}>частка Fairphone у ЄС</span>
        </div>
      </div>
    </div>
  );
};
