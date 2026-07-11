/** Versioned WormPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { WormV1 } from "./v1";

export { WormV1 } from "./v1";

export const WORM_VERSIONS = [{ label: "v1", Comp: WormV1 }];

/** Current canonical version. */
export const WormLatest = WormV1;
