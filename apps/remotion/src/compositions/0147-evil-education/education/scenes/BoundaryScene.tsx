import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground } from "~/characters";
import { colors, fontSizes, fontWeights } from "../paper";

export const BoundaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Barrier slams in from the left across the screen.
  const drop = spring({ fps, frame, config: { damping: 11, mass: 0.8, stiffness: 140 } });
  const barW = interpolate(drop, [0, 1], [0, width]);
  // Impact shake right after it lands.
  const impact = 18; // frame the bar is ~full
  const shake = frame > impact ? Math.sin((frame - impact) * 1.4) * Math.max(0, 1 - (frame - impact) / 10) * 10 : 0;
  const textIn = spring({ fps, frame: frame - 22, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* red boundary bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: barW,
            height: 120,
            background: colors.danger,
            boxShadow: "0 14px 0 #00000018",
          }}
        />
        {/* diagonal hatch stripes on the bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: barW,
            height: 120,
            backgroundImage: "repeating-linear-gradient(45deg, #00000022 0 22px, transparent 22px 48px)",
          }}
        />
        <div
          style={{
            position: "relative",
            fontSize: fontSizes.title,
            fontWeight: fontWeights.black,
            color: "#F3ECDB",
            letterSpacing: 2,
            transform: `scale(${textIn})`,
            opacity: textIn,
            textShadow: "0 3px 0 #00000030",
          }}
        >
          🔒 ДЕРЖАВНИЙ ОСВІТНІЙ КОРДОН 🛑
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
