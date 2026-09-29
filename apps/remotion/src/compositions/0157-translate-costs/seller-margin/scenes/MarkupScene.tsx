import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin, AnimatedText, ReceiptCard } from "~/components";
import { fadeIn, fadeOut } from "~/lib/animations";
import { MEDIA } from "../plan";
import { colors, fontWeights } from "../paper";

/**
 * 10–25 s · Концепція 1 — Торгова націнка. Definition first (only "36–39%"
 * is spoken here), then the concrete example (100 → +37 → 137) builds on the
 * same receipt when the narration reaches it — the final "137" row now
 * reads as a total (rule above it) instead of being just another bold line.
 * Real footage (truck → shelf price tag) is a genuinely large panel — not a
 * corner thumbnail — swapping to match which half of the story is playing.
 */
export const MarkupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const defOp = fadeIn(frame, 40, 16);
  const truckOp = Math.min(fadeIn(frame, 60, 16), fadeOut(frame, 200, 20));
  const shelfOp = fadeIn(frame, 215, 16);

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={58} weight={900} delay={10} color={colors.text}>
          Торгова націнка: <span style={{ color: colors.secondary }}>36–39%</span>
        </AnimatedText>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          display: "flex",
          justifyContent: "center",
          opacity: defOp,
          fontSize: 32,
          fontWeight: fontWeights.semibold,
          color: colors.textMuted,
          textAlign: "center",
          padding: "0 300px",
        }}
      >
        Сума, яку додано "згори" на ціну постачальника
      </div>

      {/* Supporting real footage — swaps supply → shelf, always a real-size panel. */}
      <div style={{ position: "absolute", right: 400, top: 270, opacity: truckOp }}>
        <PhotoPin src={MEDIA.truckDelivery} width={1100} height={600} delay={60} rotate={2}/>
      </div>
      <div style={{ position: "absolute", right: 60, top: 250, opacity: shelfOp }}>
        <PhotoPin
          src={MEDIA.shelfPricetag}
          kind="video"
          width={940}
          height={620}
          delay={215}
          rotate={2}
          caption="Ціннник на полиці"
        />
      </div>

      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <ReceiptCard
          header="АТБ-МАРКЕТ"
          delay={225}
          width={780}
          rows={[
            { label: "Закупівельна ціна", value: "100,00 грн", delay: 245 },
            { label: "Торгова націнка", value: "+37,00 грн", delay: 305, color: colors.secondary },
            { label: "Ціна на полиці", value: "137,00 грн", delay: 370, total: true },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
