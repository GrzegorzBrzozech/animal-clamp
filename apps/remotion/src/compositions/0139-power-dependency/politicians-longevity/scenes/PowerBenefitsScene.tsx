import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, KingPencil, PersonPencil, OfficerPencil, INK } from "~/characters";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp);

// ── Layout constants ──────────────────────────────────────────────────────────
const GROUND = 970;
const CENTER_X = 960;

// Subjects row
const SUBJECT_SIZE = 110;
const SUBJECT_W = Math.round(SUBJECT_SIZE * 170 / 220);
const SUBJECT_COUNT = 5;
const SUBJECT_GAP = 6;
const SUBJECT_SPAN = SUBJECT_COUNT * SUBJECT_W + (SUBJECT_COUNT - 1) * SUBJECT_GAP;
const SUBJECT_START_X = CENTER_X - SUBJECT_SPAN / 2;
const SUBJECT_TOP = GROUND - SUBJECT_SIZE;

// Pedestal — flush on subjects' heads
const PEDESTAL_W = SUBJECT_SPAN + 40;
const PEDESTAL_H = 200;
const PEDESTAL_LEFT = CENTER_X - PEDESTAL_W / 2;
const PEDESTAL_RIGHT = CENTER_X + PEDESTAL_W / 2;
const PEDESTAL_BOTTOM = SUBJECT_TOP;
const PEDESTAL_TOP = PEDESTAL_BOTTOM - PEDESTAL_H;

// King
const KING_SIZE = 380;
const KING_W = Math.round(KING_SIZE * 170 / 245);
const KING_LEFT = CENTER_X - KING_W / 2;
const KING_TOP = PEDESTAL_TOP - KING_SIZE;

// Officers flanking the pedestal
const OFFICER_SIZE = 300;
const OFFICER_W = Math.round(OFFICER_SIZE * 170 / 220);
const OFFICER_GAP = 24;
const OFFICER_L_LEFT = PEDESTAL_LEFT - OFFICER_W - OFFICER_GAP;
const OFFICER_R_LEFT = PEDESTAL_RIGHT + OFFICER_GAP;
const OFFICER_TOP = GROUND - OFFICER_SIZE;

// Plain servants at far sides
const SERVANT_SIZE = 220;
const SERVANT_W = Math.round(SERVANT_SIZE * 170 / 220);
const SERVANT_L_LEFT = OFFICER_L_LEFT - SERVANT_W - 60;
const SERVANT_R_LEFT = OFFICER_R_LEFT + OFFICER_W + 60;
const SERVANT_TOP = GROUND - SERVANT_SIZE;

// Coins: scene starts 44.18s, "фінансується з кишень" at 51.14s → offset 6.96s → frame 209
const COINS_AT = 209;

// ── Pedestal ──────────────────────────────────────────────────────────────────
const Pedestal: React.FC<{ s: number }> = ({ s }) => (
  <div style={{
    position: "absolute",
    left: PEDESTAL_LEFT,
    top: PEDESTAL_TOP,
    transform: `scaleY(${s})`,
    transformOrigin: "bottom center",
    opacity: s,
  }}>
    <svg width={PEDESTAL_W} height={PEDESTAL_H} viewBox={`0 0 ${PEDESTAL_W} ${PEDESTAL_H}`}>
      <rect x={3} y={3} width={PEDESTAL_W - 6} height={PEDESTAL_H - 6}
        fill="#CBC1AB" stroke={INK} strokeWidth={4} rx={6} />
      {[PEDESTAL_W * 0.25, PEDESTAL_W * 0.5, PEDESTAL_W * 0.75].map((cx, i) => (
        <line key={i} x1={cx} y1={22} x2={cx} y2={PEDESTAL_H - 18}
          stroke={`${INK}44`} strokeWidth={3} />
      ))}
      <rect x={0} y={0} width={PEDESTAL_W} height={18}
        fill="#ADA599" stroke={INK} strokeWidth={3} rx={4} />
      <rect x={0} y={PEDESTAL_H - 18} width={PEDESTAL_W} height={18}
        fill="#ADA599" stroke={INK} strokeWidth={3} rx={4} />
    </svg>
  </div>
);

// ── Subjects (arms raised, holding up pedestal) ───────────────────────────────
const SubjectRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {Array.from({ length: SUBJECT_COUNT }, (_, i) => {
        const s = spring({ fps, frame: frame - i * 5, config: { damping: 18, mass: 0.8 }, from: 0, to: 1 });
        return (
          <div key={i} style={{
            position: "absolute",
            left: SUBJECT_START_X + i * (SUBJECT_W + SUBJECT_GAP),
            top: SUBJECT_TOP,
            transform: `scale(${s})`,
            transformOrigin: "bottom center",
            opacity: s,
          }}>
            <PersonPencil size={SUBJECT_SIZE} facing={i % 2 === 0 ? 1 : -1} pose="salute" />
          </div>
        );
      })}
    </>
  );
};

// ── Coin ──────────────────────────────────────────────────────────────────────
const Coin: React.FC<{ seed: string; at: number; fromX: number }> = ({ seed, at, fromX }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [at, at + 50], [0, 1], clamp);
  const x = interpolate(prog, [0, 1], [fromX, CENTER_X], clamp);
  const y = interpolate(prog, [0, 1], [SUBJECT_TOP - 10, KING_TOP + 60], clamp)
    + Math.sin(Math.PI * prog) * -100 * (0.7 + random(seed) * 0.6);
  const op = interpolate(prog, [0, 0.08, 0.85, 1], [0, 1, 1, 0], clamp);
  const sc = interpolate(prog, [0, 0.5, 1], [0.5, 1.1, 0.4], clamp);

  return (
    <div style={{ position: "absolute", left: x - 18, top: y - 18, transform: `scale(${sc})`, opacity: op, pointerEvents: "none" }}>
      <svg width={36} height={36} viewBox="0 0 36 36">
        <circle cx={18} cy={18} r={16} fill="#f59e0b" stroke={INK} strokeWidth={2.5} />
        <text x={18} y={24} textAnchor="middle" fontSize={16} fontWeight="bold" fill={INK}>₴</text>
      </svg>
    </div>
  );
};

