/**
 * "Багач США" — Shorts (вертикальне 1080×1920). Спростування радянського
 * агітплаката 1957 р. "У них лише для багатих достаток": показуємо, що
 * "багач" на картинці одягнений у те, що робітник США заробляв за 4 дні, а
 * радянський працівник — за пів року.
 *
 * Timings from real VO: clamp-videos/.../s0001. багач сша/assets/transcribe/speech.srt
 * (segment-level ASR, no word timestamps — see per-scene comments for how
 * row-reveal timing inside a segment was estimated: proportional to
 * character count of each clause, same method as seller-margin/plan.ts).
 * Real audio duration 96.49s (ffprobe) → rounded up to 98s for a closing hold.
 *
 * Source: clamp-videos/videos/in progress/s0001. багач сша/
 *   text.txt, montage.yaml, plan_2.md, assets/transcribe/speech.srt.
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/rich-american-poster/speech.m4a";

/** Real duration 96.49s (ffprobe) — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 98;

export const MEDIA = {
  poster: "projects/rich-american-poster/poster.jpg",
  fashionShow: "projects/rich-american-poster/fashion-show.mp4",
  tophat: "projects/rich-american-poster/tophat.mp4",
  searsPrices: "projects/rich-american-poster/sears-prices.png",
  ussrStore: "projects/rich-american-poster/ussr-store.mp4",
  chevrolet: "projects/rich-american-poster/chevrolet.mp4",
} as const;

/** Real source-clip length in composition frames (FPS=30) — for `MediaKenBurns loop`/`mediaDurationInFrames`. */
export const CLIP_FRAMES = {
  fashionShow: 240, // 8.01s
  tophat: 240, // 8.00s
  ussrStore: 240, // 8.00s
  chevrolet: 359, // 11.96s
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
    title: "Гачок",
    description: "Повний плакат, повільний Ken-Burns zoom-in. Дві репліки-LowerThird одна за одною.",
    narration:
      "Фантастично, але все написане – правда. Але є нюанс. Так, достаток і надлишок можуть бути тільки в багатих. Бо достаток – це, власне, і є багатство. Це синоніми. Якби в СРСР в усіх було все, всі були б багаті.",
    mode: "media",
    startSec: 0,
    images: [MEDIA.poster],
  },
  {
    id: "nuance",
    title: "Розкриття нюансу",
    description: "Той самий плакат, zoom триває. Підпис: автори порівнювали з СРСР, а не абсолютно.",
    narration:
      "І автори несподівано забули уточнити, що абсолютна більшість в США була багатою у порівнянні з СРСР.",
    mode: "media",
    startSec: 17.6,
    images: [MEDIA.poster],
  },
  {
    id: "manIntro",
    title: "Пан на картинці",
    description: "Zoom/crop на постать багача з плаката. Коротка теза-переходка.",
    narration: "Наприклад, пан на картинці вдягнений геть нерозкішно.",
    mode: "media",
    startSec: 24.56,
    images: [MEDIA.poster],
  },
  {
    id: "usReceipt",
    title: "США: розрахунок костюма",
    description:
      "Фон — реальна хроніка (показ мод → виготовлення циліндра), ReceiptCard будується по рядку на кожен предмет; скан цінника Sears як proof-inset.",
    narration:
      "Смокінг – 65 доларів, біла святкова сорочка – 4,5, циліндр – 13,5, файна цигара – 30 центів. Разом це все дає 83 долари 30 центів, що складає десь 92% тижневого заробітку працівника.",
    mode: "media",
    startSec: 27.6,
    images: [MEDIA.fashionShow, MEDIA.tophat, MEDIA.searsPrices],
  },
  {
    id: "usWage",
    title: "США: 4 дні роботи",
    description: "Той самий фон (циліндр-хроніка) продовжується. Стат-рядок зарплати, потім велика цифра «4 ДНІ».",
    narration:
      "Працівник заробляв 90 доларів на тиждень або 4713 доларів на рік. Тобто 4 дні погорбатив на дядю Сема і вже багатій.",
    mode: "media",
    startSec: 45.34,
    images: [MEDIA.tophat],
  },
  {
    id: "ussrCost",
    title: "СРСР: розрахунок костюма",
    description:
      "Фон — хроніка радянського універмагу (Москва, 1957). ReceiptCard СРСР: смокінг → зарплата → «3 місяці», crossfade на «пів року».",
    narration:
      "А от радянський працівник дозволити собі таку розвагу либонь міг. Сам тільки смокінг коштував 1000-1500 рублів. При місячній зарплатні в 750. На цілий такий прикид треба було б працювати 3 місяці без перерви на їжу і відпочинок. А більш реалістично – півроку.",
    mode: "media",
    startSec: 55.96,
    images: [MEDIA.ussrStore],
  },
  {
    id: "carComparison",
    title: "Контраст: авто за пів року",
    description: "Фон переключається на телерекламу Chevrolet 1957. Підпис із ціною авто.",
    narration: "В той час як американець за півроку міг заробити на власний автомобіль.",
    mode: "media",
    startSec: 74.34,
    images: [MEDIA.chevrolet],
  },
  {
    id: "irony",
    title: "Іронічна ремарка",
    description: "Повернення на радянську хроніку (продовження). Одна репліка.",
    narration: "Але стрімілись... лежали в напрямку своєї мрії.",
    mode: "media",
    startSec: 79.14,
    images: [MEDIA.ussrStore],
  },
  {
    id: "kidsStat",
    title: "Фінальний удар — діти",
    description: "Повернення на плакат, zoom на дівчинку внизу картинки. Велика цифра 23 000 000.",
    narration:
      "Ну і наостанок. В США в 1957 році було 23 мільйона дітей до 6 років. Тобто якраз така кількість осіб, які не мали можливості, аби відвідати магазин і щось купити.",
    mode: "media",
    startSec: 82.8,
    images: [MEDIA.poster],
  },
  {
    id: "closer",
    title: "Фінал",
    description: "Плакат, широкий план. Остання репліка, потім затемнення й титр-джерело.",
    narration: "Так що і тут не збрехали.",
    mode: "media",
    startSec: 93.52,
    images: [MEDIA.poster],
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

export const richAmericanPosterSchema = z.object({
  hook: z.number().int().min(0).describe("Гачок (0:00) — старт, кадр"),
  nuance: z.number().int().min(0).describe("Розкриття нюансу (0:17.6) — старт, кадр"),
  manIntro: z.number().int().min(0).describe("Пан на картинці (0:24.6) — старт, кадр"),
  usReceipt: z.number().int().min(0).describe("США: розрахунок костюма (0:27.6) — старт, кадр"),
  usWage: z.number().int().min(0).describe("США: 4 дні роботи (0:45.3) — старт, кадр"),
  ussrCost: z.number().int().min(0).describe("СРСР: розрахунок костюма (0:56.0) — старт, кадр"),
  carComparison: z.number().int().min(0).describe("Контраст: авто (1:14.3) — старт, кадр"),
  irony: z.number().int().min(0).describe("Іронічна ремарка (1:19.1) — старт, кадр"),
  kidsStat: z.number().int().min(0).describe("Фінальний удар — діти (1:22.8) — старт, кадр"),
  closer: z.number().int().min(0).describe("Фінал (1:33.5) — старт, кадр"),
});

export type RichAmericanPosterProps = z.infer<typeof richAmericanPosterSchema>;

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

export const DEFAULT_STARTS: RichAmericanPosterProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof RichAmericanPosterProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as RichAmericanPosterProps);
