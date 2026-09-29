import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MediaKenBurns, BigNumber } from "~/components";
import { fadeIn } from "~/lib/animations";
import { CLIP_FRAMES, MEDIA } from "../plan";
import { colors } from "~/theme";

/**
 * 0:45.34–55.96s (319f) · SRT: "Працівник заробляв 90 доларів на тиждень або
 * 4713 доларів на рік" (45.34–51.48) → "4 дні погорбатив — і вже багатій"
 * (51.48–55.96, delay = (51.48-45.34)*30 ≈ 184f).
 */
export const UsWageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const wageOp = fadeIn(frame, 10, 18);

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.tophat}
        durationInFrames={durationInFrames}
        loop
        mediaDurationInFrames={CLIP_FRAMES.tophat}
        zoom={0.1}
        gradient="full"
        gradientStrength={0.5}
      />

      <div
        style={{
          position: "absolute",
          top: 260,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: wageOp,
          color: "#fff",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56 }}>$90 / тиждень</div>
        <div style={{ fontSize: 34, color: colors.textMuted, marginTop: 6 }}>або $4 713 на рік</div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 160 }}>
        <BigNumber value={4} suffix=" дні" delay={184} size={190} caption="— і вже багатій" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
