/** Shared props for every versioned HominidPencil attempt. */
export type HominidPencilProps = {
  /** Feet anchor on the parent (px). */
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  /** Coloured-pencil tint for the fur cloth; omit for pure graphite. */
  color?: string;
  /** Subtle idle animation (default true). */
  idle?: boolean;
  phase?: number;
  /** Emoji held in the free hand (e.g. "🌿" vegan, "🍖" hunter). */
  hold?: string;
  /** Carry a spear in the right hand (default true). Vegans set false. */
  spear?: boolean;
  /** Idle action flavour. "eat" lifts the held food to the mouth. */
  action?: "idle" | "eat";
};
