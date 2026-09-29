import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, PencilDefs, Sketch, INK, PASTEL, cavemanModel, RockPencil, ChippedTreePencil } from "~/characters";
import { Puppet, samplePose, blend } from "@animal-clamp/puppet";
import type { Pose, PuppetModel } from "@animal-clamp/puppet";
import { montserrat } from "~/lib/fonts";
import { popIn } from "~/lib/animations";
import { random } from "remotion";
import {
  FRAME_SCRATCH_START,
  FRAME_TALK1_START,
  FRAME_DIG_START,
  FRAME_EAT_START,
  FRAME_TALK2_START,
  FRAME_WAVE_START,
} from "../plan";

// Named poses along the timeline. Each segment gets its own local clock
// (starts fresh at t=0) so a transition always begins from a known point.
const SEGMENTS: { action: string; from: number }[] = [
  { action: "scratch head", from: FRAME_SCRATCH_START },
  { action: "talk", from: FRAME_TALK1_START },
  { action: "dig", from: FRAME_DIG_START },
  { action: "eat", from: FRAME_EAT_START },
  { action: "talk", from: FRAME_TALK2_START },
  { action: "wave", from: FRAME_WAVE_START },
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
// Centered on screen — this is a plain character-performance insert, no CTA layout to share space with.
const CAVE_X = W / 2;
// Nudged down a bit so the feet plant into the ground instead of floating above it.
const PUPPET_Y_NUDGE = 40;
// viewBox is "-220 -80 700 640" — its own box-center (local x=130) sits well right
// of the character's actual silhouette (centered near local x=0).
const PUPPET_VISUAL_CENTER_OFFSET = 130;

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

// Official Telegram brand mark (simple-icons "telegram", CC0) — a single compound
// path: the outer disc and the paper-plane cutout share one fill-rule="evenodd"
// path, so filling it brand-blue renders as a blue circle with a white plane.
const TELEGRAM_BLUE = "#29A9EB";
const TELEGRAM_ICON_PATH =
  "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";

// Logo + handle: one horizontal marker planted in the dirt band, between the
// rocks so it clears both the puppet and the right-hand tree — rises up out
// of the ground right as he starts digging, like that's the thing his stick
// just turned up. Styled as a clay/wood tablet (irregular corners, earthy
// fill) rather than a clean white UI pill, so it reads as a ground object.
const BADGE_X = 950;
const BADGE_Y = GROUND_Y + 170; // straddles the ground line — half "buried" at rest
const BADGE_LOGO_SIZE = 100;
const BADGE_RISE_PX = 90; // how far below its resting spot it starts, before rising into place

const GroundLogoBadge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const rise = popIn(frame, fps, FRAME_DIG_START, { damping: 14, mass: 0.8 });
  const opacity = Math.min(rise, 1);
  if (opacity <= 0.01) return null;
  const dy = (1 - Math.min(rise, 1)) * BADGE_RISE_PX;

  return (
    <div
      style={{
        position: "absolute",
        left: BADGE_X,
        top: BADGE_Y + dy,
        transform: "translate(-50%, -50%)",
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: PASTEL.brown,
        border: `4px solid ${INK}`,
        borderRadius: "40px 48px 34px 46px",
        padding: "12px 32px 12px 12px",
        boxShadow: `5px 7px 0 ${INK}44`,
      }}
    >
      <div style={{ width: BADGE_LOGO_SIZE, height: BADGE_LOGO_SIZE, flex: "none" }}>
        <svg width={BADGE_LOGO_SIZE} height={BADGE_LOGO_SIZE} viewBox="0 0 24 24">
          <path d={TELEGRAM_ICON_PATH} fill={TELEGRAM_BLUE} fillRule="evenodd" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: montserrat.fontFamily,
          fontWeight: 800,
          fontSize: 48,
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        @RightClamp
      </div>
    </div>
  );
};

// QR card, up in the clear sky above the right-hand tree's canopy.
const QR_X = 1350;
const QR_TOP = 70;
const QR_SIZE = 400;
const QR_PAD = 14;

const SkyQR: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = popIn(frame, fps, FRAME_EAT_START, { damping: 13, mass: 0.7 });
  const opacity = Math.min(scale, 1);
  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: QR_X - QR_SIZE / 2 - QR_PAD,
        top: QR_TOP,
        width: QR_SIZE + QR_PAD * 2,
        height: QR_SIZE + QR_PAD * 2,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        background: "#fff",
        border: `4px solid ${INK}`,
        borderRadius: 20,
        boxShadow: `4px 6px 0 ${INK}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("images/telegram-qr.png")} style={{ width: QR_SIZE, height: QR_SIZE }} />
    </div>
  );
};

export const CavemanTelegramScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pose = getBlendedPose(cavemanModel, frame, fps);

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

      <GroundLogoBadge frame={frame} fps={fps} />
      <SkyQR frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
