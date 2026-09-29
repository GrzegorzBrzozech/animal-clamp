import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, PhotoPin } from "~/components";
import { MEDIA } from "../plan";
import { colors, fontSizes, fontWeights } from "../paper";

/**
 * 2.98–9.30s · Механіка коаліції (до слів "проти гравця, який лідирує" —
 * та частина тепер живе в PayoffScene разом зі шкалами гравців). Єдине
 * наявне відео (board-game-friends-cheer.mp4, 12.52s) вставлено НЕ
 * full-bleed, а як `PhotoPin` — стандартний паперовий стиль сім'ї.
 *
 * `startFromSec=3.8` обрано за фактичним контентом кліпу (перевірено
 * ffmpeg-кадрами): 4–6s у кліпі — дівчата дають "хай-файв" одна одній над
 * столом — саме "об'єднують зусилля". Не просто generic "люди грають у
 * гру" — відеоряд збігається зі словами.
 */
export const MechanicScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 100px", gap: 70 }}>
      <PhotoPin
        kind="video"
        src={MEDIA.boardGame}
        startFromSec={3.8}
        width={900}
        height={760}
        rotate={-2}
        delay={0}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.semibold} color={colors.text} align="left" maxWidth="100%" delay={4} duration={18}>
          Обʼєднати зусилля проти лідера, щоб
        </AnimatedText>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} color={colors.primary} align="left" maxWidth="100%" delay={84} duration={18}>
          спільно здолати найсильнішого гравця
        </AnimatedText>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
