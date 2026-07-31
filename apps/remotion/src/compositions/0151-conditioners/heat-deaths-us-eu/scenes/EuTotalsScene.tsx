import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

// heat-related-mortality-eu.jpg 1280×1277 → almost square → w=800 h=799
const MAP_W = 800;
const MAP_H = Math.round(MAP_W * 1277 / 1280); // 799

export const EuTotalsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statS = spring({ fps, frame: frame - 30, config: { damping: 14, mass: 0.9 } });
  const thinkS = spring({ fps, frame: frame - 90, config: { damping: 12, mass: 0.9 } });
  const questionS = spring({ fps, frame: frame - 180, config: { damping: 14, mass: 0.9 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 880, top: 60, width: 5, height: 960, background: colors.border, borderRadius: 3 }} />

      {/* EU mortality map — 1280×1277 (≈square) → w=680 h=678 */}
      <div style={{ position: "absolute", left: 30, top: 90 }}>
        <PhotoPin
          src={IMG.euMortality}
          width={MAP_W}
          height={MAP_H}
          delay={5}
          rotate={-1.5}
          caption="Смертність від спеки, ЄС"
          hold="tape"
        />
      </div>

      {/* RIGHT: big EU stat */}
      <div
        style={{
          position: "absolute",
          left: 920,
          top: 160,
          opacity: statS,
          transform: `translateY(${interpolate(statS, [0, 1], [50, 0])}px)`,
        }}
      >
        <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginBottom: 12 }}>
          Європейський Союз 🇪🇺
        </div>
        <span style={{ fontSize: 200, fontWeight: fontWeights.black, color: colors.danger, lineHeight: 1 }}>
          53 000
        </span>
        <div style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 8 }}>
          смертей/рік
        </div>
      </div>

      {/* Thinking troll face — between stat and question */}
      <Img
        src={staticFile(IMG.thinking)}
        style={{
          position: "absolute",
          left: 1140,
          top: 540,
          width: 420,
          height: "auto",
          opacity: thinkS,
          transform: `scale(${interpolate(thinkS, [0, 1], [0.7, 1])}) translateY(${interpolate(thinkS, [0, 1], [30, 0])}px)`,
          transformOrigin: "center center",
        }}
      />

      {/* Question: how to compare? */}
      <div
        style={{
          position: "absolute",
          left: 920,
          bottom: 80,
          opacity: questionS,
          transform: `translateY(${interpolate(questionS, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 6, height: 170, background: colors.secondary, borderRadius: 3 }} />
          <div>
            <div style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.secondary }}>
              Європа
            </div>
            <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
              Це США, все в жізні легко дається.
            </div>
            <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
              а в ЄС життя трудне!
            </div>
            <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
              ... хай вони і рахують!
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
