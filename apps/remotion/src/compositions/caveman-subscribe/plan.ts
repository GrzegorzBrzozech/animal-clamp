export const FPS = 30;
export const AUDIO = "projects/caveman-subscribe/speech.mp3";
export const CLICK_SFX = "sfx/click.mp3";

// subscribe.01.wav transcript (tools/transcribe, uk, whisper-large):
//   0.00–6.34s   "Моя думати мало, клуня болить, клешня думати багато."
//   6.72–9.88s   "Слідкуй канал і клуня не болить."
//   10.24–12.02s "Лайк відео, тиць!"
export const AUDIO_DURATION_SEC = 12.2;
// 16.5s — extra tail after the poke so the like-rain can fall and hold ~3s.
export const TOTAL_FRAMES = 495;

export const FRAME_SCRATCH_START = 58; // "клуня болить" (1st mention)
export const FRAME_CALM_START = 108; // "клешня ... багато"
export const FRAME_WAVE_START = 202; // "Слідкуй канал і клуня не болить"
export const FRAME_TALK2_START = 307; // "Лайк відео"
export const FRAME_HUNT_START = 343; // "тиць" — spear thrust (model action "hunt", dur 1.1s, one-shot)
export const FRAME_CLICK = FRAME_HUNT_START + 6; // spear-impact moment, ~0.2s into the thrust
export const FRAME_LIKES_START = FRAME_CLICK + 5; // "купа лайків" rains down right after the hit
