import { FPS, AUDIO_DURATION_SEC } from "./plan";

export const euManufacturersConfig = {
  id: "EuManufacturers",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: Math.round(AUDIO_DURATION_SEC * FPS),
} as const;
