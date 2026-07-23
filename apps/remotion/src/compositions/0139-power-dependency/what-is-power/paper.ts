import { fontSizes, fontWeights, spacing, radii, fontFamilies } from "~/theme";
import { INK, PAPER, PAPER_DARK } from "~/characters/svg/_pencil";

export const colors = {
  bg: PAPER,
  bgAlt: PAPER_DARK,
  surface: "#E6DEC9",

  text: INK,
  textMuted: "#6E685A",

  primary: "#3E6E9E",
  secondary: "#B07E2B",
  success: "#4E8A5A",
  danger: "#BC5147",

  border: "#CBC1AB",
} as const;

export const paperPalette = colors;

export { fontSizes, fontWeights, spacing, radii, fontFamilies };
