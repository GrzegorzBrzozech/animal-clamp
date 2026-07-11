/**
 * Design tokens shared across every composition.
 * Change values here to re-skin all videos at once.
 */

export const colors = {
  // Backgrounds
  bg: "#0E1116",
  bgAlt: "#161B22",
  surface: "#1F2630",

  // Text
  text: "#F2F5F8",
  textMuted: "#9BA7B4",

  // Brand / accents
  primary: "#4F9DFF",
  secondary: "#FFC857",
  success: "#3DD68C",
  danger: "#FF6B6B",

  // Lines / borders
  border: "#2B333D",
} as const;

/**
 * Light palette — for explainer inserts that must blend with the flat,
 * white-background animated charts (e.g. the EU phones inserts). Mirrors the
 * `colors` keys so a component can swap palettes by prop. EU blue is the accent.
 */
export const light = {
  bg: "#FFFFFF",
  bgAlt: "#F4F6FA",
  surface: "#EEF1F6",

  text: "#16202C",
  textMuted: "#6B7785",

  primary: "#003399",
  secondary: "#F2A900",
  success: "#1DB954",
  danger: "#E0102B",

  border: "#D7DEE7",
} as const;

export const fontFamilies = {
  // Filled in at runtime by lib/fonts.ts (Google Fonts loader).
  display: "Montserrat",
  body: "Montserrat",
} as const;

export const fontSizes = {
  hero: 120,
  title: 84,
  heading: 60,
  body: 42,
  caption: 30,
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 32,
  lg: 64,
  xl: 120,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 28,
  pill: 999,
} as const;

export type ThemeColor = keyof typeof colors;
