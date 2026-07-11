/**
 * Canonical pencil-on-paper early human (macket "первісна людина").
 *
 * Re-exports the latest versioned attempt from ./hominid/. Every iteration is
 * preserved as ./hominid/vN.tsx (never overwritten) — compare them in the
 * HominidVersions lab and promote the chosen one by repointing `HominidLatest`.
 */
export { HominidLatest as HominidPencil } from "./hominid-pencil";
export type { HominidPencilProps } from "./hominid-pencil/types";
