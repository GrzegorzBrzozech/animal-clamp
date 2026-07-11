/** Versioned FishPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { FishV1 } from "./v1";

export { FishV1 } from "./v1";

export const FISH_VERSIONS = [{ label: "v1", Comp: FishV1 }];

/** Current canonical version. */
export const FishLatest = FishV1;
