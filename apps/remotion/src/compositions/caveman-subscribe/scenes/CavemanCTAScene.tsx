import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, PencilDefs, Sketch, INK, PASTEL, cavemanModel, RockPencil, ChippedTreePencil } from "~/characters";
import { Puppet, samplePose, blend } from "@animal-clamp/puppet";
import type { Pose, PuppetModel } from "@animal-clamp/puppet";
import { montserrat } from "~/lib/fonts";
import { fadeOut, popIn } from "~/lib/animations";
import { fontSizes, fontWeights, radii, spacing } from "~/theme";
import {
  FRAME_SCRATCH_START,
  FRAME_CALM_START,
  FRAME_WAVE_START,
  FRAME_TALK2_START,
  FRAME_HUNT_START,
  FRAME_CLICK,
  FRAME_LIKES_START,
} from "../plan";

// A brighter, more saturated golden-yellow than the muted `GOLD` from
// EconObjects (that one reads brownish against paper — too dull for a pop accent).
const CLAW_GOLD = "#F6C445";

// Named poses along the timeline. Each segment gets its own local clock
// (starts fresh at t=0) so a transition always begins from a known point.
const SEGMENTS: { action: string; from: number }[] = [
  { action: "talk", from: 0 },
  { action: "scratch head", from: FRAME_SCRATCH_START },
  { action: "idle", from: FRAME_CALM_START },
  { action: "wave", from: FRAME_WAVE_START },
  { action: "talk", from: FRAME_TALK2_START },
  { action: "hunt", from: FRAME_HUNT_START },
];

// How long a hand-off between two poses takes to cross-fade.
const BLEND_FRAMES = 10;

const easeInOut = (u: number) => {
  const c = Math.max(0, Math.min(1, u));
  return c * c * (3 - 2 * c);
};

const EMPTY_POSE: Pose = { angles: {}, root: {} };

/** Sampled pose at `frame`, cross-fading from the previous segment's pose for the first BLEND_FRAMES of a new one — so switching action never snaps. */
function getBlendedPose(model: PuppetModel, frame: number, fps: number): Pose {
  let i = 0;
  for (let s = 0; s < SEGMENTS.length; s++) if (SEGMENTS[s].from <= frame) i = s;
  const seg = SEGMENTS[i];

  const act = model.actions[seg.action];
  const pose = act ? samplePose(act, (frame - seg.from) / fps) : EMPTY_POSE;
  if (i === 0) return pose;

  const framesIn = frame - seg.from;
  if (framesIn >= BLEND_FRAMES) return pose;

  const prevSeg = SEGMENTS[i - 1];
  const prevAct = model.actions[prevSeg.action];
  const prevPose = prevAct ? samplePose(prevAct, (seg.from - prevSeg.from) / fps) : EMPTY_POSE;

  const blended = blend(prevPose, pose, easeInOut(framesIn / BLEND_FRAMES));
  return { ...blended, visible: pose.visible };
}

const W = 1920;
const H = 1080;
const GROUND_Y = 820;

// Puppet viewBox is "-220 -80 700 640" (width 700, height 640). Sizing the
// container at an exact multiple of that keeps the SVG's default
// preserveAspectRatio ("xMidYMid meet") from letterboxing, so local puppet
// coordinates map 1:1 (scaled) onto the container box.
const PUPPET_SCALE = 1.32 * 1.1;
const PUPPET_W = Math.round(700 * PUPPET_SCALE);
const PUPPET_H = Math.round(640 * PUPPET_SCALE);
// Feet (end of the leg bone chain) sit at local y≈390 → (390 - vbMinY) = 470 px
// down from the viewBox top, at 1x scale.
const FEET_OFFSET = Math.round(470 * PUPPET_SCALE);
// Positioned about a third of the way in from the left edge.
const CAVE_X = W / 3;
// Nudged down a bit so the feet plant into the ground instead of floating above it.
const PUPPET_Y_NUDGE = 40;
// viewBox is "-220 -80 700 640" — its own box-center (local x=130) sits well right
// of the character's actual silhouette (centered near local x=0).
const PUPPET_VISUAL_CENTER_OFFSET = 130;

