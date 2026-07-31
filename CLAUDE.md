# Animal Clamp — Monorepo

A pnpm workspace monorepo for 2D puppet character animation.

## Structure

```
packages/
  puppet/          # @animal-clamp/puppet — shared skeletal engine (TypeScript, no Remotion dep)
                   #   engine.ts  — computeWorld (FK), samplePose, blend
                   #   Puppet.tsx — SVG renderer (pure React)
                   #   types.ts   — PuppetModel, Bone, Shape, Pose, PuppetAction

apps/
  remotion/        # Video production — Remotion Studio + render pipeline
  rigger/          # Character design — Vite app for rigging models and authoring actions
```

## Commands

```bash
pnpm rigger        # apps/rigger dev server  → localhost:5173
pnpm remotion      # apps/remotion dev server → localhost:39573
pnpm install       # install all workspace deps
```

## Puppet model flow

```
rigger (design + export model.js)
  → apps/remotion/public/puppets/<name>.js
  → import model; <PuppetActor model={model} action="walk" />
```

## Shared package

Any component or logic used by both apps goes in `packages/puppet`.
Import as `@animal-clamp/puppet` — resolved via workspace link (no build step needed).

## Google Docs

Call the shared `gdocs` tool directly — it manages its own venv:

```bash
/Users/gtrofymov/git/clampers/tools/gdocs/run read "<doc-url>"
/Users/gtrofymov/git/clampers/tools/gdocs/run write "<doc-url>" <file>
/Users/gtrofymov/git/clampers/tools/gdocs/run list "<folder-url>"
/Users/gtrofymov/git/clampers/tools/gdocs/run create "<title>" [folder-id] [--file <file>]
```

On the first call, `run` bootstraps a venv inside `tools/gdocs/` automatically.
Credentials: `tools/gdocs/config/google-service-account.json` (never committed).

## App-specific docs

- Remotion video rules → `apps/remotion/CLAUDE.md`
- Rigger editor rules → `apps/rigger/CLAUDE.md` (TBD)
