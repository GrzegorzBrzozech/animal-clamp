---
description: >
  Build a Remotion composition from an assets/raw/<segment> folder.
  Reads montage.yaml (image timings), speech.txt (narration), copies images
  to public/projects/<id>/, creates plan.ts + config.ts + scenes + index.tsx,
  registers in Root.tsx. Pass the segment folder path as argument.
---

Build a Remotion composition for a video insert segment.

## Argument

The segment folder path. Examples:
```
/animate-segment assets/raw/01-51_passport-ww1-temporary
/animate-segment /full/absolute/path/to/assets/raw/01-99_some-segment
```

Resolve relative paths against the clamp-videos repo root:
`/Users/gtrofymov/git/clampers/clamp-videos/videos/in progress/0148. 🐺 Держава-хижак/`

## Step 1 — Read source materials

From the segment folder, read:
- **`montage.yaml`** — `parent_timecode`, `duration_sec`, `insertions[]` (each has `time` and `items[]` with `type`, `file`, `what`)
- **`speech.txt`** — narration sentences (one per line)
- **images** — `*.jpg` / `*.png` / `*.webp` listed in `insertions[].items[].file`

## Step 2 — Derive composition ID

From the folder name (e.g. `01-51_passport-ww1-temporary`):
- Strip leading `NN-NN_` timecode prefix
- Convert `kebab-case` to `PascalCase` for the component name (e.g. `PassportWw1Temporary`)
- Use `kebab-case` for the folder under `src/compositions/` (e.g. `passport-ww1-temporary`)
- Use the same `kebab-case` as the public folder key (e.g. `projects/passport-ww1-temporary/`)

## Step 3 — Transcription (if audio exists)

**Check for audio** in the segment folder: `speech.mp3`, `speech.m4a`, `speech.wav`.
If found:
```bash
cd /Users/gtrofymov/git/clampers/clamp-videos
./tools/transcribe/transcribe.sh "<segment-folder>/speech.mp3" uk large
```
Output goes to `<video-folder>/transcribe/` as `<name>.srt`. Read the SRT to get precise `startSec` values per sentence.

If **no audio** found → use montage.yaml `insertions[].time` as scene boundaries (convert `MM:SS` → seconds). Add a `TODO` comment in `plan.ts` to update after VO is recorded.

## Step 4 — Map scenes

Each image insertion in montage.yaml → one scene. For each:
- `id`: derived from the `time` + item `what` (e.g. `league1920`, `prewar`)
- `startSec`: from montage.yaml `time` field
- `images`: the `file` values from `items[]`
- `narration`: sentence(s) from speech.txt that match this time window
- `date`: extract from the `what` description if a year is mentioned (use as PhotoPin `date` prop)

## Step 5 — Create composition files

Target dir: `apps/remotion/src/compositions/<kebab-id>/`

### `plan.ts`
Export:
- `FPS = 30`
- `AUDIO_DURATION_SEC` = `duration_sec` from montage.yaml
- `AUDIO = "projects/<kebab-id>/speech.mp3"` (comment out if no audio)
- `PLAN: PlanScene[]` — one entry per image insertion
- `TIMED_PLAN` — derived from PLAN
- Zod schema (`<ComponentName>Schema`) with one `z.number().int().min(0)` per scene
- `DEFAULT_STARTS` — from PLAN startSec values
- `timedFromFrames` — same pattern as `oppenheimer/plan.ts`

### `config.ts`
```typescript
import { FPS, AUDIO_DURATION_SEC } from "./plan";
export const <camelId>Config = {
  id: "<ComponentName>",
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: Math.round(AUDIO_DURATION_SEC * FPS),
} as const;
```

### `paper.ts`
```typescript
export { paperPalette, colors, fontSizes, fontWeights, spacing, radii, fontFamilies } from "../oppenheimer/paper";
```

### `index.tsx`
Same structure as `oppenheimer/index.tsx`:
- Import `Audio`, `staticFile` only when audio exists
- Use `timedFromFrames`, `ScenePlaceholder`, `PaletteProvider`
- `SCENE_COMPONENTS` map
- `SceneBadge` for studio mode

