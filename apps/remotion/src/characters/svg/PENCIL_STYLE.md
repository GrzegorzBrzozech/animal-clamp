# Pencil-on-paper character style

The shared look for our drawn characters: **bold graphite outlines (drawn over
a few times), faceted (angular) forms, tone built from pencil HATCHING — not
solid fill — on warm paper.** Colour is **optional**: pure graphite by default,
a coloured-pencil hatch only when a scene needs to mark something (e.g. red
predators vs blue vegans). Inspired by the hand-drawn macket (`_art/characters`).
Everything is code-drawn SVG, deterministic and frame-driven — no images, no
randomness, no `useState`.

> One style, one system. Every new creature reuses `_pencil.tsx`. Don't invent a
> per-character look — extend the shared one so the whole cast stays coherent.

---

## 1. The visual rules

1. **Paper, not screen.** Background is warm cream (`PAPER` `#EDE7D6`) with faint
   fibre + speckle grain (`<PaperBackground/>`). Characters are meant to sit on it.
2. **Graphite ink, not black.** Outlines use `INK` `#3A352E`. Pure black reads as
   vector; graphite reads as pencil.
3. **Angular / faceted forms.** This is the defining trait. Build bodies from
   **straight-edged polygons** (flat planes, sharp-ish corners), NOT smooth
   ellipses. The macket is geometric: a deer is wedges + sticks, a rat is a
   hunched polygon, a caveman is blocks. _Exception:_ the amoeba is intentionally
   round/wavy (amoebas are blobby).
4. **Triple pencil stroke.** Every outline is drawn three times with different
   wobbles + tiny offsets → it reads as edges "наведені кілька разів". This is
   what `<Sketch/>` does for you; never hand-roll it.
5. **Tone = hatching, not fill.** Shade with `<Hatch/>` (parallel pencil
   strokes clipped to a shape). Light tone = wider `gap`; dark zones (shadows,
   fur, spots) = smaller `gap` + `cross` (cross-hatch) for volume. Leave
   highlights (bellies, skin, eye whites, nucleus) as bare paper. There is **no
   automatic ambient-occlusion** — you place the shadow polygons by hand (one
   darker patch on the underside/one flank is usually enough).
6. **Cute, round eyes.** Forms are angular but eyes stay round with a small paper
   highlight — that's where the "симпатичність" comes from. Heavy brows / frowns
   add character (caveman) without losing charm.
7. **Colour is optional.** Default hatch colour is graphite (`INK`). Pass a
   `color` to a character → the hatch becomes that coloured pencil (outline stays
   graphite). Use it sparingly to mark meaning: `color="#C0584E"` predators,
   `color="#3E6E9E"` vegans, `PASTEL.*` for soft tints.
8. **Occlude overlaps — draw parts back-to-front with `<Part>`.** A creature is
   many overlapping shapes (head over neck over torso, arm over body). If you draw
   each shape's full outline, the parts you can't see still draw their lines and
   the result is an illegible tangle. Instead each part first knocks out (opaque
   paper) what's behind it, THEN draws its tone + outline. Order parts from
   farthest to nearest. `<Part>` does this for you; never stack bare `<Sketch>`
   outlines for overlapping pieces.
7. **Hand-drawn wobble is stable, not boiling.** The roughen filters use a fixed
   `seed`, so lines don't shimmer frame to frame. Motion comes from transforms
   (breathe, blink, walk, leap), not from re-randomising the line.

---

## 2. The shared system — `_pencil.tsx`

| Export             | What it is                                                                 |
| ------------------ | ------------------------------------------------------------------------- |
| `INK`, `INK_SOFT`  | graphite stroke colour (`#3A352E`)                                         |
| `PAPER`,`PAPER_DARK`| paper tones (highlights, vacuoles)                                        |
| `PASTEL`           | `{ green, pink, blue, yellow, brown, gray }` muted accents                 |
| `PaperBackground`  | full-frame warm paper sheet + grain — drop behind a scene                 |
| `PencilDefs`       | the SVG filter defs; render **once per `<svg>`** (`scale` = wobble amount) |
| `Sketch`           | triple-stroked outline (3 wobble passes + slight offsets)                  |
| `Hatch`            | tonal fill: pencil strokes clipped to a shape (`gap`, `cross`, `color`)    |
| `Part`             | **occluding** body part: paper knockout → hatch → outline (use back-to-front) |

