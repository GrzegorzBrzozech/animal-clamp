import { FPS, AUDIO_DURATION_SEC } from "./plan";

export const richAmericanPosterConfig = {
  id: "RichAmericanPoster",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationInFrames: Math.round(AUDIO_DURATION_SEC * FPS),
} as const;
