import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, PagePencil, StampMark } from "~/characters";
import { INK, ROUGH_A, PencilDefs } from "~/characters/svg/_pencil";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

/** One "march of progress" figure: lean = knuckle-walk→upright, scale = size. */
const Walker: React.FC<{ x: number; baseY: number; lean: number; scale: number; opacity: number }> = ({ x, baseY, lean, scale, opacity }) => {
  const s = 60 * scale;
  return (
    <g transform={`translate(${x} ${baseY}) rotate(${lean})`} opacity={opacity} filter={`url(#${ROUGH_A})`}>
      <g stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" transform={`translate(0 ${-s * 1.6})`}>
        {/* head */}
        <circle cx={0} cy={0} r={s * 0.28} fill={INK} />
        {/* spine */}
        <line x1={0} y1={s * 0.28} x2={0} y2={s * 1.2} />
        {/* arms */}
        <line x1={0} y1={s * 0.55} x2={s * 0.6} y2={s * (0.9 + lean / 120)} />
        <line x1={0} y1={s * 0.55} x2={-s * 0.5} y2={s * 0.85} />
        {/* legs */}
        <line x1={0} y1={s * 1.2} x2={s * 0.45} y2={s * 1.9} />
        <line x1={0} y1={s * 1.2} x2={-s * 0.4} y2={s * 1.9} />
      </g>
    </g>
  );
};

const STAGES = [
  { lean: 58, scale: 0.72 },
  { lean: 42, scale: 0.82 },
  { lean: 26, scale: 0.9 },
  { lean: 12, scale: 0.97 },
  { lean: 0, scale: 1.05 },
];

export const EvolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const failScale = frame < 175 ? 2.4 : interpolate(spring({ fps, frame: frame - 175, config: { damping: 8 } }), [0, 1], [2.4, 1]);
  const failShown = frame >= 175;
  const shake = failShown ? Math.sin((frame - 175) * 1.5) * Math.max(0, 1 - (frame - 175) / 10) * 8 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={0}>
          Альтернативна біологія: людина походить від людини
        </AnimatedText>
      </AbsoluteFill>

      {/* evolution march */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <PencilDefs scale={3} />
        {/* rising baseline */}
        <line x1={280} y1={560} x2={1180} y2={430} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={interpolate(frame, [15, 40], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        {STAGES.map((st, i) => {
          const delay = 25 + i * 16;
          const op = interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = 320 + i * 210;
          const baseY = 560 - i * 32;
          return <Walker key={i} x={x} baseY={baseY} lean={st.lean} scale={st.scale} opacity={op} />;
        })}
      </svg>

      {/* exam without evolution → FAIL */}
      <div style={{ position: "absolute", right: 150, bottom: 90, transform: `translate(${shake}px, 0)` }}>
        <div style={{ position: "relative", transform: "rotate(4deg)" }}>
          <PagePencil size={280} lines={4} color="#E7D49C" />
          <div style={{ position: "absolute", top: 30, left: 0, right: 0, textAlign: "center", fontSize: 30, fontWeight: 900, color: colors.text }}>ДПА · біологія</div>
          {failShown ? (
            <div style={{ position: "absolute", left: "50%", top: "55%", transform: `translate(-50%,-50%) scale(${failScale})` }}>
              <StampMark size={200} color={colors.danger} label="ЗАВАЛИВ" />
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ position: "absolute", left: 90, bottom: 130, width: 760 }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={140} align="left" maxWidth={760} color={colors.danger}>
          …а ДПА каже - напочатку обізяна мала була!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
