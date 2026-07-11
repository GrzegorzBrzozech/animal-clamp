import { FPS, AUDIO_DURATION_SEC } from "./plan";

export const homeschoolConfig = {
  id: "Homeschool",
  fps: FPS,
  width: 1920,
  height: 1080,
  // Length follows the voiceover (see plan.ts).
  durationInFrames: Math.round(AUDIO_DURATION_SEC * FPS),
} as const;
