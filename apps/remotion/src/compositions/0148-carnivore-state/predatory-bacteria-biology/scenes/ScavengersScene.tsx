import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, PhotoPin, DoublingBadge } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ScavengersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barIn = interpolate(frame, [12, 34], [0, 1], clamp);
  // 🥇 tag lands with the title (0s); "ГОМСТЕДІНГ!" is spoken at ~10.5s → frame ~314
  const tagIn = spring({ fps, frame: frame - 18, config: { damping: 13 } });
  const gomIn = spring({ fps, frame: frame - 300, config: { damping: 13 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Photo — E. coli under microscope */}
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <PhotoPin
          src={IMG.ecoli}
          width={560}
          height={640}
          delay={4}
          rotate={-2}
          caption="E. coli"
          date="zoom ×10 000"
          hold="tape"
        />
      </div>

      {/* Ранг-тег */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 96,
          transform: `scale(${tagIn}) rotate(-4deg)`,
          transformOrigin: "left center",
          opacity: tagIn,
          background: colors.success,
          color: "#FBF7EC",
          fontWeight: fontWeights.black,
          fontSize: 34,
          padding: "8px 22px",
          borderRadius: 12,
          boxShadow: "0 6px 16px #00000030",
        }}
      >
        🥇 найшвидші
      </div>

      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 150,
          width: 10,
          height: 780,
          background: colors.success,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: "top",
        }}
      />

      {/* Text column */}
      <div style={{ position: "absolute", left: 820, top: 228, width: 1000 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={8} align="left" maxWidth={1000}>
          <span style={{ color: colors.danger }}>Хижаки</span> – не чемпіони.
          {"\n"}Чемпіони – <span style={{ color: colors.success }}>сміттярі!</span>
        </AnimatedText>

        <div style={{ height: 26 }} />

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={110}
          align="left"
          maxWidth={980}
          color={colors.text}
        >
          Тихо вцупів і пішов — наче нічиє знайшов.
        </AnimatedText>

        {/* Гомстедінг stamp — @10.5s */}
        <div
          style={{
            marginTop: 22,
            display: "inline-block",
            transform: `scale(${gomIn}) rotate(-2deg)`,
            transformOrigin: "left center",
            opacity: gomIn,
            border: `4px solid ${colors.secondary}`,
            color: colors.secondary,
            fontWeight: fontWeights.black,
            fontSize: 46,
            letterSpacing: 2,
            padding: "8px 24px",
            borderRadius: 10,
            background: `${colors.secondary}12`,
          }}
        >
          ГОМСТЕДІНГ!
        </div>

        {/* Doubling badges */}
        <div style={{ display: "flex", gap: 28, marginTop: 40, alignItems: "center" }}>
          <DoublingBadge time="20 хв" label="Кишкова паличка" color={colors.success} delay={340} size={98} />
          <DoublingBadge time="10 хв" label="Vibrio natriegens" color={colors.success} delay={415} size={98} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
