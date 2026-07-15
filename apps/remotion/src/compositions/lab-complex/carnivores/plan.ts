/**
 * "Carnivores" — the VIDEO PLAN and single source of truth.
 *
 * One entry per scene, ordered by `startSec` (the moment in the voiceover where
 * the scene begins). The composition (index.tsx) reads this list, lays the
 * scenes on the timeline under the audio, and:
 *   - renders the real scene component if one is registered for `id`;
 *   - otherwise falls back to <ScenePlaceholder>, which just displays this
 *     entry's text (title/description/narration). So an un-built beat still
 *     shows what it should contain — edit the plan, the video updates.
 *
 * Timings come from transcription/carnivors.srt. End of each scene = start of
 * the next; the last ends at AUDIO_DURATION_SEC.
 */

import { z } from "zod";

export const FPS = 30;

/** Audio track, relative to public/. */
export const AUDIO = "projects/carnivores/carnivors.m4a";

/** Full audio length (s). Slightly ≥ the last word so it isn't clipped. */
export const AUDIO_DURATION_SEC = 383;

export type SceneMode = "animation" | "talkinghead" | "hybrid";

export type PlanScene = {
  /** Stable id; also the key used to look up the scene component. */
  id: string;
  /** Short human label. */
  title: string;
  /** What the scene should show (key numbers/objects). Shown by the placeholder. */
  description: string;
  /** The voiceover this beat covers (from the transcript). */
  narration: string;
  mode: SceneMode;
  /** When this scene starts, in seconds into the audio. */
  startSec: number;
};

