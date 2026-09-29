/**
 * Versioned WomanPencil attempts. Every iteration is kept as its own `vN.tsx`
 * (never overwritten); promote one by repointing `WomanLatest`. The canonical
 * component is re-exported as `WomanPencil` from ../WomanPencil.tsx.
 */
import type { FC } from "react";
import { WomanV1 } from "./v1";
import type { WomanPencilProps } from "./types";

export { WomanV1 } from "./v1";
export type { WomanPencilProps, WomanPose } from "./types";

type WomanVersion = { label: string; Comp: FC<WomanPencilProps> };

/** Ordered version registry for the comparison lab (latest last). */
export const WOMAN_VERSIONS: WomanVersion[] = [{ label: "v1", Comp: WomanV1 }];

/** Current canonical version. */
export const WomanLatest = WomanV1;
