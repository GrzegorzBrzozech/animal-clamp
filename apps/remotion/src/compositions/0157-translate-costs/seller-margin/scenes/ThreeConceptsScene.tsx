import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { fadeIn, slideIn, stagger } from "~/lib/animations";
import { MEDIA, CLIP_FRAMES } from "../plan";
import { colors, fontWeights } from "../paper";

// Illustrative — big Ukrainian grocery chains a viewer would recognize next to
// "Сільпо чи АТБ" (not a sourced ranking, just recognizable big names).
const LEFT_CHAINS = ["АТБ", "Сільпо", "Novus", "Varus", "Фора"];
const RIGHT_CHAINS = ["Ашан", "METRO", "Копійка", "Рукавичка", "EKO Market"];

/**
 * 5–10 s · Три поняття. Revision 3: dropped the restated caption entirely
 * (narration doesn't name the three terms yet, so a caption here just fills
 * space with nothing new) and replaced it with the thing the narration DOES
 * say — "супермаркети типу Сільпо чи АТБ" — made concrete: five more
 * recognizable chains flanking a much larger video, so the beat visually
 * says "this applies to all of these", not just the one clip on screen.
 */
export const ThreeConceptsScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />

    <div style={{ position: "absolute", left: "50%", top: 90, transform: "translateX(-50%)" }}>
      <PhotoPin
        src={MEDIA.checkoutScan}
        kind="video"
        sourceDurationInFrames={CLIP_FRAMES.checkoutScan}
        width={1000}
        height={640}
        delay={5}
        rotate={1}
        hold="pin"
        caption="Сканування на касі"
      />
    </div>

    <ChainList items={LEFT_CHAINS} align="left" x={70} />
    <ChainList items={RIGHT_CHAINS} align="right" x={1850} />
  </AbsoluteFill>
);

const ChainList: React.FC<{ items: string[]; align: "left" | "right"; x: number }> = ({ items, align, x }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        [align]: align === "left" ? x : 1920 - x,
        top: 300,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        alignItems: align === "left" ? "flex-start" : "flex-end",
      } as React.CSSProperties}
    >
      {items.map((name, i) => {
        const delay = stagger(i, 12, 20);
        const op = fadeIn(frame, delay, 14);
        const x0 = slideIn(frame, delay, 14, align === "left" ? -30 : 30);
        return (
          <div
            key={name}
            style={{
              opacity: op,
              transform: `translateX(${x0}px)`,
              fontSize: 44,
              fontWeight: fontWeights.bold,
              color: colors.text,
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
};
