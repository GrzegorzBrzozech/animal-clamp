import React from "react";
import { random } from "remotion";
import { INK } from "./_pencil";
import { ROCK_SHAPE } from "./RockPencil";

/** Procedurally builds one side of a trunk outline: a jagged taper from base to top, unique per seed. */
function buildTrunkSide(seed: string, sign: number, lean: number): [number, number][] {
  const steps = 5 + Math.floor(random(`${seed}-steps`) * 3); // 5-7 chips
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const yFrac = i / steps;
    const taper = 1 - yFrac * 0.72; // narrows toward the top
    const jag = 1 + (random(`${seed}-jag-${i}`) - 0.5) * 0.5;
    pts.push([sign * 0.5 * taper * jag + lean * yFrac, -yFrac]);
  }
  return pts;
}

export interface ChippedTreePencilProps {
  x: number;
  groundY: number;
  height: number;
  mirror?: boolean;
  /** Any string — every dimension (taper, lean, crown bushiness, branches) is derived from it, so distinct seeds never look like clones. */
  seed: string;
  /** Current frame — when given, the crown and branches gently sway (trunk stays rigid), like a breeze. Omit for a static tree. */
  frame?: number;
}

// One full sway cycle, in frames (~5s at 30fps). Not fps-aware — this project defaults to 30fps everywhere.
const SWAY_PERIOD_FRAMES = 150;

/**
 * A chipped, dead-looking trunk with a green crown and a scatter of broken branch stubs.
 * Every dimension is seeded off `seed`, so no two instances come out looking the same.
 */
