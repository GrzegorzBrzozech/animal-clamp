/** Versioned AmoebaPencil attempts. Add new tries as v2.tsx, v3.tsx … never overwrite. */
import { AmoebaV1 } from "./v1";

export { AmoebaV1 } from "./v1";

export const AMOEBA_VERSIONS = [{ label: "v1", Comp: AmoebaV1 }];

/** Current canonical version. */
export const AmoebaLatest = AmoebaV1;
