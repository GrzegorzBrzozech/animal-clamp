import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

// death-certificate.png 520×384 → w=860 h=635
const CERT_W = 860;
const CERT_H = Math.round(CERT_W * 384 / 520); // 635

export const UsaCountingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statS = spring({ fps, frame: frame - 80, config: { damping: 14, mass: 0.9 } });
  const statSlide = interpolate(statS, [0, 1], [50, 0]);
  const vsS = spring({ fps, frame: frame - 200, config: { damping: 16, mass: 0.7 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Vertical accent bar */}
      <div style={{ position: "absolute", left: 940, top: 60, width: 5, height: 960, background: colors.border, borderRadius: 5 }} />

      {/* Death certificate — 520×384 → w=680 h=502 */}
      <div style={{ position: "absolute", left: 30, top: 180 }}>
        <PhotoPin
          src={IMG.deathCertificate}
          width={CERT_W}
          height={CERT_H}
          delay={5}
          rotate={-2}
          caption="Свідоцтво про смерть"
          hold="tape"
        />
      </div>

      {/* RIGHT: big number */}
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 180,
          opacity: statS,
          transform: `translateY(${statSlide}px)`,
        }}
      >
        <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginBottom: 16 }}>
          Свідоцтва про смерть:
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 200, fontWeight: fontWeights.black, color: colors.primary, lineHeight: 1 }}>
            ~2 000
          </span>
        </div>
        <div style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 8 }}>
          душ/рік
        </div>
      </div>

      {/* EU callout — appears later */}
      <div
        style={{
          position: "absolute",
          left: 990,
          bottom: 220,
          opacity: vsS,
          transform: `translateY(${interpolate(vsS, [0, 1], [30, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ width: 6, height: 130, background: colors.danger, borderRadius: 3 }} />
        <div>
          <div style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.danger }}>
            Європа:
          </div>
          <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
            ...в нас такого нема...
          </div>
          <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 6 }}>
            Викликайте математиків!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
