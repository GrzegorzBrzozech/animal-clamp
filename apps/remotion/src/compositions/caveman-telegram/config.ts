import { FPS, TOTAL_FRAMES } from "./plan";

export const cavemanTelegramConfig = {
  id: "CavemanTelegram",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: TOTAL_FRAMES,
} as const;
