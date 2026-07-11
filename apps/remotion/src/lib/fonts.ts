import { loadFont } from "@remotion/google-fonts/Montserrat";

/**
 * Loads the project font once with Cyrillic + Latin support.
 * Import `montserrat.fontFamily` anywhere you need the resolved family name.
 */
export const montserrat = loadFont("normal", {
  weights: ["400", "500", "600", "700", "900"],
  subsets: ["cyrillic", "latin"],
});
