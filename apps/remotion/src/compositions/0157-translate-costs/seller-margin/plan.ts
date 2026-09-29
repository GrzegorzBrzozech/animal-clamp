/**
 * "Перекласти витрати" — вставка «seller-margin»: скільки насправді заробляє
 * супермаркет (АТБ) з банки сметани за 137 грн — торгова націнка → валова
 * маржа → чиста маржа → податки → операційні витрати.
 *
 * REVISION 2 (after user review of the first cut). What changed and why —
 * see git history / PR description for the full note; in short:
 *   - Paper style, not full-bleed video: every real photo/video is a
 *     `PhotoPin` insert on the cream paper canvas (like `marginal-utility`),
 *     never a full-screen background with text glued on top of it (unreadable,
 *     and it read as if the video WAS the point rather than illustrating one).
 *   - Numbers on screen must exactly match what's being said RIGHT NOW — no
 *     showing 36–39% during the "2%" hook, no showing "100 грн" before the
 *     narration says it. Where a beat has no single clean number, don't force
 *     one on screen.
 *   - The three concepts (торгова націнка / валова маржа / чиста маржа) are
 *     now told identically: title → the SAME `ReceiptCard` calculation,
 *     extended/reframed at each step → short explanation. Real B-roll is a
 *     small supporting inset, not the stage.
 *   - Dropped the Минфін building visual (confusing — "чому кабінет
 *     міністрів?") and moved `profit-report-screenshot` here instead: both
 *     2025 documents (rentability table + tax/profit source) belong together
 *     where the actual 2025 numbers are spoken, not at the "чиста маржа"
 *     concept beat (which is generic, no specific company data).
 *   - `opex` cuts re-timed against word-count-proportional position inside its
 *     sentence (no word-level ASR timestamps exist — see transcribe/speech.json
 *     only has segment-level timing) instead of a naive uniform split, which
 *     had video advancing a whole beat ahead of the narration.
 *   - Every inset video is either shorter than its slot or `loop`ed — the
 *     first cut let `conclusion-crowded-store.mp4` (8s) run under a 13.4s
 *     scene and freeze on its last frame for ~5s.
 *
 * Source: clamp-videos.../0157. перекласти витрати/assets/raw/seller-margin/
 *   plot.md, montage.yaml. Timings from transcribe/speech.srt (real audio).
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/seller-margin/speech.mp3";

/** Real duration 91.19s (ffprobe) — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 92;

export const MEDIA = {
  hookPricetag: "projects/seller-margin/hook-pricetag-atb-svoya-liniya.mp4",
  checkoutScan: "projects/seller-margin/intro-checkout-scan.mp4",
  truckDelivery: "projects/seller-margin/markup-truck-delivery-atb.jpg",
  shelfPricetag: "projects/seller-margin/markup-pricetag-shelf-zlagoda.mp4",
  taxOffice: "projects/seller-margin/tax-office.webp",
  taxOffice2: "projects/seller-margin/tax-office-2.webp",
  warehouse: "projects/seller-margin/opex-warehouse.jpg",
  cashier: "projects/seller-margin/opex-cashier.mp4",
  securityGate: "projects/seller-margin/opex-security-gate.jpg",
  refrigeration: "projects/seller-margin/opex-refrigeration.mp4",
  spoiledProduct: "projects/seller-margin/opex-spoiled-product.png",
  crowdedStore: "projects/seller-margin/conclusion-crowded-store.mp4",
} as const;

/** Real source-clip length in composition frames (FPS=30) — for `PhotoPin sourceDurationInFrames`/loop and freeze checks. */
export const CLIP_FRAMES = {
  hookPricetag: 240, // 8.00s
  checkoutScan: 210, // 7.00s
  shelfPricetag: 180, // 6.00s
  cashier: 90, // 3.00s
  refrigeration: 90, // 3.00s
  crowdedStore: 240, // 8.00s
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
    title: "Гачок — всього 2%",
    description: "Паперовий канвас, реальний ціннник у невеликій рамці, єдина велика мальована цифра «2%» — без жодних інших чисел.",
    narration: "А ви знали, що супермаркети типу Сільпо чи АТБ заробляють всього 2% з проданого товару?",
    mode: "media",
    startSec: 0,
    images: [MEDIA.hookPricetag],
  },
  {
    id: "threeConcepts",
    title: "Три поняття",
    description: "Коротка перехідна сцена: рамка з відео каси, мінімум тексту (терміни ще не названо — називати їх зараз було б передчасно).",
    narration: "Коли ми говоримо про економіку мережевих супермаркетів, важливо розділяти три різні поняття.",
    mode: "media",
    startSec: 5.08,
    images: [MEDIA.checkoutScan],
  },
  {
    id: "markup",
    title: "Концепція 1 — Торгова націнка: 36–39%",
    description: "Назва → мальований чек 100→+37→137, що будується по мірі мовлення → рамка з реальним ціннником як доказ.",
    narration: "Торгова націнка – 36-39%. Це сума, яку магазин додає до закупівельної ціни товару. Якщо АТБ купив банку сметани у виробника за 100 гривень, то на полицю він виставить її приблизно за 137 гривень.",
    mode: "media",
    startSec: 10.32,
    images: [MEDIA.truckDelivery, MEDIA.shelfPricetag],
  },
  {
    id: "grossMargin",
    title: "Концепція 2 — Валова маржа: 26–28%",
    description: "Той самий чек 100/+37/137 повертається; поруч — видимий розрахунок 37÷137=27%, а не просто підпис-твердження.",
    narration: "Валова маржа – 26-28%. Це та сама різниця між закупівлею і продажем, але порахована відсотково від кінцевої ціни на полиці, а не від собівартості.",
    mode: "generated",
    startSec: 24.74,
  },
  {
    id: "netProfit",
    title: "Концепція 3 — Чиста маржа: 1–4%",
    description: "Той самий чек продовжується вниз: 137 − податки/витрати ≈ 2 грн. Жодних сторонніх скріншотів тут — вони збивають, це чисто концептуальний крок.",
    narration: "Чиста маржа – прибуток – 1-4%. Це те, що реально залишається власнику магазину після вирахування всіх витрат.",
    mode: "generated",
    startSec: 36.48,
  },
  {
    id: "taxesIntro",
    title: "Куди діваються гроші: 50–80% — податки",
    description: "Мінімум тексту: одна теза «50–80% податки», велике реальне фото будівлі уряду як generic символ податків (не претендує на джерело АТБ-даних).",
    narration: "Куди діваються гроші, виручені з продажу? Левова частина – це податки та збори. На них йде 50-80% від націнки.",
    mode: "media",
    startSec: 43.76,
    images: [MEDIA.taxOffice2],
  },
  {
    id: "taxesList",
    title: "Перелік податків → реальні цифри 2025",
    description: "Весь текст (перелік податків + «Інше» + обидві цифри 2025 року, податки червоним/прибуток зеленим) — у лівій колонці. Жодних скріншотів. Права колонка — велике фото tax-office, у рамці під його власну пропорцію (без обрізання навпіл).",
    narration: "Податок на прибуток, податки на зарплату, ПДВ, місцеві податки та акцизи. Наприклад, у 2025 році АТБ сплатило до бюджетів 38 мільярдів гривень, а чистий прибуток компанії склав лише 3,5 мільярда гривень.",
    mode: "media",
    startSec: 51.88,
    images: [MEDIA.taxOffice2],
  },
  {
    id: "opex",
    title: "Решта: операційні витрати мережі",
    description: "5 кадрів у рамках з підписами на паперових планшетках, перетаймовано пропорційно до слів у реченні (склад → каса → охорона → холодильники → списання).",
    narration: "Решта – покриття операційних витрат мережі, логістика та склади, зарплати касирам, охороні, логістам, менеджерам, комунальні послуги, списання, прострочені, зіпсовані, вкрадені продукти.",
    mode: "media",
    startSec: 66.58,
    images: [MEDIA.warehouse, MEDIA.cashier, MEDIA.securityGate, MEDIA.refrigeration, MEDIA.spoiledProduct],
  },
  {
    id: "conclusion",
    title: "Висновок: 2 грн, але мільйони банок",
    description: "Повний чек-калькуляція (постачальник → націнка → податки/опекс → чистий прибуток) + візуальне рівняння банка×об'єм=реальний прибуток АТБ 2025 — жодного відео, жодного абзацу тексту, що дублює голос.",
    narration: "У підсумку, чистий заробіток АТБ з того самого пакета сметани за 137 гривень становить усього 2 гривні. Ритейл заробляє не на величезній маржі з одного товару, а на колосальних обсягах і швидкості продажів.",
    mode: "generated",
    startSec: 78.64,
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

export const sellerMarginSchema = z.object({
  hook: z.number().int().min(0).describe("Гачок — всього 2% (0:00) — старт, кадр"),
  threeConcepts: z.number().int().min(0).describe("Три поняття (0:05) — старт, кадр"),
  markup: z.number().int().min(0).describe("Торгова націнка (0:10) — старт, кадр"),
  grossMargin: z.number().int().min(0).describe("Валова маржа (0:25) — старт, кадр"),
  netProfit: z.number().int().min(0).describe("Чиста маржа (0:36) — старт, кадр"),
  taxesIntro: z.number().int().min(0).describe("Куди діваються гроші (0:44) — старт, кадр"),
  taxesList: z.number().int().min(0).describe("Перелік податків + цифри 2025 (0:52) — старт, кадр"),
  opex: z.number().int().min(0).describe("Операційні витрати (1:07) — старт, кадр"),
  conclusion: z.number().int().min(0).describe("Висновок (1:19) — старт, кадр"),
});

export type SellerMarginProps = z.infer<typeof sellerMarginSchema>;

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

export const DEFAULT_STARTS: SellerMarginProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof SellerMarginProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as SellerMarginProps);
