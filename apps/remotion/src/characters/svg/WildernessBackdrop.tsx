import React from "react";
import { random } from "remotion";
import { PaperBackground, PencilDefs, Sketch, INK } from "./_pencil";
import { RockPencil } from "./RockPencil";
import { ChippedTreePencil } from "./ChippedTreePencil";

export interface WildernessBackdropProps {
  width?: number;
  height?: number;
  groundY?: number;
  groundColor?: string;
  treeCount?: number;
  /** Height of the tallest (leftmost) tree, in px — the rest taper down toward the right, ±10% seeded jitter. */
  treeSize?: number;
  rockCount?: number;
  /** Average rock radius in px — actual rocks vary ±35% around this, seeded. */
  rockSize?: number;
  /** Current frame — when given, trees sway gently; omit for a static backdrop. */
  frame?: number;
  /** Any string — reseeds every generated position/size, so two backdrops on screen never clone each other. */
  seed?: string;
}

/** Scattered dirt texture — dots and short scratch-marks simulating ground relief. */
const GroundTexture: React.FC<{ width: number; height: number; groundY: number; seed: string }> = ({
  width,
  height,
  groundY,
  seed,
}) => (
  <>
    {Array.from({ length: 55 }, (_, i) => {
      const x = 20 + random(`${seed}-groundMarkX-${i}`) * (width - 40);
      const y = groundY + 14 + random(`${seed}-groundMarkY-${i}`) * (height - groundY - 28);
      const isDot = random(`${seed}-groundMarkKind-${i}`) > 0.4;
      const op = 0.25 + random(`${seed}-groundMarkOp-${i}`) * 0.3;
      if (isDot) {
        const r = 1.5 + random(`${seed}-groundMarkR-${i}`) * 2.5;
        return <circle key={i} cx={x} cy={y} r={r} fill={INK} opacity={op} />;
      }
      const len = 6 + random(`${seed}-groundMarkLen-${i}`) * 10;
      const angle = random(`${seed}-groundMarkAngle-${i}`) * Math.PI;
      const dx = Math.cos(angle) * len, dy = Math.sin(angle) * len;
      return (
        <line
          key={i}
          x1={x - dx / 2} y1={y - dy / 2} x2={x + dx / 2} y2={y + dy / 2}
          stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={op}
        />
      );
    })}
  </>
);

/**
 * The shared "paper wilderness" backdrop — paper texture, a dirt ground band, scattered
 * rocks, and a couple of chipped trees swaying in the wind. Drop it behind any puppet
 * scene; everything is optional and seeded, so the default call reproduces the look
 * used across the caveman scenes, while passing `treeCount`/`rockSize`/`groundColor`/etc.
 * reshapes it without touching this file.
 */
export const WildernessBackdrop: React.FC<WildernessBackdropProps> = ({
  width = 1920,
  height = 1080,
  groundY = 820,
  groundColor = "#C87B5266",
  treeCount = 2,
  treeSize = 800,
  rockCount = 4,
  rockSize = 35,
  frame,
  seed = "backdrop",
}) => {
  const trees = Array.from({ length: treeCount }, (_, i) => {
    const t = treeCount === 1 ? 0.5 : i / (treeCount - 1);
    // Tallest on the left, tapering down toward the right — a big anchor tree plus
    // smaller ones, like the hand-placed original — not an independent size roll per
    // tree (that reads as a random lottery, e.g. a stubby tree where the big one was).
    const heightRatio = 1.3 - t * 0.65;
    const jitter = 0.9 + random(`${seed}-treeH-${i}`) * 0.2;
    return {
      x: 70 + t * (width - 140),
      height: treeSize * heightRatio * jitter,
      mirror: t > 0.5,
      seed: `${seed}-tree-${i}`,
    };
  });

  const rocks = Array.from({ length: rockCount }, (_, i) => ({
    x: 60 + random(`${seed}-rockX-${i}`) * (width - 120),
    y: groundY + 60 + random(`${seed}-rockY-${i}`) * (height - groundY - 120),
    r: rockSize * (0.65 + random(`${seed}-rockR-${i}`) * 0.7),
  }));

  return (
    <>
      <PaperBackground />
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        <PencilDefs scale={2.5} />
        <Sketch fill={groundColor} width={3.5}>
          <rect x={0} y={groundY} width={width} height={height - groundY} />
        </Sketch>
        <GroundTexture width={width} height={height} groundY={groundY} seed={seed} />
        {rocks.map((r, i) => (
          <RockPencil key={i} x={r.x} y={r.y} r={r.r} />
        ))}
        {trees.map((t, i) => (
          <ChippedTreePencil key={i} x={t.x} groundY={groundY} height={t.height} mirror={t.mirror} seed={t.seed} frame={frame} />
        ))}
      </svg>
    </>
  );
};
