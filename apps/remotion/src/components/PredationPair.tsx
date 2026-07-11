import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { fontSizes } from "~/theme";
import { usePalette } from "~/theme/palette";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Local timeline (frames after this pair's own `delay`).
const APPEAR = 10; // predator pop-in
const PREY_AT = 18; // prey appears
const PREY_IN = 12;
const JUMP_AT = 40; // leap begins
const JUMP_DUR = 8; // fast
const CATCH = JUMP_AT + JUMP_DUR;
const GLOW_DUR = 22;

export type PredationPairProps = {
  /** Shown to the LEFT of the predator (follows it). */
  predatorLabel: string;
  /** Shown to the RIGHT of the prey. */
  preyLabel: string;
  renderPredator: (cx: number, cy: number) => React.ReactNode;
  /** Prey is drawn at the (x, y) the pair owns; `hurt`/freeze toggle on capture. */
  renderPrey: (hurt: boolean, freezeFrame: number, x: number, y: number) => React.ReactNode;
  /** Hold hidden for this many frames, then play the beat. Lets pairs stagger
   *  inside one scene and accumulate (they never exit). */
  delay?: number;
  predatorRestX?: number;
  preyX?: number;
  y?: number;
  /** Predator's center after the leap (overlapping the prey = the bite). */
  attackX?: number;
  glowColor?: string;
  labelSize?: number;
  labelWidth?: number;
  /** Gap between the predator's center and its label's right edge. */
  predatorGap?: number;
  /** Gap between the prey's center and its label's left edge. */
  preyGap?: number;
};

/**
 * One predator→prey beat: the predator pops in with its label to its LEFT, the
 * prey pops in with its label to its RIGHT, the predator leaps and bites, the
 * prey becomes a victim (hurt + frozen) while the predator lights up. After the
 * beat it just stays — so several pairs with staggered `delay`s accumulate in
 * one scene and only clear when the scene itself ends.
 */
export const PredationPair: React.FC<PredationPairProps> = ({
  predatorLabel,
  preyLabel,
  renderPredator,
  renderPrey,
  delay = 0,
  predatorRestX = 780,
  preyX = 1160,
  y = 560,
  attackX = preyX - 150,
  glowColor,
  labelSize = fontSizes.body - 6,
  labelWidth = 460,
  predatorGap = 185,
  preyGap = 150,
}) => {
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const frame = useCurrentFrame() - delay;
  const glow_ = glowColor ?? pal.secondary;

  const caught = frame >= CATCH;

  // predator: pop in, then leap
  const predOpacity = interpolate(frame, [0, APPEAR], [0, 1], clamp);
  const appearScale = interpolate(frame, [0, APPEAR], [0.5, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const x = interpolate(frame, [JUMP_AT, JUMP_AT + JUMP_DUR], [predatorRestX, attackX], { ...clamp, easing: Easing.in(Easing.cubic) });
  const lunge = caught ? spring({ frame: frame - CATCH, fps, config: { damping: 9, mass: 0.4 } }) : 0;
  const cx = x + lunge * 18;
  const glow = interpolate(frame, [CATCH, CATCH + GLOW_DUR], [0, 1], clamp);
  const pulse = appearScale * (1 + lunge * 0.08 + glow * 0.06);
  const predFilter = glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${glow_}) saturate(${1 + 0.7 * glow}) brightness(${1 + 0.18 * glow})` : undefined;

  // prey: pop in beside the predator
  const preyOpacity = interpolate(frame, [PREY_AT, PREY_AT + PREY_IN], [0, 1], clamp);
  const preyScale = interpolate(frame, [PREY_AT, PREY_AT + PREY_IN], [0.6, 1], clamp);

  const ring = interpolate(frame, [CATCH, CATCH + 16], [0, 1], clamp);

  return (
    <AbsoluteFill>
      {/* predator label — to its LEFT, follows it */}
      <div style={{ position: "absolute", left: cx - labelWidth - predatorGap, top: y - labelSize * 0.7, width: labelWidth, textAlign: "right", fontSize: labelSize, fontWeight: 800, color: pal.danger, opacity: predOpacity }}>
        {predatorLabel}
      </div>

      {/* prey */}
      <div style={{ opacity: preyOpacity, transform: `scale(${preyScale})`, transformOrigin: `${preyX}px ${y}px` }}>{renderPrey(caught, CATCH + delay, preyX, y)}</div>

      {/* prey label — to its RIGHT */}
      <div style={{ position: "absolute", left: preyX + preyGap, top: y - labelSize * 0.6, width: labelWidth, textAlign: "left", fontSize: labelSize, fontWeight: 800, color: pal.success, opacity: preyOpacity }}>
        {preyLabel}
      </div>

      {/* impact shock ring */}
      {ring > 0 && ring < 1 ? (
        <div style={{ position: "absolute", left: preyX, top: y, width: 40 + ring * 150, height: 40 + ring * 150, marginLeft: -(40 + ring * 150) / 2, marginTop: -(40 + ring * 150) / 2, borderRadius: "50%", border: `4px solid ${pal.danger}`, opacity: 1 - ring }} />
      ) : null}

      {/* predator (drawn last → on top during the bite) */}
      <div style={{ opacity: predOpacity, transform: `scale(${pulse})`, transformOrigin: `${cx}px ${y}px`, filter: predFilter }}>{renderPredator(cx, y)}</div>
    </AbsoluteFill>
  );
};
