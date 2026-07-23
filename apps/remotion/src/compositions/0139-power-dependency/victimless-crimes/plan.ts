/**
 * "Залежність від влади" — вставка 17:30 «Злочини без постраждалого»
 * Transcribed from speech.mp3 with whisper-large (uk).
 * Timings: [0:00] handshake, [0:06] mini-scenes (bars at end), [0:20] rothbard, [0:32] prison-chart
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/victimless-crimes/speech.mp3";

/** Full audio length (s). Real: 41.48s — +1s buffer. */
export const AUDIO_DURATION_SEC = 43;

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
    id: "handshake",
    title: "Злочин без постраждалого",
    description:
      "Дві фігури обмінюються пакунком на площі. Третя фігура (офіцер) з'являється у темному кутку й спостерігає.",
    narration:
      "Злочин без постраждалого — це дія, яка порушує закон, але не завдає шкоди конкретній особі.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "miniScenes",
    title: "П'ять «злочинів» + ґрати",
    description:
      "П'ять колонок з'являються слово за словом. На «ніхто не подав скарги» — посмішки. На «але держава» — ґрати падають зверху, обличчя сумніють.",
    narration:
      "Наркотики для особистого вжитку. Статеві втіхи між дорослими. Азартні ігри. Робота без ліцензії. Контрабанда. Ніхто не подав скарги. Ніхто не зазнав прямої шкоди. Але держава може посадити за це за грати.",
    mode: "animation",
    startSec: 6.16,
  },
  {
    id: "rothbard",
    title: "Ротбард: «Етика свободи»",
    description:
      "Портрет Ротбарда + обкладинка книги ліворуч. Велика цитата праворуч.",
    narration:
      "Мюррей Ротбард у «Етиці свободи» стверджував: криміналізація добровільних дій між дорослими — це не захист прав, а їх порушення. Держава перетворює себе на постраждалого там, де реального постраждалого немає.",
    mode: "hybrid",
    startSec: 20.2,
    images: [
      "projects/victimless-crimes/CloseupRothbard.jpg",
      "projects/victimless-crimes/TheEthicsofLiberty.jpg",
    ],
  },
  {
    id: "prisonChart",
    title: "45% за наркотики",
    description:
      "Анімована в'язниця — 100 камер. 43 підсвічуються зеленим (drug offenses). Інші кольори за категоріями.",
    narration:
      "У США сьогодні близько 45% федеральних ув'язнених відбувають термін за наркотики. Більшість — не за насилля, а за зберігання або збут.",
    mode: "animation",
    startSec: 32.82,
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

export const victimlessCrimesSchema = z.object({
  handshake: z.number().int().min(0).describe("Злочин без постраждалого (0:00) — старт, кадр"),
  miniScenes: z.number().int().min(0).describe("П'ять злочинів + ґрати (0:06) — старт, кадр"),
  rothbard: z.number().int().min(0).describe("Ротбард (0:20) — старт, кадр"),
  prisonChart: z.number().int().min(0).describe("45% за наркотики (0:32) — старт, кадр"),
});

export type VictimlessCrimesProps = z.infer<typeof victimlessCrimesSchema>;

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

export const DEFAULT_STARTS: VictimlessCrimesProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof VictimlessCrimesProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as VictimlessCrimesProps);
