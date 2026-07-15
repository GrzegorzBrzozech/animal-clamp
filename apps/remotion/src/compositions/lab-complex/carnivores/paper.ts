/**
 * Carnivores paper palette — the whole video is re-skinned to the pencil-on-paper
 * look. Mirrors the dark theme's `colors` keys so a scene flips just by swapping
 * its `~/theme` import for this file. Accents are darkened so they read on paper.
 * Wired video-wide via <PaletteProvider value={paperPalette}> in index.tsx.
 */
import { fontSizes, fontWeights, spacing, radii, fontFamilies } from "~/theme";
import { INK, PAPER, PAPER_DARK } from "~/characters/svg/_pencil";

export const colors = {
  bg: PAPER,
  bgAlt: PAPER_DARK,
  surface: "#E6DEC9",

  text: INK,
  textMuted: "#6E685A",

  primary: "#3E6E9E", // blue pencil
  secondary: "#B07E2B", // ochre (darker yellow, legible on paper)
  success: "#4E8A5A", // green pencil
  danger: "#BC5147", // red pencil

  border: "#CBC1AB",
} as const;

/** Palette object for <PaletteProvider value={paperPalette}>. */
export const paperPalette = colors;

export { fontSizes, fontWeights, spacing, radii, fontFamilies };
