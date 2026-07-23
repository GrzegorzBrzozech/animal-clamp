import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPhilosopher } from "@remotion/google-fonts/Philosopher";

/**
 * Loads the project font once with Cyrillic + Latin support.
 * Import `montserrat.fontFamily` anywhere you need the resolved family name.
 */
export const montserrat = loadFont("normal", {
  weights: ["400", "500", "600", "700", "900"],
  subsets: ["cyrillic", "latin"],
});

/**
 * Philosopher italic — classical serif with Cyrillic support.
 * Use for dramatic/royal speech elements.
 */
export const philosopher = loadPhilosopher("italic", {
  weights: ["400", "700"],
  subsets: ["cyrillic"],
});

// ── Local gothic fonts (copied to public/fonts/) ──────────────────────────────

function loadLocalFont(family: string, file: string): { fontFamily: string } {
  const handle = delayRender(`Loading font ${family}`);
  const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { style: "normal", weight: "400" });
  face.load().then(() => {
    document.fonts.add(face);
    continueRender(handle);
  }).catch(() => continueRender(handle));
  return { fontFamily: `"${family}", serif` };
}

/** Blackcraft — dark gothic, supports Ukrainian Cyrillic */
export const blackcraft = loadLocalFont("Blackcraft", "Blackcraft.ttf");

/** Ruthless Sketch — bold hand-drawn with Cyrillic */
export const ruthlessSketch = loadLocalFont("RuthlessSketch", "RuthlessSketch.ttf");

/** Westhorn — gothic serif, supports Ukrainian */
export const westhorn = loadLocalFont("Westhorn", "Westhorn.ttf");

/** Datcub — display gothic, supports Ukrainian */
export const datcub = loadLocalFont("Datcub", "Datcub.ttf");

/** Kaph — medieval/gothic, supports Ukrainian */
export const kaph = loadLocalFont("Kaph", "Kaph.ttf");

/** Divagon — decorative gothic, supports Ukrainian */
export const divagon = loadLocalFont("Divagon", "Divagon.ttf");
