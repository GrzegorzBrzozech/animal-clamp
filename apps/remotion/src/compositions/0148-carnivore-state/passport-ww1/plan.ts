/**
 * "Держава-хижак" — segment 01:51 «passport-ww1-temporary»
 * How the League of Nations' "temporary" WW1 passport controls became permanent.
 *
 * Timings from mlx-whisper transcription of speech.mp3:
 *   0.00 prewar    — "До 1914 р. більшість кордонів…" → "Уряди ввели паспортний контроль"
 *  12.30 league1920 — "На конференції Ліги Націй 1920 року… тимчасовим заходом"
 *  21.92 crises     — "Але довоєнних умов більше не існувало. Велика депресія…"
 *  31.04 temporary  — "Тимчасовий захід залишився назавжди. Сьогодні ми вважаємо…"
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO_DURATION_SEC = 40.4;
export const AUDIO = "projects/passport-ww1/speech.mp3";

export type SceneMode = "animation" | "talkinghead" | "hybrid";

export type PlanScene = {
  id: string;
  title: string;
  description: string;
  narration: string;
  mode: SceneMode;
  startSec: number;
  images?: string[];
  date?: string;
};

export const PLAN: PlanScene[] = [
  {
    id: "prewar",
    title: "До і після 1914",
    description:
      "До 1914 р. кордони Европи без документів. ПСВ змінила це за тижні: паспортний контроль для шпигунів і дезертирів.",
    narration:
      "До 1914 року більшість кордонів Европи перетинали без жодних документів. Перша світова змінила це за лічені тижні: уряди ввели паспортний контроль для виявлення шпигунів і дезертирів.",
    mode: "hybrid",
    startSec: 0,
    images: [
      "projects/passport-ww1/wwi-montage.jpg",
      "projects/passport-ww1/german-passport-types.webp",
    ],
  },
  {
    id: "league1920",
    title: "Конференція Ліги Націй 1920",
    description:
      "На конференції 1920 р. паспорти названо тимчасовим заходом — до відновлення довоєнних умов.",
    narration:
      "На конференції Ліги Націй 1920 року паспорти для перетину кордонів були офіційно названі тимчасовим заходом — до відновлення довоєнних умов.",
    mode: "hybrid",
    startSec: 12,
    images: ["projects/passport-ww1/00-24_league-of-nations-commission-1919.jpg"],
    date: "Ліга Націй, 1919",
  },
  {
    id: "crises",
    title: "Кожна криза — нова причина",
    description:
      "Але довоєнних умов більше не існувало. Велика депресія, Друга світова, Холодна війна — кожна криза давала нову причину не скасовувати тимчасове.",
    narration:
      "Але довоєнних умов більше не існувало. Велика депресія, Друга світова, Холодна війна — кожна криза давала нову причину не скасовувати «тимчасове».",
    mode: "hybrid",
    startSec: 22,
    images: ["projects/passport-ww1/wwii-collage.jpg"],
  },
  {
    id: "temporary",
    title: "Тимчасовий захід назавжди",
    description:
      "Тимчасовий захід залишився назавжди. Сьогодні паспорт — природній атрибут особи.",
    narration:
      "Тимчасовий захід залишився назавжди. Сьогодні ми вважаємо паспорт природним атрибутом особи — хоча ще сто років тому такого поняття практично не існувало.",
    mode: "hybrid",
    startSec: 31,
    images: ["projects/passport-ww1/german-passport-types.webp"],
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

export const passportWw1Schema = z.object({
  prewar:    z.number().int().min(0).describe("До і після 1914 (0:00) — старт, кадр"),
  league1920: z.number().int().min(0).describe("Ліга Націй 1920 (0:12) — старт, кадр"),
  crises:    z.number().int().min(0).describe("Кожна криза (0:22) — старт, кадр"),
  temporary: z.number().int().min(0).describe("Тимчасовий захід назавжди (0:31) — старт, кадр"),
});

export type PassportWw1Props = z.infer<typeof passportWw1Schema>;

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

export const DEFAULT_STARTS: PassportWw1Props = PLAN.reduce((acc, s) => {
  acc[s.id as keyof PassportWw1Props] = Math.round(s.startSec * FPS);
  return acc;
}, {} as PassportWw1Props);
