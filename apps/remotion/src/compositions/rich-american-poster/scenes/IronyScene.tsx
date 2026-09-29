import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/** 1:19.14–1:22.8 (110f) · SRT: "Але стрімілись... лежали в напрямку своєї мрії." (79.14–82.04). */
export const IronyScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns src={MEDIA.ussrStore} durationInFrames={durationInFrames} zoom={0.08} gradient="bottom" />
      <Caption delay={0} exitAt={90}>
        Але "стрімілись"... у напрямку мрії.
      </Caption>
    </AbsoluteFill>
  );
};
