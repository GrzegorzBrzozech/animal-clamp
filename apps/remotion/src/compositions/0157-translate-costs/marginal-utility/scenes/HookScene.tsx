import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, SandPilePencil, GoldBarPencil } from "~/characters";
import { AnimatedText } from "~/components";
import { fadeIn, popIn } from "~/lib/animations";
import { colors, fontSizes, fontWeights } from "../paper";

/**
 * 0–7 s · Гачок.
 * A ton of sand next to a kilo of gold, and the question that starts the video.
 *
 * The size gap between the two IS the point of the scene ("more" ≠ "worth
 * more"), so the heap is deliberately huge and the ingot deliberately tiny. Both
 * are set so their ground line lands at y ≈ 490 and their boxes bottom out at
 * y = 510, just above the labels at y = 540.
 *
 * Reveal order follows the narration ("Золото дорожче за пісок…" — gold is
 * named first): the ingot pops in first, the heap second. Gold sits closer to
 * centre (1320) than a naive edge-to-edge mirror would put it, so the pair
 * reads as balanced around the frame's centre rather than each hugging its edge.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const goldS = popIn(frame, fps, 4, { damping: 14, mass: 0.8 });
  const pileS = popIn(frame, fps, 20, { damping: 14, mass: 0.8 });
  const pileScale = interpolate(pileS, [0, 1], [0.7, 1]);
  const goldScale = interpolate(goldS, [0, 1], [0.7, 1]);
  const labelOp = fadeIn(frame, 38, 18);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* the plentiful good — a whole TON of it (width ≈ 1.73 × size → 797 px) */}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 50,
          transform: `scale(${pileScale})`,
          transformOrigin: "bottom center",
          opacity: pileS,
        }}
      >
        <SandPilePencil size={460} />
      </div>

      {/* the scarce good — one kilo, and it looks like one kilo */}
      <div
        style={{
          position: "absolute",
          left: 1227,
          top: 380,
          transform: `scale(${goldScale})`,
          transformOrigin: "bottom center",
          opacity: goldS,
        }}
      >
        <GoldBarPencil size={130} />
      </div>

      {/* labels under each object (centred on 458 / 1440) */}
      <div
        style={{
          position: "absolute",
          left: 358,
          top: 540,
          width: 600,
          textAlign: "center",
          opacity: labelOp,
          fontSize: fontSizes.body,
          fontWeight: fontWeights.bold,
          color: colors.textMuted,
        }}
      >
        тонна піску
      </div>
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 540,
          width: 600,
          textAlign: "center",
          opacity: labelOp,
          fontSize: fontSizes.body,
          fontWeight: fontWeights.bold,
          color: colors.secondary,
        }}
      >
        кілограм золота
      </div>

      {/* the question */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center" }}>
        <AnimatedText
          size={72}
          weight={fontWeights.black}
          delay={58}
          align="center"
          maxWidth={1500}
          style={{ lineHeight: 1.15 }}
        >
          Що цінніше: <span style={{ color: colors.primary }}>тонна піску</span> чи{" "}
          <span style={{ color: colors.secondary }}>кілограм золота</span>?
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
