/**
 * "Залежність від влади" — вставка 02:02 «Що таке влада?»
 * Transcribed from speech.mp3 with whisper-large (uk).
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/what-is-power/speech.mp3";

/** Full audio length (s). Real length 44.2 — rounded up to avoid clipping. */
export const AUDIO_DURATION_SEC = 45;

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
    id: "power",
    title: "Що таке влада",
    description: "Трон з примарною фігурою. Люди стоять спиною — потім падають на коліна на слові «добровільно».",
    narration: "Влада — це здатність примушувати інших людей робити те, чого вони б не зробили добровільно.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "authorityVsPower",
    title: "Авторитет vs Влада",
    description: "Вертикально розділений екран: ліво — зелений авторитет (лікар, вчитель), право — червона влада (держава, примус).",
    narration: "Важливо розрізняти авторитет і владу. Авторитет — вплив, якому підкоряються добровільно: лікар, вчитель, керівник на роботі. Влада — коли відмова тягне примусові наслідки.",
    mode: "animation",
    startSec: 5.62,
  },
  {
    id: "stateMonopoly",
    title: "Держава і монополія насилля",
    description: "Люди з мішками зерна. З'являються поліцейський і військовий. Половина мішків переходить до них.",
    narration: "Держава — це організація, яка системно застосовує примус для збору ресурсів з населення, задля чого монополізує насилля.",
    mode: "animation",
    startSec: 16.76,
  },
  {
    id: "weberQuote",
    title: "Цитата Вебера",
    description: "Портрет Макса Вебера + текстова картка з цитатою про монополію законного насильства.",
    narration: "Так описав її соціолог Макс Вебер на початку ХХ ст. «Держава — організація, яка успішно претендує на монополію законного застосування фізичного насильства на певній території».",
    mode: "hybrid",
    startSec: 24.74,
    images: ["projects/what-is-power/Max_Weber_1918.jpg", "projects/what-is-power/politics-as-a-vocation.png"],
  },
  {
    id: "politician",
    title: "Політик і механізм влади",
    description: "Велика фігура політика ліворуч. Натовп людей у центрі. Праворуч — офіцер, військовий, гільйотина.",
    narration: "Саме тому влада і примус нероздільні, а політик — людина, яка контролює цей механізм.",
    mode: "animation",
    startSec: 38.5,
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

export const whatIsPowerSchema = z.object({
  power: z.number().int().min(0).describe("Що таке влада (0:00) — старт, кадр"),
  authorityVsPower: z.number().int().min(0).describe("Авторитет vs Влада (0:05) — старт, кадр"),
  stateMonopoly: z.number().int().min(0).describe("Держава і монополія (0:16) — старт, кадр"),
  weberQuote: z.number().int().min(0).describe("Цитата Вебера (0:24) — старт, кадр"),
  politician: z.number().int().min(0).describe("Політик і механізм (0:38) — старт, кадр"),
});

export type WhatIsPowerProps = z.infer<typeof whatIsPowerSchema>;

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

export const DEFAULT_STARTS: WhatIsPowerProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof WhatIsPowerProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as WhatIsPowerProps);
