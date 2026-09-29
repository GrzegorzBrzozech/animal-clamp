/**
 * "Гранична корисність" — single source of truth for the MarginalUtility video.
 *
 * Source script: clamp-videos/videos/in progress/0157. перекласти витрати/
 *   assets/raw/marginal utility/plot.md
 *
 * VO recorded — `startSec` + `END_SEC` below are measured from the real
 * narration (transcribed via tools/transcribe, uk/large). Audio file:
 * public/projects/marginal-utility/speech.mp3 (71.18 s per ffprobe).
 * The diminishing-value and demand-curve scenes turned out to run
 * noticeably longer/shorter than the plot.md placeholders guessed, so their
 * internal cue timings were re-paced too (see DiminishingScene/DemandCurveScene) —
 * everything else only needed the boundary update.
 */

export const FPS = 30;

/** How many frames two adjacent scenes overlap during a transition. */
export const TRANSITION_FRAMES = 18;

export type SceneId = "hook" | "laborTheory" | "mengerValue" | "diminishing" | "demandCurve";

type SceneTiming = {
  id: SceneId;
  title: string;
  /** Timecode (seconds) at which this scene should appear. */
  startSec: number;
  /** The narration this scene illustrates (verbatim from plot.md). */
  narration: string;
};

const TIMINGS: SceneTiming[] = [
  {
    id: "hook",
    title: "Гачок — пісок проти золота",
    startSec: 0,
    narration:
      "Золото дорожче за пісок, очевидно ж, так? Але чим це пояснити? Чи сама лише рідкісність робить золото ціннішим за пісок?",
  },
  {
    id: "laborTheory",
    title: "Проблема старої теорії — вартість = праця",
    startSec: 6.6,
    narration:
      "Класична економічна теорія намагалася пояснити вартість через працю та витрати виробництва. Неважливо, що ти створюєш — важливо лише скільки зусиль витратив. Якщо золото знайти важче ніж пісок, і треба копати глибше — то воно буде дорожче.",
  },
  {
    id: "mengerValue",
    title: "Менгер — цінність в очах споживача",
    startSec: 21.06,
    narration:
      "Але Карл Менгер зробив два важливих спостереження. Перше — людина цінить кожен товар і послугу унікально, у свій власний спосіб, залежно від потреби, яку вони можуть задовольнити. Чим важливіша потреба — тим більше людина готова платити. Тож цінність речі — не в самому товарі і не у витраченій роботі, а в очах самого споживача.",
  },
  {
    id: "diminishing",
    title: "Мішки піску — кожен наступний дешевший",
    startSec: 40.12,
    narration:
      "Друге спостереження — людина цінує кожну наступну одиницю блага нижче за попередню. Що логічно: адже перша одиниця йде на задоволення найбільш важливої потреби, друга — на менш важливу, і так далі. І людина просто перестане платити, якщо ціна товару буде перевищувати цінність потреби, яку він задовольняє.",
  },
  {
    id: "demandCurve",
    title: "Вихід до попиту і пропозиції",
    startSec: 58.8,
    narration:
      "І саме тут лежить фундамент знайомої нам теорії попиту і пропозиції. Чим нижча ціна товару — тим більше незначнішу потребу людина готова нею задовольнити. І, відповідно, купує більше!",
  },
];

/** End of the video — real VO ends at 70.92 s; padded slightly so the last word isn't clipped. */
export const END_SEC = 71.5;

export type SceneSpec = SceneTiming & { durationInFrames: number };

/**
 * Derive each scene's frame length from the start times. With a transition of
 * V frames between scenes, a scene that is V frames longer than its gap lands
 * its successor exactly on the next timecode.
 */
export const SCENES: SceneSpec[] = TIMINGS.map((scene, i) => {
  const nextStart = TIMINGS[i + 1]?.startSec ?? END_SEC;
  const isLast = i === TIMINGS.length - 1;
  return {
    ...scene,
    durationInFrames:
      Math.round((nextStart - scene.startSec) * FPS) + (isLast ? 0 : TRANSITION_FRAMES),
  };
});