// Where the spear tip lands during the extended part of the "hunt" thrust —
// measured from the rendered puppet at the click frame (spear bone's world
// bounding box), so the logo badge sits exactly where he pokes it. Nudged
// down along with the puppet so it reads as resting on the ground.
const LOGO_X = 1400;
const LOGO_Y = 700;
const LOGO_SIZE = 400;

// Anticipation before the hit: jump (parabolic hop to a new spot) → freeze
// (dead still) → tremble in place → jump again. Repeats until the poke, then
// locks wherever it was.
const CLAW_JUMP_FRAMES = 10; // quick hop
const CLAW_JUMP_RANGE_X = 55; // "трохи далі" — bigger reach than a mere twitch — horizontal only
const CLAW_JUMP_ARC = 46; // hop height over the "hump" — always returns to the same baseline
const CLAW_PAUSE_MIN = 8; // ~0.27s
const CLAW_PAUSE_RANGE = 14; // up to +0.47s more
const CLAW_SHAKE_MIN = 6; // 0.2s
const CLAW_SHAKE_RANGE = 9; // up to +0.3s more

function clawCycle(i: number) {
  const pause = CLAW_PAUSE_MIN + Math.floor(random(`clawPause-${i}`) * CLAW_PAUSE_RANGE);
  const shake = CLAW_SHAKE_MIN + Math.floor(random(`clawShake-${i}`) * CLAW_SHAKE_RANGE);
  return { jump: CLAW_JUMP_FRAMES, pause, shake, total: CLAW_JUMP_FRAMES + pause + shake };
}

function clawTarget(i: number) {
  if (i < 0) return { x: 0 };
  return { x: (random(`clawTargetX-${i}`) - 0.5) * 2 * CLAW_JUMP_RANGE_X };
}

function getClawJitter(frameRaw: number): { x: number; y: number; pulse: number } {
  // Freeze exactly at the poke — whatever mid-cycle position it was at holds still.
  const frame = Math.min(frameRaw, FRAME_CLICK - 1);
  const t = frame - FRAME_CALM_START;
  if (t < 0) return { x: 0, y: 0, pulse: 1 };

  let elapsed = 0;
  let i = 0;
  let cycle = clawCycle(0);
  while (t >= elapsed + cycle.total) {
    elapsed += cycle.total;
    i += 1;
    cycle = clawCycle(i);
  }
  const localT = t - elapsed;
  const from = clawTarget(i - 1);
  const to = clawTarget(i);

  if (localT < cycle.jump) {
    const u = localT / cycle.jump;
    const eased = u * u * (3 - 2 * u);
    // Rises over a hump and always comes back down to the same baseline (y=0).
    const arc = -CLAW_JUMP_ARC * 4 * u * (1 - u);
    return { x: from.x + (to.x - from.x) * eased, y: arc, pulse: 1 };
  }

  if (localT < cycle.jump + cycle.pause) {
    return { x: to.x, y: 0, pulse: 1 }; // завмирає
  }

  // труситься — small tremble in place, horizontal only
  return {
    x: to.x + (random(`clawShakeX-${frame}`) - 0.5) * 14,
    y: 0,
    pulse: 1 + Math.sin(frame * 0.9) * 0.04,
  };
}

