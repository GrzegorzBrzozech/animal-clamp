import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns, BigNumber } from "~/components";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/**
 * 1:22.8–1:33.52 (322f) · Повернення на плакат, zoom/pan у бік дівчинки
 * знизу картинки. SRT: "Ну і наостанок."(0) · "23 млн дітей до 6 років"
 * (83.84→31f) · "не мали можливості... щось купити"(89.00→186f).
 */
export const KidsStatScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.poster}
        durationInFrames={durationInFrames}
        zoom={0.18}
        panY={-150}
        gradient="bottom"
        gradientStrength={0.6}
      />

      <Caption delay={0} exitAt={28}>
        Ну і наостанок.
      </Caption>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260 }}>
        <BigNumber value={23} suffix=" млн" delay={31} size={180} caption="дітей до 6 років у США, 1957" />
      </AbsoluteFill>

      <Caption delay={186} exitAt={310}>
        Саме ті, хто не міг сам піти в магазин і щось купити.
      </Caption>
    </AbsoluteFill>
  );
};
