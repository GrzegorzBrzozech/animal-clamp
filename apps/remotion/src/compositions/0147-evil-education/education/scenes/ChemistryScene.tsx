import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, ManuscriptPencil, FlaskPencil } from "~/characters";
import { INK, PAPER } from "~/characters/svg/_pencil";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

// Word timing (scene-local frames, from the transcript):
//   "Можна додати уроки релігієзнавства" ≈ f0–68
//   "але не замість хімії"               ≈ f70–115  (flask + bubbles beat)
const FLASK_IN = 70;
const BUBBLES_START = 80;

/** Bubbles rising out of the flask mouth once the chemistry beat starts. */
const Bubbles: React.FC<{ cx: number; baseY: number; count: number; color: string }> = ({ cx, baseY, count, color }) => {
  const frame = useCurrentFrame();
  const cycle = 56;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const local = frame - BUBBLES_START - i * 5;
        if (local < 0) return null;
        const t = (((local % cycle) + cycle) % cycle) / cycle;
        const y = baseY - t * 240;
        const x = cx + Math.sin(local * 0.12 + i * 1.6) * 34 + ((i % 3) - 1) * 20;
        const r = 7 + (i % 4) * 6;
        const op = Math.sin(t * Math.PI) * 0.9;
        return <circle key={i} cx={x} cy={y} r={r} fill={PAPER} stroke={color} strokeWidth={3.4} opacity={op} />;
      })}
    </>
  );
};

export const ChemistryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const manuIn = spring({ fps, frame: frame - 6, config: { damping: 13, mass: 0.6 } });
  const plusIn = spring({ fps, frame: frame - 16, config: { damping: 11 } });
  const plusPulse = 1 + Math.max(0, Math.sin(frame * 0.16)) * 0.1;

  // manuscript slides left to make room for the flask
  const manuX = interpolate(frame, [FLASK_IN, FLASK_IN + 20], [960, 720], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plusX = interpolate(frame, [FLASK_IN, FLASK_IN + 20], [740, 965], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const flaskShown = frame >= FLASK_IN;
  const flaskIn = spring({ fps, frame: frame - FLASK_IN, config: { damping: 11, mass: 0.6 } });

  const phase1 = interpolate(frame, [58, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* релігієзнавство — an ancient manuscript, being ADDED */}
      <div style={{ position: "absolute", left: manuX, top: 460, transform: `translate(-50%,-50%) scale(${manuIn})`, opacity: manuIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <ManuscriptPencil size={230} />
        <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.text, marginTop: 6 }}>релігієзнавство</span>
      </div>

      {/* additive plus */}
      <div style={{ position: "absolute", left: plusX, top: 440, transform: `translate(-50%,-50%) scale(${plusIn * plusPulse})`, opacity: plusIn, fontSize: 110, fontWeight: 900, color: colors.success }}>
        ＋
      </div>

      {/* хімія — flask appears on "але не замість хімії", then bubbles */}
      {flaskShown ? (
        <div style={{ position: "absolute", left: 1230, top: 470, transform: `translate(-50%,-50%) scale(${flaskIn})`, opacity: flaskIn, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <FlaskPencil size={210} color={colors.success} />
          <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.text, marginTop: 6 }}>хімія</span>
        </div>
      ) : null}

      {/* bubbles */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Bubbles cx={1230} baseY={430} count={9} color={colors.success} />
        <Bubbles cx={1230} baseY={430} count={5} color={INK} />
      </svg>

      {/* captions follow the words */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, display: "flex", justifyContent: "center", opacity: phase1 }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={8} slide={0} maxWidth="94%">
          можна <span style={{ color: colors.success }}>додати</span> релігієзнавство
        </AnimatedText>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={FLASK_IN + 2} slide={0} maxWidth="94%">
          але <span style={{ color: colors.danger }}>не замість</span> хімії
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
