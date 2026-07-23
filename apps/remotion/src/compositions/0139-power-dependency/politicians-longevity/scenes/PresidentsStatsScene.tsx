import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, INK } from "~/characters";
import { montserrat } from "~/lib/fonts";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp);

// Video is 8 s long at 30 fps
const VIDEO_DUR_FRAMES = 240;
const TRANSITION_DUR = 24; // 0.8 s

// Phase-2 layout: video on the right, stats on the left
const STATS_W = 640;
const VID_X = STATS_W + 20;       // 660
const VID_W = 1920 - VID_X - 20;  // 1240
const VID_H = Math.round(VID_W * 9 / 16); // 697  (true 16:9)
const VID_TOP = Math.round((1080 - VID_H) / 2); // 191

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  at: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - at, config: { damping: 18, mass: 0.9 }, from: 0, to: 1 });

  return (
    <div style={{
      transform: `scale(${s})`,
      transformOrigin: "left center",
      opacity: s,
      textAlign: "left",
      marginBottom: 28,
    }}>
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 20,
        fontWeight: 600,
        color: "#6E685A",
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: "uppercase" as const,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 90,
        fontWeight: 900,
        color,
        lineHeight: 1,
        textShadow: `2px 2px 0 ${INK}22`,
      }}>
        {value}
      </div>
    </div>
  );
};

const DiffBar: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - at, config: { damping: 14 }, from: 0, to: 1 });

  return (
    <div style={{
      opacity: s,
      transform: `scaleX(${s})`,
      transformOrigin: "left center",
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "#f59e0b22",
        border: "3px solid #f59e0b",
        borderRadius: 14,
        padding: "8px 28px",
      }}>
        <span style={{ fontSize: 38, color: "#f59e0b" }}>↑</span>
        <span style={{
          fontFamily: montserrat.fontFamily,
          fontSize: 34,
          fontWeight: 800,
          color: INK,
        }}>
          +12 р. різниця
        </span>
      </div>
    </div>
  );
};

export const PresidentsStatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const t = Math.max(0, frame - VIDEO_DUR_FRAMES);
  const tProg = Math.min(t / TRANSITION_DUR, 1);

  // Video: full-screen → right panel
  const vidLeft  = interpolate(tProg, [0, 1], [0,       VID_X],   clamp);
  const vidTop   = interpolate(tProg, [0, 1], [0,       VID_TOP], clamp);
  const vidW     = interpolate(tProg, [0, 1], [1920,    VID_W],   clamp);
  const vidH     = interpolate(tProg, [0, 1], [1080,    VID_H],   clamp);

  // PaperBackground only visible in phase 2
  const bgOp = interpolate(tProg, [0, 1], [0, 1], clamp);

  // Stats slide in after transition
  const statsOp    = frame >= VIDEO_DUR_FRAMES + TRANSITION_DUR ? fade(frame, VIDEO_DUR_FRAMES + TRANSITION_DUR, 8) : 0;
  const statsDelay = VIDEO_DUR_FRAMES + TRANSITION_DUR;

  return (
    <AbsoluteFill>
      {/* Paper background fades in during transition */}
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <PaperBackground />
      </div>

      {/* Video — animates from full-screen to right panel */}
      <div style={{
        position: "absolute",
        left: vidLeft,
        top: vidTop,
        width: vidW,
        height: vidH,
        borderRadius: tProg > 0.05 ? 16 : 0,
        overflow: "hidden",
        border: tProg > 0.05 ? `3px solid ${INK}33` : "none",
        boxShadow: tProg > 0.05 ? `0 6px 32px ${INK}22` : "none",
        background: "#000",
      }}>
        <OffthreadVideo
          src={staticFile("projects/politicians-longevity/presidents-longevity.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Stats panel — appears after video */}
      <div style={{
        position: "absolute",
        left: 100,
        top: 0,
        width: STATS_W,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 40px 0 60px",
        opacity: statsOp,
      }}>
        <StatCard label="Президент США" value="79 р." color="#f59e0b" at={statsDelay} />
        <StatCard label="Середній американець (XX ст.)" value="67 р." color="#60a5fa" at={statsDelay + 20} />
        <DiffBar at={statsDelay + 45} />
      </div>

    </AbsoluteFill>
  );
};