const LogoBadge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const intro = popIn(frame, fps, FRAME_CALM_START, { damping: 14, mass: 0.7 });
  const impactT = frame - FRAME_CLICK;
  const bump = impactT >= 0 && impactT <= 10 ? Math.sin(Math.min(impactT, 10) / 10 * Math.PI) * 0.22 : 0;
  const glow = impactT >= 0 && impactT <= 14 ? Math.sin(Math.min(impactT, 14) / 14 * Math.PI) : 0;

  // Nervous energy before the hit — pulses in size and hops in place —
  // then freezes dead still the instant the spear lands.
  const { x: jitterX, y: jitterY, pulse } = getClawJitter(frame);

  const scale = Math.min(intro, 1) * (1 + bump) * pulse;
  if (intro <= 0.01) return null;

  return (
    <>
      {/* Ground shadow — tracks the same horizontal hops as the badge (no scale/pulse of its own),
          so it doesn't visibly detach from it while it's jumping around. */}
      <div
        style={{
          position: "absolute",
          left: LOGO_X - LOGO_SIZE * 0.4,
          top: LOGO_Y + LOGO_SIZE * 0.33,
          width: LOGO_SIZE * 0.8,
          height: LOGO_SIZE * 0.18,
          borderRadius: "50%",
          background: INK,
          opacity: 0.2 * Math.min(intro, 1),
          transform: `translateX(${jitterX}px)`,
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LOGO_X - LOGO_SIZE / 2,
          top: LOGO_Y - LOGO_SIZE / 2,
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          transform: `translate(${jitterX}px, ${jitterY}px) scale(${scale})`,
          opacity: Math.min(intro, 1),
        }}
      >
      <div
        style={{
          position: "absolute",
          inset: -14,
          borderRadius: "50%",
          boxShadow: `0 0 0 ${6 + glow * 10}px ${CLAW_GOLD}${glow > 0.05 ? "cc" : "55"}`,
          opacity: 0.55 + glow * 0.45,
          transition: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: `7px solid ${INK}`,
          boxShadow: `6px 8px 0 ${INK}33`,
          background: "#141414",
        }}
      >
        <Img
          src={staticFile("images/clamp-logo.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      </div>
    </>
  );
};

const LIKE_COUNT = 16;
// Likes land in the dirt band, roughly halfway between the horizon and the
// bottom edge — spread vertically so they don't all rest on one exact line.
const LIKES_REST_MID_Y = GROUND_Y + (H - GROUND_Y) / 2;
const LIKES_REST_SPREAD = 70;

/** One falling 👍, thrown at a deterministic delay/x/size, that lands on the ground and stays put. */
const FallingLike: React.FC<{ frame: number; index: number }> = ({ frame, index }) => {
  const delay = Math.floor(random(`likeDelay-${index}`) * 14);
  const start = FRAME_LIKES_START + delay;
  const t = frame - start;
  if (t < 0) return null;

  const fallDur = 22 + Math.floor(random(`likeDur-${index}`) * 12);
  const x = 60 + random(`likeX-${index}`) * (W - 120);
  const startY = -80 - random(`likeStartY-${index}`) * 260;
  const restY = LIKES_REST_MID_Y + (random(`likeRestY-${index}`) - 0.5) * 2 * LIKES_REST_SPREAD;
  const size = 46 + random(`likeSize-${index}`) * 34;
  const spin = (random(`likeSpin-${index}`) - 0.5) * 900;
  const restRot = (random(`likeRest-${index}`) - 0.5) * 50;

  const progress = Math.min(t / fallDur, 1);
  const y = interpolate(progress, [0, 1], [startY, restY], { easing: Easing.in(Easing.quad) });
  const rotation = progress < 1 ? spin * progress : restRot;

  // A quick squash-bounce right as it lands.
  const sinceLand = t - fallDur;
  const bounce = sinceLand >= 0 && sinceLand <= 10 ? Math.sin(Math.min(sinceLand, 10) / 10 * Math.PI) * 0.3 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${1 + bounce})`,
      }}
    >
      👍
    </div>
  );
};

const LikeRain: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {Array.from({ length: LIKE_COUNT }, (_, i) => (
      <FallingLike key={i} frame={frame} index={i} />
    ))}
  </>
);

const CTAPill: React.FC<{
  frame: number;
  delay: number;
  exitAt?: number;
  left?: number;
  right?: number;
  top: number;
  bg: string;
  sizeMultiplier?: number;
  children: React.ReactNode;
}> = ({ frame, delay, exitAt, left, right, top, bg, sizeMultiplier = 1, children }) => {
  const { fps } = useVideoConfig();
  const scale = popIn(frame, fps, delay, { damping: 12, mass: 0.6 });
  const outOp = exitAt != null ? fadeOut(frame, exitAt, 12) : 1;
  const opacity = Math.min(scale, 1) * outOp;
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        transform: `scale(${scale * sizeMultiplier})`,
        transformOrigin: left != null ? "left center" : "right center",
        opacity,
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
        background: bg,
        border: `3px solid ${INK}`,
        borderRadius: radii.pill,
        padding: `${spacing.sm}px ${spacing.lg}px`,
        fontFamily: montserrat.fontFamily,
        fontSize: fontSizes.body,
        fontWeight: fontWeights.black,
        color: INK,
        whiteSpace: "nowrap",
        boxShadow: `4px 6px 0 ${INK}33`,
      }}
    >
      {children}
    </div>
  );
};

const ROCKS = [
  { x: 150, y: GROUND_Y + 145, r: 24 },
  { x: 670, y: GROUND_Y + 200, r: 38 },
  { x: 1150, y: GROUND_Y + 65, r: 30 },
  { x: 1760, y: GROUND_Y + 115, r: 46 },
];

/** Scattered dirt texture — dots and short scratch-marks simulating ground relief. */
const GroundTexture: React.FC = () => (
  <>
    {Array.from({ length: 55 }, (_, i) => {
      const x = 20 + random(`groundMarkX-${i}`) * (W - 40);
      const y = GROUND_Y + 14 + random(`groundMarkY-${i}`) * (H - GROUND_Y - 28);
      const isDot = random(`groundMarkKind-${i}`) > 0.4;
      const op = 0.25 + random(`groundMarkOp-${i}`) * 0.3;
      if (isDot) {
        const r = 1.5 + random(`groundMarkR-${i}`) * 2.5;
        return <circle key={i} cx={x} cy={y} r={r} fill={INK} opacity={op} />;
      }
      const len = 6 + random(`groundMarkLen-${i}`) * 10;
      const angle = random(`groundMarkAngle-${i}`) * Math.PI;
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

const Rocks: React.FC = () => (
  <>
    {ROCKS.map((rock, i) => (
      <RockPencil key={i} x={rock.x} y={rock.y} r={rock.r} />
    ))}
  </>
);

export const CavemanCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pose = getBlendedPose(cavemanModel, frame, fps);

  // Comic "ТИЦЬ!" burst synced to the spear-impact / click frame.
  const burstScale = popIn(frame, fps, FRAME_CLICK, { damping: 9, mass: 0.5 });
  const burstOpacity = Math.min(burstScale, 1) * fadeOut(frame, FRAME_CLICK + 20, 14);

  return (
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily }}>
      <PaperBackground />

      <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        <PencilDefs scale={2.5} />
        <Sketch fill="#C87B5266" width={3.5}>
          <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} />
        </Sketch>
        <GroundTexture />
        <Rocks />
        <ChippedTreePencil x={70} groundY={GROUND_Y} height={1050} seed="treeL" />
        <ChippedTreePencil x={1850} groundY={GROUND_Y} height={560} mirror seed="treeR" />

        {/* Puppet's ground shadow. The viewBox's own bounding box isn't centered on the
            character (vb spans x:[-220,480], character silhouette sits near local x=0),
            so the shadow needs the same offset correction the container's centering skips. */}
        <ellipse
          cx={CAVE_X - PUPPET_VISUAL_CENTER_OFFSET * PUPPET_SCALE} cy={GROUND_Y + PUPPET_Y_NUDGE + 6}
          rx={PUPPET_W * 0.24} ry={PUPPET_W * 0.05}
          fill={INK} opacity={0.2}
        />
      </svg>

      <Puppet
        model={cavemanModel}
        pose={pose}
        style={{
          position: "absolute",
          left: CAVE_X - PUPPET_W / 2,
          top: GROUND_Y - FEET_OFFSET + PUPPET_Y_NUDGE,
          width: PUPPET_W,
          height: PUPPET_H,
        }}
      />

      <LogoBadge frame={frame} fps={fps} />

      <CTAPill
        frame={frame}
        delay={FRAME_WAVE_START}
        left={710}
        top={120}
        bg={PASTEL.blue}
        sizeMultiplier={1.5}
      >
        🔔 ПІДПИСУЙСЯ
      </CTAPill>

      <LikeRain frame={frame} />

      {burstOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: LOGO_Y - LOGO_SIZE / 2 - 150,
            left: LOGO_X - 40,
            transform: `translate(-50%, 0) scale(${burstScale}) rotate(-6deg)`,
            opacity: burstOpacity,
            fontFamily: montserrat.fontFamily,
            fontSize: 90,
            fontWeight: fontWeights.black,
            color: CLAW_GOLD,
            WebkitTextStroke: `4px ${INK}`,
            letterSpacing: 2,
          }}
        >
          ТИЦЬ!
        </div>
      )}
    </AbsoluteFill>
  );
};
