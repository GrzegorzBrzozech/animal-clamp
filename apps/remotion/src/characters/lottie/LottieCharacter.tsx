import React, { useEffect, useState } from "react";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import { cancelRender, continueRender, delayRender, staticFile, Freeze, Sequence } from "remotion";
import type { LottieCharacterName } from "./catalog.generated";

// The available creatures are derived from the .json files in
// public/characters/lottie/. Add one by dropping its file there and running
// `npm run sync:characters` (regenerates ./catalog.generated.ts). Never edit the
// list by hand.
export type { LottieCharacterName };

export type LottieCharacterProps = {
  name: LottieCharacterName;
  /** Center of the character, in composition pixels. */
  x: number;
  y: number;
  /** Rendered box size (square), in pixels. */
  size: number;
  /** 1 faces right, -1 mirrors horizontally. */
  facing?: 1 | -1;
  rotate?: number;
  opacity?: number;
  loop?: boolean;
  /** >1 plays the internal wobble faster, <1 slower. */
  playbackRate?: number;
  /** Drain the color — used to mark a Lottie creature as a victim. */
  grayscale?: boolean;
  /** Freeze the animation at this (scene-local) frame — e.g. when caught. */
  freezeAtFrame?: number;
  /**
   * Skip the first N internal frames of the clip — i.e. start playback partway
   * in. Use to cut an intro (e.g. begin at the "eating" beat, not the hop).
   * Find N by scrubbing the clip in Studio; it's measured in the clip's own
   * frames (see its `fr`/`op`).
   */
  startFrame?: number;
};

/**
 * Drop-in, reusable Lottie creature. Frame-synced to the Remotion timeline
 * (deterministic) and positioned by its center so callers can choreograph
 * movement from useCurrentFrame() in the parent. Loads its JSON from
 * public/characters/lottie/<name>.json and holds the render until ready.
 */
export const LottieCharacter: React.FC<LottieCharacterProps> = ({
  name,
  x,
  y,
  size,
  facing = 1,
  rotate = 0,
  opacity = 1,
  loop = true,
  playbackRate = 1,
  grayscale = false,
  freezeAtFrame,
  startFrame = 0,
}) => {
  const [handle] = useState(() => delayRender(`lottie:${name}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(staticFile(`characters/lottie/${name}.json`))
      .then((res) => res.json())
      .then((json: LottieAnimationData) => {
        if (!alive) return;
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
    return () => {
      alive = false;
    };
  }, [handle, name]);

  if (!data) return null;

  const lottie = (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: `rotate(${rotate}deg) scaleX(${facing})`,
        opacity,
        filter: grayscale ? "grayscale(0.85) brightness(0.78)" : undefined,
      }}
    >
      <Lottie animationData={data} loop={loop} playbackRate={playbackRate} style={{ width: "100%", height: "100%" }} />
    </div>
  );

  // Freeze the internal animation on a given frame (e.g. the moment of capture).
  const framed = freezeAtFrame != null ? <Freeze frame={freezeAtFrame}>{lottie}</Freeze> : lottie;

  // Skip an intro: a negative `from` shifts the clip's frame forward by
  // startFrame, so playback begins partway in. layout="none" keeps our own
  // absolute positioning (Sequence would otherwise wrap it in an AbsoluteFill).
  return startFrame > 0 ? (
    <Sequence from={-startFrame} layout="none">
      {framed}
    </Sequence>
  ) : (
    framed
  );
};