export const ChippedTreePencil: React.FC<ChippedTreePencilProps> = ({ x, groundY, height, mirror, seed, frame }) => {
  const trunkGrad = `trunkShade-${React.useId().replace(/[:]/g, "")}`;
  const crownGrad = `crownShade-${React.useId().replace(/[:]/g, "")}`;
  const crownMerge = `crownMerge-${React.useId().replace(/[:]/g, "")}`;
  const barkClip = `barkClip-${React.useId().replace(/[:]/g, "")}`;
  const halfW = height * 0.11;
  const flip = mirror ? -1 : 1;
  const lean = (random(`${seed}-lean`) - 0.5) * 0.5;
  const left = buildTrunkSide(`${seed}-L`, -1, lean);
  const right = buildTrunkSide(`${seed}-R`, 1, lean).slice().reverse();
  const trunk: [number, number][] = [...left, ...right];
  const trunkPoints = trunk.map(([px, py]) => `${px * halfW * 2},${py * height}`).join(" ");

  // Bark texture: short jagged cracks (a polyline of 2-6 kinked segments each),
  // clipped to the trunk silhouette — reads as bark fissures, unlike plain dots.
  const barkMarkCount = Math.round(height * 0.035); // scales with trunk size
  const barkMarks = Array.from({ length: barkMarkCount }, (_, mi) => {
    const xNorm = (random(`${seed}-barkX-${mi}`) - 0.5) * 0.9;
    const yFrac = random(`${seed}-barkY-${mi}`); // 0 (base) .. 1 (top)
    let cx = xNorm * halfW * 2 + lean * halfW * 2 * yFrac;
    let cy = -yFrac * height;
    const segCount = 2 + Math.floor(random(`${seed}-barkSegs-${mi}`) * 5); // 2-6
    const baseAngle = -Math.PI / 2 + (random(`${seed}-barkDir-${mi}`) - 0.5) * 0.7; // mostly "up" the grain, some tilt
    const pts: [number, number][] = [[cx, cy]];
    for (let s = 0; s < segCount; s++) {
      const segLen = 3 + random(`${seed}-barkLen-${mi}-${s}`) * 5;
      const angle = baseAngle + (random(`${seed}-barkKink-${mi}-${s}`) - 0.5) * 1.1;
      cx += Math.cos(angle) * segLen;
      cy += Math.sin(angle) * segLen;
      pts.push([cx, cy]);
    }
    return {
      d: pts.map(([px, py], i) => `${i === 0 ? "M" : "L"} ${px},${py}`).join(" "),
      op: 0.2 + random(`${seed}-barkOp-${mi}`) * 0.35,
    };
  });

  // Crown sits somewhere in the upper third — height and bushiness both vary per tree.
  const crownCenterY = -height * (0.72 + random(`${seed}-crownCenter`) * 0.16);
  const crownBlobCount = 4 + Math.floor(random(`${seed}-crownCount`) * 3); // 4-6
  const crownBlobs = Array.from({ length: crownBlobCount }, (_, ci) => ({
    dx: (random(`${seed}-crownDX-${ci}`) - 0.5) * halfW * 5.2,
    dy: crownCenterY + (random(`${seed}-crownDY-${ci}`) - 0.5) * height * 0.16,
    r: halfW * (1.3 + random(`${seed}-crownR-${ci}`) * 1.3),
  }));
  // Branches poke out below the crown, not swallowed by it.
  const crownBottom = crownCenterY + height * 0.16;

  // Sway pivoted where the branches/crown meet the trunk — amplitude/phase per-seed so a
  // row of trees doesn't nod in unison. The trunk itself never rotates, only the foliage.
  const swayAmpDeg = 2.4 + random(`${seed}-swayAmp`) * 2;
  const swayPhase = random(`${seed}-swayPhase`) * Math.PI * 2;
  const sway = frame != null ? Math.sin((frame / SWAY_PERIOD_FRAMES) * Math.PI * 2 + swayPhase) * swayAmpDeg : 0;
  const swayPivotY = crownBottom;
  const swayPivotX = lean * halfW * 2 * (-crownBottom / height);

  const branchCount = 2 + Math.floor(random(`${seed}-branchCount`) * 2); // 2-3, different per tree
  const branches = Array.from({ length: branchCount }, (_, bi) => {
    const baseY = crownBottom + random(`${seed}-branchAlong-${bi}`) * (height * 0.18);
    const side = random(`${seed}-branchSide-${bi}`) > 0.5 ? 1 : -1;
    const len = halfW * (1.1 + random(`${seed}-branchLen-${bi}`) * 1.7);
    const lift = 0.3 + random(`${seed}-branchLift-${bi}`) * 0.5;
    const baseX = side * flip * halfW * 0.3 + lean * (-baseY / height);
    const tipX = baseX + side * flip * len;
    const tipY = baseY - len * lift;
    const midX = baseX + side * flip * len * 0.5;
    const midY = baseY - len * lift * 0.35 + halfW * 0.5;
    return `M ${baseX},${baseY} L ${tipX},${tipY} L ${midX},${midY} Z`;
  });

  return (
    <g transform={`translate(${x}, ${groundY + 45})`}>
      <defs>
        <linearGradient id={trunkGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A6F53" />
          <stop offset="100%" stopColor="#4E3E2E" />
        </linearGradient>
        <linearGradient id={crownGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A9CB94" />
          <stop offset="100%" stopColor="#5F8A4C" />
        </linearGradient>
        {/* Same trick the puppet rig uses to fuse overlapping shapes: dilate the combined
            alpha, flood it ink-colored, then merge that underneath — one continuous outline
            around the whole cluster instead of a facet line around every single blob. */}
        <filter id={crownMerge} filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="dil" />
          <feFlood floodColor={INK} result="inkfill" />
          <feComposite in="inkfill" in2="dil" operator="in" result="edge" />
          <feMerge>
            <feMergeNode in="edge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={barkClip}>
          <polygon points={trunkPoints} />
        </clipPath>
      </defs>

      {/* Ground shadow, for a little volume. */}
      <ellipse cx={0} cy={4} rx={halfW * 1.6} ry={halfW * 0.5} fill={INK} opacity={0.18} />

      <polygon
        points={trunkPoints}
        fill={`url(#${trunkGrad})`}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Bark texture — dots + short scratch-marks, clipped so they never poke past the taper. */}
      <g clipPath={`url(#${barkClip})`}>
        {barkMarks.map((m, mi) => (
          <path key={mi} d={m.d} fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={m.op} />
        ))}
      </g>
      {/* Foliage sways from where it meets the trunk; the trunk itself stays put. */}
      <g transform={`rotate(${sway} ${swayPivotX} ${swayPivotY})`}>
        {branches.map((d, bi) => (
          <path key={bi} d={d} fill={`url(#${trunkGrad})`} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        ))}
        <g filter={`url(#${crownMerge})`}>
          {crownBlobs.map((b, ci) => (
            <polygon
              key={ci}
              points={ROCK_SHAPE.map(([px, py]) => `${b.dx + px * b.r},${b.dy + py * b.r}`).join(" ")}
              fill={`url(#${crownGrad})`}
            />
          ))}
        </g>
      </g>
    </g>
  );
};
