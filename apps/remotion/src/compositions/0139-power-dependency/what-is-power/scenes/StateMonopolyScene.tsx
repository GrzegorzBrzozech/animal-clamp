import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, EmotivePerson, OfficerPencil, MilitaryPencil, INK } from "~/characters";
import { colors, fontSizes, fontWeights } from "../paper";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fade = (f: number, s: number, d = 20) =>
  interpolate(f, [s, s + d], [0, 1], clamp);

const FIG_SIZE = 320;
const GROUND   = 800;
const STAND_TOP = GROUND - FIG_SIZE;
const SAD_AT   = 150;

// ── Grain sack — y=bottom (ground level), size=height ────────────────────────
const GrainSack: React.FC<{ x: number; y: number; size?: number; opacity: number }> = ({
  x, y, size = 128, opacity,
}) => {
  const H = size;
  const bw = H * 0.60;
  const nw = H * 0.22;
  const sw = Math.max(2.5, H * 0.026);
  const bodyPath = [
    `M ${x - nw/2} ${y - H + H*0.16}`,
    `C ${x - bw/2 - H*0.07} ${y - H*0.74} ${x - bw/2 - H*0.04} ${y - H*0.36} ${x - bw*0.38} ${y}`,
    `Q ${x} ${y + H*0.03} ${x + bw*0.38} ${y}`,
    `C ${x + bw/2 + H*0.04} ${y - H*0.36} ${x + bw/2 + H*0.07} ${y - H*0.74} ${x + nw/2} ${y - H + H*0.16}`,
    "Z",
  ].join(" ");
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={y + 4} rx={bw*0.40} ry={5} fill="#00000028" />
      <path d={bodyPath} fill="#C4934E" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {[0.28, 0.45, 0.62, 0.78].map((t, i) => (
        <line key={i}
          x1={x - bw * (0.30 + t * 0.06)} y1={y - H * t}
          x2={x + bw * (0.30 + t * 0.06)} y2={y - H * t}
          stroke={INK} strokeWidth={1.4} opacity={0.22}
        />
      ))}
      <path
        d={`M ${x - nw/2 - 2} ${y - H + H*0.20} Q ${x} ${y - H + H*0.14} ${x + nw/2 + 2} ${y - H + H*0.20}`}
        fill="none" stroke="#7A5025" strokeWidth={sw * 0.8} strokeLinecap="round"
      />
      <ellipse cx={x} cy={y - H + H*0.18} rx={nw*0.28} ry={H*0.03} fill="#7A5025" opacity={0.8} />
      <ellipse cx={x} cy={y - H + H*0.08} rx={nw*0.42} ry={H*0.05} fill="#D9A93A" opacity={0.9} />
    </g>
  );
};

// ── Moving sack ───────────────────────────────────────────────────────────────
const MovingSack: React.FC<{ fromX: number; toX: number; at: number }> = ({ fromX, toX, at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 48], [0, 1], clamp);
  const cx = fromX + (toX - fromX) * t;
  const arcY = interpolate(t, [0, 0.5, 1], [0, -130, 0]);
  const op = interpolate(frame, [at - 4, at, at + 44, at + 52], [0, 1, 1, 0], clamp);
  const H = 128;
  const bw = H * 0.60;
  const nw = H * 0.22;
  const sw = Math.max(2.5, H * 0.026);
  const y = GROUND + arcY;
  const bodyPath = [
    `M ${cx - nw/2} ${y - H + H*0.16}`,
    `C ${cx - bw/2 - H*0.07} ${y - H*0.74} ${cx - bw/2 - H*0.04} ${y - H*0.36} ${cx - bw*0.38} ${y}`,
    `Q ${cx} ${y + H*0.03} ${cx + bw*0.38} ${y}`,
    `C ${cx + bw/2 + H*0.04} ${y - H*0.36} ${cx + bw/2 + H*0.07} ${y - H*0.74} ${cx + nw/2} ${y - H + H*0.16}`,
    "Z",
  ].join(" ");
  return (
    <g opacity={op}>
      <path d={bodyPath} fill="#C4934E" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx={cx} cy={y - H + H*0.08} rx={nw*0.42} ry={H*0.05} fill="#D9A93A" opacity={0.9} />
    </g>
  );
};

// ── Civilian: appears with smile, then turns sad ──────────────────────────────
const CivilianFigure: React.FC<{ left: number; delay: number; index: number }> = ({ left, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ fps, frame: frame - delay, config: { damping: 18 }, from: 0, to: 1 });
  const happyProgress = interpolate(frame, [delay + 5, delay + 22, SAD_AT - 20, SAD_AT + 12], [0, 1, 1, 0], clamp);
  const sadProgress   = interpolate(frame, [SAD_AT + index * 8, SAD_AT + index * 8 + 25], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", left, top: STAND_TOP, transform: `scale(${appear})`, transformOrigin: "bottom center", opacity: appear }}>
      <EmotivePerson size={FIG_SIZE} facing={1} pose="stand" happyProgress={happyProgress} sadProgress={sadProgress} />
    </div>
  );
};

