import { FPS, AUDIO_DURATION_SEC } from "./plan";

export const oppenheimerConfig = {
  id: "Oppenheimer",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: Math.round(AUDIO_DURATION_SEC * FPS),
} as const;
