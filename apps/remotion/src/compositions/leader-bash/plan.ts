/**
 * "Leader Bash" — вставка-підпроект (🎞️) для 0158 «проти багатих», у
 * основне відео йде на 01:13.144 (assets/montage.0158.v1.yaml). Пояснює
 * термін: антилідерська коаліція в настільних іграх.
 *
 * Джерело мав РІВНО одне відео (board-game-friends-cheer.mp4, 12.52s) на
 * ВСІ 13.5s озвучки — недостатньо різноманітності для 13.5s одного
 * абстрактного поняття. Розбито на 3 біти замість "один клуб на всю
 * доріжку":
 *   1. hook — назва терміну (paper title card, без відео)
 *   2. mechanic — сам механізм; реальне відео вставлено як `PhotoPin`
 *      (не full-bleed — стандартний паперовий стиль сімʼї, як
 *      seller-margin/marginal-utility). Обрано вікно 3.8–12.5s кліпу:
 *      на 4–6s дівчата дають "хай-файв" (= "об'єднують зусилля"), на
 *      8–12s хтось показує пальцем на усміхненого чоловіка (= "проти
 *      гравця, який зараз лідирує") — реальний контент кліпу збігається
 *      зі словами, а не просто ілюструє "люди грають у гру".
 *   3. payoff — "зрівняти шанси на перемогу": дві шкали виростають до
 *      однакової висоти (немає відповідного стокового відео на цю фразу).
 *
 * Timings: word-level ASR (transcribe/speech.json, mlx-whisper --word-timestamps).
 * Real audio duration 13.4676s (ffprobe) → +3s hold on the final payoff frame
 * after the narration ends (requested) = 16.5s total.
 *
 * Source: assets/raw/leader-bash/{speech.mp3,speech.txt,montage.yaml,board-game-friends-cheer.mp4}
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/leader-bash/speech.mp3";

/** Real duration 13.4676s (ffprobe) — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 16.5;

export const MEDIA = {
  boardGame: "projects/leader-bash/board-game-friends-cheer.mp4",
} as const;

/** Real source-clip length in composition frames (FPS=30) — 12.52s. */
export const CLIP_FRAMES = {
  boardGame: 376, // 12.52s
} as const;

export type SceneMode = "media" | "generated";

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
    title: "Гачок — назва терміну",
    description: "Paper title card: «Leader Bash» + підпис «стратегія антилідерської коаліції». Без відео — на 2.98s ще нема що показувати.",
    narration: "Leader Bash або стратегія антилідерської коаліції –",
    mode: "generated",
    startSec: 0,
  },
  {
    id: "mechanic",
    title: "Механіка — реальне відео",
    description: "PhotoPin (kind=video) з board-game-friends-cheer.mp4, startFromSec≈3.8 — вікно, де в кадрі якраз хай-файв (об'єднання зусиль). Текст праворуч.",
    narration: "це модель поведінки гравців у настільних іграх, коли всі або більшість учасників об'єднують зусилля",
    mode: "media",
    startSec: 2.98,
    images: [MEDIA.boardGame],
  },
  {
    id: "payoff",
    title: "Шанси на перемогу",
    description:
      "4 паперові стовпчики гравців (не 2) — один явно лідирує. Шматок зверху лідера відлітає й приземляється на найслабшого: розрив зникає. Заголовок — назва демонстрації ('Шанси на перемогу'), а НЕ дослівний повтор репліки.",
    narration: "проти гравця, який зараз лідирує, щоб зрівняти шанси на перемогу.",
    mode: "generated",
    startSec: 9.3,
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

export const leaderBashSchema = z.object({
  hook: z.number().int().min(0).describe("Гачок — назва терміну (0:00) — старт, кадр"),
  mechanic: z.number().int().min(0).describe("Механіка — реальне відео (0:03) — старт, кадр"),
  payoff: z.number().int().min(0).describe("Payoff — зрівняти шанси (0:12) — старт, кадр"),
});

export type LeaderBashProps = z.infer<typeof leaderBashSchema>;

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

export const DEFAULT_STARTS: LeaderBashProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof LeaderBashProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as LeaderBashProps);
