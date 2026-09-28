import type { PuppetModel } from '@animal-clamp/puppet';
import { model as cavemanModelRaw } from './caveman-model';
import { model as pithecanthropusModelRaw } from './pithecanthropus-model';

export { PuppetActor } from './PuppetActor';
// Puppet Studio exports these as plain JSON literals (no `satisfies PuppetModel`),
// so TS widens fields like `drawAs` to `string` — assert the shared type once here
// rather than re-annotating the generated files (they get overwritten on every export).
export const cavemanModel = cavemanModelRaw as PuppetModel;
export const pithecanthropusModel = pithecanthropusModelRaw as PuppetModel;
