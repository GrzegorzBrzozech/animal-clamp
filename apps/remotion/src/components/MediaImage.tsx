import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from "remotion";
import { fadeIn } from "~/lib/animations";
import { montserrat } from "~/lib/fonts";
import { colors, radii } from "~/theme";

type Props = {
  /** Path under public/, e.g. "frendcoin/warren-portrait.jpg". */
  src: string;
  /** Frame at which the image fades in. */
  delay?: number;
  width?: number | string;
  height?: number | string;
  /** Subtle slow zoom ("Ken Burns"). Set 0 to disable. */
  zoom?: number;
  caption?: string;
  borderColor?: string;
  style?: React.CSSProperties;
};

/** Fade-in image with an optional slow zoom and caption. Reusable across videos. */
export const MediaImage: React.FC<Props> = ({
  src,
  delay = 0,
  width = 460,
  height = 460,
  zoom = 0.08,
  caption,
  borderColor = colors.border,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = fadeIn(frame, delay, 18);
  const scale = interpolate(frame, [delay, durationInFrames], [1, 1 + zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          width,
          height,
          overflow: "hidden",
          borderRadius: radii.md,
          border: `2px solid ${borderColor}`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
      {caption ? (
        <span
          style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 26,
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
};
