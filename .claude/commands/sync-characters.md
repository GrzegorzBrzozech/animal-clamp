---
description: Re-register Lottie characters by syncing the catalog with public/characters/lottie/
allowed-tools: Bash(pnpm --filter remotion sync:characters)
---

Re-register the project's Lottie characters.

Run:

```bash
pnpm --filter remotion sync:characters
```

This rescans `public/characters/lottie/*.json` and regenerates
`src/characters/lottie/catalog.generated.ts` (the `LottieCharacterName` type is
derived from it). After it runs, report to the user the list of currently
registered characters from the script's output, and mention any that are newly
added or removed since they were last referenced.

Do not hand-edit the catalog or the name type — the files on disk are the source
of truth.
