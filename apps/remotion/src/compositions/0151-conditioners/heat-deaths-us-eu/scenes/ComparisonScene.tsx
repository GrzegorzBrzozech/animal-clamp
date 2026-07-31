import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fade = (frame: number, start: number, dur = 22) =>
  interpolate(frame, [start, start + dur], [0, 1], clamp);

type StatCardProps = {
  region: string;
  value: string;
  color: string;
  delay: number;
  note?: string;
};

const StatCard: React.FC<StatCardProps> = ({ region, value, color, delay, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 12, mass: 1.0 } });
  const slideY = interpolate(s, [0, 1], [60, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: s,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          fontSize: fontSizes.title,
          fontWeight: fontWeights.black,
          color: colors.textMuted,
        }}
      >
        {region}
      </div>
      <div
        style={{
          fontSize: 200,
          fontWeight: fontWeights.black,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {note ? (
        <div
          style={{
            fontSize: fontSizes.caption,
            fontWeight: fontWeights.bold,
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};

export const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();
  const vsOp = fade(frame, 100, 24);
  const gapOp = fade(frame, 180, 28);
  const conclusionOp = fade(frame, 280, 28);
  const seriouslyS = spring({ fps, frame: frame - 170, config: { damping: 12, mass: 1.1 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Seriously face — large, left side */}
      <Img
        src={staticFile(IMG.seriously)}
        style={{
          position: "absolute",
          left: 40,
          top: 180,
          width: 500,
          height: "auto",
          opacity: seriouslyS,
          transform: `scale(${interpolate(seriouslyS, [0, 1], [0.75, 1])}) translateY(${interpolate(seriouslyS, [0, 1], [40, 0])}px)`,
          transformOrigin: "center center",
        }}
      />

      {/* Top label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}>
        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={80}
          align="center"
          color={colors.textMuted}
          style={{ margin: "0 auto" }}
        >
          Смертей від спеки на 100 000 населення (за EU-методологією)
        </AnimatedText>
      </div>

      {/* Two stat cards */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 170,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 80,
        }}
      >
        <StatCard
          region="США"
          value="3"
          color={colors.primary}
          delay={10}
          note="8–10 тис. / 330 млн"
        />

        {/* VS separator */}
        <div
          style={{
            paddingBottom: 110,
            opacity: vsOp,
            fontSize: 80,
            fontWeight: fontWeights.black,
            color: colors.border,
          }}
        >
          vs
        </div>

        <StatCard
          region="ЄС"
          value="12"
          color={colors.danger}
          delay={63}
          note="53 тис. / 450 млн"
        />
      </div>

      {/* Gap badge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 260,
          textAlign: "center",
          opacity: gapOp,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: `${colors.secondary}22`,
            border: `4px solid ${colors.secondary}`,
            borderRadius: 20,
            padding: "18px 48px",
          }}
        >
          <span
            style={{
              fontSize: fontSizes.heading,
              fontWeight: fontWeights.black,
              color: colors.secondary,
            }}
          >
            Так не годиться!
          </span>
        </div>
      </div>

      {/* Conclusion */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          textAlign: "center",
          opacity: conclusionOp,
        }}
      >
        <span
          style={{
            fontSize: fontSizes.body,
            fontWeight: fontWeights.bold,
            color: colors.textMuted,
            fontStyle: "italic",
          }}
        >
          Рівень життя - схожий, але спека більш критична
        </span>
      </div>
    </AbsoluteFill>
  );
};
