export const FPS = 30;
export const AUDIO = "projects/caveman-telegram/speech.mp3";

// telegram.01.wav transcript (tools/transcribe, uk, whisper-large, word timestamps):
//   0.00–1.12s  "Відео мало?"
//   1.42–2.56s  "Моя каже,"
//   2.58–3.84s  "копай телеграм."
//   4.00–5.14s  "Там"
//   5.14–5.76s  "корінці"
//   5.76–6.82s  "смакота."
//   6.82–9.48s  (no more words — satisfied grunts/sighs)
export const AUDIO_DURATION_SEC = 9.48;
// A little tail after the sighs so the last beat doesn't cut off abruptly.
export const TOTAL_FRAMES = 300;

export const FRAME_SCRATCH_START = 0; // "Відео мало?" — puzzled, scratches the back of his head
export const FRAME_TALK1_START = 43; // 1.42s — "Моя каже," — talks
export const FRAME_DIG_START = 77; // "копай телеграм. Там" — digs with the stick
export const FRAME_EAT_START = 154; // "корінці смакота" — eats the root he just dug up
export const FRAME_TALK2_START = 229; // 7.29s — eating held a bit longer into the trailing sighs, then talks again
export const FRAME_WAVE_START = 243; // 8.10s — waves
