import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "~/theme";

export type HominidPose = "walk" | "idle" | "rest" | "cheer" | "haul";

type Props = {
  /** Feet anchor on the parent (px). */
  x: number;
  y: number;
  scale?: number;
  /** Clothing / body color. */
  color?: string;
  skin?: string;
  facing?: 1 | -1;
  pose?: HominidPose;
  /** Walk-cycle speed. */
  speed?: number;
  /** Phase offset so a group doesn't move in lockstep. */
  phase?: number;
  /** Emoji held in the forward hand. */
  hold?: string;
};

/**
 * A chunky stick-figure early human. Fully frame-driven (no state).
 * Reusable across scenes — drive it with x/y + pose.
 */
export const Hominid: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  color = colors.danger,
  skin = "#E8B98A",
  facing = 1,
  pose = "idle",
  speed = 0.25,
  phase = 0,
  hold,
}) => {
  const frame = useCurrentFrame();
  const t = frame * speed + phase;
  const walk = pose === "walk";
  const sit = pose === "rest";
  const swing = walk ? Math.sin(t) : 0;
  const bob = walk ? -Math.abs(Math.sin(t)) * 5 : Math.sin(t * 0.6) * 2;

  const hipY = sit ? 112 : 95;
  const shoulderY = sit ? 74 : 52;
  const headCy = sit ? 56 : 34;
  const footY = sit ? hipY + 26 : 145;
  const leftFootX = sit ? 26 : 45 + Math.sin(swing) * 18;
  const rightFootX = sit ? 64 : 45 - Math.sin(swing) * 18;

  // arms
  let lHand: [number, number];
  let rHand: [number, number];
  if (pose === "cheer") {
    lHand = [26, shoulderY - 42];
    rHand = [64, shoulderY - 42];
  } else if (pose === "haul") {
    lHand = [74, shoulderY + 10];
    rHand = [74, shoulderY + 22];
  } else if (sit) {
    lHand = [28, hipY - 4];
    rHand = [62, hipY - 4];
  } else {
    lHand = [45 - Math.sin(swing) * 13, shoulderY + 34];
    rHand = [45 + Math.sin(swing) * 13, shoulderY + 34];
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 90,
        height: 150,
        transform: `translate(-50%, -100%) scale(${scale}) scaleX(${facing})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg width={90} height={150} style={{ transform: `translateY(${bob}px)`, overflow: "visible" }}>
        {/* legs */}
        <line x1={45} y1={hipY} x2={leftFootX} y2={footY} stroke={skin} strokeWidth={11} strokeLinecap="round" />
        <line x1={45} y1={hipY} x2={rightFootX} y2={footY} stroke={skin} strokeWidth={11} strokeLinecap="round" />
        {/* torso */}
        <line x1={45} y1={shoulderY} x2={45} y2={hipY} stroke={color} strokeWidth={20} strokeLinecap="round" />
        {/* arms */}
        <line x1={45} y1={shoulderY + 4} x2={lHand[0]} y2={lHand[1]} stroke={skin} strokeWidth={9} strokeLinecap="round" />
        <line x1={45} y1={shoulderY + 4} x2={rHand[0]} y2={rHand[1]} stroke={skin} strokeWidth={9} strokeLinecap="round" />
        {/* head */}
        <circle cx={45} cy={headCy} r={17} fill={skin} />
        {/* brow — caveman look */}
        <line x1={34} y1={headCy - 4} x2={56} y2={headCy - 4} stroke="#00000033" strokeWidth={4} strokeLinecap="round" />
        {hold ? (
          <text x={rHand[0]} y={rHand[1] + 8} fontSize={30} textAnchor="middle">
            {hold}
          </text>
        ) : null}
      </svg>
      {sit ? (
        <div style={{ position: "absolute", left: 58, top: 24, fontSize: 26, transform: `scaleX(${facing})` }}>💤</div>
      ) : null}
    </div>
  );
};
