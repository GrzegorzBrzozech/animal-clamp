/** Versioned DeerPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { DeerV1 } from "./v1";

export { DeerV1, type DeerPencilProps } from "./v1";

export const DEER_VERSIONS = [{ label: "v1", Comp: DeerV1 }];

/** Current canonical version. */
export const DeerLatest = DeerV1;
