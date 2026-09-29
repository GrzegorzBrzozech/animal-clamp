import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { MediaKenBurns, ReceiptCard } from "~/components";
import { CLIP_FRAMES, MEDIA } from "../plan";

/**
 * 0:27.6–45.34s (532f) · Розрахунок костюма (США). Фон: показ мод → циліндр
 * (реальна хроніка, 8s-кліпи looped/swapped — жоден не розтягнутий довше
 * свого реального плану). Sears-скан як маленький proof-inset у кутку.
 *
 * Row-reveal timing: SRT дає лише один суцільний сегмент 27.60–45.34 на весь
 * перелік цін (немає word-level ASR) — тому кожен рядок оцінено пропорційно
 * до довжини свого фрагмента речення (той самий метод, що
 * seller-margin/plan.ts "opex" scene):
 *   Смокінг(0) · сорочка(61f/2.03s) · циліндр(146f/4.85s) · цигара(192f/6.4s)
 *   · разом(268f/8.93s) · "92%"(378f/12.6s).
 */
export const UsReceiptScene: React.FC = () => {
  const FASHION_SHOW_FRAMES = 268; // up to the "разом" reveal
  const TOPHAT_FRAMES = 532 - FASHION_SHOW_FRAMES;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={FASHION_SHOW_FRAMES}>
        <MediaKenBurns
          src={MEDIA.fashionShow}
          durationInFrames={FASHION_SHOW_FRAMES}
          loop
          mediaDurationInFrames={CLIP_FRAMES.fashionShow}
          zoom={0.1}
          gradient="bottom"
          gradientStrength={0.6}
        />
      </Sequence>
      <Sequence from={FASHION_SHOW_FRAMES} durationInFrames={TOPHAT_FRAMES}>
        <MediaKenBurns
          src={MEDIA.tophat}
          durationInFrames={TOPHAT_FRAMES}
          loop
          mediaDurationInFrames={CLIP_FRAMES.tophat}
          zoom={0.1}
          gradient="bottom"
          gradientStrength={0.6}
        />
      </Sequence>

      {/* Sears каталог 1957 — proof-inset для рядка "сорочка" */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 60,
          width: 260,
          background: "#FBF7EC",
          border: "3px solid #1E1B16",
          borderRadius: 6,
          padding: 8,
          boxShadow: "0 10px 26px #00000050",
          transform: "rotate(2.5deg)",
        }}
      >
        <Img src={staticFile(MEDIA.searsPrices)} style={{ width: "100%", display: "block", borderRadius: 2 }} />
        <div style={{ fontSize: 15, textAlign: "center", marginTop: 6, color: "#1E1B16", fontWeight: 700 }}>
          Sears, каталог 1957: сорочки $3.77–$6.77
        </div>
      </div>

      <div style={{ position: "absolute", left: 110, top: 850, width: 860 }}>
        <ReceiptCard
          header="Одяг багатія (США)"
          delay={0}
          width={860}
          rows={[
            { label: "Смокінг", value: "$65", delay: 0 },
            { label: "Біла сорочка", value: "$4.5", delay: 61 },
            { label: "Циліндр", value: "$13.5", delay: 146 },
            { label: "Файна цигара", value: "$0.3", delay: 192 },
            { label: "Разом", value: "$83.30", delay: 268, total: true },
            { label: "= тижневого заробітку", value: "≈92%", delay: 378, indent: true, muted: true },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
