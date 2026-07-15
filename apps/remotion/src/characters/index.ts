/**
 * Shared, video-agnostic character library.
 *
 * Reusable across every composition (import via `~/characters`). Hosts both the
 * Lottie creature system (lottie/) and all code-drawn SVG characters & scenery
 * (svg/). Anything drawable lives here — never inside a single composition.
 */
export { PuppetActor } from "./puppet/PuppetActor";
export { cavemanModel } from "./puppet/caveman-model";

export { LottieCharacter } from "./lottie/LottieCharacter";
export type { LottieCharacterName, LottieCharacterProps } from "./lottie/LottieCharacter";

export { Frog } from "./svg/Frog";
export { Fish } from "./svg/Fish";
export { Worm } from "./svg/Worm";
export { Rat } from "./svg/Rat";
export { ButterflyVector } from "./svg/ButterflyVector";
export type { CreatureProps } from "./svg/types";

// Code-drawn characters & scenery (formerly carnivores-local).
export { Critter } from "./svg/Critter";
export { Deer } from "./svg/Deer";
export { Hominid, type HominidPose } from "./svg/Hominid";
export { Plant, Grass, Sun } from "./svg/Flora";

// ── Pencil-on-paper style (macket look) ──────────────────────────────────────
// Bold graphite outline + faceted/angular forms + optional pastel tint, on a
// warm paper background. See svg/_pencil.tsx for the shared style system and
// svg/PENCIL_STYLE.md for the full guide + AI generation prompt + animation spec.
export { PaperBackground, PencilDefs, Sketch, Hatch, Part, INK, PAPER, PASTEL } from "./svg/_pencil";
export { FrogPencil } from "./svg/FrogPencil";
export { RatPencil } from "./svg/RatPencil";
export { DeerPencil } from "./svg/DeerPencil";
export { HominidPencil } from "./svg/HominidPencil";
export { AmoebaPencil } from "./svg/AmoebaPencil";
export { FishPencil } from "./svg/FishPencil";
export { WormPencil } from "./svg/WormPencil";
export { ButterflyPencil } from "./svg/ButterflyPencil";

// Pencil-on-paper school / science objects (books, stamp, flask, building, page, head).
export { BookPencil, StampMark, FlaskPencil, BuildingPencil, PagePencil, HeadPencil, ManuscriptPencil, HousePencil } from "./svg/SchoolObjects";
export { PersonPencil, type PersonPose } from "./svg/PersonPencil";
export { PoliticianPencil } from "./svg/PoliticianPencil";
export { OfficerPencil } from "./svg/OfficerPencil";
export { BarrierPencil } from "./svg/BarrierPencil";
export { Seagull } from "./svg/Seagull";
export { KingPencil } from "./svg/KingPencil";
export { PrincessPencil } from "./svg/PrincessPencil";

/** Catalog of pencil-style SVG creatures (macket look). */
export const PENCIL_CHARACTERS = ["frog", "rat", "deer", "hominid", "amoeba", "fish", "worm", "butterfly"] as const;

/** Catalog of bundled Lottie creatures — auto-generated from public/characters/lottie/. */
export { LOTTIE_CHARACTERS } from "./lottie/catalog.generated";

/** Catalog of code-drawn SVG creatures (Flora = scenery: plant/grass/sun). */
export const SVG_CHARACTERS = ["frog", "fish", "worm", "rat", "butterfly-vector", "critter", "deer", "hominid"] as const;

/** Render registry for SVG creatures — used by galleries/pickers. */
export { SVG_PREVIEWS, type SvgPreview } from "./svgPreviews";