// ── Military with spring appear ───────────────────────────────────────────────
const MilitaryAppear: React.FC<{ left: number; top: number; appearAt: number }> = ({ left, top, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - appearAt, config: { damping: 13, mass: 0.9 }, from: 0, to: 1 });
  return (
    <div style={{ position: "absolute", left, top, transform: `scale(${s})`, transformOrigin: "bottom center", opacity: s }}>
      <MilitaryPencil size={OFFICER_SIZE} facing={-1} pose="stand" />
    </div>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────
const CIVILS = [
  { left: 480, delay: 10 },
  { left: 840, delay: 15 },
  { left: 1200, delay: 20 },
];

const OFFICER_SIZE = 410;
const MILITARY_LEFT = 1560;

export const StateMonopolyScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOp      = fade(frame, 5, 25);
  const sackStaticOp = interpolate(frame, [30, 50, 120, 145], [0, 1, 1, 0], clamp);
  // Sequential phrases — each fades in, holds, then fades out as next appears
  const phrase1Op = interpolate(frame, [72, 92, 130, 142], [0, 1, 1, 0], clamp);
  const phrase2Op = interpolate(frame, [90, 110, 146, 156], [0, 1, 1, 0], clamp);
  const phrase3Op = fade(frame, 120, 18);
  const sackUniformOp = fade(frame, 175, 20);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Title */}
      <div style={{ position: "absolute", top: 48, left: 0, right: 0, textAlign: "center", opacity: titleOp }}>
        <span style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: colors.text }}>
          Час збирання <span style={{ color: colors.success }}>врожаю</span>
        </span>
      </div>

      {/* Sequential spoken phrases */}
      <div style={{ position: "absolute", bottom: 760, left: 0, right: 990, textAlign: "center", opacity: phrase1Op, fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.textMuted }}>
        О, селяни-<span style={{ color: colors.success, fontWeight: fontWeights.black }}>куркулі</span>!
      </div>
      <div style={{ position: "absolute", bottom: 680, left: 900, right: 0, textAlign: "center", opacity: phrase2Op, fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.textMuted }}>
        У вас щось забагато <span style={{ color: colors.secondary, fontWeight: fontWeights.black }}>зерна</span>.
      </div>
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center", opacity: phrase3Op, fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.textMuted }}>
        Віддайте на потреби <span style={{ color: colors.danger, fontWeight: fontWeights.black }}>Держави</span>
      </div>

      {/* Civilians */}
      {CIVILS.map((c, i) => (
        <CivilianFigure key={i} left={c.left} delay={c.delay} index={i} />
      ))}

      {/* Officer — left */}
      <div style={{ position: "absolute", left: 80, top: GROUND - OFFICER_SIZE }}>
        <div style={{ transform: `scale(${fade(frame, 70, 28)})`, transformOrigin: "bottom center", opacity: fade(frame, 70, 28) }}>
          <OfficerPencil size={OFFICER_SIZE} facing={1} pose="present" />
        </div>
      </div>

      {/* Military — right */}
      <MilitaryAppear left={MILITARY_LEFT} top={GROUND - OFFICER_SIZE} appearAt={90} />

      {/* Ground + sacks */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080">
        <line x1={60} y1={GROUND} x2={1860} y2={GROUND} stroke={`${INK}44`} strokeWidth={3} />

        {/* Static sacks near civilians — y=GROUND (bottom-aligned) */}
        <GrainSack x={510} y={800} opacity={sackStaticOp} />
        <GrainSack x={610} y={800} opacity={sackStaticOp} />
        <GrainSack x={560} y={800} opacity={sackStaticOp} />
        <GrainSack x={875} y={800} opacity={sackStaticOp} />
        <GrainSack x={985} y={800} opacity={sackStaticOp} />
        <GrainSack x={935} y={800} opacity={sackStaticOp} />
        <GrainSack x={1235} y={800} opacity={sackStaticOp} />
        <GrainSack x={1355} y={800} opacity={sackStaticOp} />
        <GrainSack x={1295} y={800} opacity={sackStaticOp} />

        {/* Transfer animation */}
        <MovingSack fromX={550} toX={230} at={128} />
        <MovingSack fromX={915} toX={240} at={138} />
        <MovingSack fromX={1275} toX={1700} at={133} />

        {/* Sacks by uniforms */}
        <GrainSack x={195} y={800} opacity={sackUniformOp} />
        <GrainSack x={270} y={800} opacity={sackUniformOp} />
        <GrainSack x={1660} y={800} opacity={sackUniformOp} />
        <GrainSack x={1735} y={800} opacity={sackUniformOp} />
      </svg>
    </AbsoluteFill>
  );
};