### `scenes/<SceneId>Scene.tsx` — one per image insertion

**Scene layout pattern** (use for all historical-document segments):
- `<PaperBackground />`
- `<PhotoPin>` for each image — positioned left half (~110px from left, ~80px top, width ~540-580px)
  - `caption`: from montage.yaml `items[].what` (abbreviated)
  - `date`: from the what description
  - `rotate`: alternate ±2-3°, `hold="tape"` or `"pin"`
- Narration text — right half (left: ~780-820px)
  - Title line with `<AnimatedText size={fontSizes.heading}>` highlighting key concept in `colors.primary`
  - Body paragraph with the narration sentence(s)
  - Optional: small animated infographic (timeline, era comparison, quote stamp)
- Accent vertical bar between photo and text

**Visual elements to add per scene type**:
- "Before/After" era: two cards with `spring()` pop-in
- Quote/law: red stamp overlay (rotated, semi-transparent)
- Timeline: dot-line with year markers
- Text quote: vertical accent bar + large `"` glyph

## Step 6 — Copy images to public

```bash
mkdir -p apps/remotion/public/projects/<kebab-id>
cp "<segment-folder>/"*.jpg apps/remotion/public/projects/<kebab-id>/
cp "<segment-folder>/"*.png apps/remotion/public/projects/<kebab-id>/ 2>/dev/null || true
```

## Step 7 — Register in Root.tsx

In `apps/remotion/src/Root.tsx`, add after the last `import`:
```typescript
import { <ComponentName> } from "./compositions/<kebab-id>";
import { <camelId>Config } from "./compositions/<kebab-id>/config";
import { <ComponentName>Schema, DEFAULT_STARTS as <UPPER_ID>_STARTS } from "./compositions/<kebab-id>/plan";
```

Inside `RemotionRoot` JSX, add a `<Composition>` before the `euRegulations` one.

## Step 8 — Type-check

```bash
cd apps/remotion && npm run lint
```

Fix any TypeScript errors (unused variables, incompatible color types — use explicit `string` type for color props).

## Step 9 — Retrospective (run after every session)

After finishing, update this command file with:
- What worked well (reusable patterns to keep)
- What was inconvenient (steps that needed manual fixing)
- Any new scene component patterns discovered

---

## Retrospective — session 2026-07-12

**Зручно:**
- `PhotoPin` — ідеальний компонент для historical documents: тейп, дата, підпис, Ken Burns "з коробки"
- Структура `oppenheimer/` — шаблон готовий, достатньо скопіювати і адаптувати `paper.ts` re-export
- `PaletteProvider` + `paperPalette` — один рядок, вся палітра підхоплюється автоматично
- `ScenePlaceholder` fallback — дозволяє зареєструвати сцену без JSX, вона видно на timeline

**Незручно / потребує поліпшень:**
- **Немає аудіо → сцени без таймінгу.** Workflow: montage.yaml дає приблизні точки зміни зображень, але точний sync тільки після запису VO. Треба передбачити: або записати VO до побудови анімації, або зробити easy-update коли SRT з'явиться.
- **`this.srt` з відредагованого відео** — якщо витягувати аудіо з готового `this.mp4`, там буде змішаний трек (музика + VO + SFX). Whisper впорається, але тайминг буде менш точний. Ліпше: окремий клін VO файл.
- **TypeScript strict literals** — `color: colors.danger` інферується як `"#BC5147"`, а не `string`. Треба завжди визначати тип параметра явно: `color: string`.
- **Unused `useVideoConfig()`** — якщо не використовуєш fps/width/height — не імпортуй.
- **Пошук аудіо** — C0380 виявився іншим сегментом. Правило: перевірити duration та тип контенту транскрипцією першого сегмента перш ніж брати файл.
- **`transcribe.sh` і output dir** — output йде у `<video-folder>/transcribe/`, не в сегмент. Треба вказувати в плані де шукати сирі файли.

---

## Retrospective — session 2026-07-12 (Homo Erectus / puppet animation)

