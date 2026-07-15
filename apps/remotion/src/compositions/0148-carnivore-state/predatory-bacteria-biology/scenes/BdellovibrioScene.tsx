import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, PhotoPin, DoublingBadge } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const STEPS = ["проникнення", "харчування", "розмноження"];

const Step: React.FC<{ text: string; delay: number; last: boolean }> = ({ text, delay, last }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 14 } });
  return (
    <>
      <div
        style={{
          transform: `scale(${s})`,
          opacity: s,
          background: `${colors.danger}14`,
          border: `2.5px solid ${colors.danger}`,
          color: colors.danger,
          fontWeight: fontWeights.black,
          fontSize: 30,
          padding: "10px 20px",
          borderRadius: 12,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {!last ? (
        <span style={{ color: colors.danger, fontSize: 40, fontWeight: 900, opacity: s }}>→</span>
      ) : null}
    </>
  );
};

export const BdellovibrioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const barIn = interpolate(frame, [12, 34], [0, 1], clamp);
  const tagIn = spring({ fps: 30, frame: frame - 18, config: { damping: 13 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Photo — cryotomogram */}
      <div style={{ position: "absolute", left: 120, top: 170 }}>
        <PhotoPin
          src={IMG.bdellovibrio}
          width={560}
          height={560}
          delay={4}
          rotate={2}
          caption="Bdellovibrio bacteriovorus"
          date="4 год"
          hold="pin"
        />
      </div>

      {/* Ранг-тег */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 116,
          transform: `scale(${tagIn}) rotate(-3deg)`,
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
        🩸 справжній хижак
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
      <div style={{ position: "absolute", left: 820, top: 310, width: 1000 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={8} align="left" maxWidth={1000}>
          <span style={{ color: colors.danger }}>Хижі</span>, але гальмують
        </AnimatedText>

        <div style={{ height: 26 }} />

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={62}
          align="left"
          maxWidth={980}
          color={colors.text}
        >
          Отримуєш все й одразу. Але поки знайдеш, де ото все є - пів життя сплине
        </AnimatedText>

        {/* Mini flow — synced to "проникнення / харчування / розмноження" */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 40 }}>
          {STEPS.map((t, i) => (
            <Step key={t} text={t} delay={78 + i * 28} last={i === STEPS.length - 1} />
          ))}
        </div>

        <div style={{ marginTop: 44 }}>
          <DoublingBadge time="4 год" label="на цикл — у 12× повільніше за E. coli" color={colors.danger} delay={165} size={98} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
