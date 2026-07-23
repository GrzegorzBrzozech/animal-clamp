import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const fade = (f: number, start: number, dur = 20) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Accent quote mark
const QuoteMark: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      left: 800,
      top: 160,
      fontSize: 280,
      fontWeight: fontWeights.black,
      color: `${colors.danger}22`,
      lineHeight: 1,
      opacity,
      pointerEvents: "none",
      userSelect: "none",
      fontFamily: "Georgia, serif",
    }}
  >
    "
  </div>
);

// Quote card with reveal animation
const QuoteCard: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - at, config: { damping: 16, mass: 0.8 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 880,
        top: 360,
        width: 1020,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      {/* accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 6,
          height: "100%",
          background: colors.danger,
          borderRadius: 3,
        }}
      />

      <div style={{ paddingLeft: 32 }}>
        {/* quote text */}
        <div
          style={{
            fontSize: 42,
            fontWeight: fontWeights.semibold,
            color: colors.text,
            lineHeight: 1.75,
            fontStyle: "italic",
          }}
        >
          «Держава — організація, яка успішно{" "}
          <span style={{ color: colors.danger, fontWeight: fontWeights.black, fontStyle: "normal" }}>
            претендує на монополію
          </span>{" "}
          законного застосування{" "}
          <span style={{ color: colors.danger, fontWeight: fontWeights.black, fontStyle: "normal" }}>
            фізичного насильства
          </span>{" "}
          на певній території»
        </div>

        {/* attribution */}
        <div
          style={{
            marginTop: 28,
            fontSize: fontSizes.caption,
            fontWeight: fontWeights.bold,
            color: colors.secondary,
            borderTop: `2px solid ${colors.border}`,
            paddingTop: 20,
          }}
        >
          — Макс Вебер,{" "}
          <span style={{ fontStyle: "italic" }}>«Політика як покликання»</span>, 1919
        </div>
      </div>
    </div>
  );
};

export const WeberQuoteScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <PaperBackground />

      <QuoteMark opacity={fade(frame, 5, 25)} />

      {/* Weber portrait */}
      <div style={{ position: "absolute", left: 80, top: 150 }}>
        <PhotoPin
          src="projects/what-is-power/Max_Weber_1918.jpg"
          width={580}
          height={760}
          delay={5}
          rotate={-2}
          caption="Макс Вебер, соціолог"
          date="1864–1920"
          hold="tape"
        />
      </div>

      {/* Book inset */}
      <div style={{ position: "absolute", left: 520, top: 350 }}>
        <PhotoPin
          src="projects/what-is-power/politics-as-a-vocation.png"
          width={320}
          height={450}
          delay={30}
          rotate={7}
          caption="Політика як покликання"
          date="1919"
          hold="pin"
          objectFit="contain"
        />
      </div>

      {/* Quote card */}
      <QuoteCard at={20} />

    </AbsoluteFill>
  );
};
