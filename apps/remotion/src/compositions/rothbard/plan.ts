/**
 * "Зло від освіти" — segment 11:08 «rothbard-education» — VIDEO PLAN & single
 * source of truth. The history of compulsory state schooling per Murray Rothbard:
 * Prussia 1763 → drill → Fichte → spread → Soviet apogee.
 *
 * This segment leans on ARCHIVAL IMAGERY (portraits, a war map, paintings) — they
 * are presented via <PhotoPin> as photos pinned onto the paper notebook, so the
 * real images live inside the pencil-on-paper look instead of being bare slides.
 *
 * Timings transcribed from public/projects/rothbard/speech.mp3 with
 * whisper-large-v3-turbo (word-level). Each scene ends where the next begins.
 */

import { z } from "zod";

export const FPS = 30;

/** Voiceover track, relative to public/. */
export const AUDIO = "projects/rothbard/speech.mp3";

/** Full audio length (s). Real length 90.58 — rounded up so the tail isn't clipped. */
export const AUDIO_DURATION_SEC = 91;

export type SceneMode = "animation" | "talkinghead" | "hybrid";

export type PlanScene = {
  id: string;
  title: string;
  description: string;
  narration: string;
  mode: SceneMode;
  startSec: number;
  /** Archival image(s) this scene pins onto the paper, if any. */
  images?: string[];
};

