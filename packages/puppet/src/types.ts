export interface Bone {
  id: string;
  parent: string | null;
  x: number;
  y: number;
  angle: number;
  len: number;
  z?: number;
  drawAs?: 'limb' | null;
  width?: number;
  endCap?: boolean;
  merge?: boolean;
  mergeGroup?: string | null;
  layer?: string | null;
  label?: string;
  icon?: string;
}

export interface Shape {
  id: string;
  bone: string;
  kind: 'poly' | 'circle';
  z?: number;
  fill: string;
  stroke?: boolean | string;
  strokeColor?: string;
  width?: number;
  pts?: [number, number][];
  cx?: number;
  cy?: number;
  r?: number;
  closed?: boolean;
  hidden?: boolean;
  merge?: boolean;
  mergeGroup?: string | null;
  layer?: string | null;
  label?: string;
  icon?: string;
  groupWith?: string;
}

export interface Pose {
  angles: Record<string, number | undefined>;
  root?: { x?: number; y?: number; r?: number };
  visible?: Record<string, boolean | undefined>;
}

export interface ActionKey {
  t: number;
  pose: Pose;
}

export interface PuppetAction {
  dur: number;
  loop: boolean;
  keys: ActionKey[];
  icon?: string;
}

export interface PuppetColors {
  ink: string;
  skin: string;
  [key: string]: string | undefined;
}

export interface PuppetModel {
  name?: string;
  viewBox?: string;
  colors: PuppetColors;
  bones: Bone[];
  shapes: Shape[];
  actions: Record<string, PuppetAction>;
  merge?: boolean;
  mergeGroupColors?: Record<string, string>;
}

export interface WorldNode {
  ox: number;
  oy: number;
  A: number;
  tipX: number;
  tipY: number;
}

export type WorldMap = Record<string, WorldNode>;
