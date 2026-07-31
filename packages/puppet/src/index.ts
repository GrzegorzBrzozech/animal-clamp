export { Puppet } from './Puppet';
export type { PuppetProps } from './Puppet';
export { computeWorld, samplePose, blend, polyPath, RAD, boneMerges, shapeMerges, layerOf, resolveLayer, groupOf, groupOfIn } from './engine';
export type { PuppetModel, Bone, Shape, Pose, PuppetAction, PuppetColors, WorldNode, WorldMap } from './types';

import type { PuppetModel } from './types';

export const DEFAULT_PUPPET: PuppetModel = {
  name: 'Caveman-1.0',
  viewBox: '-200 -40 400 560',
  colors: { ink: '#3b3a37', skin: '#e9e2d2', hair: '#38372e', fur: '#8f8676', wood: '#8a5a34', stone: '#6b6b6b' },
  merge: true,
  mergeGroupColors: { head: '#2f6fd0', body: '#c25a3a', armL: '#3a8f5c', armR: '#a0522d', legL: '#8659b5', legR: '#c98a1f' },
  bones: [
    { id: 'root', parent: null, x: 4, y: 276, angle: 0, len: 0, z: 0, merge: true, drawAs: 'limb', width: 28, layer: 'back', icon: '💪', mergeGroup: 'body' },
    { id: 'head', parent: 'root', x: 2, y: -215, angle: 0, len: 0, z: 20, merge: false, drawAs: null, width: 22, mergeGroup: 'head' },
    { id: 'armUpperL', parent: 'root', x: -83, y: -143, angle: 140.5, len: 80, drawAs: 'limb', width: 52, z: 6, endCap: false, merge: true, layer: null, mergeGroup: 'armL' },
    { id: 'armLowerL', parent: 'armUpperL', x: 3, y: -2, angle: -53.2, len: 80, drawAs: 'limb', width: 45, z: 23, endCap: true, layer: 'front', mergeGroup: 'armL' },
    { id: 'armUpperR', parent: 'root', x: 90, y: -139, angle: 44.5, len: 80, drawAs: 'limb', width: 52, z: 6, endCap: false, mergeGroup: 'armR' },
    { id: 'armLowerR', parent: 'armUpperR', x: 6, y: 0, angle: 42.1, len: 80, drawAs: 'limb', width: 45, z: 23, layer: 'front', mergeGroup: 'armR' },
    { id: 'legUpperL', parent: 'root', x: -41, y: 5, angle: 100.1, len: 92, drawAs: 'limb', width: 50, z: 2, endCap: false, mergeGroup: 'legL' },
    { id: 'legLowerL', parent: 'legUpperL', x: 0, y: -1, angle: -7.5, len: 20, drawAs: 'limb', width: 50, z: 2, endCap: false, mergeGroup: 'legL' },
    { id: 'legUpperR', parent: 'root', x: 38, y: 2, angle: 75.2, len: 92, drawAs: 'limb', width: 50, z: 2, endCap: false, mergeGroup: 'legR' },
    { id: 'legLowerR', parent: 'legUpperR', x: 1, y: 1, angle: 10.6, len: 22, drawAs: 'limb', width: 51, z: 2, endCap: false, mergeGroup: 'legR' },
    { id: 'boneox6op', parent: 'root', x: 2, y: -181, angle: 89.1, len: 164, drawAs: null, width: 28, z: 8, label: 'Torso', icon: '🩻', mergeGroup: 'body' },
  ],
  shapes: [
    { id: 'torso', bone: 'boneox6op', kind: 'poly', z: 5, fill: 'skin', pts: [[21,90],[170,72],[165,-67],[25,-90],[2,-53],[-35,-29],[-40,30],[-6,50]] },
    { id: 'cloth', bone: 'root', kind: 'poly', z: 6, fill: 'fur', merge: false, pts: [[11,-72],[57,-182],[76,-23],[93,84],[66,74],[21,108],[-20,65],[-39,79],[-59,57],[-94,86],[-70,-15],[-15,-33]] },
    { id: 'shapena72s', bone: 'legLowerL', kind: 'poly', z: 10, fill: 'skin', label: 'FootL', icon: '👟', pts: [[36,-24],[25,-22],[26,17],[37,43],[48,49],[49,38],[55,30],[53,16],[53,1],[41,-13]] },
    { id: 'shapeovocp', bone: 'legLowerR', kind: 'poly', z: 10, fill: 'skin', label: 'FootR', icon: '👟', pts: [[68,-10],[62,-23],[65,-32],[58,-36],[57,-49],[43,-38],[32,-15],[30,25],[47,32],[52,14],[58,1]] },
    { id: 'headbox', bone: 'head', kind: 'poly', z: 20, fill: 'skin', merge: false, pts: [[33,-35],[47,60],[27,69],[7,71],[-45,61],[-28,-38]] },
    { id: 'hair', bone: 'head', kind: 'poly', z: 21, fill: 'hair', pts: [[-19,-32],[-29,-34],[-54,7],[-35,-34],[-58,-18],[-32,-42],[-37,-44],[-54,-52],[-21,-51],[-10,-62],[-4,-52],[12,-66],[18,-51],[32,-52],[48,-55],[41,-47],[48,-26],[34,-37],[33,-20],[15,-35],[-9,-38],[-23,-10]] },
    { id: 'earL', bone: 'head', kind: 'circle', z: 19, fill: 'skin', cx: -39, cy: 1, r: 11 },
    { id: 'earR', bone: 'head', kind: 'circle', z: 19, fill: 'skin', cx: 44, cy: 1, r: 11 },
    { id: 'browL', bone: 'head', kind: 'poly', z: 22, fill: 'ink', stroke: false, merge: false, pts: [[-25,-4],[0,0],[-2,5],[-25,1]] },
    { id: 'browR', bone: 'head', kind: 'poly', z: 22, fill: 'ink', stroke: false, pts: [[40,-3],[14,0],[14,4],[40,3]] },
    { id: 'eyeL', bone: 'head', kind: 'circle', z: 22, fill: 'ink', stroke: false, cx: -12, cy: 4, r: 5 },
    { id: 'eyeR', bone: 'head', kind: 'circle', z: 22, fill: 'ink', stroke: false, cx: 26, cy: 5, r: 5 },
    { id: 'nose', bone: 'head', kind: 'poly', z: 22, fill: 'skin', merge: false, pts: [[5,1],[-1,39],[21,39],[9,1]] },
    { id: 'mouth', bone: 'head', kind: 'poly', z: 22, fill: 'ink', stroke: false, pts: [[-7,47],[29,47],[29,50],[-7,50]] },
    { id: 'shapehpyuy', bone: 'armLowerL', kind: 'circle', z: 23, fill: 'skin', merge: true, cx: 85, cy: -23, r: 8, label: 'ThumbR', icon: '👍' },
    { id: 'shape5a485', bone: 'armLowerR', kind: 'circle', z: 23, fill: 'skin', cx: 84, cy: 23, r: 8, label: 'ThumbL', icon: '👍' },
    { id: 'shape9k3hj', bone: 'armLowerR', kind: 'circle', z: 23, fill: 'skin', cx: 103, cy: 3, r: 8, label: 'Pointer', icon: '👆' },
    { id: 'shapepy1qf', bone: 'armLowerR', kind: 'circle', z: 23, fill: 'skin', cx: 96, cy: -17, r: 8, label: 'PinkyL', icon: '🤙' },
    { id: 'shapeugpyx', bone: 'armLowerL', kind: 'circle', z: 23, fill: 'skin', cx: 98, cy: -9, r: 8, label: 'PointerR', icon: '👆' },
    { id: 'shape7vczj', bone: 'armLowerL', kind: 'circle', z: 23, fill: 'skin', cx: 94, cy: 15, r: 8, label: 'PinkeR', icon: '🤙' },
    { id: 'shapet7k8o', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: 39, cy: -32, r: 9, label: 'Dot-1', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapek5gxj', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: -64, cy: 40, r: 7, label: 'Dot-2', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapecevl7', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: -18, cy: -12, r: 5, label: 'Dot-3', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapelnmm6', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: 37, cy: 35, r: 10, label: 'Dot-4', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapecy80l', bone: 'boneox6op', kind: 'poly', z: 5, fill: 'hair', label: 'chest-divider', icon: '⎸', groupWith: 'torso', pts: [[76,5],[75,-4],[121,1],[119,-2]] },
    { id: 'shapeiigx0', bone: 'boneox6op', kind: 'circle', z: 5, fill: 'fur', merge: false, cx: 102, cy: 49, r: 4, label: 'Nipple', groupWith: 'torso' },
    { id: 'shapefxx9u', bone: 'boneox6op', kind: 'poly', z: 5, fill: 'hair', merge: false, label: 'underbrest', icon: '━', groupWith: 'torso', pts: [[120,63],[123,19],[123,16]] },
    { id: 'shaped71yx', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: 48, cy: -118, r: 3, label: 'Dot-5', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapegtnz7', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: 76, cy: 64, r: 4, label: 'Dot-6', icon: '⚫️', groupWith: 'cloth' },
    { id: 'shapesebg7', bone: 'root', kind: 'circle', z: 10, fill: 'ink', cx: -9, cy: 54, r: 8, label: 'Dot-7', icon: '⚫️', groupWith: 'cloth' },
  ],
  actions: {
    idle: { dur: 3, loop: true, keys: [
      { t: 0, pose: { angles: { armUpperL: 123.8, armUpperR: 107.5, head: 0, armLowerL: -53.6, armLowerR: -244, boneox6op: 89.8 }, root: { x: 0, y: -1.477, r: 0 } } },
      { t: 1.65, pose: { angles: { armUpperL: 119.6, armUpperR: 102.6, head: 2.5, armLowerL: -48.6, armLowerR: -237.7 }, root: { x: 0, y: -0.15, r: 0 } } },
    ] },
    walk: { dur: 1, loop: true, keys: [
      { t: 0, pose: { angles: { legUpperL: 97.7, legLowerL: -3.6, legUpperR: 72.2, legLowerR: 5.2, armUpperL: 87.4, armUpperR: 78.7, head: -1, armLowerR: 0.5, armLowerL: -98, boneox6op: 87.3 }, root: { x: 0, y: 0, r: 0 } } },
      { t: 0.57, pose: { angles: { legUpperL: 84.7, legLowerL: -25.3, legUpperR: 87, legLowerR: -0.2, armUpperL: 129.1, armUpperR: 31.8, head: 1, armLowerR: 119.6, armLowerL: -51, boneox6op: 89.3 }, root: { x: 0, y: -6, r: 0 } } },
    ] },
    wave: { dur: 0.7, loop: true, keys: [
      { t: 0, pose: { angles: { armUpperR: -46, armLowerR: -89.1, armLowerL: -51.1, armUpperL: 135 }, root: {} } },
      { t: 0.38, pose: { angles: { armUpperR: -52.2, armLowerR: -72.6, armLowerL: -53.7, armUpperL: 134 }, root: { x: 0, y: 0, r: 0 } } },
    ] },
    'scratch head': { dur: 1.5, loop: true, keys: [
      { t: 0, pose: { angles: { armLowerL: 97.1, armUpperL: -111.7, boneox6op: 89.6, head: 6, armUpperR: 78.3, armLowerR: 11.3 }, root: {} } },
      { t: 0.75, pose: { angles: { armLowerL: 85.2, armUpperL: -100, boneox6op: 88.8, head: 7.4, armUpperR: 80.3, armLowerR: 5.9 }, root: { x: 0, y: 0, r: 0 } } },
    ] },
    talk: { dur: 2, loop: true, icon: '🗣️', keys: [
      { t: 0,    pose: { angles: { head: 0, armUpperL: 121, armUpperR: 108, armLowerL: -52, armLowerR: -242, boneox6op: 89.5 }, root: { x: 0, y: 0, r: 0 } } },
      { t: 0.5,  pose: { angles: { head: 6, armUpperL: 124, armUpperR: 105, armLowerL: -55, armLowerR: -248 } } },
      { t: 1.0,  pose: { angles: { head: -2, armUpperL: 119, armUpperR: 111, armLowerL: -50, armLowerR: -238 } } },
      { t: 1.5,  pose: { angles: { head: 5, armUpperL: 122, armUpperR: 106, armLowerL: -54, armLowerR: -245 } } },
      { t: 2,    pose: { angles: { head: 0, armUpperL: 121, armUpperR: 108, armLowerL: -52, armLowerR: -242, boneox6op: 89.5 }, root: { x: 0, y: 0, r: 0 } } },
    ] },
    hunt: { dur: 2, loop: true, icon: '🏹', keys: [
      { t: 0,   pose: { angles: { head: -12, armUpperL: 68, armUpperR: 32, armLowerL: 15, armLowerR: -5, legUpperL: 97.7, legLowerL: -3.6, legUpperR: 72.2, legLowerR: 5.2, boneox6op: 76 }, root: { x: 0, y: 0, r: -18 } } },
      { t: 1,   pose: { angles: { head: -15, armUpperL: 65, armUpperR: 29, armLowerL: 18, armLowerR: -8, boneox6op: 74 }, root: { x: 0, y: -3, r: -18 } } },
      { t: 2,   pose: { angles: { head: -12, armUpperL: 68, armUpperR: 32, armLowerL: 15, armLowerR: -5, legUpperL: 97.7, legLowerL: -3.6, legUpperR: 72.2, legLowerR: 5.2, boneox6op: 76 }, root: { x: 0, y: 0, r: -18 } } },
    ] },
    dig: { dur: 1, loop: true, icon: '⛏️', keys: [
      { t: 0,    pose: { angles: { armUpperL: 22, armLowerL: 38, armUpperR: 18, armLowerR: 42, head: -8, legUpperL: 100, legLowerL: 5, legUpperR: 74, legLowerR: 8, boneox6op: 68 }, root: { x: 0, y: 0, r: -28 } } },
      { t: 0.45, pose: { angles: { armUpperL: -18, armLowerL: -25, armUpperR: -14, armLowerR: -22, head: -12, boneox6op: 65 }, root: { x: 0, y: -6, r: -32 } } },
      { t: 1,    pose: { angles: { armUpperL: 22, armLowerL: 38, armUpperR: 18, armLowerR: 42, head: -8, legUpperL: 100, legLowerL: 5, legUpperR: 74, legLowerR: 8, boneox6op: 68 }, root: { x: 0, y: 0, r: -28 } } },
    ] },
  },
};
