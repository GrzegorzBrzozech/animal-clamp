/**
 * "Зло від освіти" — segment 00:24 «ukraine-education-details» — the VIDEO PLAN
 * and single source of truth.
 *
 * One entry per scene, ordered by `startSec` (the moment in the voiceover where
 * the scene begins). The composition (index.tsx) reads this list, lays the
 * scenes on the timeline under the audio, and renders the registered scene
 * component (or <ScenePlaceholder> from the plan text if none is wired yet).
 *
 * Timings are exact — transcribed from public/projects/education/speech.mp3 with
 * whisper-large-v3-turbo (word-level). End of each scene = start of the next;
 * the last ends at AUDIO_DURATION_SEC.
 */

import { z } from "zod";

export const FPS = 30;

/** Voiceover track, relative to public/. */
export const AUDIO = "projects/education/speech.mp3";

/** Full audio length (s). Real length 84.77 — rounded up so the tail isn't clipped. */
export const AUDIO_DURATION_SEC = 85;

export type SceneMode = "animation" | "talkinghead" | "hybrid";

export type PlanScene = {
  id: string;
  title: string;
  description: string;
  narration: string;
  mode: SceneMode;
  startSec: number;
};

export const PLAN: PlanScene[] = [
  {
    id: "law",
    title: "Закон: 12 років у школі",
    description:
      "Закон «Про повну загальну середню освіту» розгортається. Ряд із 12 років-клітинок заповнюється; 12-та підсвічена «з 2027», стара «11» закреслена.",
    narration:
      "Закон України про повну загальну середню освіту зобов'язує школярів вчитися 12 років у школі. З 2027 року, до цього було 11 років.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "structure",
    title: "Структура 4 + 5 + 3",
    description:
      "Сходинки школи: 4 роки початкової + 5 базової середньої + 3 профільної = 12. Три кольорові блоки складаються по черзі.",
    narration:
      "Це 4 роки початкової школи, 5 базової середньої та 3 профільної.",
    mode: "animation",
    startSec: 10.26,
  },
  {
    id: "ministry",
    title: "МОН затверджує програми",
    description:
      "Будівля МОН + великий офіційний штамп б'є по чек-листу: обов'язкові предмети / стандарти / мінімум годин. Кожен пункт отримує печатку ✓.",
    narration:
      "Навчальні програми розробляє Міністерство освіти і науки. Воно затверджує перелік обов'язкових предметів, стандарти і мінімальну кількість годин.",
    mode: "animation",
    startSec: 15.62,
  },
  {
    id: "privateFreedom",
    title: "Приватні школи: свобода вибору",
    description:
      "Державні vs приватні. У приватних — регулятори/тумблери, які можна крутити: підручники, власні предмети, розклад.",
    narration:
      "Окрім державних шкіл, дозволені і приватні. В них є деяка свобода вибору. Можна вибирати підручники, додавати власні предмети, змінювати розклад.",
    mode: "animation",
    startSec: 24.2,
  },
  {
    id: "altMethods",
    title: "Альтернативні підходи",
    description:
      "Картки педагогік вистрибують: вальдорфський, монтессорі, і щось «більш екстравагантне» (перевернуте/дивне).",
    narration:
      "Навіть застосувати альтернативні педагогічні підходи — вальдорфський, монтессорі чи щось більш екстравагантне.",
    mode: "animation",
    startSec: 33.4,
  },
  {
    id: "boundary",
    title: "Але є межа",
    description:
      "Коротка потужна відбивка: тверда лінія / стіна опускається й перекриває свободу. «Але є межа, яку змінити не можна».",
    narration: "Але є межа, яку змінити не можна.",
    mode: "animation",
    startSec: 40.4,
  },
  {
    id: "standard",
    title: "Держстандарт → компетентності",
    description:
      "Опечатана незмінна серцевина ДЕРЖСТАНДАРТ: конкретні результати навчання — компетентності. Замок / сургучева печатка.",
    narration:
      "Державний стандарт освіти визначає конкретні результати навчання, так звані компетентності.",
    mode: "animation",
    startSec: 43.12,
  },
  {
    id: "dpa",
    title: "ДПА однакова для всіх",
    description:
      "Дві школи (приватна / державна) різними шляхами приходять до ОДНОГО й того ж аркуша ДПА. Однаковий іспит для обох.",
    narration:
      "Учень зобов'язаний їх продемонструвати на державній підсумковій атестації — ДПА. І ДПА для приватних шкіл така сама, як для державних.",
    mode: "animation",
    startSec: 48.62,
  },
  {
    id: "evolution",
    title: "Приклад: еволюція в ДПА",
    description:
      "Можна вчити біологію по-своєму, але без теорії еволюції — провал ДПА. Марш еволюції (мавпа→людина); аркуш отримує червоний штамп «ЗАВАЛИВ».",
    narration:
      "На практиці це означає — можна вчити біологію по-своєму, але якщо в програмі немає теорії еволюції, учень завалить ДПА, бо еволюція там є.",
    mode: "animation",
    startSec: 57.76,
  },
  {
    id: "algebra",
    title: "Алгебру прибрати не можна",
    description:
      "Підручники з математики вільно міняються, але «алгебра» (x²) прикута/прибита — її не прибрати з програми.",
    narration:
      "Можна використовувати будь-який підручник з математики, але не можна прибрати алгебру.",
    mode: "animation",
    startSec: 67.78,
  },
  {
    id: "chemistry",
    title: "Не замість хімії",
    description:
      "Можна ДОДАТИ релігієзнавство (+ новий слот), але не викинути хімію: колба захищена, заміна заблокована.",
    narration:
      "Можна додати уроки релігієзнавства, але не замість хімії.",
    mode: "animation",
    startSec: 72.88,
  },
  {
    id: "conclusion",
    title: "Міністерство — ЩО, школа — ЯК",
    description:
      "Підсумок: міністерство визначає ЩО має знати учень (ціль), а приватна школа знаходить найкращі шляхи ЯК доставити знання в конкретну голову.",
    narration:
      "Тож міністерство визначає, що має знати учень, а приватна школа знаходить найкращі шляхи, як доставити ці знання в конкретну голову.",
    mode: "animation",
    startSec: 76.7,
  },
];

