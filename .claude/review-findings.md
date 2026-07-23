# Review Findings (Correctness) — Full Snapshot (`apps/` + `packages/`)

## Top findings

1. **High — Deleting a bone in Rigger can leave orphaned descendants (model corruption).**
   - **Why this is a correctness issue:** `delBone` removes only the selected bone and its direct children. Deeper descendants remain with `parent` pointing to a deleted bone, creating an invalid hierarchy. This can move parts to fallback coordinates and break expected posing/editing behavior.
   - **Affected path:** `apps/rigger/src/PuppetStudio.jsx:234`
   - **Fix direction:** Delete the full subtree recursively (all descendants), and remove/reassign shapes bound to any removed bone IDs.

2. **Medium — `samplePose()` still returns shallow-copied keyframe poses, so nested objects can be mutated through returned value.**
   - **Why this is a correctness issue:** At boundary times, `samplePose` returns `{ ...keys[i].pose }`, which shares nested `angles` and `root` object references with source keyframes. Any downstream mutation of `result.angles`/`result.root` can mutate original action keyframes and produce persistent animation corruption.
   - **Affected path:** `packages/puppet/src/engine.ts:76,85`
   - **Fix direction:** Return deep copies for boundary keyframes (at least clone `angles`, `root`, and `visible` maps), and extend tests to assert nested mutation safety.

## Scope checked

- Baseline checks: `pnpm lint`, `pnpm test` (both passing).
- Static correctness review of:
  - `packages/puppet/src`
  - `apps/remotion/src/Root.tsx` and composition wiring
  - `apps/remotion/src/compositions/*`
  - `apps/rigger/src`
