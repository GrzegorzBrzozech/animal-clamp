/** Shared contract for every code-drawn SVG creature. */
export type CreatureProps = {
  /** Center of the creature, in composition pixels. */
  x: number;
  y: number;
  /** Bounding height, in pixels (width derived from aspect). */
  size: number;
  /** 1 faces right, -1 mirrors horizontally. */
  facing?: 1 | -1;
  /** Victim state: ✖ eyes, drained color, droop. */
  hurt?: boolean;
  /** Wobble/animation phase offset. */
  phase?: number;
  /** Stronger locomotion when true. */
  moving?: boolean;
};

/** Desaturate a creature's main color when it has become a victim. */
export const drained = "#8A9A8F";
