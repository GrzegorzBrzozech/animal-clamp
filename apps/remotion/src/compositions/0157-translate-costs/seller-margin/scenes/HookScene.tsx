import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { MEDIA, CLIP_FRAMES } from "../plan";
import { colors, fontWeights } from "../paper";

/**
 * 0–5 s · Гачок. ONE number — "2%" — filling the frame, no other figure (the
 * first cut showed "36–39%" here too, contradicting the hook's own
 * question). Revision 3: the real footage was reduced to a tiny corner card
 * — too small to read as "the visual proof" it's meant to be — so it's now
 * a genuinely large panel (~55% of the frame), and the number fills the rest
 * with no empty margin and no restated caption under it.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numS = spring({ fps, frame: frame - 24, config: { damping: 12, mass: 0.8 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 50, top: 120 }}>
        <PhotoPin
          src={MEDIA.hookPricetag}
          kind="video"
          sourceDurationInFrames={CLIP_FRAMES.hookPricetag}
          width={1060}
          height={800}
          delay={6}
          rotate={-1.5}
          caption="Реальний ціннник у АТБ"
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 720,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: numS,
          transform: `scale(${numS})`,
        }}
      >
        <div style={{ fontSize: 420, fontWeight: fontWeights.black, color: colors.danger, lineHeight: 1 }}>2%</div>
      </div>
    </AbsoluteFill>
  );
};
