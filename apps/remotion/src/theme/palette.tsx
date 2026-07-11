import { createContext, useContext } from "react";
import { colors as darkColors } from "./index";

/**
 * Runtime colour palette. Shared components read their DEFAULT colours from here
 * (via `usePalette()`), so a whole composition can be re-skinned by wrapping it
 * in `<PaletteProvider value={...}>`. The default is the dark theme, so any video
 * that doesn't provide a palette keeps its original look — this is fully
 * backward-compatible. Carnivores provides a paper palette (see carnivores/paper.ts).
 */
export type Palette = { [K in keyof typeof darkColors]: string };

const PaletteContext = createContext<Palette>(darkColors);

export const PaletteProvider = PaletteContext.Provider;

/** Read the active palette (dark theme if no provider above). */
export const usePalette = (): Palette => useContext(PaletteContext);
