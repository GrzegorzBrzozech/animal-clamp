import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/**
 * 1:14.34–1:19.14 (144f) · SRT: "американець за півроку міг заробити на
 * власний автомобіль" (74.34–78.24). Реальна телереклама Chevrolet 1957.
 */
export const CarComparisonScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns src={MEDIA.chevrolet} durationInFrames={durationInFrames} zoom={0.06} gradient="bottom" />
      <Caption delay={0} exitAt={115}>
        Пів року роботи → власний автомобіль
      </Caption>
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: 32,
          opacity: 0.9,
        }}
      >
        Chevrolet '57 — від $2 048
      </div>
    </AbsoluteFill>
  );
};
