import React from "react";
import { AbsoluteFill } from "remotion";
import { LottieCharacter, LOTTIE_CHARACTERS, SVG_PREVIEWS } from "~/characters";
import { colors, fontSizes } from "~/theme";

const COLS = 6;
const W = 1920;
const H = 1080;
const HEADER = 96;

type Cell = {
  name: string;
  kind: "lottie" | "svg";
  render: (cx: number, cy: number, size: number) => React.ReactNode;
};

const CELLS: Cell[] = [
  ...LOTTIE_CHARACTERS.map(
    (name): Cell => ({
      name,
      kind: "lottie",
      render: (cx, cy, size) => <LottieCharacter name={name} x={cx} y={cy} size={size} />,
    })
  ),
  ...SVG_PREVIEWS.map((p): Cell => ({ name: p.name, kind: "svg", render: p.render })),
];

/**
 * Browse EVERY registered character in isolation — Lottie (from LOTTIE_CHARACTERS)
 * and code-drawn SVG (from SVG_PREVIEWS), each looping in its own labeled cell.
 * Both sources update automatically as characters are added. Open in Studio and
 * scrub to inspect timing.
 */
export const CharacterGallery: React.FC = () => {
  const rows = Math.ceil(CELLS.length / COLS);
  const cellW = W / COLS;
  const cellH = (H - HEADER) / rows;
  const lottieCount = LOTTIE_CHARACTERS.length;

  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: "sans-serif" }}>
      <div style={{ position: "absolute", top: 26, left: 0, width: "100%", textAlign: "center", fontSize: fontSizes.heading, fontWeight: 800, color: colors.text }}>
        Бібліотека персонажів · {lottieCount} Lottie + {SVG_PREVIEWS.length} SVG
      </div>

      {CELLS.map((cell, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cellX = col * cellW;
        const cellY = HEADER + row * cellH;
        const size = Math.min(cellW, cellH) * 0.5;
        const tint = cell.kind === "lottie" ? colors.primary : colors.success;
        return (
          <React.Fragment key={cell.kind + cell.name}>
            <div style={{ position: "absolute", left: cellX + 8, top: cellY + 8, width: cellW - 16, height: cellH - 16, border: `1px solid ${colors.border}`, borderRadius: 14, background: colors.bgAlt }} />
            {cell.render(cellX + cellW / 2, cellY + cellH / 2 - 12, size)}
            <div style={{ position: "absolute", left: cellX, top: cellY + cellH - 34, width: cellW, textAlign: "center", fontSize: fontSizes.caption - 8, fontWeight: 700, color: tint }}>
              {cell.name}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