const COIN_CONFIGS = [
  { seed: "c1", at: COINS_AT,      fromX: SUBJECT_START_X + 0 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W / 2 },
  { seed: "c2", at: COINS_AT + 7,  fromX: SUBJECT_START_X + 1 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W / 2 },
  { seed: "c3", at: COINS_AT + 14, fromX: SUBJECT_START_X + 2 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W / 2 },
  { seed: "c4", at: COINS_AT + 21, fromX: SUBJECT_START_X + 3 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W / 2 },
  { seed: "c5", at: COINS_AT + 28, fromX: SUBJECT_START_X + 4 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W / 2 },
  { seed: "c6", at: COINS_AT + 5,  fromX: SUBJECT_START_X + 1 * (SUBJECT_W + SUBJECT_GAP) },
  { seed: "c7", at: COINS_AT + 17, fromX: SUBJECT_START_X + 3 * (SUBJECT_W + SUBJECT_GAP) + SUBJECT_W },
];

// ── Scene ─────────────────────────────────────────────────────────────────────
export const PowerBenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pedestalS  = spring({ fps, frame: frame - 0,  config: { damping: 18 }, from: 0, to: 1 });
  const kingS      = spring({ fps, frame: frame - 15, config: { damping: 16, mass: 1.0 }, from: 0, to: 1 });
  const officerLS  = spring({ fps, frame: frame - 26, config: { damping: 16 }, from: 0, to: 1 });
  const officerRS  = spring({ fps, frame: frame - 32, config: { damping: 16 }, from: 0, to: 1 });
  const servantLS  = spring({ fps, frame: frame - 42, config: { damping: 16 }, from: 0, to: 1 });
  const servantRS  = spring({ fps, frame: frame - 48, config: { damping: 16 }, from: 0, to: 1 });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Ground line + hatch */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="pbHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={INK} strokeWidth="1.8" />
          </pattern>
          <linearGradient id="pbFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="pbMask">
            <rect x="0" y={GROUND} width="1920" height={1080 - GROUND} fill="url(#pbFade)" />
          </mask>
        </defs>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={`${INK}55`} strokeWidth={3} opacity={fade(frame, 5, 20)} />
        <rect x="0" y={GROUND} width="1920" height={1080 - GROUND}
          fill="url(#pbHatch)" fillOpacity={0.28} mask="url(#pbMask)" opacity={fade(frame, 5, 20)} />
      </svg>

      {/* Subjects — standing on ground, arms up, supporting pedestal */}
      <SubjectRow />

      {/* Pedestal — sits on subjects' heads */}
      <Pedestal s={pedestalS} />

      {/* King — on top of pedestal */}
      <div style={{
        position: "absolute",
        left: KING_LEFT,
        top: KING_TOP,
        transform: `scale(${kingS})`,
        transformOrigin: "bottom center",
        opacity: kingS,
      }}>
        <KingPencil size={KING_SIZE} />
      </div>

      {/* Left officer — flanking pedestal, faces right */}
      <div style={{
        position: "absolute",
        left: OFFICER_L_LEFT,
        top: OFFICER_TOP,
        transform: `scale(${officerLS})`,
        transformOrigin: "bottom center",
        opacity: officerLS,
      }}>
        <OfficerPencil size={OFFICER_SIZE} facing={1} pose="stand" />
      </div>

      {/* Right officer — flanking pedestal, faces left */}
      <div style={{
        position: "absolute",
        left: OFFICER_R_LEFT,
        top: OFFICER_TOP,
        transform: `scale(${officerRS})`,
        transformOrigin: "bottom center",
        opacity: officerRS,
      }}>
        <OfficerPencil size={OFFICER_SIZE} facing={-1} pose="stand" />
      </div>

      {/* Left servant — pill 💊 in extended hand (facing=1, handR=[140,96] in 170×220) */}
      <div style={{
        position: "absolute",
        left: SERVANT_L_LEFT,
        top: SERVANT_TOP,
        width: SERVANT_W,
        height: SERVANT_SIZE,
        transform: `scale(${servantLS})`,
        transformOrigin: "bottom center",
        opacity: servantLS,
      }}>
        <PersonPencil size={SERVANT_SIZE} facing={1} pose="present" />
        <div style={{ position: "absolute", left: 128, top: 60, fontSize: 44, lineHeight: 1, userSelect: "none" }}>
          💊
        </div>
      </div>

      {/* Right servant — meat 🍖 in extended hand (facing=-1 mirrors: hand at x=30) */}
      <div style={{
        position: "absolute",
        left: SERVANT_R_LEFT,
        top: SERVANT_TOP,
        width: SERVANT_W,
        height: SERVANT_SIZE,
        transform: `scale(${servantRS})`,
        transformOrigin: "bottom center",
        opacity: servantRS,
      }}>
        <PersonPencil size={SERVANT_SIZE} facing={-1} pose="present" />
        <div style={{ position: "absolute", left: -16, top: 60, fontSize: 44, lineHeight: 1, userSelect: "none" }}>
          🍖
        </div>
      </div>

      {/* Coins — fly from subjects up to king */}
      {COIN_CONFIGS.map((c) => (
        <Coin key={c.seed} {...c} />
      ))}
    </AbsoluteFill>
  );
};