/** Total composition length in frames (= audio length). */
export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS);

/** Derived per-scene frame placement (end = next scene's start, last = audio end). */
export const TIMED_PLAN = PLAN.map((s, i) => {
  const endSec = i < PLAN.length - 1 ? PLAN[i + 1].startSec : AUDIO_DURATION_SEC;
  return {
    ...s,
    fromFrame: Math.round(s.startSec * FPS),
    durationInFrames: Math.round((endSec - s.startSec) * FPS),
    endSec,
  };
});

// ── Live editing in Studio ───────────────────────────────────────────────────
// Each scene's start is exposed as an editable number (FRAMES) in the Studio
// "Props" panel. Labels show the default clock time for orientation.
export const educationSchema = z.object({
  law: z.number().int().min(0).describe("Закон: 12 років (0:00) — старт, кадр"),
  structure: z.number().int().min(0).describe("Структура 4+5+3 (0:10) — старт, кадр"),
  ministry: z.number().int().min(0).describe("МОН затверджує (0:15) — старт, кадр"),
  privateFreedom: z.number().int().min(0).describe("Приватні: свобода (0:24) — старт, кадр"),
  altMethods: z.number().int().min(0).describe("Альтернативні підходи (0:33) — старт, кадр"),
  boundary: z.number().int().min(0).describe("Але є межа (0:40) — старт, кадр"),
  standard: z.number().int().min(0).describe("Держстандарт (0:43) — старт, кадр"),
  dpa: z.number().int().min(0).describe("ДПА однакова (0:48) — старт, кадр"),
  evolution: z.number().int().min(0).describe("Еволюція в ДПА (0:57) — старт, кадр"),
  algebra: z.number().int().min(0).describe("Алгебру не прибрати (1:07) — старт, кадр"),
  chemistry: z.number().int().min(0).describe("Не замість хімії (1:12) — старт, кадр"),
  conclusion: z.number().int().min(0).describe("ЩО vs ЯК (1:16) — старт, кадр"),
});

export type EducationProps = z.infer<typeof educationSchema>;

/** Recompute the timeline from a set of (possibly Studio-edited) start FRAMES. */
export function timedFromFrames(starts: Record<string, number>) {
  const ordered = PLAN.map((s) => ({ ...s, fromFrame: starts[s.id] ?? Math.round(s.startSec * FPS) })).sort(
    (a, b) => a.fromFrame - b.fromFrame,
  );
  return ordered.map((s, i) => {
    const endFrame = i < ordered.length - 1 ? ordered[i + 1].fromFrame : TOTAL_FRAMES;
    return {
      ...s,
      durationInFrames: Math.max(1, endFrame - s.fromFrame),
      startSec: s.fromFrame / FPS,
      endSec: endFrame / FPS,
    };
  });
}

/** Default start frames (from the exact transcript) for Root.tsx defaultProps. */
export const DEFAULT_STARTS: EducationProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof EducationProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as EducationProps);
