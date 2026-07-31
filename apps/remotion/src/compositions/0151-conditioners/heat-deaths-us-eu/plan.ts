/**
 * "Кондиціонери" — segment 06:40 «heat-deaths-us-eu»
 * Why EU reports 10-12x more heat deaths than the USA — different counting methods.
 *
 * Timings from whisper-large (segment-level, verbose stdout).
 * SRT: videos/in progress/transcribe/speech.srt
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/heat-deaths-us-eu/speech.mp3";

/** Real duration 60.108s — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 61;

export const IMG = {
  deathCertificate: "projects/heat-deaths-us-eu/death-certificate.png",
  usaHeatMap: "projects/heat-deaths-us-eu/usa-heat-map.jpg",
  euModel: "projects/heat-deaths-us-eu/This-figure-shows-the-relationship-between-high-temperatures-and-deaths-observed-during.png",
  euMortality: "projects/heat-deaths-us-eu/heat-related-mortality-eu.jpg",
  motherOfGod: "projects/heat-deaths-us-eu/mother-of-god.webp",
  thinking: "projects/heat-deaths-us-eu/thinking.svg",
  okay: "projects/heat-deaths-us-eu/okay.png",
  seriously: "projects/heat-deaths-us-eu/seriously.svg",
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
    id: "claim",
    title: "У 10-12 разів — це брехня?",
    description: "Провокаційне відкриття: «у 10-12 разів — це брехня?» Скажете ви. І матимете рацію — бо рахують по-різному.",
    narration: "У 10-12 разів це брехня! Скажете ви. І матимете рацію. Бо рахують по-різному.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "usaCounting",
    title: "США: свідоцтва про смерть",
    description: "У США смертність від спеки рахують за свідоцтвами → ~2 000/рік. Свідоцтво про смерть як артефакт.",
    narration: "У Сполучених Штатах причину загибелі оцінюють за свідоцтвами про смерть. На спеку списують близько 2 000 на рік. А у Європі рахують через математичну модель.",
    mode: "hybrid",
    startSec: 6.44,
    images: [IMG.deathCertificate, IMG.usaHeatMap],
  },
  {
    id: "euModel",
    title: "Европа: модель температура → смерті",
    description: "Графік залежності температури і смертності. При 22°C → 100 людей, при 35°C → 130. Різниця 30 = внесок спеки.",
    narration: "Залежність температури і смертності. При 22 градусах у середньому помирає 100 людей. При 35 — 130 людей. Різницю в 30 смертей модель відносить до спеки.",
    mode: "hybrid",
    startSec: 17.42,
    images: [IMG.euModel],
  },
  {
    id: "euTotals",
    title: "Европа: 53 тисячі на рік",
    description: "Результат EU-моделі: ~53 000 смертей від спеки на рік. Треба порахувати USA за тією самою методологією.",
    narration: "І це приблизно 53 тисячі на рік. Як же звести це до єдиної системи координат? По Європі немає єдиних даних, тож треба порахувати USA по тій моделі.",
    mode: "hybrid",
    startSec: 29.44,
    images: [IMG.euMortality],
  },
  {
    id: "usaEstimates",
    title: "США за EU-моделлю: 8-10 тисяч",
    description: "Готових досліджень немає. Власні оцінки за EU-методологією: 8-10 тисяч смертей на рік у США.",
    narration: "Чесно кажучи, готових наукових висновків нема. Є тільки обрахунки по частині територій. Тож нам довелося робити власні оцінки. Вийшло 8-10 тисяч на рік.",
    mode: "hybrid",
    startSec: 39.74,
    images: [IMG.usaHeatMap],
  },
  {
    id: "comparison",
    title: "3 проти 12 — розрив у 3-5 разів",
    description: "На 100 тис. населення: США 3, ЄС 12. Реальний розрив 3-5 разів — і це дуже багато при схожому кліматі та економіці.",
    narration: "З перерахунком на 100 тисяч населення це 3 проти 12. Реальний розрив — у 3-5 разів. Що все ще дуже багато, враховуючи схожий клімат і рівень економіки.",
    mode: "animation",
    startSec: 47.58,
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

export const heatDeathsUsEuSchema = z.object({
  claim: z.number().int().min(0).describe("У 10-12 разів — це брехня? (0:00)"),
  usaCounting: z.number().int().min(0).describe("США: свідоцтва про смерть (0:06)"),
  euModel: z.number().int().min(0).describe("Европа: модель температура→смерті (0:17)"),
  euTotals: z.number().int().min(0).describe("Европа: 53 тисячі на рік (0:29)"),
  usaEstimates: z.number().int().min(0).describe("США за EU-моделлю: 8-10 тисяч (0:39)"),
  comparison: z.number().int().min(0).describe("3 проти 12 — розрив (0:47)"),
});

export type HeatDeathsUsEuProps = z.infer<typeof heatDeathsUsEuSchema>;

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

export const DEFAULT_STARTS: HeatDeathsUsEuProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof HeatDeathsUsEuProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as HeatDeathsUsEuProps);
