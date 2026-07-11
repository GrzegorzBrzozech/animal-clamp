/**
 * "EU manufacturers" — insert at parent 15:20, ~36s VO.
 * Single source of truth: one entry per beat, ordered by `startSec`.
 *
 * Timings derived from sentence-boundary pauses in the voiceover (ffmpeg
 * silencedetect). Beat order follows the *spoken* order (Fairphone first, the
 * market-share bar chart as the closing punch) — not the rough montage.yaml.
 *
 * Narration (speech.txt):
 *   «[роздратовано] А отут помилка, наклеп на святую Європейщину!
 *    В ЄС є справжній виробник — нідерландський Fairphone. Нішевий, дорогий,
 *    10 з 10 за iFixit. Чи набув популярності? Так — якщо порівнювати з
 *    українськими виробниками. І ні — якщо з усіма іншими: частка < 1%.
 *    П'ятірка лідерів ЄС: Samsung 35, Apple 27, Xiaomi 16, Motorola 6, Honor 3.»
 */

export const FPS = 30;

/** Voiceover, relative to public/. */
export const AUDIO = "projects/eu-manufacturers/vo.mp3";

/** Full audio length (s) — slightly ≥ the last word so it isn't clipped. */
export const AUDIO_DURATION_SEC = 35.8;

export type PlanScene = {
  id: string;
  title: string;
  narration: string;
  startSec: number;
};

export const PLAN: PlanScene[] = [
  {
    id: "correction",
    title: "Помилка / наклеп",
    narration: "А отут помилка, наклеп на святую Європейщину!",
    startSec: 0,
  },
  {
    id: "fairphoneReveal",
    title: "Fairphone — справжній EU-виробник",
    narration: "В Євросоюзі є справжній виробник — нідерландський Fairphone.",
    startSec: 4.2,
  },
  {
    id: "fairphoneTraits",
    title: "Нішевий, дорогий, iFixit 10/10",
    narration: "Нішевий, дорогий, з оцінкою ремонтопридатності 10 з 10 за iFixit.",
    startSec: 8.3,
  },
  {
    id: "question",
    title: "Чи набув популярності?",
    narration: "Чи набув бренд відповідної популярності?",
    startSec: 13.6,
  },
  {
    id: "yesUkraine",
    title: "Так — проти українських виробників",
    narration: "Так! Якщо порівнювати їх з українськими виробниками телефонів.",
    startSec: 16.1,
  },
  {
    id: "noShare",
    title: "І ні — частка < 1%",
    narration: "І ні, якщо порівнювати з усіма іншими. Адже частка ринку — менше відсотка.",
    startSec: 20.0,
  },
  {
    id: "marketBars",
    title: "П'ятірка лідерів ринку ЄС",
    narration: "П'ятірка лідерів ринку Союзу: Samsung 35%, Apple 27%, Xiaomi 16%, Motorola 6%, Honor 3%.",
    startSec: 25.1,
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
