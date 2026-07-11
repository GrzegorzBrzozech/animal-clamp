import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, HousePencil, PersonPencil } from "~/characters";
import { INK } from "~/characters/svg/_pencil";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const BAR_AT = 34;
const BARRIER_DOWN = BAR_AT + 24; // frame 58

/** Striped drop-barrier (шлагбаум) that swings down across the path. */
const Barrier: React.FC<{ angle: number }> = ({ angle }) => (
  <svg viewBox="0 0 520 200" width={520} height={200} style={{ overflow: "visible" }}>
    {/* post */}
    <rect x={18} y={40} width={26} height={150} rx={6} fill={colors.surface} stroke={INK} strokeWidth={5} />
    {/* pivoting boom */}
    <g transform={`rotate(${angle} 44 56)`}>
      <rect x={44} y={44} width={440} height={26} rx={8} fill={colors.danger} stroke={INK} strokeWidth={5} />
      {[70, 140, 210, 280, 350, 420].map((x) => (
        <rect key={x} x={x} y={44} width={34} height={26} fill="#EDE7D6" opacity={0.85} />
      ))}
    </g>
    <circle cx={44} cy={56} r={12} fill={colors.surface} stroke={INK} strokeWidth={5} />
  </svg>
);

export const NotSimpleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const houseIn = spring({ fps, frame, config: { damping: 14 } });

  // boom swings from vertical (-80°, up) down to horizontal (0°)
  const angle = interpolate(frame, [BAR_AT, BARRIER_DOWN], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = frame >= BARRIER_DOWN && frame < BARRIER_DOWN + 10 ? Math.sin(frame * 1.4) * 4 : 0;

  // child walks from right toward the house, stops at the barrier
  const childX = interpolate(frame, [0, BAR_AT + 6], [1700, 975], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isWalking = frame < BAR_AT + 6;
  const bob = isWalking ? Math.sin(frame * 0.7) * 6 : 0;
  // small lean while walking, snap upright when stopped
  const lean = isWalking ? Math.sin(frame * 0.35) * 3 : 0;

  // "вдома" flips from success → danger once the barrier is fully down
  const vdomaColor = frame >= BARRIER_DOWN ? colors.danger : colors.success;

  // "якщо зможете!" fades in after barrier is down
  const subtitleOpacity = interpolate(frame, [BARRIER_DOWN, BARRIER_DOWN + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* house */}
      <div style={{ position: "absolute", left: 560, top: 600, transform: `translate(-50%,-50%) scale(${houseIn})`, opacity: houseIn }}>
        <HousePencil size={300} heart />
      </div>

      {/* walking child — faces left (toward house), stops at barrier */}
      <div
        style={{
          position: "absolute",
          left: childX,
          top: 510,
          transform: `translateY(${bob}px) rotate(${lean}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <PersonPencil size={190} facing={-1} pose="stand" />
      </div>

      {/* barrier drops in front of the child */}
      <div style={{ position: "absolute", left: 900, top: 500, transform: `translateY(${shake}px)` }}>
        <Barrier angle={angle} />
      </div>

      {/* title — always visible; "вдома" changes green→red when barrier closes */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={4} slide={0} maxWidth="90%">
          Діти, навчайтесь{" "}
          <span style={{ color: vdomaColor }}>вдома</span>
        </AnimatedText>
      </div>

      {/* "якщо зможете!" appears when barrier is down */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 230,
          display: "flex",
          justifyContent: "center",
          opacity: subtitleOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: fontSizes.heading,
            fontWeight: fontWeights.black,
            color: colors.danger,
            letterSpacing: "0.01em",
          }}
        >
          …якщо зможете!
        </span>
      </div>
    </AbsoluteFill>
  );
};
