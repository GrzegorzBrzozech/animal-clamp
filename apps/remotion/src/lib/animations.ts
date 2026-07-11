import {
  interpolate,
  spring,
  Easing,
  type SpringConfig,
} from "remotion";

/**
 * Reusable, frame-driven animation helpers.
 * Every helper is deterministic — no Date.now(), no Math.random().
 */

type InterpOpts = {
  easing?: (n: number) => number;
};

/** Fade in over [start, start+duration]. Returns opacity 0→1. */
export const fadeIn = (
  frame: number,
  start = 0,
  duration = 20,
  opts: InterpOpts = {},
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: opts.easing ?? Easing.out(Easing.cubic),
  });

/** Fade out over [start, start+duration]. Returns opacity 1→0. */
export const fadeOut = (
  frame: number,
  start: number,
  duration = 20,
  opts: InterpOpts = {},
) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: opts.easing ?? Easing.in(Easing.cubic),
  });

/** Translate-in along an axis. Returns pixels offset (→0). */
export const slideIn = (
  frame: number,
  start = 0,
  duration = 20,
  distance = 60,
  opts: InterpOpts = {},
) =>
  interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: opts.easing ?? Easing.out(Easing.cubic),
  });

/** Spring scale/progress 0→1 with a sensible default config. */
export const popIn = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = {},
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, ...config },
  });

/**
 * Staggered delay for list items: item `i` starts `step` frames after the previous.
 */
export const stagger = (i: number, step = 6, base = 0) => base + i * step;
