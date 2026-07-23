---
description: >
  Edit or redesign a Remotion scene in apps/remotion/src/compositions/.
  Reads the existing file first, changes ONLY what is requested, follows
  the frame-filling and "no phantom content" rules below.
---

Edit a scene in the Remotion composition.

## Step 1 — Read before touching

**Always** `Read` the scene file in full before writing any code.
List every visual element already present. Do not add or remove anything
that the user did not explicitly ask about.

Elements to inventory:
- Text labels and annotations
- Characters / figures and their positions
- SVG objects (props, scenery, decorative geometry)
- Animation timings (appear/kneel/transition)
- Background and ground lines

## Step 2 — Change only what is requested

If the user says "move the throne left" → move only the throne.
If the user says "make figures bigger" → scale the figures, adjust their
top/left so they still stand on the ground line.

**Never add** items that were not there before:
- No extra text labels, captions, or annotations unless requested
- No badge overlays, tooltips, or info boxes unless requested
- No additional figures unless requested
- No new SVG scenery objects unless requested

The exception: if adding an element is obviously required to make the
requested change work (e.g., a speech-bubble tail when adding a bubble).

## Frame-filling rule

Every scene must fill the full 1920×1080 canvas. Elements span edge-to-edge
with margins calibrated to scene density:

| Density             | Left/right margin | Top/bottom margin |
|---------------------|-------------------|-------------------|
| sparse (≤3 objects) | 80–100 px         | 80–120 px         |
| medium (4–6 objects)| 40–80 px          | 60–100 px         |
| dense (7+ objects)  | 20–40 px          | 40–60 px          |

Ground line (where figures stand): typically y = 800–880 depending on
figure size. Figures positioned so their feet touch the ground line.

For multi-column layouts: divide the 1920px width into equal or intentional
zones; the separator lives at or near x = 960.

Figure sizing rule: a standing PersonPencil at `size=200` fills roughly
18% of frame height. At `size=300` it fills 28%. Target 20–35% for main
characters so they read clearly at full resolution.

## Emotion arc rule (EmotivePerson)

`happyProgress` → ∪ shape (smile, horns up = happy).
`sadProgress`   → ∩ shape (frown, horns down = sad).

Typical arc: figure appears with `happyProgress=1` (spring in already
smiling) → at SAD_AT transition: happyProgress fades out, sadProgress
fades in. Never use a transition that goes sad → happy unless the
narrative calls for it.

Use a `CivilianFigure` (or equivalent) subcomponent with `useVideoConfig()`
so `spring()` can be called at the hook level, not inside a `.map()`.

## Shared library rule

Any object drawn in code that could appear in another composition
(thrones, guillotines, podiums, vehicles, large scenery) belongs in
`apps/remotion/src/characters/svg/` and must be exported from
`apps/remotion/src/characters/index.ts`.

Scene files under `compositions/<video>/scenes/` must not define
reusable components — only wire up shared pieces.

**Large complex objects are ALWAYS shared library elements.** If a component
takes more than ~20 lines of SVG to draw (a throne, a guillotine, a building,
a vehicle, a cannon, etc.) — it belongs in `characters/svg/`, not inline in a
scene. Create it as a standalone `.tsx` file, export from `index.ts`, then
import in the scene. Shared props pattern: `opacity?: number` + `style?: React.CSSProperties`
so the scene can override position/size without touching the object itself.

## After editing

Run `npm run lint` to catch TypeScript errors.
Render one still per scene at a representative frame to verify layout.
