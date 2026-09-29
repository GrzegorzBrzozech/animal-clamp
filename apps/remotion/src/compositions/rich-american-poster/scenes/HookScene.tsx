import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/**
 * 0:00–17.6s · Гачок. Повний плакат, повільний Ken-Burns zoom-in.
 * Три репліки-LowerThird одна за одною (SRT: 0.00–5.68, 6.48–13.24, 13.80–17.12).
 * `LowerThird` fades itself out past `exitAt`, so all three can render
 * unconditionally — no mount/unmount gating needed.
 */
export const HookScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.poster}
        durationInFrames={durationInFrames}
        zoom={0.14}
        gradient="bottom"
        gradientStrength={0.55}
      />

      <Caption delay={0} exitAt={165}>
        Фантастично, все написане — правда. Але є нюанс…
      </Caption>
      <Caption delay={194} exitAt={392}>
        Достаток = багатство. Це синоніми.
      </Caption>
      <Caption delay={414} exitAt={510}>
        Якби в СРСР в усіх було все — всі були б багаті.
      </Caption>
    </AbsoluteFill>
  );
};
