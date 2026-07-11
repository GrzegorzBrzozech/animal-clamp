import React from "react";
import { AbsoluteFill } from "remotion";
import { usePalette } from "~/theme/palette";

type Props = {
  /** Solid color or one of the theme background tokens. Defaults to palette bg. */
  color?: string;
  /** Optional second color → vertical gradient. */
  gradientTo?: string;
  children?: React.ReactNode;
};

/** Full-frame background layer. Stack content on top via children. */
export const Background: React.FC<Props> = ({ color, gradientTo, children }) => {
  const pal = usePalette();
  const base = color ?? pal.bg;
  const background = gradientTo ? `linear-gradient(180deg, ${base} 0%, ${gradientTo} 100%)` : base;

  return <AbsoluteFill style={{ background }}>{children}</AbsoluteFill>;
};
