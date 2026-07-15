/**
 * Rothbard paper palette — same pencil-on-paper skin as Education/Homeschool.
 * The historical images sit on this warm-paper notebook via <PhotoPin>, so the
 * archival photos still read as part of the drawn style. See education/paper.ts.
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