**Зручно:**
- **`PuppetActor` + custom action inline** — `dig` action можна визначити прямо в `caveman-model.ts` (або inline), не потребує зміни рендерера.
- **`style` prop на SVG** — `PuppetActor` передає `style` прямо на `<svg>`, тому `position: absolute` + `left/top/width/height` чудово позиціонує персонажа на 1920×1080 канвасі.
- **Розрахунок позиції**: viewBox `-200 -40 400 560` → root at y≈276, head at y≈61, feet at y≈388 — ці offsets стабільні, корисно зберегти в коментарі.
- **`Hatch` + `Sketch`** з `_pencil.tsx` — дозволяють малювати небо, землю, воду, горби одним паттерном без готових assets.
- **`Seagull` як shared character** в `~/characters/svg/` — правильно за CLAUDE.md; крила анімовані через `Math.sin`.
- **Transparent transcribe output** — `transcribe.sh` сам знайшов правильний `<video-folder>/transcribe/` output dir.

**Незручно / потребує поліпшень:**
- **`git stash` не зберігає untracked** — stash зберігає тільки tracked зміни; нові файли (Seagull.tsx, homo-erectus/) залишились і lint показав хибні результати. Завжди перевіряй lint після stash pop.
- **Кути кісток PuppetActor — черна скринька** без запуску Studio. Кути треба перевіряти у Rigger (localhost:5173) або Remotion Studio (localhost:39573) — в коді вони виглядають логічно, але візуальний результат треба перевіряти наживо.
- **`unused import` помилки** — TypeScript strict видасть помилку на `interpolate` якщо не використати. Чисти imports одразу після написання сцени.
- **Назва папки "XXXX."** — папка без нумерованого префіксу; треба явно вказати kebab-case id у промпті або задати вручну.

---

## Retrospective — session 2026-07-13 (Predatory Bacteria Biology)

**Зручно:**
- **Стілл-перевірка кожної сцени** — `npm run still -- <Comp> f_N.png --frame=N` (по одному кадру в центр кожної сцени) і `Read` PNG. Швидко ловить перекриття/обрізку тексту без запуску Studio. Найцінніший крок для layout-сцен.
- **Новий shared `DoublingBadge`** (`~/components`) — годинник ⏱ + великий час поділу + підпис. Переюзабельний для будь-якого мікробіо/growth-rate пояснення; кладеться в спільну бібліотеку за CLAUDE.md.
- **5 сцен на 3 зображення** — наратив був багатший за montage (додав autotrophs-інфографіку без фото + ranking-payoff). Не обмежуватись «1 сцена = 1 зображення»: слухати структуру speech.txt/SRT.
- **`IMG` const-map у plan.ts** — усі шляхи до зображень в одному об'єкті, сцени тягнуть `IMG.foo`. Уникає одруків шляхів і дублювання.
- **Кольорове кодування стратегій** — success=сміттярі, danger=хижаки, secondary=автотрофи; наскрізь через усі сцени + фінальний рейтинг. Робить payoff зрозумілим миттєво.

**Незручно / потребує поліпшень:**
- **montage.yaml `file:` бреше** — вказані `00-18_bdellovibrio-cryotomogram.jpg`, а на диску `00-12_bdellovibrio-bacteriovorus-cryotomogram.jpg`. Правило: ЗАВЖДИ `ls` папку сегмента і брати фактичні імена, не `file:` з montage. Бонусні файли (GIF, extra jpg) montage теж не згадує.
- **montage `duration_sec` бреше** — стояло 45, реальне аудіо 56.7s (`ffprobe`). Завжди ffprobe speech.mp3, не довіряй montage.
- **`transcribe.sh` output → `videos/in progress/transcribe/speech.srt`** (спільна папка рівня «in progress»), НЕ в сегмент і не в `<video>/transcribe/`. Там уже лежав чужий `этап 1.srt`. Найнадійніше — читати тайминги прямо з verbose-stdout `transcribe.sh` (він друкує `[hh:mm.sss --> ...]` рядки), а не шукати файл.
- **PhotoPin inset перекриває caption головного фото** — при двох фото в одній колонці inset накриває нижній підпис. Або опускай inset нижче bottom головного пін (top130+h430 → bottom≈634), або скорочуй caption до одного слова.
