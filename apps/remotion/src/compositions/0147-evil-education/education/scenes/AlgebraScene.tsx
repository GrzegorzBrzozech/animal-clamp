import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBackground, BookPencil } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

const COVERS = ["#3E6E9E", "#4E8A5A", "#B07E2B", "#BC5147"];

export const AlgebraScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Book swaps every 24 frames with a quick flip.
  const idx = Math.floor(frame / 24) % COVERS.length;
  const flip = Math.abs(Math.sin((frame % 24) / 24 * Math.PI)); // 0→1→0
  const flipScaleX = 1 - flip * 0.85;

  // Algebra tile shakes when "pulled" (recurring tug), never leaves.
  const tug = frame > 45 ? Math.sin((frame - 45) * 0.5) * Math.max(0, 1 - ((frame - 45) % 40) / 40) * 10 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 160, padding: spacing.xl }}>
        {/* free choice of textbook */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.md }}>
          <div style={{ transform: `scaleX(${flipScaleX})` }}>
            <BookPencil size={260} color={COVERS[idx]} />
          </div>
          <AnimatedText size={fontSizes.body} weight={fontWeights.black} delay={4} slide={0} color={colors.success}>
            підручник — будь-який...
          </AnimatedText>
        </div>

        {/* algebra is bolted down */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.md }}>
          <div style={{ position: "relative", transform: `translateX(${tug}px)` }}>
            <div
              style={{
                width: 260,
                height: 220,
                borderRadius: 20,
                background: `${colors.primary}22`,
                border: `6px solid ${colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 120,
                fontWeight: 900,
                color: colors.primary,
              }}
            >
              x²
            </div>
            {/* bolts in the corners */}
            {[[18, 18], [222, 18], [18, 182], [222, 182]].map(([l, t], i) => (
              <div key={i} style={{ position: "absolute", left: l, top: t, fontSize: 30 }}>🔩</div>
            ))}
            <div style={{ position: "absolute", top: -46, left: "50%", transform: "translateX(-50%)", fontSize: 40 }}>⛓️</div>
          </div>
          <AnimatedText size={fontSizes.body} weight={fontWeights.black} delay={4} slide={0} color={colors.danger}>
            ... якщо це підручник з Al-Gebra
          </AnimatedText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
