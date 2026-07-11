/** Versioned RatPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { RatV1 } from "./v1";

export { RatV1 } from "./v1";

export const RAT_VERSIONS = [{ label: "v1", Comp: RatV1 }];

/** Current canonical version. */
export const RatLatest = RatV1;
