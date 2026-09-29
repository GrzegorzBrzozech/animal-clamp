import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin, AnimatedText } from "~/components";
import { MEDIA } from "../plan";
import { colors, fontWeights } from "../paper";

/**
 * 44–52 s · Куди діваються гроші (частина 1). No screenshots here at all —
 * this beat makes a generic claim (no specific figures yet, those are next
 * scene), so it doesn't need a document. `tax-office-2.webp`, framed to its
 * own aspect (1360×904) so it isn't cropped, stands in as the generic
 * "taxes" visual — it makes no claim about being АТБ's specific data (that
 * would be misleading, see `taxesList`'s revision note).
 */
export const TaxesIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numS = spring({ fps, frame: frame - 50, config: { damping: 14, mass: 0.8 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", right: 60, top: 250 }}>
        <PhotoPin src={MEDIA.taxOffice2} width={880} height={584} delay={10} rotate={2} objectFit="cover" />
      </div>

      <div style={{ position: "absolute", left: 90, top: 140, width: 760 }}>
        <AnimatedText size={50} weight={800} delay={5} align="left" color={colors.text} maxWidth={720}>
          Куди діваються виручені гроші?
        </AnimatedText>
      </div>

      <div style={{ position: "absolute", left: 90, top: 380, opacity: numS, transform: `scale(${numS})`, transformOrigin: "left center" }}>
        <div style={{ fontSize: 190, fontWeight: fontWeights.black, color: colors.danger, lineHeight: 1 }}>50–80%</div>
        <div style={{ fontSize: 38, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
          від націнки йде на податки
        </div>
      </div>
    </AbsoluteFill>
  );
};
