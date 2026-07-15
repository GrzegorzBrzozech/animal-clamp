import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, PhotoPin, DoublingBadge } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MyxococcusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barIn = interpolate(frame, [12, 34], [0, 1], clamp);
  const tagIn = spring({ fps, frame: frame - 18, config: { damping: 13 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Primary photo — fruiting bodies */}
      <div style={{ position: "absolute", left: 70, top: 130 }}>
        <PhotoPin
          src={IMG.myxococcus}
          width={470}
          height={430}
          delay={4}
          rotate={-3}
          caption="Myxococcus"
          hold="tape"
        />
      </div>

      {/* Inset photo — swarm eating a bacterial lawn */}
      <div style={{ position: "absolute", left: 380, top: 588 }}>
        <PhotoPin
          src={IMG.myxoLawn}
          width={380}
          height={320}
          delay={100}
          rotate={4}
          caption="зграя їсть газон бактерій"
          hold="pin"
        />
      </div>

      {/* Ранг-тег */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 88,
          transform: `scale(${tagIn}) rotate(-4deg)`,
          transformOrigin: "left center",
          opacity: tagIn,
          background: colors.danger,
          color: "#FBF7EC",
          fontWeight: fontWeights.black,
          fontSize: 32,
          padding: "8px 22px",
          borderRadius: 12,
          boxShadow: "0 6px 16px #00000030",
        }}
      >
        🐺 зграйний хижак
      </div>

      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 180,
          width: 10,
          height: 720,
          background: colors.danger,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: "top",
        }}
      />

      {/* Text column */}
      <div style={{ position: "absolute", left: 820, top: 210, width: 1000 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={8} align="left" maxWidth={1000}>
          Myxococcus — <span style={{ color: colors.danger }}>полює зграєю</span>
        </AnimatedText>

        <div style={{ height: 26 }} />

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={108}
          align="left"
          maxWidth={980}
          color={colors.text}
        >
          Виходить, що групове полювання ще повільніше. Не дивно, поки з усіма домовишся, поки всі зберуться...
          вже час і скасовувати ті кляті шашлики.
        </AnimatedText>

        {/* Cost of hunting — synced to "знайти / проникнути / з'їсти" @~5s */}
        <div style={{ display: "flex", gap: 18, marginTop: 38, flexWrap: "wrap" }}>
          {["🔍 знайти", "🗡 проникнути", "🍽 з'їсти"].map((t, i) => {
            const s = spring({ fps, frame: frame - (144 + i * 24), config: { damping: 14 } });
            return (
              <span
                key={t}
                style={{
                  transform: `scale(${s})`,
                  opacity: s,
                  fontSize: 32,
                  fontWeight: fontWeights.black,
                  color: colors.danger,
                  background: `${colors.danger}12`,
                  border: `2.5px solid ${colors.danger}`,
                  borderRadius: 12,
                  padding: "10px 22px",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        <div style={{ marginTop: 44 }}>
          <DoublingBadge time="5 год" label="У 15 разів повільніше за E. coli" color={colors.danger} delay={60} size={98} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