export const PLAN: PlanScene[] = [
  {
    id: "hook",
    title: "Гачок: коли з'явилося зло?",
    description: "Діалог-гачок. Великі числа 3,5 млрд / 4 млрд / 0,5 млрд. Доповідач у кутку.",
    narration:
      "Коли на Землі з'явилося зло? 3,5 мільярди років назад. А добро? 4 мільярди. То півмільярди років на Землі був Едемський сад? Що тоді сталося?",
    mode: "hybrid",
    startSec: 0,
  },
  {
    id: "firstLife",
    title: "Перше життя = добро",
    description:
      "Таймлайн стартує на 4 млрд. Перша клітина. Фотон ☀ летить у фотосинтезуючу клітину → вона світлішає. Підпис «добро = користь живому».",
    narration:
      "4 мільярди років назад виникло перше життя. Добро можна вчинити тільки до живих істот. Визначимо добро як причинення користі живому організму. Фотон, що потрапляє на фотосинтезуючий організм, приносить йому добро.",
    mode: "animation",
    startSec: 15.58,
  },
  {
    id: "symbiosis",
    title: "Симбіоз / синтрофія",
    description:
      "Дві бактерії. Стрілка «їжа» зліва-направо, «відходи» справа-наліво. Обидві пульсують у такт — взаємна користь (зелений).",
    narration:
      "Джерелом добра теж має бути жива істота. Візьмемо симбіоз. Первинно це синтрофія: продукти життєдіяльності однієї бактерії споживає інша. Перша продукує їжу для другої, друга рятує першу від шкідливих відходів.",
    mode: "animation",
    startSec: 43.56,
  },
  {
    id: "goodTimeline",
    title: "Таймлайн добра",
    description: "Таймлайн: 4,0 млрд (життя), 3,7 млрд (симбіоз = добро), зелена зона миру 200 млн років.",
    narration:
      "Симбіоз з'являється на 300 мільйонів років пізніше за життя. Але лишається 200 мільйонів років миру і злагоди. 4 мільярди існує життя, 3,7 — симбіоз, або, на хлопський розум, добро.",
    mode: "animation",
    startSec: 87.38,
  },
  {
    id: "predationAppears",
    title: "З'являється хижацтво",
    description: "Таймлайн: маркер 3,5 млрд спалахує ЧЕРВОНИМ. Одна бактерія кидається на іншу й поглинає її.",
    narration:
      "А що ж за зло з'явилося 3,5 мільярди років назад? Хижацтво — перше зло. Момент, коли одні організми вигадують, як позбавляти інших життя заради власної вигоди. Поки один переробляє сполуки чи ловить фотони, інший відбирає ці ресурси.",
    mode: "animation",
    startSec: 113.72,
  },
  {
    id: "whyPredation",
    title: "Чому хижацтво вигідне",
    description: "Формула «ВИГОДА = НАДБАННЯ − ЗУСИЛЛЯ» збирається на екрані. Доповідач у кутку.",
    narration:
      "Чому виникає і закріплюється хижацтво? Бо воно може бути вигідним. Вигода — це розмір надбання мінус зусилля на здобування. Якщо полювання не вимагає великих зусиль, а винагорода значна — природа створила умови для такої ситуації.",
    mode: "hybrid",
    startSec: 146.14,
  },
  {
    id: "divisionRates",
    title: "Швидкість поділу",
    description:
      "Зліва хижак (червоний): «20 хв», стрімко множиться. Справа мирна (синя): «8–24 год», повільно. Будівельник робить сам, хижак — готове.",
    narration:
      "Хижа кишкова паличка ділиться кожні 20 хвилин. А мирна автотрофна ціанобактерія витрачає на поділ від 8 до 24 годин. Бо мирний будівельник робить усе сам, а хижак отримує готове.",
    mode: "animation",
    startSec: 169.04,
  },
  {
    id: "deerExample",
    title: "Олень і пітекантроп",
    description: "Порівняння життя пітекантропів хижаків і веганів. " +
      "Згори - глобальний таймер, що показує як змінюються часи." +
      "Нижче - спліт-екран: зліва хижаки, праворуч - вегани" +
      "Хижаки валять деякий час бігають за оленем, потім валять його. З оленя випадає багатор їжі. Решту часи хижаки відпочивають." +
      "Вегани: вегани безперервно бігають і шукають корінці." +
      "Для кожної групи покажчик калорій: Для одної особи в груп потрібно 3000 ккал , якщо особа рухається і 1500, якщо відпочиває. З оленя приходить 400 000 ккал." +
      "З кожної зібраної рослинки - 100 ккал, при цьому сімʼя рухається так. Щоб зібрати добову норму, після чого переходить в режим відпочинку. Кількість калорій може йти в мінус, але до певної межі, до -30000",
    narration:
      "Якщо, розколупавши оленя, родина пітекантропа може жити три місяці без голоду й втоми — створюється значний стимул полювати, а не шукати малопоживні корінці й рідкісні ягоди.",
    mode: "animation",
    startSec: 188.26,
  },
  {
    id: "persistence",
    title: "Мирні не зникають (БЕАТ БЕЗ СЦЕНИ)",
    description:
      "Поки не реалізовано. Має показати: попри появу хижацтва мирний спосіб і симбіоз не зникають; ба більше — хижаки з часом трансформуються в мирняків. Місток до наступної сцени.",
    narration:
      "Попри виникнення хижого способу життя, мирний спосіб не зникає, не зникає й симбіоз. Ба більше, ми спостерігаємо трансформацію хижаків у мирняків із часом.",
    mode: "animation",
    startSec: 203.88,
  },
  {
    id: "predationChase",
    title: "Нові види — як хижаки (4 пари накопичуються)",
    description:
      "Блок: 4 пари вмикаються по черзі (за словами) і ЛИШАЮТЬСЯ на екрані, аж поки блок не завершиться. Внутрішні тайминги пар — у LANES всередині PredationChaseScene.tsx (atSec). Пари: еукаріот→прокаріот, багатоклітинний→одноклітинний, земноводне→риба+безхребетне, ссавець→комаха.",
    narration:
      "Більшість принципово нових видів формуються як хижаки на вже існуючих. Еукаріоти полюють на прокаріот, багатоклітинні — на одноклітинні. Перші земноводні хапають риб і безхребетних. Плазуни і ссавці починають як мисливці на комах.",
    mode: "animation",
    startSec: 217.02,
  },
  {
    id: "peacefulTurn",
    title: "Хижаки стають мирними",
    description: "Хижаки зеленіють, спускаються до трави й пасуться; один вигрівається під сонцем (фотосинтез через симбіоз).",
    narration:
      "З часом перші мисливці породжують поміркованіших нащадків, які починають харчуватися рослинами. А деякі можуть навіть отримувати енергію з сонця — не напряму, а через симбіоз із водоростями.",
    mode: "animation",
    startSec: 236.76,
  },
  {
    id: "frequencyPayoff",
    title: "Вигода залежить від частки хижаків",
    description:
      "Графік: X — частка хижаків, Y — вигода. Спадна крива. Маркер їде вправо; зона прибутку (зелена) → збиток (червоний) під нулем; популяція вимирає.",
    narration:
      "Чому ж усе не вимирає з появою хижацтва, або всі не стають хижаками? Прибутковість хижацтва — величина не постійна. Вигода залежить від того, який відсоток популяції вже обрав цю стратегію. Коли хижих мало — вигода величезна. Коли хижацтво домінує — конкуренція зростає, час на пошук жертви збільшується, енергія йде в мінус. Стратегія стає збитковою, і популяція хижаків вимирає від голоду.",
    mode: "animation",
    startSec: 258.0,
  },
  {
    id: "preyDefenses",
    title: "Захист жертв",
    description: "Чотири картки: ☠ отрута, 🛡 панцир, 🎭 мімікрія, 💨 швидкість — вистрибують по черзі.",
    narration:
      "Замість розмноження жертви можуть інвестувати у самозахист: виробляти отруту, нарощувати панцир, розвивати мімікрію або просто дуже швидко бігати.",
    mode: "animation",
    startSec: 300.02,
  },
  {
    id: "bioenergetics",
    title: "Закон біоенергетики",
    description: "Енергетичні терези: приплив (калорії від жертви) vs відплив (зусилля). Зелений надлишок. Доповідач у кутку.",
    narration:
      "Діє жорсткий закон біоенергетики: якщо швидкість втрати енергії перевищить швидкість накопичення, організм гине. Хижацтво закріплюється, бо калорії від жертви значно перевищують витрати на полювання. Цей надлишок гарантує виживання, тому еволюція знов і знов створює хижаків.",
    mode: "hybrid",
    startSec: 312.28,
  },
  {
    id: "humans",
    title: "А люди?",
    description: "Доповідач на весь екран. Перехід «бактерія → людина». Людина vs курка/корова; потім людина vs людина.",
    narration:
      "Чи можна ці принципи застосувати до людей? Звісно. Люди підпорядковуються тим самим законам. Термодинаміка не перестає діяти, бо ми винайшли мораль. І це не лише людина проти курки чи корови — всередині роду людського відбувається все те саме. Усі були мирними в Едемі, але потроху з'явилися ті, хто буквально об'їдав родичів.",
    mode: "talkinghead",
    startSec: 343.38,
  },
  {
    id: "cliffhanger",
    title: "Клифхенгер",
    description: "Фінальна картка. «Далі буде…» + назва каналу.",
    narration: "Але про це вже в наступному відео.",
    mode: "talkinghead",
    startSec: 379.16,
  },
];

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
// Each scene's startSec is exposed as an editable number in the Studio "Props"
// panel (a Zod schema → form controls). Drag/type → preview updates live; the
// "Save" button writes the values back into Root.tsx's defaultProps.
/** Total composition length in frames (= audio length). */
export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS);

