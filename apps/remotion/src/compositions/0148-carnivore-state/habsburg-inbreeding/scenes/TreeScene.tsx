import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, INK, KingPencil, PrincessPencil } from "~/characters";
import { colors, fontSizes, fontWeights } from "../paper";

// ── Layout constants ─────────────────────────────────────────────────────────

const CHAR_SIZE = 80;
const KING_W = Math.round(CHAR_SIZE * 170 / 245); // ≈ 56
const QUEEN_W = Math.round(CHAR_SIZE * 170 / 255); // ≈ 53

// 7 columns left→right: idx 6 (Maximilian, oldest) → idx 0 (Carlos II, newest)
// STEP=269 + LEFT=152 → COL_CX(3)=959 (Felipe II at exact canvas center)
const STEP = 269;
const COL_CX = (idx: number) => 152 + (6 - idx) * STEP;
// COL_CX(6)=152  COL_CX(5)=421  COL_CX(4)=690
// COL_CX(3)=959  COL_CX(2)=1228 COL_CX(1)=1497  COL_CX(0)=1766

const KING_Y = 305;                          // top of king character div
const QUEEN_Y = 695;                         // top of queen character div
const KING_FEET_Y = KING_Y + CHAR_SIZE;      // = 270
const QUEEN_FEET_Y = QUEEN_Y + CHAR_SIZE;    // = 660
const MID_Y = Math.round((KING_FEET_Y + QUEEN_Y) / 2); // = 425
const BADGE_TOP = QUEEN_FEET_Y + 8;         // = 668: below queen feet
const QUEEN_LABEL_TOP = BADGE_TOP + 30;     // = 698: name+years below badge

// Carlos II (solo): vertically centered at MID_Y
const CARLOS_Y = MID_Y - Math.round(CHAR_SIZE / 2); // = 385

// ── Habsburg genealogy data ──────────────────────────────────────────────────

type Gen = {
  idx: number;
  solo?: true;
  king: { name: string; years: string; role: string };
  queen?: { name: string; years: string };
  relation?: string;
  neutral?: true; // true = не родичі (нормальний шлюб)
};

const GENS: Gen[] = [
  {
    idx: 6,
    king: { name: "Максиміліан І", years: "1459–1519", role: "засновник" },
    queen: { name: "Марія Бургундська", years: "1457–1482" },
    relation: "не родичі",
    neutral: true,
  },
  {
    idx: 5,
    king: { name: "Феліпе І Красивий", years: "1478–1506", role: "пра-пра-прадід" },
    queen: { name: "Хуана Кастильська", years: "1479–1555" },
    relation: "не родичі",
    neutral: true,
  },
  {
    idx: 4,
    king: { name: "Карл V", years: "1500–1558", role: "пра-прадід" },
    queen: { name: "Ізабелла Португальська", years: "1503–1539" },
    relation: "двоюрідна сестра",
  },
  {
    idx: 3,
    king: { name: "Феліпе ІІ", years: "1527–1598", role: "прадід" },
    queen: { name: "Анна Австрійська", years: "1549–1580" },
    relation: "племінниця",
  },
  {
    idx: 2,
    king: { name: "Феліпе ІІІ", years: "1578–1621", role: "дід" },
    queen: { name: "Маргарита Австрійська", years: "1584–1611" },
    relation: "двоюрідна сестра",
  },
  {
    idx: 1,
    king: { name: "Феліпе IV", years: "1605–1665", role: "батько" },
    queen: { name: "Маріана Австрійська", years: "1634–1696" },
    relation: "племінниця",
  },
  {
    idx: 0,
    solo: true,
    king: { name: "Карл ІІ", years: "1661–1700", role: "Останній Габсбург" },
  },
];

// ── Reveal frames ─────────────────────────────────────────────────────────────
// Synced with narration: "Його батько" → idx1 fast; "Батьків батько" → idx2;
// "сім поколінь поспіль" → fill rest quickly; tree done ~frame 210.

const REVEAL: Record<number, number> = {
  0:   0, // Carlos II — immediately
  1:  30, // Felipe IV + Mariana — "Його батько"
  2:  65, // Felipe III + Margaret — "Батьків батько"
  3: 105, // Felipe II + Anna
  4: 125, // Charles V + Isabella
  5: 145, // Philip I + Joanna
  6: 165, // Maximilian + Mary
};

// ── Scene ─────────────────────────────────────────────────────────────────────

