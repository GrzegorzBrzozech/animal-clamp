import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/**
 * 0:24.56–27.6s · Zoom/crop у бік постаті багача (верхня частина плаката).
 * SRT 24.56–27.60.
 */
export const ManIntroScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.poster}
        durationInFrames={durationInFrames}
        zoom={0.22}
        panY={-60}
        gradient="bottom"
        gradientStrength={0.5}
      />
      <Caption delay={10} exitAt={75}>
        Скільки коштував його вигляд?
      </Caption>
    </AbsoluteFill>
  );
};
