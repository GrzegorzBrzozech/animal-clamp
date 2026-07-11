/**
 * Generates simple, organic "creature" animations as Lottie JSON.
 *
 * Each creature is a closed bezier blob whose vertices wobble between a few
 * morph keyframes — enough to read as a living amoeba / bacterium. Output goes
 * to public/characters/lottie/<name>.json so the shared <LottieCharacter>
 * wrapper can load it via staticFile().
 *
 * Pure & deterministic (sin-based wobble, no randomness) so re-running yields
 * identical files. Run: node scripts/gen-lottie-creatures.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/characters/lottie");

const TAU = Math.PI * 2;
/** Smooth-circle bezier handle factor for n points. */
const kappa = (n) => (4 / 3) * Math.tan(Math.PI / (2 * n));

/** One closed bezier blob path value (Lottie "sh" shape), morph step k. */
function blobShape({ r, n, wobble, k, cx = 0, cy = 0 }) {
  const h = kappa(n) * r; // tangent handle length (based on mean radius)
  const v = [];
  const i = [];
  const o = [];
  for (let p = 0; p < n; p++) {
    const a = (p / n) * TAU;
    // deterministic per-point, per-keyframe radial wobble
    const rad = r + wobble * Math.sin(p * 1.7 + k * 1.3) + wobble * 0.4 * Math.cos(p * 2.9 - k * 0.7);
    v.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    // tangent perpendicular to the radius, in travel direction
    const tx = -Math.sin(a) * h;
    const ty = Math.cos(a) * h;
    o.push([tx, ty]);
    i.push([-tx, -ty]);
  }
  return { c: true, v, i, o };
}

/** Build a looping animated path: keyframes morph 0→1→2→…→0. */
function morphPath({ r, n, wobble, steps, op }) {
  const times = [];
  for (let s = 0; s <= steps; s++) times.push(Math.round((s / steps) * op));
  const k = times.map((t, idx) => ({
    t,
    s: [blobShape({ r, n, wobble, k: idx % steps })],
    i: { x: [0.42], y: [1] },
    o: { x: [0.58], y: [0] },
  }));
  k[k.length - 1].h = 0;
  return { a: 1, k };
}

const rgba = (hex, alpha = 1) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, alpha];
};

const fill = (color) => ({ ty: "fl", c: { a: 0, k: rgba(color) }, o: { a: 0, k: 100 }, r: 1, nm: "fill" });
const stroke = (color, w) => ({ ty: "st", c: { a: 0, k: rgba(color) }, o: { a: 0, k: 100 }, w: { a: 0, k: w }, lc: 2, lj: 2, nm: "stroke" });
const trGroup = (pos = [0, 0], scale = [100, 100], rot = 0) => ({
  ty: "tr",
  p: { a: 0, k: pos },
  a: { a: 0, k: [0, 0] },
  s: { a: 0, k: scale },
  r: { a: 0, k: rot },
  o: { a: 0, k: 100 },
});

/** A shape layer wrapping one group of items. */
function shapeLayer({ ind, nm, items, op, pos = [200, 200], scale = [100, 100], rot = 0 }) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: rot },
      p: { a: 0, k: [pos[0], pos[1], 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [scale[0], scale[1], 100] },
    },
    ao: 0,
    shapes: [{ ty: "gr", nm: nm + "-grp", it: items }],
    ip: 0,
    op,
    st: 0,
    bm: 0,
  };
}

function comp({ nm, layers, w = 400, h = 400, op = 90, fr = 30 }) {
  return { v: "5.7.4", fr, ip: 0, op, w, h, nm, ddd: 0, assets: [], layers };
}

// ── Amoeba: big morphing red blob + nucleus + vacuole ───────────────────────
const amoeba = comp({
  nm: "amoeba",
  op: 90,
  layers: [
    shapeLayer({
      ind: 1,
      nm: "vacuole",
      op: 90,
      pos: [232, 168],
      items: [{ ty: "el", s: { a: 0, k: [44, 44] }, p: { a: 0, k: [0, 0] } }, fill("#0E1116"), { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 22 } }],
    }),
    shapeLayer({
      ind: 2,
      nm: "nucleus",
      op: 90,
      pos: [188, 214],
      items: [{ ty: "el", s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] } }, fill("#C23B3B"), trGroup()],
    }),
    shapeLayer({
      ind: 3,
      nm: "membrane",
      op: 90,
      items: [{ ty: "sh", ks: morphPath({ r: 132, n: 7, wobble: 26, steps: 3, op: 90 }) }, stroke("#FF9C9C", 6), fill("#FF6B6B"), trGroup()],
    }),
  ],
});

// ── Bacterium: small green oval blob + highlight + a wiggling flagellum ──────
const flagellumPath = (() => {
  const mk = (bend) => ({ c: false, v: [[0, 0], [60, bend], [120, -bend], [176, bend * 0.6]], i: [[0, 0], [-20, 0], [-20, 0], [-18, 0]], o: [[20, 0], [20, 0], [20, 0], [18, 0]] });
  return {
    a: 1,
    k: [
      { t: 0, s: [mk(18)], i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } },
      { t: 30, s: [mk(-18)], i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } },
      { t: 60, s: [mk(18)], i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] }, h: 0 },
    ],
  };
})();

const bacterium = comp({
  nm: "bacterium",
  op: 60,
  layers: [
    shapeLayer({
      ind: 1,
      nm: "flagellum",
      op: 60,
      pos: [70, 200],
      rot: 0,
      items: [{ ty: "sh", ks: flagellumPath }, stroke("#2FB373", 7), { ty: "tr", p: { a: 0, k: [-176, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }],
    }),
    shapeLayer({
      ind: 2,
      nm: "highlight",
      op: 60,
      pos: [178, 182],
      items: [{ ty: "el", s: { a: 0, k: [40, 26] }, p: { a: 0, k: [0, 0] } }, fill("#A9F0CB"), { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 60 } }],
    }),
    shapeLayer({
      ind: 3,
      nm: "body",
      op: 60,
      scale: [165, 92],
      items: [{ ty: "sh", ks: morphPath({ r: 70, n: 6, wobble: 9, steps: 3, op: 60 }) }, stroke("#7CE6B0", 5), fill("#3DD68C"), trGroup()],
    }),
  ],
});

// ── Colony: a cluster of small prokaryote cells holding together ─────────────
const COLONY_CELLS = [
  [0, 0],
  [-66, -38],
  [66, -38],
  [-72, 36],
  [70, 40],
  [0, -78],
  [4, 80],
];
const colony = comp({
  nm: "colony",
  op: 90,
  layers: COLONY_CELLS.map(([ox, oy], idx) =>
    shapeLayer({
      ind: idx + 1,
      nm: "cell" + idx,
      op: 90,
      pos: [200 + ox, 200 + oy],
      items: [
        { ty: "sh", ks: morphPath({ r: 46, n: 5, wobble: 7, steps: 3, op: 90 }) },
        stroke("#7CE6B0", 4),
        fill("#3DD68C"),
        // slight per-cell phase via group rotation so they don't pulse in unison
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: idx * 23 }, o: { a: 0, k: 100 } },
      ],
    })
  ),
});

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, data] of Object.entries({ amoeba, bacterium, colony })) {
  const file = resolve(OUT_DIR, `${name}.json`);
  writeFileSync(file, JSON.stringify(data));
  console.log("wrote", file);
}
