import React from "react";
import { useCurrentFrame } from "remotion";
import { montserrat } from "~/lib/fonts";
import { fadeIn, fadeOut, slideIn } from "~/lib/animations";
import { fontSizes, fontWeights, radii, spacing } from "~/theme";
import { usePalette } from "~/theme/palette";

type Props = {
  children: React.ReactNode;
  /** Frame at which the pill fades/slides in. */
  delay: number;
  /** Frame at which it starts fading out. Omit to stay visible. */
  exitAt?: number;
  duration?: number;
  color?: string;
  background?: string;
  size?: number;
  style?: React.CSSProperties;
};

/**
 * Bottom-third label pill — real-footage "explainer" caption (a term, a
 * category, a short phrase) over full-bleed video/photo. Promoted from a
 * scene-local original (lab-complex/carnivores/HumansScene) into the shared
 * library per the "everything reusable is shared" rule.
 */
export const LowerThird: React.FC<Props> = ({
  children,
  delay,
  exitAt,
  duration = 16,
  color,
  background,
  size = fontSizes.body,
  style,
}) => {
  const frame = useCurrentFrame();
  const pal = usePalette();
  const inOp = fadeIn(frame, delay, duration);
  const outOp = exitAt != null ? fadeOut(frame, exitAt, duration) : 1;
  const opacity = Math.min(inOp, outOp);
  const translateY = slideIn(frame, delay, duration, 24);

  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: "50%",
        transform: `translate(-50%, ${translateY}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: spacing.md,
        background: background ?? "#000000b0",
        border: `2px solid ${pal.border}55`,
        borderRadius: radii.lg,
        padding: `${spacing.sm}px ${spacing.lg}px`,
        fontFamily: montserrat.fontFamily,
        fontSize: size,
        fontWeight: fontWeights.bold,
        color: color ?? "#FFFFFF",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
