/**
 * "EU regulations timeline" — insert at parent 00:35, ~35s VO.
 * Single source of truth: one entry per beat, ordered by `startSec`.
 *
 * Timings derived from sentence-boundary pauses in the voiceover (ffmpeg
 * silencedetect). The composition lays each beat on the timeline under the
 * audio and lights up the persistent flow-strip step that matches.
 *
 * Narration (speech.txt):
 *   «Точніше — ЄС запустив не одне правило, а цілий пакет…
 *    Грудень 2024: USB Type-C. Червень 2025: Ecodesign — 5 років оновлень,
 *    7 років запчастин. Це вже відбулось. Липень 2026: право на ремонт.
 *    Лютий 2027: замінна батарея стандартними інструментами.»
 */

export const FPS = 30;

/** Voiceover, relative to public/. */
export const AUDIO = "projects/eu-regulations/vo.mp3";

/** Full audio length (s) — slightly ≥ the last word so it isn't clipped. */
export const AUDIO_DURATION_SEC = 34.6;

export type PlanScene = {
  id: string;
  title: string;
  narration: string;
  startSec: number;
};

export const PLAN: PlanScene[] = [
  {
    id: "intro",
    title: "Не одне правило — цілий пакет",
    narration: "Точніше сказати, що Євросоюз запустив не одне правило, а цілий пакет…",
    startSec: 0,
  },
  {
    id: "typeC",
    title: "USB Type-C · грудень 2024",
    narration: "Грудень 2024-го: стандарт роз'єму підключення і зарядки — USB Type-C.",
    startSec: 7.5,
  },
  {
    id: "ecodesign",
    title: "Ecodesign · червень 2025",
    narration:
      "Червень 2025-го: вимоги Ecodesign до ремонтопридатності. Виробники зобов'язані забезпечити 5 років оновлень і 7 років доступних запчастин.",
    startSec: 13.7,
  },
  {
    id: "alreadyDone",
    title: "Це вже відбулось",
    narration: "Це вже відбулось.",
    startSec: 24.5,
  },
  {
    id: "rightToRepair",
    title: "Право на ремонт · липень 2026",
    narration: "Липень 2026-го: Директива про право на ремонт.",
    startSec: 26.5,
  },
  {
    id: "battery",
    title: "Замінна батарея · лютий 2027",
    narration: "Лютий 2027-го: вимога щодо замінюваної батареї стандартними інструментами.",
    startSec: 30.8,
  },
];

/** Derived per-beat frame placement (end = next beat's start, last = audio end). */
export const TIMED_PLAN = PLAN.map((s, i) => {
  const endSec = i < PLAN.length - 1 ? PLAN[i + 1].startSec : AUDIO_DURATION_SEC;
  return {
    ...s,
    fromFrame: Math.round(s.startSec * FPS),
    durationInFrames: Math.round((endSec - s.startSec) * FPS),
    endSec,
  };
});

export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS);
