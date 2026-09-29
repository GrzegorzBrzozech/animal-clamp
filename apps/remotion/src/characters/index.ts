/**
 * Shared, video-agnostic character library.
 *
 * Reusable across every composition (import via `~/characters`). Hosts both the
 * Lottie creature system (lottie/) and all code-drawn SVG characters & scenery
 * (svg/). Anything drawable lives here — never inside a single composition.
 */
export { PuppetActor, cavemanModel } from "./puppet";

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
export { WomanPencil, type WomanPencilProps, type WomanPose } from "./svg/WomanPencil";
export { DiggerPencil } from "./svg/DiggerPencil";
// NOTE: `PortraitPencil` (the drawn-face framed portrait) is archived in
// `svg/_archive/PortraitPencil.tsx` — use `~/components/PortraitPhoto` for a
// framed REAL photograph, which is what the explainers now use.

// Pencil-on-paper economics objects (sand pile, gold bar, sacks, price tags,
// thought bubbles, and the needs a good can satisfy).
export {
  SandPilePencil,
  GoldBarPencil,
  SandSackPencil,
  PriceTagPencil,
  DressPencil,
  RoadPencil,
  SandboxPencil,
  BeachPencil,
  SandPitPencil,
  SandSprayPencil,
  CratePencil,
  JarPencil,
  ShovelPencil,
  ThoughtBubblePencil,
  CoinPencil,
  VersusMark,
  SAND,
  GOLD,
  SPRAY_LIFE,
} from "./svg/EconObjects";
export { EmotivePerson } from "./svg/EmotivePerson";
export { KneelingPersonPencil } from "./svg/KneelingPersonPencil";
export { MilitaryPencil } from "./svg/MilitaryPencil";
export { PoliticianPencil } from "./svg/PoliticianPencil";
export { OfficerPencil } from "./svg/OfficerPencil";
export { BarrierPencil } from "./svg/BarrierPencil";
export { Seagull } from "./svg/Seagull";
export { GrandThrone } from "./svg/GrandThrone";
export { RockPencil, ROCK_SHAPE } from "./svg/RockPencil";
export { ChippedTreePencil } from "./svg/ChippedTreePencil";
export { Guillotine } from "./svg/Guillotine";
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
