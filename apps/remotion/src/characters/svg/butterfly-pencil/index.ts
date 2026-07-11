/** Versioned ButterflyPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { ButterflyV1 } from "./v1";

export { ButterflyV1 } from "./v1";

export const BUTTERFLY_VERSIONS = [{ label: "v1", Comp: ButterflyV1 }];

/** Current canonical version. */
export const ButterflyLatest = ButterflyV1;
