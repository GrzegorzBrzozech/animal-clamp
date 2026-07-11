/** Versioned FrogPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { FrogV1 } from "./v1";

export { FrogV1 } from "./v1";

export const FROG_VERSIONS = [{ label: "v1", Comp: FrogV1 }];

/** Current canonical version. */
export const FrogLatest = FrogV1;
