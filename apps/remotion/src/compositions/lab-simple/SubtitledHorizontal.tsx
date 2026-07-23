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

export const subtitledHorizontalSchema = z.object({
  videoSrc: z.string().default(""),
  subtitles: z.array(subtitleItemSchema).default([]),
  // When true: blurred version of the video fills the frame, clean video centered on top.
  // Use when source video has pillarbox/letterbox bars cropped out (e.g. 4:3 content in 16:9 output).
  withBlurredBg: z.boolean().default(false),
});

type Props = z.infer<typeof subtitledHorizontalSchema>;
type SubtitleItem = z.infer<typeof subtitleItemSchema>;

export const calculateMetadataHorizontal: CalculateMetadataFunction<Props> = ({ props }) => {
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
  fontSize: 52,
  lineHeight: 1.3,
  textShadow: [
    "3px 3px 0 #000",
    "-3px -3px 0 #000",
    "3px -3px 0 #000",
    "-3px 3px 0 #000",
    "0 3px 0 #000",
    "0 -3px 0 #000",
    "3px 0 0 #000",
    "-3px 0 0 #000",
  ].join(", "),
};

const PlainLine: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ ...textStyle, color: "#ffffff" }}>{text}</span>
);

const HighlightedLine: React.FC<{ subtitle: SubtitleItem }> = ({ subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = subtitle.startSec + frame / fps;

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
        paddingBottom: "8%",
      }}
    >
      <div style={{ opacity, maxWidth: "78%", textAlign: "center" }}>
        {subtitle.words.length > 0 ? (
          <HighlightedLine subtitle={subtitle} />
        ) : (
          <PlainLine text={subtitle.text} />
        )}
      </div>
    </AbsoluteFill>
  );
};

export const SubtitledHorizontal: React.FC<Props> = ({ videoSrc, subtitles, withBlurredBg }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {videoSrc && (
        <>
          {withBlurredBg ? (
            <>
              {/* Blurred fill — covers the pillarbox gaps on sides */}
              <AbsoluteFill>
                <OffthreadVideo
                  src={staticFile(videoSrc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(24px) brightness(0.35)",
                    transform: "scale(1.08)",
                  }}
                />
              </AbsoluteFill>
              {/* Main video — natural proportions, centered, fills full height */}
              <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <OffthreadVideo
                  src={staticFile(videoSrc)}
                  style={{ height: "100%", width: "auto" }}
                />
              </AbsoluteFill>
            </>
          ) : (
            <AbsoluteFill>
              <OffthreadVideo
                src={staticFile(videoSrc)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          )}
          <AbsoluteFill
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 30%)",
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