export const TreeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const popIn = (idx: number) =>
    spring({ fps, frame: frame - REVEAL[idx], config: { damping: 14, mass: 0.7 } });

  const fadeIn = (idx: number) =>
    interpolate(frame, [REVEAL[idx], REVEAL[idx] + 18], [0, 1], clamp);

  // Vertical coupling line within each couple's column.
  // Draws downward from KING_FEET_Y to QUEEN_Y when the couple appears.
  const couplingLine = (idx: number) => {
    const start = REVEAL[idx] + 5;
    const prog = interpolate(frame, [start, start + 28], [0, 1], clamp);
    return { x: COL_CX(idx), y1: KING_FEET_Y, y2: KING_FEET_Y + (QUEEN_Y - KING_FEET_Y) * prog };
  };

  // Horizontal child line from parent column toward child column.
  // Draws rightward (COL_CX(idx) → COL_CX(idx-1)) when the parent appears.
  const childLine = (idx: number) => {
    const start = REVEAL[idx] + 15;
    const prog = interpolate(frame, [start, start + 28], [0, 1], clamp);
    const x1 = COL_CX(idx);
    const x2 = COL_CX(idx - 1); // higher x (to the right)
    return { y: MID_Y, x1, x2: x1 + (x2 - x1) * prog };
  };

  // ── Text style helpers ──────────────────────────────────────────────────────
  const nameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.text,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    textAlign: "center",
  };
  const subStyle: React.CSSProperties = {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    textAlign: "center",
  };
  const roleStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: fontWeights.bold,
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  // Helper: label div position (centered at COL_CX, 220px wide)
  const labelBox = (idx: number, top: number): React.CSSProperties => ({
    position: "absolute",
    left: COL_CX(idx) - 110,
    top,
    width: 220,
  });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Page title */}
      <div style={{
        position: "absolute",
        left: 400,
        top: 30,
        fontSize: fontSizes.heading,
        fontWeight: fontWeights.black,
        color: colors.text,
        opacity: fadeIn(0),
      }}>
        7 поколінь інбридингу{" "}
        <span style={{ color: colors.primary }}>Габсбургів</span>
      </div>

      {/* ── SVG tree lines ────────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* Vertical coupling lines (within each couple's column, idx 1–6) */}
        {([1, 2, 3, 4, 5, 6] as const).map((idx) => {
          const cl = couplingLine(idx);
          return (
            <line key={`cl${idx}`}
              x1={cl.x} y1={cl.y1} x2={cl.x} y2={cl.y2}
              stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.7}
            />
          );
        })}

        {/* Horizontal child lines (parent → child, idx 1–6 each point right) */}
        {([1, 2, 3, 4, 5, 6] as const).map((idx) => {
          const hl = childLine(idx);
          return (
            <line key={`hl${idx}`}
              x1={hl.x1} y1={hl.y} x2={hl.x2} y2={hl.y}
              stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.7}
            />
          );
        })}
      </svg>

      {/* ── Characters + labels ───────────────────────────────────────────── */}
      {GENS.map((gen) => {
        const s = popIn(gen.idx);
        const op = fadeIn(gen.idx);
        const cx = COL_CX(gen.idx);

        if (gen.solo) {
          // ── Carlos II — centered at MID_Y ────────────────────────────────
          return (
            <React.Fragment key={gen.idx}>
              <div style={{
                position: "absolute",
                left: cx - KING_W / 2,
                top: CARLOS_Y,
                transform: `scale(${s})`,
                transformOrigin: "center bottom",
                opacity: s,
              }}>
                <KingPencil size={CHAR_SIZE} />
              </div>

              {/* Role + name + years below character */}
              <div style={{ ...labelBox(gen.idx, CARLOS_Y + CHAR_SIZE + 8), opacity: op }}>
                <div style={roleStyle}>{gen.king.role}</div>
                <div style={nameStyle}>{gen.king.name}</div>
                <div style={subStyle}>{gen.king.years}</div>
              </div>
            </React.Fragment>
          );
        }

        // ── Couple (king + queen) ─────────────────────────────────────────
        return (
          <React.Fragment key={gen.idx}>
            {/* King labels above */}
            <div style={{ ...labelBox(gen.idx, 205), opacity: op }}>
              <div style={nameStyle}>{gen.king.name}</div>
              <div style={subStyle}>{gen.king.years}</div>
              <div style={roleStyle}>{gen.king.role}</div>
            </div>

            {/* King character */}
            <div style={{
              position: "absolute",
              left: cx - KING_W / 2,
              top: KING_Y,
              transform: `scale(${s})`,
              transformOrigin: "center bottom",
              opacity: s,
            }}>
              <KingPencil size={CHAR_SIZE} />
            </div>

            {/* Queen character */}
            <div style={{
              position: "absolute",
              left: cx - QUEEN_W / 2,
              top: QUEEN_Y,
              transform: `scale(${s})`,
              transformOrigin: "center bottom",
              opacity: s,
            }}>
              <PrincessPencil size={CHAR_SIZE} />
            </div>

            {/* Relation badge — directly below queen character */}
            {gen.relation && (
              <div style={{
                position: "absolute",
                left: cx - 85,
                width: 170,
                top: BADGE_TOP,
                textAlign: "center",
                opacity: interpolate(frame, [REVEAL[gen.idx] + 20, REVEAL[gen.idx] + 38], [0, 1], clamp),
                padding: "3px 8px",
                background: gen.neutral ? `${colors.border}30` : `${colors.danger}18`,
                border: `1.5px solid ${gen.neutral ? colors.border : `${colors.danger}55`}`,
                borderRadius: 8,
              }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: gen.neutral ? fontWeights.regular : fontWeights.black,
                  color: gen.neutral ? colors.textMuted : colors.danger,
                  whiteSpace: "nowrap",
                }}>
                  {gen.neutral ? "✓" : "💒"} {gen.relation}
                </span>
              </div>
            )}

            {/* Queen labels below badge */}
            <div style={{ ...labelBox(gen.idx, QUEEN_LABEL_TOP), opacity: op }}>
              <div style={nameStyle}>{gen.queen!.name}</div>
              <div style={subStyle}>{gen.queen!.years}</div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Final callout — appears after tree is complete */}
      <div style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 50,
        opacity: interpolate(frame, [220, 248], [0, 1], clamp),
        fontSize: fontSizes.body,
        fontWeight: fontWeights.bold,
        textAlign: "center",
      }}>
        Карл ІІ «Зачарований» - останній іспанський король із династії Габсбургів.
        Західна гілка могутньої родини закінчилася на ньому.
      </div>
    </AbsoluteFill>
  );
};
