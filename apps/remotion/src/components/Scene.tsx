import React from "react";
import { AbsoluteFill } from "remotion";
import { spacing } from "~/theme";

type Props = {
  children: React.ReactNode;
  /** Flex alignment of scene content. Defaults to centered. */
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  direction?: React.CSSProperties["flexDirection"];
  gap?: number;
  padding?: number;
  style?: React.CSSProperties;
};

/**
 * Centered flex container used as the root of every scene.
 * Keeps layout consistent so scenes only worry about content.
 */
export const Scene: React.FC<Props> = ({
  children,
  justify = "center",
  align = "center",
  direction = "column",
  gap = spacing.md,
  padding = spacing.xl,
  style,
}) => {
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap,
        padding,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
