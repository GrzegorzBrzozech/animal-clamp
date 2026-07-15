/**
 * "Зло від освіти" — segment 08:11 «home-education» — VIDEO PLAN & single source
 * of truth. Home schooling in Ukraine is legal on paper but wrapped in red tape.
 *
 * One entry per scene, ordered by `startSec` (VO moment where the scene begins).
 * Timings transcribed from public/projects/homeschool/speech.mp3 with
 * whisper-large-v3-turbo (word-level). Each scene ends where the next begins;
 * the last ends at AUDIO_DURATION_SEC.
 */

import { z } from "zod";

export const FPS = 30;

/** Voiceover track, relative to public/. */
export const AUDIO = "projects/homeschool/speech.mp3";

/** Full audio length (s). Real length 41.12 after cutting the DPA phrase — rounded up. */
export const AUDIO_DURATION_SEC = 41.3;

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
    id: "allowed",
    title: "Домашня освіта дозволена",
    description:
      "Затишний будинок із дитиною й книгою — «індивідуальна форма навчання». Зелена печатка «дозволено». Все виглядає ідилічно.",
    narration:
      "В Україні не заборонена і домашня освіта — так звана індивідуальна форма навчання.",
    mode: "animation",
    startSec: 0,
  },
  {
    id: "notSimple",
    title: "Але не так просто",
    description:
      "Ідилія обривається: перед будинком опускається шлагбаум/бар'єр. «Але це не означає, що можна просто взяти і навчати вдома».",
    narration:
      "Але це не означає, що можна просто взяти і навчати дитину вдома.",
    mode: "animation",
    startSec: 5.3,
  },
  {
    id: "attach",
    title: "Прикріпитися до школи",
    description:
      "Бюрократія: треба прикріпитися до державної школи, погодження директора, план навчання. Документи + печатка директора.",
    narration:
      "Треба офіційно прикріпитися до державної школи: отримати погодження директора, надати план навчання.",
    mode: "animation",
    startSec: 9.58,
  },
  {
    id: "motiveRefuse",
    title: "Мотив відмовити",
    description:
      "У шкіл прямий мотив відмовити: менше учнів — менше фінансування. Монети/гроші зменшуються, коли учень іде на домашнє.",
    narration:
      "А у більшості шкіл є прямий мотив відмовити: менше учнів — менше фінансування від держави.",
    mode: "animation",
    startSec: 15.84,
  },
  {
    id: "moreRefusals",
    title: "Відмов більше, ніж згод",
    description:
      "Порівняння двох стовпчиків: «Відмови» (червоний, високий) значно вищий за «Погодження» (зелений, крихітний).",
    narration: "От і не дивно, що відмов значно більше, ніж погоджень.",
    mode: "animation",
    startSec: 22.18,
  },
  {
    id: "notEnd",
    title: "І це не кінець",
    description:
      "Нескінченний цикл контролю: регулярні звіти, іспити в школі, атестації щосеместра/щороку. Колесо/календар крутиться.",
    narration:
      "Але й це не кінець. Адже далі — регулярні звіти, іспити в школі, атестації щосеместра або щороку.",
    mode: "animation",
    startSec: 25.38,
  },
  {
    id: "failRefuse",
    title: "Не склав — відмова",
    description:
      "Якщо дитина не склала атестацію — школа може відмовити в продовженні домашнього навчання. Червоний ✖ на дитині.",
    narration:
      "Якщо дитина не склала — школа може відмовити в продовженні домашнього навчання.",
    mode: "animation",
    startSec: 32.46,
  },
  {
    id: "onePercent",
    title: "Менше 1% сімей",
    description:
      "Підсумок: менше одного відсотка сімей в Україні обирають цей шлях. Велике «< 1%» на тлі рядів будиночків.",
    narration: "І менше одного відсотка сімей в Україні обирають цей шлях.",
    mode: "animation",
    startSec: 37.2,
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
export const homeschoolSchema = z.object({
  allowed: z.number().int().min(0).describe("Домашня освіта дозволена (0:00) — старт, кадр"),
  notSimple: z.number().int().min(0).describe("Але не так просто (0:05) — старт, кадр"),
  attach: z.number().int().min(0).describe("Прикріпитися до школи (0:09) — старт, кадр"),
  motiveRefuse: z.number().int().min(0).describe("Мотив відмовити (0:15) — старт, кадр"),
  moreRefusals: z.number().int().min(0).describe("Відмов більше (0:22) — старт, кадр"),
  notEnd: z.number().int().min(0).describe("І це не кінець (0:25) — старт, кадр"),
  failRefuse: z.number().int().min(0).describe("Не склав — відмова (0:32) — старт, кадр"),
  onePercent: z.number().int().min(0).describe("Менше 1% сімей (0:39) — старт, кадр"),
});

export type HomeschoolProps = z.infer<typeof homeschoolSchema>;

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
export const DEFAULT_STARTS: HomeschoolProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof HomeschoolProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as HomeschoolProps);
