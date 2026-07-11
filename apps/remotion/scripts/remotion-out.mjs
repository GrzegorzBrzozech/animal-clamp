// Thin wrapper around `remotion render` / `remotion still` that organizes
// output per composition: out/<CompositionId>/<filename>.
//
// Usage (via npm scripts):
//   npm run render -- <CompId> [filename] [extra remotion flags...]
//   npm run still  -- <CompId> [filename] [--frame=N] [extra flags...]
//
// If filename is omitted it defaults to "<CompId>.<ext>".
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const kind = process.argv[2]; // "render" | "still"
const argv = process.argv.slice(3);

const ext = kind === "still" ? "png" : "mp4";
const compId = argv.find((a) => !a.startsWith("-"));

if (!compId) {
  console.error(
    `Usage: npm run ${kind} -- <CompositionId> [filename.${ext}] [remotion flags...]`,
  );
  process.exit(1);
}

const flags = argv.filter((a) => a.startsWith("-"));
const positional = argv.filter((a) => !a.startsWith("-") && a !== compId);
const filename = positional[0] ?? `${compId}.${ext}`;

const outDir = path.join("out", compId);
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, filename);

const result = spawnSync(
  "npx",
  ["remotion", kind, compId, outPath, ...flags],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
