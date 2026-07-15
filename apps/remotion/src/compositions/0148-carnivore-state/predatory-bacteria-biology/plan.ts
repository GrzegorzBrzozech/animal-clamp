/**
 * "Держава-хижак" — вставка 10:27 «predatory-bacteria-biology»
 *
 * Виправляє перевернутий факт: хижаки — НЕ чемпіони розмноження.
 * Найшвидші — гетеротрофи-«сміттярі» (гомстедінг), потім хижаки, найповільніші — автотрофи.
 * Прямий біологічний паралель до економічних/політичних засобів Оппенгаймера.
 *
 * Тайминги — з whisper-large транскрипції public/projects/predatory-bacteria-biology/speech.mp3.
 * Кожна сцена завершується там, де починається наступна.
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/predatory-bacteria-biology/speech.mp3";

/** Реальна довжина 56.69 с — округлено вгору, щоб не обрізати хвіст. */
export const AUDIO_DURATION_SEC = 57;

/** Шляхи до зображень (фактичні імена файлів, не з montage.yaml). */
export const IMG = {
  ecoli: "projects/predatory-bacteria-biology/00-00_ecoli-microscope.jpg",
  ecoliGif: "projects/predatory-bacteria-biology/00-00_ecoli-colony-growth-timelapse.gif",
  bdellovibrio: "projects/predatory-bacteria-biology/00-12_bdellovibrio-bacteriovorus-cryotomogram.jpg",
  myxoLawn: "projects/predatory-bacteria-biology/00-20_myxococcus-eats-bacterial-lawn.jpg",
  myxococcus: "projects/predatory-bacteria-biology/00-30_myxococcus-xanthus.png",
} as const;

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
    id: "scavengers",
    title: "Сміттярі — найшвидші",
    description:
      "Хижаки не чемпіони. Найшвидше ростуть ті, хто підбирає нічийне — молекули з мертвих клітин і виділень. Гомстедінг. E. coli — 20 хв, Vibrio natriegens — 10 хв.",
    narration:
      "Тут треба уточнити, що хижаки — не чемпіони в плані розмноження. Найшвидше ростуть ті, хто тихенько підбирає нічийне, зронене іншими: молекули з мертвих клітин і виділень. Гомстедінг! Кишкова паличка ділиться кожні 20 хвилин. Морська бактерія Vibrio natriegens — взагалі за 10.",
    mode: "hybrid",
    startSec: 0,
    images: [IMG.ecoli],
  },
  {
    id: "bdellovibrio",
    title: "Bdellovibrio — хижак зсередини",
    description:
      "Справжні хижі бактерії повільніші. Bdellovibrio проникає всередину жертви, їсть її зсередини і дає нащадків через 4 години. Кріотомограма.",
    narration:
      "Справжні хижі бактерії — повільніші. Bdellovibrio проникає всередину жертви, їсть її зсередини і дає нащадків через 4 години.",
    mode: "hybrid",
    startSec: 18,
    images: [IMG.bdellovibrio],
  },
  {
    id: "myxococcus",
    title: "Myxococcus — зграйний хижак",
    description:
      "Зграйний хижак Myxococcus подвоюється за 5 годин. Бути хижаком не так і просто: треба знайти жертву, проникнути, з'їсти.",
    narration:
      "Зграйний хижак Myxococcus — подвоюється за 5 годин. Бути хижаком не так і просто: треба знайти жертву, проникнути, з'їсти.",
    mode: "hybrid",
    startSec: 26,
    images: [IMG.myxococcus, IMG.myxoLawn],
  },
  {
    id: "autotrophs",
    title: "Автотрофи — все самі",
    description:
      "Найповільніші — ті, хто намагається все виробляти сам, з базових речовин: CO₂, води, мінералів. Нітрозомонас — раз на 10 годин, ціанобактерія Prochlorococcus — раз на добу.",
    narration:
      "Найповільніші — ті, хто намагається все виробляти сам, з базових речовин: CO₂, води, мінералів. Нітрозомонас, яка виробляє енергію з аміаку, ділиться раз на 10 годин. Ціанобактерія Prochlorococcus — раз на добу.",
    mode: "animation",
    startSec: 34,
  },
  {
    id: "ranking",
    title: "Закономірність мікросвіту",
    description:
      "Найвигідніше брати готове і не конфліктувати. Потім — полювати. Найсумніше — все робити самому. Три стратегії від найшвидшої до найповільнішої.",
    narration:
      "В мікросвіті є закономірність: найвигідніше брати готове і не конфліктувати. Потім — полювати. Найсумніше — все робити самому.",
    mode: "animation",
    startSec: 48,
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

export const predatoryBacteriaBiologySchema = z.object({
  scavengers: z.number().int().min(0).describe("Сміттярі — найшвидші (0:00) — старт, кадр"),
  bdellovibrio: z.number().int().min(0).describe("Bdellovibrio (0:18) — старт, кадр"),
  myxococcus: z.number().int().min(0).describe("Myxococcus (0:26) — старт, кадр"),
  autotrophs: z.number().int().min(0).describe("Автотрофи (0:34) — старт, кадр"),
  ranking: z.number().int().min(0).describe("Закономірність (0:48) — старт, кадр"),
});

export type PredatoryBacteriaBiologyProps = z.infer<typeof predatoryBacteriaBiologySchema>;

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

export const DEFAULT_STARTS: PredatoryBacteriaBiologyProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof PredatoryBacteriaBiologyProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as PredatoryBacteriaBiologyProps);