`<Sketch stroke={INK} width={4.5}>` takes plain SVG shapes (`<polygon>`,
`<path>`, `<circle>`, `<line>`) and renders the three-pass pencil outline (pass a
`fill` only for solid bits like eye pupils). `<Hatch gap={7} color={INK} cross>`
takes the shape(s) to shade as children (used as a clip mask); render the SAME
shape in a `Sketch` afterwards for the outline. Punch a paper highlight (eye
white, nucleus) by drawing a `PAPER`-filled shape over the hatch before the
outline. Both clone children, so children must accept a `fill` override.

---

## 3. Authoring a new character (recipe)

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { type CreatureProps } from "./types";
import { INK, PAPER, PencilDefs, Part, Hatch } from "./_pencil";

const VB_W = 160; // pick a viewBox that frames the art
const VB_H = 130;

export const ThingPencil: React.FC<CreatureProps & { color?: string }> = ({
  x, y, size, facing = 1, phase = 0, hurt = false, moving = false, color,
}) => {
  const frame = useCurrentFrame();
  const t = hurt ? phase : frame * (moving ? 0.3 : 0.12) + phase; // freeze when hurt
  const tone = hurt ? "#9AA0A6" : (color ?? INK); // graphite by default
  const width = size * (VB_W / VB_H);
  const body = "… FACETED outline, straight segments …";

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: size,
                  transform: `translate(-50%, -50%) scaleX(${facing})` }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        <PencilDefs scale={3.4} />
        {/* BACK-TO-FRONT: legs/tail first … then the body occludes their seams */}
        <Part width={4.5}><polygon points="… leg behind …" /></Part>
        {/* body: occluding paper knockout + light hatch + outline, in one Part */}
        <Part width={4.5} hatch={{ gap: 7, color: tone }}><polygon points={body} /></Part>
        {/* extra shadow zone for volume (interior, over the body) */}
        <Hatch gap={4} cross color={tone} opacity={0.65}><polygon points="… underside …" /></Hatch>
        {/* head/eyes LAST so they occlude the body edge; round eyes = paper + INK pupil */}
        <Part width={4.5}><circle cx={…} cy={…} r={…} /></Part>
      </svg>
    </div>
  );
};
```

**Conventions**

- **Anchor:** centre creatures with `translate(-50%, -50%)` at `(x, y)`. Anchor
  ground-standing characters (deer, human) at the **feet** with
  `translate(-50%, -100%)` and `transformOrigin: "bottom center"`.
- **Props:** honour `CreatureProps` (`x, y, size, facing, hurt, phase, moving`)
  so a character is drop-in anywhere. Add optional `color` (omit → graphite).
- **`hurt`:** hatch turns drained grey (`#9AA0A6`), eyes become an ✖, motion
  freezes (drive `t` from `phase`, not `frame`).
- **`facing`:** flip with `scaleX(${facing})` on the wrapper.
- **`PencilDefs scale`:** ~3–3.4 (rough, "drawn-over" edges). Lower = crisper
  corners for tiny detail.
- **Stroke width:** ~4.5 at character scale; thinner (≈3) for tails, whiskers,
  worm segments.
- Register the new component in `src/characters/index.ts` and add it to
  `PENCIL_CHARACTERS`.

**Versioning (uniform for every character).** Each character lives in a folder
`svg/<name>-pencil/` with one file per attempt: `v1.tsx`, `v2.tsx`, … exporting
`<Name>V1`, `<Name>V2`, …. `index.ts` exposes a `<NAME>_VERSIONS` registry +
`<Name>Latest`; the flat `<Name>Pencil.tsx` just re-exports `<Name>Latest`. NEVER
overwrite an old version — add a new `vN.tsx` and (when chosen) repoint
`<Name>Latest`. Labels are plain `v1/v2/v3`. Folder name uses a hyphen
(`frog-pencil`, not `FrogPencil`) to avoid a case-collision with the re-export
file on macOS.

---

## 4. Animation vocabulary — what a character should do

Every character is frame-driven from `useCurrentFrame()`. Aim to support this
shared "acting" set so scenes can direct any creature the same way:

