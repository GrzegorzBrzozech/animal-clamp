export const FPS = 30;
export const AUDIO = "projects/homo-erectus/створення чорного моря.mp3";
export const AUDIO_DURATION_SEC = 16;
export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS);

// Phase boundaries (frames)
export const FRAME_DIG_END   = Math.round(3.76 * FPS);  // 113 — rain starts
export const FRAME_RAIN_END  = Math.round(8.22 * FPS);  // 247 — sea formed
export const FRAME_AUDIO_END = Math.round(12.0 * FPS);  // 360 — outro (seagull + flag)
