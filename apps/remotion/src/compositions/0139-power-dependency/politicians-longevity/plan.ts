/**
 * "Залежність від влади" — вставка 18:42 «Довготривалість життя політиків»
 * Transcribed from speech.mp3; real length 54.9s — padded to 56s.
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/politicians-longevity/speech.mp3";

/** Real end: 54.70 s — rounded up to avoid clipping. */
export const AUDIO_DURATION_SEC = 56;

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
    id: "powerLongevity",
    title: "Влада продовжує життя",
    description: "Король і політик у центрі. На «у буквальному сенсі» — над ними спливає +1 Up.",
    narration: "Влада продовжує життя. У буквальному сенсі.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "presidentsStats",
    title: "Статистика президентів США",
    description: "Два великі числа зліва: 79 (президент) і 67 (середній американець). Праворуч — графік presidents-longevity.mp4.",
    narration: "Середній вік американських президентів на момент смерті – 79 років. Для порівняння, середня тривалість життя чоловіків у Сполучених Штатах впродовж ХХ століття становила від 65 до 70 років.",
    mode: "hybrid",
    startSec: 2.86,
  },
  {
    id: "rulersComparison",
    title: "Авторитарні правителі",
    description: "П'ять карток зліва-направо: Єлизавета II, Цзян Цземінь, Тіто, Франко, Сталін. Кожна — вік смерті vs середня тривалість. Різниця позначена стрілкою вгору.",
    narration: "Серед авторитарних правителів ще яскравіше. Єлизавета ІІ – 96 років, при середній тривалості життя британки – 83. Цзянь Цземінь – 96, а середній китаєць жив – 75. Тіто – 87, коли Югослав – 67. Фрамко – 82, а решта іспанців – 70. Сталін – 74, а середній радянський чоловік у 1953-му жив близько 58 років.",
    mode: "animation",
    startSec: 16.04,
  },
  {
    id: "powerBenefits",
    title: "Влада фінансується підданими",
    description: "Правитель на п'єдесталі. Слуги: лікар, охоронець, кухар. П'єдестал тримають маленькі фігури підданих. З їхніх кишень летять монети вгору до правителя.",
    narration: "Влада дає доступ до найкращої медицини, харчування, безпеки та відпочинку. Всього, що статистично подовжує життя. І цей доступ фінансується з кишень тих, ким правитель керує.",
    mode: "animation",
    startSec: 44.18,
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

export const politiciansLongevitySchema = z.object({
  powerLongevity: z.number().int().min(0).describe("Влада продовжує життя (0:00)"),
  presidentsStats: z.number().int().min(0).describe("Статистика президентів (0:03)"),
  rulersComparison: z.number().int().min(0).describe("Авторитарні правителі (0:14)"),
  powerBenefits: z.number().int().min(0).describe("Влада фінансується підданими (0:43)"),
});

export type PoliticiansLongevityProps = z.infer<typeof politiciansLongevitySchema>;

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

export const DEFAULT_STARTS: PoliticiansLongevityProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof PoliticiansLongevityProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as PoliticiansLongevityProps);