| Action        | How it's expressed                                                        | Props/driver        |
| ------------- | ------------------------------------------------------------------------- | ------------------- |
| **idle**      | gentle breathe (`1 + sin(t)*0.03` body scaleY) + occasional blink         | default             |
| **blink**     | squash eyes (`scaleY ~0.12`) for a few frames every ~3 s                  | default             |
| **move**      | faster cycle + locomotion (legs scuttle, tail sway, wings flap)           | `moving`            |
| **facing**    | mirror horizontally                                                        | `facing: 1 \| -1`   |
| **hurt/victim** | ✖ eyes, drained colour, droop, frozen                                   | `hurt`              |
| **enter**     | pop-in scale (handled by the scene, e.g. spring/back ease)                | scene-level         |
| **leap/attack** | translate toward target + a small lunge spring                          | scene-level         |
| **phase**     | offset so a crowd doesn't move in lockstep                                | `phase`             |

Scene-level beats (enter, leap, glow on hit) live in components like
`PredationPair`; the character only needs to expose `hurt`/`moving`/`facing`.
Special, character-specific extras are fine (frog blink, amoeba morph, deer
`state="down"`, human spear) — keep them deterministic.

---

## 5. Built so far (macket set + prey)

| Component        | Macket role            | View / notes                                  |
| ---------------- | ---------------------- | --------------------------------------------- |
| `FrogPencil`     | Жаба                   | sits, breathes, blinks; hatched body + spots  |
| `RatPencil`      | Щур (предок)           | side view, scuttles, curling tail             |
| `DeerPencil`     | Олень                  | feet-anchored, antlers; `state` stand/down    |
| `HominidPencil`  | Первісна людина        | front view, blocky head, spear, hatched cloth |
| `AmoebaPencil`   | Амеба                  | morphing blob + nucleus (the round exception) |
| `FishPencil`     | (prey) риба            | faceted, tail sways                            |
| `WormPencil`     | (prey) безхребетне     | segmented, undulates                           |
| `ButterflyPencil`| (prey) комаха          | faceted wings flap                            |

All are pure graphite by default; pass `color` for a coloured-pencil hatch.

Preview: **CharacterLab** composition → `PencilGallery` (macket layout).
Motion demo: **PredationPencil** composition (predators meet prey on paper).

The original flat-vector characters (`Frog`, `Rat`, `Deer`, `Hominid`, …) are kept
alongside — nothing was deleted.

---

## 6. Prompt for an AI to generate matching characters

### 6a. Reference art (image model)

> Hand-drawn character of a **{animal}**, bold dark graphite pencil outline on
> warm cream paper, **edges drawn over several times** (sketchy, slightly uneven).
> **Angular, faceted, geometric** construction — flat straight-edged planes, not
> smooth curves. Simple, friendly, slightly cartoonish; **big round eyes** with a
> tiny highlight. Tone is **pencil hatching / cross-hatching** (parallel strokes),
> NOT flat fill — darker hatch in the shadow zones for volume, bare paper for
> highlights. Mostly graphite; soft coloured-pencil hatch only if a colour
> matters. Light paper grain. Plain background. Full body, model-sheet style.

### 6b. Code component (LLM)

> Write a Remotion React SVG component `XxxPencil` for our pencil-on-paper style.
> Import `INK, PAPER, PencilDefs, Part, Hatch` from `./_pencil`. Accept
> `CreatureProps & { color? }`; `tone = hurt ? "#9AA0A6" : (color ?? INK)` so it's
> graphite by default. Build each body piece from **faceted `<polygon>`s** (straight
> segments, sharp corners — angular, NOT ellipses) and draw them as `<Part>`s
> **back-to-front** (legs/tail → body → head/eyes) so each occludes the seams
> behind it — never stack bare outlines for overlapping pieces. Shade a part with
> `<Part hatch={{ gap: 7, color: tone }}>`; add a darker `<Hatch gap={4} cross …>`
> on the underside for volume. Leave highlights as bare paper; eye-whites are a
> `<Part>` (paper) with an `INK` pupil. Render `<PencilDefs scale={3.4}/>` once.
> Round eyes (`INK` pupil + `PAPER` glint); `hurt` → ✖ eyes + grey + freeze.
> Centre with `translate(-50%,-50%) scaleX(facing)` (feet-anchor if it stands on
> ground). All motion from `useCurrentFrame()` — breathe + blink at idle, faster
> when `moving`. Deterministic: no `Math.random`, no `Date.now`, no `useState`.
> Pick a viewBox that frames the art; keep proportions cute. Follow the recipe in
> §3 and the existing characters (e.g. `FrogPencil`, `RatPencil`) for structure.
