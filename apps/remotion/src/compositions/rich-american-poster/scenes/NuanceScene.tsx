import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/** 0:17.6–24.56s · Той самий плакат, zoom триває. SRT 17.60–23.86. */
export const NuanceScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.poster}
        durationInFrames={durationInFrames}
        zoom={0.08}
        panY={-20}
        gradient="bottom"
        gradientStrength={0.55}
      />
      <Caption delay={0} exitAt={185}>
        Автори "забули" уточнити: порівняння з СРСР, а не абсолютне.
      </Caption>
    </AbsoluteFill>
  );
};
