/**
 * Single source of truth for the Frendcoin video.
 *
 * Timing is driven by the voiceover (public/projects/frendcoin/narration.mp3, ~98.6s).
 * Each scene has a START time in seconds, taken from the narration's natural
 * pauses (measured with ffmpeg silencedetect). Scene durations are derived so
 * that — after accounting for the TransitionSeries overlap — every scene begins
 * exactly at its narration timestamp. Tweak `startSec` to re-sync.
 */

export const FPS = 30;

/** How many frames two adjacent scenes overlap during a transition. */
export const TRANSITION_FRAMES = 18;

/** Audio file under public/, played across the whole composition. */
export const NARRATION_FILE = "projects/frendcoin/narration.mp3";

export type SceneId =
  | "intro"
  | "balance"
  | "quidProQuo"
  | "warren"
  | "timebanks"
  | "limit";

type SceneTiming = {
  id: SceneId;
  /** Narration timestamp (seconds) at which this scene should appear. */
  startSec: number;
  narration: string;
};

// Ordered scenes + the moment the video ends (slightly past the audio so the
// last line isn't clipped).
const TIMINGS: SceneTiming[] = [
  {
    id: "intro",
    startSec: 0,
    narration:
      "Frendcoin — це система негрошових розрахунків між людьми. Ви позичили кумові машину, а він вам полагодив дах.",
  },
  {
    id: "balance",
    startSec: 16.3,
    narration:
      "Кожен тримає в голові балансовий рахунок: скільки зробив для інших і скільки отримав натомість. Поки тримається баланс — дружба. Коли ж одна сторона багато робить і нічого не отримує — відносини руйнуються.",
  },
  {
    id: "quidProQuo",
    startSec: 43.0,
    narration:
      "Ця побутова звичка — найдавніший соціальний закон. Ще римляни формулювали його як «quid pro quo» — послуга за послугу. Спроба перевести взаємозалік на більший масштаб виникала неодноразово.",
  },
  {
    id: "warren",
    startSec: 63.17,
    narration:
      "Вдалу спробу зробив анархіст Джозая Уоррен у 19 столітті. Він почав із «Магазину часу», де товари купували за чеки, рівні годинам праці, а потім заснував колонії «Утопія» та «Сучасні часи».",
  },
  {
    id: "timebanks",
    startSec: 79.66,
    narration:
      "Сьогодні ця ідея живе у цифровому вигляді — платформа Timebanks, «година за годину». Але всі такі системи впираються в межу росту.",
  },
  {
    id: "limit",
    startSec: 90.28,
    narration:
      "На відміну від грошей, Frendcoin не має універсального курсу — її забезпечує лише особиста довіра, тож масштабувати на мільйони незнайомців неможливо.",
  },
];

export const END_SEC = 99.2;

export type SceneSpec = SceneTiming & { durationInFrames: number };

/**
 * Derive each scene's frame length from start times.
 * With a transition of V frames between scenes, a scene that is V frames longer
 * than its narration gap lands its successor exactly on the next timestamp.
 */
export const SCENES: SceneSpec[] = TIMINGS.map((scene, i) => {
  const nextStart = TIMINGS[i + 1]?.startSec ?? END_SEC;
  const gapSec = nextStart - scene.startSec;
  const isLast = i === TIMINGS.length - 1;
  const durationInFrames =
    Math.round(gapSec * FPS) + (isLast ? 0 : TRANSITION_FRAMES);
  return { ...scene, durationInFrames };
});
