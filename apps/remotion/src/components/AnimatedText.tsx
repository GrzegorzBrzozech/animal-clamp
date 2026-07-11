import React from "react";
import { useCurrentFrame } from "remotion";
import { montserrat } from "~/lib/fonts";
import { fadeIn, slideIn } from "~/lib/animations";
import { fontSizes, fontWeights } from "~/theme";
import { usePalette } from "~/theme/palette";

type Props = {
  children: React.ReactNode;
  /** Frame (relative to the enclosing Sequence) at which the entrance begins. */
  delay?: number;
  /** Entrance duration in frames. */
  duration?: number;
  /** Slide distance in px; set 0 to disable the slide. */
  slide?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: React.CSSProperties["textAlign"];
  maxWidth?: number | string;
  style?: React.CSSProperties;
};

/** Fade + slide text entrance. Pure function of the current frame. */
export const AnimatedText: React.FC<Props> = ({
  children,
  delay = 0,
  duration = 22,
  slide = 40,
  size = fontSizes.heading,
  weight = fontWeights.bold,
  color,
  align = "center",
  maxWidth = "70%",
  style,
}) => {
  const frame = useCurrentFrame();
  const pal = usePalette();
  const opacity = fadeIn(frame, delay, duration);
  const translateY = slideIn(frame, delay, duration, slide);

  return (
    <div
      style={{
        fontFamily: montserrat.fontFamily,
        fontSize: size,
        fontWeight: weight,
        color: color ?? pal.text,
        textAlign: align,
        maxWidth,
        lineHeight: 1.2,
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