export const PLAN: PlanScene[] = [
  {
    id: "thesis",
    title: "Ротбард: це про контроль",
    description:
      "Портрет Мюррея Ротбарда, пришпилений до паперу. Теза книги «Освіта: вільна і обов'язкова»: обов'язкова держосвіта — не про навчання, а про контроль.",
    narration:
      "Обов'язкова держосвіта — це не про навчання, це про контроль. Так стверджує Мюррей Ротбард у книзі «Освіта: вільна і обов'язкова».",
    mode: "hybrid",
    startSec: 0,
    images: ["projects/rothbard/00-00_rothbard-portrait.jpg"],
  },
  {
    id: "prussia",
    title: "Прусія, 1763",
    description:
      "Карта Семирічної війни. Прусія, 1763 рік — щойно завершився найкривавіший конфлікт XVIII століття.",
    narration:
      "Прусія, 1763 рік. Тільки-но завершилась Семирічна війна — найкривавіший конфлікт XVIII століття.",
    mode: "hybrid",
    startSec: 7.72,
    images: ["projects/rothbard/00-10_seven-years-war-map.png"],
  },
  {
    id: "friedrich",
    title: "Фрідріх підписує закон",
    description:
      "Портрет Фрідріха Великого + армія. Він аналізує результати війни та підписує перший у світі закон про обов'язкову початкову освіту.",
    narration:
      "Король Фрідріх Великий аналізує результати війни та підписує перший у світі закон про обов'язкову початкову освіту.",
    mode: "hybrid",
    startSec: 15.02,
    images: ["projects/rothbard/00-10_friedrich-der-grosse.jpg"],
  },
  {
    id: "desertion",
    title: "Дезертирство 30%",
    description:
      "Прусська армія (картина) + велика цифра 30% дезертирства. Солдати не розуміли наказів, не читали карт, не мали лояльності до держави.",
    narration:
      "Прусська армія до реформи мала хронічну проблему: дезертирство сягало 30 відсотків. Солдати не розуміли наказів, не могли читати карти, не мали жодної лояльності до держави.",
    mode: "hybrid",
    startSec: 21.82,
    images: ["projects/rothbard/00-18_prussian-military.jpg"],
  },
  {
    id: "newSchool",
    title: "Новий навчальний план",
    description:
      "Муштра прусських рекрутів (акварель Герлаха) + список «елементів»: пунктуальність, чекати дозволу говорити, виконання команд без роздумів.",
    narration:
      "Нова школа мала це виправити. Навчальний план включав чіткі елементи: пунктуальність, смиренне очікування дозволу говорити або діяти, виконання команд без роздумів.",
    mode: "hybrid",
    startSec: 33.22,
    images: ["projects/rothbard/00-30_prussian-drill-gerlach.jpg"],
  },
  {
    id: "dogTraining",
    title: "Дресування → служба",
    description:
      "Аналогія: зараз це схоже на дресування собак, тоді — відкрито називали підготовкою до служби. Так дисципліна заходить у широкі маси.",
    narration:
      "Зараз це більше схоже на дресування собак. Тоді відкрито називали підготовкою до служби. Так в широкі маси заходить дисципліна.",
    mode: "animation",
    startSec: 43.66,
  },
  {
    id: "napoleonFichte",
    title: "Поразка від Наполеона → Фіхте",
    description:
      "Наполеон входить у Берлін (1806) + портрет Фіхте. Через 40 років, після поразки, Фіхте у «Промовах до німецької нації» формулює це прямо.",
    narration:
      "Через 40 років, після поразки від Наполеона, філософ Йоганн Ґоттліб Фіхте у «Промовах до німецької нації» сформулював це прямо.",
    mode: "hybrid",
    startSec: 52.06,
    images: ["projects/rothbard/00-42_napoleon-enters-berlin-1806.jpg", "projects/rothbard/00-42_fichte-portrait.png"],
  },
  {
    id: "fichteQuote",
    title: "Цитата Фіхте",
    description:
      "Велика цитата поверх портрета Фіхте: «нова освіта повинна повністю знищити свободу волі в учня… щоб людина не могла бажати нічого іншого, крім того, чого ви бажаєте».",
    narration:
      "«Нова освіта повинна повністю знищити свободу волі в учня. Школи повинні формувати особистість таким чином, щоб людина просто не могла бажати нічого іншого, крім того, чого ви від неї бажаєте.»",
    mode: "hybrid",
    startSec: 59.78,
    images: ["projects/rothbard/00-42_fichte-portrait.png"],
  },
  {
    id: "spread",
    title: "Модель поширюється світом",
    description:
      "Ротбард саме на Фіхте покладає відповідальність. Модель поширюється: Прусія → Європа → США → весь світ (карта/стрілки).",
    narration:
      "Ротбард у своїй книзі саме на Фіхте покладає відповідальність за формування логіки держосвіти. Модель поширилась на всю Європу, а потім — до Сполучених Штатів і на весь світ.",
    mode: "animation",
    startSec: 71.88,
  },
  {
    id: "soviet",
    title: "Радянський апогей",
    description:
      "Радянська система — логічний апогей: тотальна уніфікація. Ряди однакових голів; одна установа вирішує, що «правильно» думати мільйонам.",
    narration:
      "Радянська система стала логічним апогеєм цього процесу — тотальна уніфікація. Одна установа вирішує, що «правильно» думати мільйонам людей.",
    mode: "animation",
    startSec: 82.32,
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
export const rothbardSchema = z.object({
  thesis: z.number().int().min(0).describe("Ротбард: контроль (0:00) — старт, кадр"),
  prussia: z.number().int().min(0).describe("Прусія 1763 (0:07) — старт, кадр"),
  friedrich: z.number().int().min(0).describe("Фрідріх підписує (0:15) — старт, кадр"),
  desertion: z.number().int().min(0).describe("Дезертирство 30% (0:21) — старт, кадр"),
  newSchool: z.number().int().min(0).describe("Навчальний план (0:33) — старт, кадр"),
  dogTraining: z.number().int().min(0).describe("Дресування → служба (0:43) — старт, кадр"),
  napoleonFichte: z.number().int().min(0).describe("Наполеон → Фіхте (0:52) — старт, кадр"),
  fichteQuote: z.number().int().min(0).describe("Цитата Фіхте (0:59) — старт, кадр"),
  spread: z.number().int().min(0).describe("Модель поширюється (1:11) — старт, кадр"),
  soviet: z.number().int().min(0).describe("Радянський апогей (1:22) — старт, кадр"),
});

export type RothbardProps = z.infer<typeof rothbardSchema>;

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
export const DEFAULT_STARTS: RothbardProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof RothbardProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as RothbardProps);