// Each scene's start, editable in Studio's Props panel — in FRAMES (whole
// numbers; 30 = 1 s). Written out explicitly (not generated) so Studio's "Save"
// can statically parse the schema and rewrite Root.tsx. Labels show the default
// clock time for orientation.
export const carnivoresSchema = z.object({
  hook: z.number().int().min(0).describe("Гачок (0:00) — старт, кадр"),
  firstLife: z.number().int().min(0).describe("Перше життя = добро (0:16) — старт, кадр"),
  symbiosis: z.number().int().min(0).describe("Симбіоз / синтрофія (0:44) — старт, кадр"),
  goodTimeline: z.number().int().min(0).describe("Таймлайн добра (1:27) — старт, кадр"),
  predationAppears: z.number().int().min(0).describe("З'являється хижацтво (1:54) — старт, кадр"),
  whyPredation: z.number().int().min(0).describe("Чому хижацтво вигідне (2:26) — старт, кадр"),
  divisionRates: z.number().int().min(0).describe("Швидкість поділу (2:49) — старт, кадр"),
  deerExample: z.number().int().min(0).describe("Олень і пітекантроп (3:08) — старт, кадр"),
  persistence: z.number().int().min(0).describe("Мирні не зникають (3:24) — старт, кадр"),
  predationChase: z.number().int().min(0).describe("Нові види — хижаки (3:37) — старт, кадр"),
  peacefulTurn: z.number().int().min(0).describe("Хижаки стають мирними (3:57) — старт, кадр"),
  frequencyPayoff: z.number().int().min(0).describe("Вигода vs частка хижаків (4:18) — старт, кадр"),
  preyDefenses: z.number().int().min(0).describe("Захист жертв (5:00) — старт, кадр"),
  bioenergetics: z.number().int().min(0).describe("Закон біоенергетики (5:12) — старт, кадр"),
  humans: z.number().int().min(0).describe("А люди? (5:43) — старт, кадр"),
  cliffhanger: z.number().int().min(0).describe("Клифхенгер (6:19) — старт, кадр"),
});

export type CarnivoresProps = z.infer<typeof carnivoresSchema>;

/** Recompute the timeline from a set of (possibly Studio-edited) start FRAMES. */
export function timedFromFrames(starts: Record<string, number>) {
  const ordered = PLAN.map((s) => ({ ...s, fromFrame: starts[s.id] ?? Math.round(s.startSec * FPS) })).sort((a, b) => a.fromFrame - b.fromFrame);
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
