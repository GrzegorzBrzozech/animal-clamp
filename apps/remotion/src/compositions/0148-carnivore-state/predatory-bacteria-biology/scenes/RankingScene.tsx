import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Tier = {
  medal: string;
  glyph: string;
  title: string;
  verdict: string;
  time: string;
  color: string;
  /** relative bar width 0..1 (desirability, not speed) */
  weight: number;
};

const TIERS: Tier[] = [
  { medal: "🥇", glyph: "🍃", title: "Падальщики", verdict: "бери, що погано лежить", time: "10 хв-2 год", color: colors.success, weight: 1 },
  { medal: "🥈", glyph: "🐺", title: "Хижаки", verdict: "кусай ближнього", time: "3–6 год", color: colors.danger, weight: 0.64 },
  { medal: "🥉", glyph: "🏗", title: "Автотрофи", verdict: "вір у себе", time: "5–24 год", color: colors.secondary, weight: 0.34 },
];

const Row: React.FC<{ tier: Tier; delay: number }> = ({ tier, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 15, mass: 0.8 } });
  const slide = interpolate(s, [0, 1], [-80, 0]);
  const barW = interpolate(frame, [delay + 8, delay + 34], [0, tier.weight], clamp);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity: s,
        transform: `translateX(${slide}px)`,
      }}
    >
      <span style={{ fontSize: 64, width: 74, textAlign: "center" }}>{tier.medal}</span>

      {/* proportional bar with label inside */}
      <div style={{ position: "relative", flex: 1, height: 96 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${barW * 100}%`,
            minWidth: 320,
            background: `${tier.color}22`,
            border: `4px solid ${tier.color}`,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 26px",
          }}
        >
          <span style={{ fontSize: 52 }}>{tier.glyph}</span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 40, fontWeight: fontWeights.black, color: tier.color, whiteSpace: "nowrap" }}>
              {tier.title}
            </span>
            <span style={{ fontSize: 24, fontWeight: fontWeights.bold, color: colors.textMuted, whiteSpace: "nowrap" }}>
              {tier.verdict}
            </span>
          </div>
        </div>
      </div>

      {/* time chip */}
      <span
        style={{
          fontSize: 36,
          fontWeight: fontWeights.black,
          color: tier.color,
          width: 220,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        ⏱ {tier.time}
      </span>
    </div>
  );
};

export const RankingScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <AnimatedText
          size={fontSizes.heading}
          weight={fontWeights.black}
          delay={4}
          align="center"
          maxWidth="88%"
          style={{ margin: "0 auto" }}
        >
          <span style={{ color: colors.primary }}>Закономірність</span> мікросвіту
        </AnimatedText>
      </div>

      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 350,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {TIERS.map((t, i) => (
          <Row key={t.title} tier={t} delay={[65, 150, 200][i]} />
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={215}
          align="center"
          maxWidth="80%"
          color={colors.textMuted}
          style={{ margin: "0 auto" }}
        >
          Найкращий закон – той, що працює, навіть коли про нього не знаєш
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
