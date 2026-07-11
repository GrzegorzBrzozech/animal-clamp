/**
 * Versioned HominidPencil attempts. Every iteration is kept as its own `vN.tsx`
 * (never overwritten) so versions can be compared in the HominidVersions lab and
 * the best one chosen. The newest is re-exported as the canonical `HominidPencil`
 * from ../HominidPencil.tsx.
 */
import type { FC } from "react";
import { HominidV1 } from "./v1";
import { HominidV2 } from "./v2";
import { HominidV3 } from "./v3";
import type { HominidPencilProps } from "./types";

export { HominidV1 } from "./v1";
export { HominidV2 } from "./v2";
export { HominidV3 } from "./v3";
export type { HominidPencilProps } from "./types";

type HominidVersion = { label: string; Comp: FC<HominidPencilProps> };

/** Ordered version registry for the comparison lab (latest last). */
export const HOMINID_VERSIONS: HominidVersion[] = [
  { label: "v1", Comp: HominidV1 },
  { label: "v2", Comp: HominidV2 },
  { label: "v3", Comp: HominidV3 },
];

/** The current canonical version (v3 = the user's favourite m2 look + actions). */
export const HominidLatest = HominidV3;
