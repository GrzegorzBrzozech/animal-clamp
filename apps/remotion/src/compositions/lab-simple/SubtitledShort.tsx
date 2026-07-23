import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { montserrat } from "~/lib/fonts";

const wordSchema = z.object({
  word: z.string(),
  startSec: z.number(),
  endSec: z.number(),
});

const subtitleItemSchema = z.object({
  startSec: z.number(),
  endSec: z.number(),
  text: z.string(),
  words: z.array(wordSchema).default([]),
});

export const subtitledShortSchema = z.object({
  videoSrc: z.string().default(""),
  subtitles: z.array(subtitleItemSchema).default([]),
  alreadyVertical: z.boolean().default(false),
});

type SubtitleItem = z.infer<typeof subtitleItemSchema>;
type Props = z.infer<typeof subtitledShortSchema>;

export const calculateMetadata: CalculateMetadataFunction<Props> = ({ props }) => {
  const last = props.subtitles?.at(-1);
  const fps = 30;
  const durationInFrames = last ? Math.ceil(last.endSec * fps) + fps : fps * 10;
  return { durationInFrames };
};

const HIGHLIGHT = "#FFD700";
const FADE = 4;

const textStyle: React.CSSProperties = {
  fontFamily: montserrat.fontFamily,
  fontWeight: 900,
  fontSize: 68,
  lineHeight: 1.25,
  textShadow: [
    "4px 4px 0 #000",
    "-4px -4px 0 #000",
    "4px -4px 0 #000",
    "-4px 4px 0 #000",
    "0 4px 0 #000",
    "0 -4px 0 #000",
    "4px 0 0 #000",
    "-4px 0 0 #000",
  ].join(", "),
};

// Plain sentence — no word timestamps available
const PlainLine: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ ...textStyle, color: "#ffffff" }}>{text}</span>
);

// Sentence with per-word highlight
const HighlightedLine: React.FC<{ subtitle: SubtitleItem }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // frame is relative to sequence start, so absolute time = subtitle.startSec + frame/fps
  const currentSec = subtitle.startSec + frame / fps;

  // Last word whose startSec has passed → stays highlighted until next word starts
  const activeIdx = subtitle.words.reduce<number>((acc, w, i) => {
    return currentSec >= w.startSec ? i : acc;
  }, -1);

  return (
    <span style={textStyle}>
      {subtitle.words.map((w, i) => (
        <span key={i} style={{ color: i === activeIdx ? HIGHLIGHT : "#ffffff" }}>
          {w.word}
          {i < subtitle.words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
};

const SubtitleLine: React.FC<{ subtitle: SubtitleItem; totalFrames: number }> = ({
  subtitle,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, FADE, totalFrames - FADE, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "15%",
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: "82%",
          textAlign: "center",
        }}
      >
        {subtitle.words.length > 0 ? (
          <HighlightedLine subtitle={subtitle} />
        ) : (
          <PlainLine text={subtitle.text} />
        )}
      </div>
    </AbsoluteFill>
  );
};

export const SubtitledShort: React.FC<Props> = ({ videoSrc, subtitles, alreadyVertical }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {videoSrc && (
        <>
          {alreadyVertical ? (
            // Already 9:16 — show full-frame, skip letterbox/blur background
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(videoSrc)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          ) : (
            <>
              {/* Blurred fill background — covers empty pillarbox/letterbox areas */}
              <AbsoluteFill>
                <OffthreadVideo
                  src={staticFile(videoSrc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(28px) brightness(0.35)",
                    transform: "scale(1.1)",
                  }}
                />
              </AbsoluteFill>

              {/* Main video — capped at 62% height so subtitles (bottom 15%) never overlap */}
              <AbsoluteFill style={{ alignItems: "flex-start", paddingTop: "5%" }}>
                <OffthreadVideo
                  src={staticFile(videoSrc)}
                  style={{ width: "100%", height: "auto", maxHeight: "62%" }}
                />
              </AbsoluteFill>

              {/* Top gradient */}
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 22%)",
                  pointerEvents: "none",
                }}
              />
            </>
          )}

          {/* Bottom gradient — subtitle readability */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 38%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      {subtitles.map((sub, i) => {
        const from = Math.round(sub.startSec * fps);
        const duration = Math.max(1, Math.round(sub.endSec * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SubtitleLine subtitle={sub} totalFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
