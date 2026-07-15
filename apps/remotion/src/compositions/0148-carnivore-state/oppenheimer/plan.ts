/**
 * "Держава-хижак" — segment 01:10 «oppenheimer-two-means»
 * Franz Oppenheimer's two means: economic (voluntary) vs political (coercion).
 *
 * Timings transcribed from public/projects/oppenheimer/speech.mp3 with
 * whisper-large (word-level). Each scene ends where the next begins.
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/oppenheimer/speech.mp3";

/** Full audio length (s). Real length 36.68 — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 37;

export type SceneMode = "animation" | "talkinghead" | "hybrid";

export type PlanScene = {
  id: string;
  title: string;
  description: string;
  narration: string;
  mode: SceneMode;
  startSec: number;
  images?: string[];
};

export const PLAN: PlanScene[] = [
  {
    id: "hook",
    title: "Раптом захотілося",
    description: "Введення: раптово виникає бажання. Знаєш чого саме.",
    narration: "Раптом чогось схотілося і навіть знаєш чого саме.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "threePaths",
    title: "Три варіанти",
    description: "Три шляхи: зробити самому, виміняти в іншого або забрати силою. Три картки з'являються послідовно.",
    narration: "Тоді є варіанти: зробити самому, виміняти в іншого або забрати силою.",
    mode: "animation",
    startSec: 3.1,
  },
  {
    id: "oppIntro",
    title: "Оппенгаймер: дві категорії",
    description:
      "Портрет Франца Оппенгаймера пришпилений до паперу. Текст: 'побачив в цих шляхах дві категорії — де є добровільна взаємодія або де присутній примус'.",
    narration:
      "Франц Оппенгаймер, німецький соціолог початку 20-го століття, побачив в цих шляхах дві категорії: де є тільки добровільна взаємодія або де присутній примус.",
    mode: "hybrid",
    startSec: 7.92,
    images: ["projects/oppenheimer/00-00_franz-oppenheimer-portrait.jpg"],
  },
  {
    id: "twoMeans",
    title: "Економічне vs Політичне",
    description: "Першу категорію він назвав 'економічною', другу — 'політичною'. Два великих блоки з'являються на екрані.",
    narration: "Першу категорію він назвав 'економічною', другу — 'політичною'.",
    mode: "animation",
    startSec: 17.76,
  },
  {
    id: "voluntary",
    title: "Добровільний обмін: чіпси",
    description:
      "Відмовитись від покупки чіпсів — можна. Всі конфлікти тільки всередині себе. Покупець і магазин — обидва добровільно.",
    narration: "Відмовитись від покупки чіпсів в магазині можна. Всі конфлікти тільки всередині себе.",
    mode: "animation",
    startSec: 21.34,
  },
  {
    id: "mandatory",
    title: "Примусові блага",
    description:
      "А от відмовитись від спільного блага — автотрас, безоплатної освіти та виборів — неможливо. Список з'являється з червоним X по кожному.",
    narration: "А от відмовитись від спільного блага, автотрас, безоплатної освіти та виборів — неможливо.",
    mode: "animation",
    startSec: 26.56,
  },
  {
    id: "stateQuote",
    title: "Держава — організація примусу",
    description:
      "Конфлікти з вашими слугами. Портрет Оппенгаймера + цитата: «Держава є організацією політичних засобів» — Franz Oppenheimer, 1908.",
    narration: "Бо негайно виникнуть конфлікти з вашими слугами і найнятими менеджерами.",
    mode: "hybrid",
    startSec: 32.58,
    images: ["projects/oppenheimer/00-00_franz-oppenheimer-portrait.jpg"],
  },
];

export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS);

export const TIMED_PLAN = PLAN.map((s, i) => {
  const endSec = i < PLAN.length - 1 ? PLAN[i + 1].startSec : AUDIO_DURATION_SEC;
  return {
    ...s,
    fromFrame: Math.round(s.startSec * FPS),
    durationInFrames: Math.round((endSec - s.startSec) * FPS),
    endSec,
  };
});

export const oppenheimerSchema = z.object({
  hook: z.number().int().min(0).describe("Раптом захотілося (0:00) — старт, кадр"),
  threePaths: z.number().int().min(0).describe("Три варіанти (0:03) — старт, кадр"),
  oppIntro: z.number().int().min(0).describe("Оппенгаймер: дві категорії (0:07) — старт, кадр"),
  twoMeans: z.number().int().min(0).describe("Економічне vs Політичне (0:17) — старт, кадр"),
  voluntary: z.number().int().min(0).describe("Добровільний обмін (0:21) — старт, кадр"),
  mandatory: z.number().int().min(0).describe("Примусові блага (0:26) — старт, кадр"),
  stateQuote: z.number().int().min(0).describe("Держава-організація (0:32) — старт, кадр"),
});

export type OppenheimerProps = z.infer<typeof oppenheimerSchema>;

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

export const DEFAULT_STARTS: OppenheimerProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof OppenheimerProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as OppenheimerProps);
