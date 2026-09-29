import { FPS, TOTAL_FRAMES } from "./plan";

export const cavemanSubscribeConfig = {
  id: "CavemanSubscribe",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: TOTAL_FRAMES,
} as const;
