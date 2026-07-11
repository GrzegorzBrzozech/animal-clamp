import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { popIn } from "~/lib/animations";
import { radii, spacing } from "~/theme";
import { usePalette } from "~/theme/palette";

type Props = {
  children: React.ReactNode;
  /** Frame at which the card springs in. */
  delay?: number;
  background?: string;
  borderColor?: string;
  padding?: number;
  style?: React.CSSProperties;
};

/** Spring-in surface card for grouping content (icons, labels, stats). */
export const Card: React.FC<Props> = ({
  children,
  delay = 0,
  background,
  borderColor,
  padding = spacing.lg,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const scale = popIn(frame, fps, delay);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.sm,
        background: background ?? pal.surface,
        border: `2px solid ${borderColor ?? pal.border}`,
        borderRadius: radii.lg,
        padding,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
