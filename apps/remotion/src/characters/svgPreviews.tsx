import React from "react";
import { colors } from "~/theme";
import { Frog } from "./svg/Frog";
import { Fish } from "./svg/Fish";
import { Worm } from "./svg/Worm";
import { Rat } from "./svg/Rat";
import { ButterflyVector } from "./svg/ButterflyVector";
import { Critter } from "./svg/Critter";
import { Deer } from "./svg/Deer";
import { Hominid } from "./svg/Hominid";
import { Plant, Sun } from "./svg/Flora";

/**
 * Preview registry for the code-drawn SVG characters — the analogue of
 * LOTTIE_CHARACTERS. Each entry knows how to render itself centered at (cx, cy)
 * roughly `size` tall, hiding each component's own positioning convention
 * (some are center-based, Deer/Hominid/Plant anchor at their feet, etc.).
 * Used by CharacterGallery so SVG creatures show up alongside the Lottie ones.
 */
export type SvgPreview = {
  name: string;
  render: (cx: number, cy: number, size: number) => React.ReactNode;
};

export const SVG_PREVIEWS: SvgPreview[] = [
  { name: "frog", render: (cx, cy, s) => <Frog x={cx} y={cy} size={s} moving /> },
  { name: "fish", render: (cx, cy, s) => <Fish x={cx} y={cy} size={s} moving /> },
  { name: "worm", render: (cx, cy, s) => <Worm x={cx} y={cy} size={s} moving /> },
  { name: "rat", render: (cx, cy, s) => <Rat x={cx} y={cy} size={s} moving /> },
  { name: "butterfly-vector", render: (cx, cy, s) => <ButterflyVector x={cx} y={cy} size={s} moving /> },
  { name: "critter", render: (cx, cy, s) => <Critter x={cx} y={cy} size={s} color={colors.success} moving /> },
  // Feet-anchored (translate -100%): drop the anchor to the cell's lower half.
  { name: "deer", render: (cx, cy, s) => <Deer x={cx} y={cy + s / 2} scale={s / 160} /> },
  { name: "hominid", render: (cx, cy, s) => <Hominid x={cx} y={cy + s / 2} scale={s / 150} pose="walk" /> },
  { name: "plant", render: (cx, cy, s) => <Plant x={cx} y={cy + s / 2} scale={s / 50} /> },
  { name: "sun", render: (cx, cy, s) => <Sun x={cx} y={cy} r={s / 3} /> },
];
