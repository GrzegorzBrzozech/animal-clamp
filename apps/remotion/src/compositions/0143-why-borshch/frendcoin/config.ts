import { FPS, SCENES, TRANSITION_FRAMES } from "./script";

/**
 * Composition metadata for Root.tsx. Total duration accounts for the overlap
 * introduced by each transition between scenes.
 */
export const frendcoinConfig = {
  id: "Frendcoin",
  fps: FPS,
  width: 1920,
  height: 1080,
  get durationInFrames() {
    const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
    const overlap = (SCENES.length - 1) * TRANSITION_FRAMES;
    return total - overlap;
  },
} as const;
