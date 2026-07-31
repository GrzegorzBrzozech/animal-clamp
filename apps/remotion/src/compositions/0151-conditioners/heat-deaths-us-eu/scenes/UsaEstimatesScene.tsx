import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

// usa-heat-map.jpg 800×573 → w=860 h=616
const MAP_W = 860;
const MAP_H = Math.round(MAP_W * 573 / 800); // 616

export const UsaEstimatesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statS = spring({ fps, frame: frame - 90, config: { damping: 13, mass: 1.0 } });
  const okayS = spring({ fps, frame: frame - 40, config: { damping: 12, mass: 0.9 } });
  const noteS = spring({ fps, frame: frame - 180, config: { damping: 16, mass: 0.7 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 940, top: 60, width: 5, height: 960, background: colors.border, borderRadius: 3 }} />

      {/* USA heat map — 800×573 → w=680 h=487 */}
      <div style={{ position: "absolute", left: 50, top: 200 }}>
        <PhotoPin
          src={IMG.usaHeatMap}
          width={MAP_W}
          height={MAP_H}
          delay={5}
          rotate={1.5}
          caption="Теплова карта США"
          hold="tape"
        />
      </div>

      {/* RIGHT: estimate */}
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 160,
          opacity: statS,
          transform: `translateY(${interpolate(statS, [0, 1], [50, 0])}px)`,
        }}
      >
        <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginBottom: 12 }}>
          оцінки Клешні Права за EU-моделлю: США
        </div>
        <span style={{ fontSize: 180, fontWeight: fontWeights.black, color: colors.primary, lineHeight: 1 }}>
          8–10 тис.
        </span>
        <div style={{ fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 8 }}>
          "температурних" смертей/рік
        </div>
      </div>

      {/* Okay face — between stat and caveat */}
      <Img
        src={staticFile(IMG.okay)}
        style={{
          position: "absolute",
          left: 1040,
          top: 410,
          width: 420,
          height: "auto",
          opacity: okayS,
          transform: `scale(${interpolate(okayS, [0, 1], [0.7, 1])}) translateY(${interpolate(okayS, [0, 1], [30, 0])}px)`,
          transformOrigin: "center center",
        }}
      />
      {/* Okay face — between stat and caveat */}
      <Img
        src={staticFile(IMG.okay)}
        style={{
          position: "absolute",
          left: 1350,
          top: 410,
          width: 420,
          height: "auto",
          opacity: okayS,
          transform: `scale(${interpolate(okayS, [0, 1], [0.7, 1])}) translateY(${interpolate(okayS, [0, 1], [30, 0])}px)`,
          transformOrigin: "center center",
        }}
      />

      {/* Honest caveat */}
      <div
        style={{
          position: "absolute",
          left: 990,
          bottom: 100,
          opacity: noteS,
          transform: `translateY(${interpolate(noteS, [0, 1], [30, 0])}px)`,
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div style={{ width: 6, height: 80, background: colors.secondary, borderRadius: 3, marginTop: 4 }} />
        <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, lineHeight: 1.5 }}>
          Джерело:<br />
          Регіональні дані + апроксимація на решту територій
        </div>
      </div>
    </AbsoluteFill>
  );
};
