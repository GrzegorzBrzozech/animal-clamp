import type React from "react";

/**
 * Poses the woman supports. Deliberately a SUBSET of `PersonPose` (same names)
 * so she can be dropped in wherever a `PersonPencil` stood.
 */
export type WomanPose = "stand" | "present";

export type WomanPencilProps = {
  size: number;
  /** Mirror horizontally; she faces right by default (like `PersonPencil`). */
  facing?: 1 | -1;
  pose?: WomanPose;
  /** Dress tone — the coloured-pencil hatch on bodice + skirt. */
  color?: string;
  /** Hair tone (graphite by default). */
  hairColor?: string;
  style?: React.CSSProperties;
};
