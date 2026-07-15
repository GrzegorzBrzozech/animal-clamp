/**
 * "Держава-хижак" — segment 06:00 «habsburg-inbreeding»
 * Habsburg royal inbreeding: 7 generations ending with Carlos II of Spain.
 *
 * Timings transcribed from projects/habsburg-inbreeding/speech.mp3
 * with whisper-large (mlx, word-level).
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/habsburg-inbreeding/speech.mp3";

/** Full audio length (s). Real length 31.64 — rounded up. */
export const AUDIO_DURATION_SEC = 32;

export type SceneMode = "animation" | "hybrid";

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
    id: "portrait",
    title: "Портрет Карла ІІ",
    description:
      "Фото-пін з парадним портретом Карла ІІ Іспанського (Карреньо де Міранда, ~1685). Вступна нарація про Габсбургів та ступінь інбридингу.",
    narration:
      "Ініціативу продемонструвати, до чого призводить шлюб між родичами, взяла на себе династія Габсбурги. Карл ІІ Іспанський за ступенем кровної спорідненості перевищував навіть дітей від рідних брата і сестри.",
    mode: "hybrid",
    startSec: 0,
    images: ["projects/habsburg-inbreeding/05-56_carlos_II_habsburgo_portrait.jpg"],
  },
  {
    id: "tree",
    title: "Сім поколінь інбридингу",
    description:
      "Анімоване генеалогічне дерево Габсбургів: від засновників до Карла ІІ. Дерево будується знизу вгору — кожне покоління з'являється по черзі з підписами про ступінь спорідненості. Персонажі: KingPencil (золота корона, червона мантія) та PrincessPencil (золота діадема, біла сукня).",
    narration:
      "Його батько одружився з власною племінницею. Батьків батько — теж з родичкою. І так сім поколінь поспіль Габсбурги шлюбувались всередині родини. Він не міг розмовляти до 4 років, ходити до 8, і помер без нащадків у 39. Правляча династія буквально зжерла сама себе зсередини.",
    mode: "animation",
    startSec: 12.94,
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

export const habsburgInbreedingSchema = z.object({
  portrait: z.number().int().min(0).describe("Портрет Карла ІІ (0:00) — старт, кадр"),
  tree: z.number().int().min(0).describe("Генеалогічне дерево (0:12) — старт, кадр"),
});

export type HabsburgInbreedingProps = z.infer<typeof habsburgInbreedingSchema>;

export function timedFromFrames(starts: Record<string, number>) {
  const ordered = PLAN.map((s) => ({
    ...s,
    fromFrame: starts[s.id] ?? Math.round(s.startSec * FPS),
  })).sort((a, b) => a.fromFrame - b.fromFrame);
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

export const DEFAULT_STARTS: HabsburgInbreedingProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof HabsburgInbreedingProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as HabsburgInbreedingProps);
