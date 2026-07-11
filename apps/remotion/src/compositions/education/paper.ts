/**
 * Education paper palette — same pencil-on-paper skin as Carnivores, which is a
 * natural fit for a video about schooling (a school-notebook look). Mirrors the
 * dark theme's `colors` keys so any shared component re-skins by prop/provider.
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
  secondary: "#B07E2B", // ochre
  success: "#4E8A5A", // green pencil
  danger: "#BC5147", // red pencil

  border: "#CBC1AB",
} as const;

export const paperPalette = colors;

export { fontSizes, fontWeights, spacing, radii, fontFamilies };
