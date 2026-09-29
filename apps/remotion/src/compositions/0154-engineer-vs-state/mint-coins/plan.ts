/**
 * "Інженер проти держави" — вставка «mint-coins»: НБУ не розкриває
 * собівартість карбування монет, але відомо, що 10-копійкова монета
 * коштує державі приблизно в 5 разів більше за свій номінал — і в цю
 * собівартість не входить робота політиків і чиновників, які підтримують
 * її обіг.
 *
 * assets/raw/mint-coins мав лише `speech.txt` і готове аудіо — жодних
 * власних фото/відео. За прямою вказівкою користувача фоном служить реальне
 * B-roll: "Клуб української нумізматики" — "Як карбують монети України. Всі
 * етапи виробництва" (youtube.com/watch?v=JwQEAty2qBU), відрізок 9:30–10:18
 * (48s, без звуку) — сам процес карбування монети, що біжить безперервно
 * під усю вставку, поки текст/графіка на екрані змінюються під мовлення.
 * Джерело завантаження й точний таймкод — у
 * assets/raw/mint-coins/numismatics-minting-process.request.txt.
 *
 * Текст/цифри (монета, чек-калькуляція) лишаються тими самими графічними
 * акцентами, що й у "generated"-версії (paper-style картки), лише
 * перефарбовані на світлий колір з тінню — щоб читались на живому відео,
 * а не на кремовому папері.
 *
 * Timings — з transcribe/*.srt (реальне аудіо), не з приблизних оцінок.
 */

import { z } from "zod";

export const FPS = 30;

export const AUDIO = "projects/mint-coins/speech.mp3";

/** Real duration 47.07s (ffprobe) — rounded up to avoid clipping the tail. */
export const AUDIO_DURATION_SEC = 48;

/** Background B-roll — muted, runs full-bleed for the whole insert. */
export const MEDIA = "projects/mint-coins/minting-process.mp4";

export const CREDIT = {
  channel: "Клуб української нумізматики",
  title: "Як карбують монети України. Всі етапи виробництва",
} as const;

export type PlanScene = {
  id: string;
  title: string;
  description: string;
  narration: string;
  startSec: number;
};

export const PLAN: PlanScene[] = [
  {
    id: "secrecy",
    title: "Таємниця собівартості",
    description: "Монета на паперовому канвасі, потім штамп «ТАЄМНИЦЯ» слемом лягає зверху.",
    narration: "Національний банк України ніколи не розголошує собівартість виготовлення монет та банкнот. Ця інформація є державною та комерційною таємницею Банкнотно-монетного двору.",
    startSec: 0,
  },
  {
    id: "facts",
    title: "Що відомо",
    description: "Два факти по черзі: монета номіналом 10 копійок і далі — її собівартість у 5 разів вища за номінал.",
    narration: "Проте відомо декілька речей. Перше: в 26-му році Нацбанк все ще карбує монети номіналом 10 копійок. Друге: ентузіасти порахували, що собівартість випуску такої монети в 5 разів перевищує номінал.",
    startSec: 14.82,
  },
  {
    id: "costBreakdown",
    title: "Що входить у собівартість",
    description: "Чек-калькуляція: матеріали і робота персоналу — враховано; робота політиків і чиновників — ні. Наприкінці риторичне питання.",
    narration: "У собівартість вкладають тільки базові потреби, такі як матеріали і робота виробничого персоналу. А от роботу політиків і чиновників, які забезпечують ліквідність цих коштів, не включають. А може варто було б порахувати і це?",
    startSec: 31.06,
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

export const mintCoinsSchema = z.object({
  secrecy: z.number().int().min(0).describe("Таємниця собівартості (0:00) — старт, кадр"),
  facts: z.number().int().min(0).describe("Що відомо (0:15) — старт, кадр"),
  costBreakdown: z.number().int().min(0).describe("Що входить у собівартість (0:31) — старт, кадр"),
});

export type MintCoinsProps = z.infer<typeof mintCoinsSchema>;

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

export const DEFAULT_STARTS: MintCoinsProps = PLAN.reduce((acc, s) => {
  acc[s.id as keyof MintCoinsProps] = Math.round(s.startSec * FPS);
  return acc;
}, {} as MintCoinsProps);
