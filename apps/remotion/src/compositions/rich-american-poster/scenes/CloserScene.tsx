import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MediaKenBurns } from "~/components";
import { fadeIn } from "~/lib/animations";
import { Caption } from "../Caption";
import { MEDIA } from "../plan";

/**
 * 1:33.52–1:38 (134f) · SRT: "Так що і тут не збрехали." (93.52–95.26).
 * Плакат широким планом, потім затемнення й титр-джерело.
 */
export const CloserScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dimOp = fadeIn(frame, 60, 40);
  const creditOp = fadeIn(frame, 75, 30);

  return (
    <AbsoluteFill>
      <MediaKenBurns src={MEDIA.poster} durationInFrames={durationInFrames} zoom={0.04} gradient="full" />

      <Caption delay={0} exitAt={55}>
        Так що і тут не збрехали.
      </Caption>

      <AbsoluteFill style={{ background: "#000000", opacity: dimOp * 0.7 }} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: creditOp,
          color: "#fff",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, color: "#ffffffcc" }}>
          Плакат: В. Говорков, "У них лише для багатих достаток...", 1957
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
