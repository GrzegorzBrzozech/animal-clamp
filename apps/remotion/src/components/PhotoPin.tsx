import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile, interpolate, spring } from "remotion";
import { montserrat } from "~/lib/fonts";
import { INK, PAPER } from "~/characters/svg/_pencil";

type Props = {
  /** Path under public/, e.g. "projects/rothbard/00-00_rothbard-portrait.jpg". */
  src: string;
  width?: number;
  height?: number;
  /** Frame at which it pops onto the paper. */
  delay?: number;
  /** Resting tilt in degrees (a hand-pinned photo is never perfectly straight). */
  rotate?: number;
  /** Slow Ken-Burns zoom; 0 to disable. */
  zoom?: number;
  caption?: string;
  /** Small date/label chip on the tape. */
  date?: string;
  /** "tape" (two strips of masking tape) or "pin" (a push-pin at top). */
  hold?: "tape" | "pin";
  /** CSS objectFit for the image inside the frame. Default "cover". */
  objectFit?: React.CSSProperties["objectFit"];
  style?: React.CSSProperties;
};

/**
 * A real photograph presented as if pinned/taped onto the paper notebook — the
 * bridge that lets historical images live inside the pencil-on-paper look.
 * White photo border, slight tilt, masking-tape or a push-pin, pencil caption.
 * Deterministic; reusable across history/explainer videos.
 */
export const PhotoPin: React.FC<Props> = ({
  src,
  width = 460,
  height = 560,
  delay = 0,
  rotate = -3,
  zoom = 0.08,
  caption,
  date,
  hold = "tape",
  objectFit = "cover",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 14, mass: 0.7 } });
  const scale = interpolate(frame, [delay, durationInFrames], [1, 1 + zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        opacity: s,
        transform: `rotate(${rotate}deg) scale(${s})`,
        transformOrigin: "top center",
        ...style,
      }}
    >
      {/* the photo — white paper border, hand-drawn ink frame */}
      <div
        style={{
          background: "#FBF7EC",
          padding: 14,
          paddingBottom: caption ? 14 : 18,
          boxShadow: "0 10px 26px #00000030",
          border: `2px solid ${INK}44`,
        }}
      >
        <div style={{ width: "100%", height, overflow: "hidden", background: "#000" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit, transform: `scale(${scale})` }} />
        </div>
        {caption ? (
          <div
            style={{
              marginTop: 10,
              textAlign: "center",
              fontFamily: montserrat.fontFamily,
              fontSize: 26,
              fontWeight: 800,
              color: INK,
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>

      {/* masking tape strips */}
      {hold === "tape" ? (
        <>
          <div style={tape(-18, "18%", -22)} />
          <div style={tape(-14, "72%", 16)} />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#BC5147",
            border: `3px solid ${INK}`,
            boxShadow: "0 4px 8px #00000040",
          }}
        />
      )}

      {/* date chip */}
      {date ? (
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -18,
            transform: "rotate(6deg)",
            background: PAPER,
            border: `3px solid ${INK}`,
            borderRadius: 8,
            padding: "4px 14px",
            fontFamily: montserrat.fontFamily,
            fontSize: 30,
            fontWeight: 900,
            color: INK,
          }}
        >
          {date}
        </div>
      ) : null}
    </div>
  );
};

const tape = (top: number, left: string, rot: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left,
  transform: `translateX(-50%) rotate(${rot}deg)`,
  width: 96,
  height: 34,
  background: "#D8CFB4cc",
  border: "1px solid #00000018",
});
