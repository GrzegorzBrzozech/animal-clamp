import { FPS, END_SEC } from "./script";

export const marginalUtilityConfig = {
  id: "MarginalUtility",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: Math.round(END_SEC * FPS),
} as const;
