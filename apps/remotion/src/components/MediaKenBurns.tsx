import React from "react";
import { Img, Loop, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { fadeIn } from "~/lib/animations";

type GradientSide = "bottom" | "top" | "left" | "right" | "full" | "none";

type Props = {
  /** Path under public/, e.g. "projects/seller-margin/opex-warehouse.jpg". */
  src: string;
  /** "video" / "image" — inferred from the file extension if omitted. */
  kind?: "video" | "image";
  /**
   * The span (frames, relative to the enclosing Sequence) over which the slow
   * zoom/pan plays out. Pass the SCENE's own durationInFrames — reading
   * useVideoConfig() here would give the whole composition's length, not the
   * nested Sequence's, and the move would play far too slowly.
   */
  durationInFrames: number;
  /** Frame at which the clip fades in. */
  delay?: number;
  fadeInFrames?: number;
  /** Total scale added over `durationInFrames` (1 → 1+zoom). 0 disables. */
  zoom?: number;
  /** "in" grows the whole time; "out" starts zoomed and settles back to 1. */
  zoomDirection?: "in" | "out";
  /** Total pixel pan added over `durationInFrames`. */
  panX?: number;
  panY?: number;
  fit?: "cover" | "contain";
  /** Where to start playback inside the source video (seconds). */
  startFromSec?: number;
  muted?: boolean;
  /**
   * Repeat the source clip to fill `durationInFrames` — for short B-roll
   * (5-10s) playing under a much longer narration slot. Requires
   * `mediaDurationInFrames` (the clip's own real length in frames); the
   * Ken-Burns zoom/pan still interpolates smoothly across the FULL scene
   * span, independent of where the underlying loop restarts.
   */
  loop?: boolean;
  mediaDurationInFrames?: number;
  /** Dark gradient scrim for legible text on top of busy footage. */
  gradient?: GradientSide;
  gradientStrength?: number;
  style?: React.CSSProperties;
};

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

const gradientCss = (side: GradientSide, strength: number): string | undefined => {
  const dark = `rgba(0,0,0,${strength})`;
  switch (side) {
    case "bottom":
      return `linear-gradient(to bottom, transparent 45%, ${dark} 100%)`;
    case "top":
      return `linear-gradient(to top, transparent 45%, ${dark} 100%)`;
    case "left":
      return `linear-gradient(to left, transparent 45%, ${dark} 100%)`;
    case "right":
      return `linear-gradient(to right, transparent 45%, ${dark} 100%)`;
    case "full":
      return `linear-gradient(to bottom, ${dark} 0%, rgba(0,0,0,${strength * 0.35}) 40%, ${dark} 100%)`;
    default:
      return undefined;
  }
};

/**
 * Full-bleed real photo/video with a slow Ken-Burns zoom/pan — the "montage
 * layer" primitive for videos built from real B-roll rather than drawn scenes
 * (see 0157-translate-costs/seller-margin/plot.md: "реальний кліп/фото +
 * просте Ken Burns + текстовий оверлей", no illustrated backgrounds).
 */
export const MediaKenBurns: React.FC<Props> = ({
  src,
  kind,
  durationInFrames,
  delay = 0,
  fadeInFrames = 16,
  zoom = 0.12,
  zoomDirection = "in",
  panX = 0,
  panY = 0,
  fit = "cover",
  startFromSec = 0,
  muted = true,
  loop = false,
  mediaDurationInFrames,
  gradient = "none",
  gradientStrength = 0.6,
  style,
}) => {
  const frame = useCurrentFrame();
  const resolvedKind = kind ?? (VIDEO_EXT.test(src) ? "video" : "image");
  const opacity = fadeIn(frame, delay, fadeInFrames);

  const [scaleFrom, scaleTo] = zoomDirection === "in" ? [1, 1 + zoom] : [1 + zoom, 1];
  const scale = interpolate(frame, [0, durationInFrames], [scaleFrom, scaleTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: fit,
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000", opacity, ...style }}>
      {resolvedKind === "video" ? (
        loop && mediaDurationInFrames ? (
          <Loop durationInFrames={mediaDurationInFrames}>
            <OffthreadVideo
              src={staticFile(src)}
              startFrom={Math.round(startFromSec * 30)}
              muted={muted}
              style={mediaStyle}
            />
          </Loop>
        ) : (
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={Math.round(startFromSec * 30)}
            muted={muted}
            style={mediaStyle}
          />
        )
      ) : (
        <Img src={staticFile(src)} style={mediaStyle} />
      )}
      {gradient !== "none" ? (
        <div style={{ position: "absolute", inset: 0, background: gradientCss(gradient, gradientStrength) }} />
      ) : null}
    </div>
  );
};
