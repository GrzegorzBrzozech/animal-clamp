import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MediaKenBurns, ReceiptCard } from "~/components";
import { Caption } from "../Caption";
import { CLIP_FRAMES, MEDIA } from "../plan";

/**
 * 0:55.96–74.34s (551f) · Розрахунок костюма (СРСР). Фон: універмаг у
 * Москві, 18.06.1957 — той самий рік, що й плакат.
 *
 * SRT: "розвага?"(0) · "смокінг 1000-1500 руб"(60.54→137f) ·
 * "зарплата 750"(63.90→238f) · "3 місяці без їжі"(66.04→302f) ·
 * "реалістично — півроку"(71.84→476f, crossfade — той самий розрахунок,
 * перечитаний реалістичніше, а не інша цифра з нуля).
 */
export const UssrCostScene: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MediaKenBurns
        src={MEDIA.ussrStore}
        durationInFrames={durationInFrames}
        loop
        mediaDurationInFrames={CLIP_FRAMES.ussrStore}
        zoom={0.1}
        gradient="bottom"
        gradientStrength={0.6}
      />

      <Caption delay={0} exitAt={120}>
        А чи міг це собі дозволити радянський працівник?
      </Caption>

      <div style={{ position: "absolute", left: 110, top: 850, width: 860 }}>
        <ReceiptCard
          header="Той самий прикид (СРСР)"
          delay={137}
          width={860}
          rows={[
            { label: "Смокінг", value: "1000–1500 ₽", delay: 137 },
            { label: "Зарплата/міс", value: "750 ₽", delay: 238, muted: true },
            { label: "Треба працювати", value: "3 місяці", delay: 302, total: true },
          ]}
          crossfade={{
            at: 476,
            from: "Теоретично: 3 місяці без їжі й відпочинку",
            to: "Реалістично — пів року",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
