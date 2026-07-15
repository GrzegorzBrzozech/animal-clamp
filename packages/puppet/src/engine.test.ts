import { describe, it, expect } from 'vitest';
import {
  computeWorld,
  samplePose,
  blend,
  boneMerges,
  shapeMerges,
  resolveLayer,
  polyPath,
} from './engine';
import type { Bone, Shape, PuppetAction, PuppetColors } from './types';

// ─── helpers ──────────────────────────────────────────────────────────────────

const COLORS: PuppetColors = { ink: '#000', skin: '#fff' };

function bone(overrides: Partial<Bone> & { id: string }): Bone {
  return { parent: null, x: 0, y: 0, angle: 0, len: 0, ...overrides };
}

function shape(overrides: Partial<Shape> & { id: string; bone: string }): Shape {
  return { kind: 'poly', fill: 'skin', ...overrides };
}

// ─── computeWorld ─────────────────────────────────────────────────────────────

describe('computeWorld', () => {
  it('root bone at origin with zero angle has tip at (len, 0)', () => {
    const bones = [bone({ id: 'root', x: 0, y: 0, angle: 0, len: 100 })];
    const W = computeWorld(bones, { angles: {}, root: {} });
    expect(W.root.ox).toBeCloseTo(0);
    expect(W.root.oy).toBeCloseTo(0);
    expect(W.root.tipX).toBeCloseTo(100);
    expect(W.root.tipY).toBeCloseTo(0);
  });

  it('child bone inherits parent world position', () => {
    const bones = [
      bone({ id: 'parent', x: 0, y: 0, angle: 0, len: 50 }),
      bone({ id: 'child', parent: 'parent', x: 0, y: 0, angle: 0, len: 30 }),
    ];
    const W = computeWorld(bones, { angles: {}, root: {} });
    expect(W.child.ox).toBeCloseTo(50);
    expect(W.child.tipX).toBeCloseTo(80);
  });

  it('pose angle overrides bone default angle', () => {
    const bones = [bone({ id: 'root', angle: 0, len: 100 })];
    const W = computeWorld(bones, { angles: { root: 90 }, root: {} });
    expect(W.root.tipX).toBeCloseTo(0, 1);
    expect(W.root.tipY).toBeCloseTo(100, 1);
  });

  it('orphaned parent ID does not crash — returns origin', () => {
    const bones = [bone({ id: 'child', parent: 'missing', x: 0, y: 0, angle: 0, len: 10 })];
    expect(() => computeWorld(bones, { angles: {}, root: {} })).not.toThrow();
    const W = computeWorld(bones, { angles: {}, root: {} });
    expect(W.child.ox).toBeCloseTo(0);
  });
});

// ─── samplePose ───────────────────────────────────────────────────────────────

describe('samplePose', () => {
  const action: PuppetAction = {
    dur: 2,
    loop: false,
    keys: [
      { t: 0, pose: { angles: { arm: 0 } } },
      { t: 1, pose: { angles: { arm: 90 } } },
      { t: 2, pose: { angles: { arm: 180 } } },
    ],
  };

  it('returns a copy at t=0, not the original object', () => {
    const result = samplePose(action, 0);
    expect(result).not.toBe(action.keys[0].pose);
  });

  it('mutating the result does not corrupt the keyframe', () => {
    const result = samplePose(action, 0);
    (result as Record<string, unknown>).visible = { arm: false };
    const again = samplePose(action, 0);
    expect(again.visible).toBeUndefined();
  });

  it('interpolates angle at midpoint', () => {
    const result = samplePose(action, 0.5);
    expect(result.angles.arm).toBeCloseTo(45, 0);
  });

  it('clamps to last keyframe when t > dur and loop=false', () => {
    const result = samplePose(action, 99);
    expect(result.angles.arm).toBeCloseTo(180, 0);
  });

  it('dur: 0 does not silently become 1 — uses last keyframe t', () => {
    const zeroAction: PuppetAction = {
      dur: 0,
      loop: true,
      keys: [
        { t: 0,   pose: { angles: { a: 0 } } },
        { t: 0.5, pose: { angles: { a: 90 } } },
      ],
    };
    // With correct dur=0.5: t=0.6 wraps to 0.1 (near start) → angle ≈ 9.
    // With the old bug (dur silently 1): t=0.6 is past last key → wrap gives ~80.
    const result = samplePose(zeroAction, 0.6);
    expect(result.angles.a).toBeLessThan(15);
  });

  it('loops correctly: t past dur wraps to start', () => {
    const loopAction: PuppetAction = {
      dur: 1,
      loop: true,
      keys: [
        { t: 0, pose: { angles: { a: 0 } } },
        { t: 1, pose: { angles: { a: 360 } } },
      ],
    };
    const at0 = samplePose(loopAction, 0).angles.a;
    const at1 = samplePose(loopAction, 1).angles.a;
    expect(at0).toBeCloseTo(at1, 0);
  });

  it('returns empty pose for empty action', () => {
    const result = samplePose({ dur: 1, loop: false, keys: [] }, 0.5);
    expect(result.angles).toEqual({});
  });
});

// ─── blend ────────────────────────────────────────────────────────────────────

describe('blend', () => {
  it('u=0 returns first pose angles', () => {
    const p0 = { angles: { a: 10 } };
    const p1 = { angles: { a: 20 } };
    expect(blend(p0, p1, 0).angles.a).toBeCloseTo(10);
  });

  it('u=1 returns second pose angles', () => {
    const p0 = { angles: { a: 10 } };
    const p1 = { angles: { a: 20 } };
    expect(blend(p0, p1, 1).angles.a).toBeCloseTo(20);
  });

  it('missing key in p0 takes value from p1', () => {
    const p0 = { angles: {} };
    const p1 = { angles: { extra: 45 } };
    expect(blend(p0, p1, 0.5).angles.extra).toBeCloseTo(45);
  });
});

// ─── boneMerges ───────────────────────────────────────────────────────────────

describe('boneMerges', () => {
  it('explicit merge:true overrides drawAs', () => {
    expect(boneMerges(bone({ id: 'b', merge: true, drawAs: null }))).toBe(true);
  });

  it('explicit merge:false overrides drawAs:limb', () => {
    expect(boneMerges(bone({ id: 'b', merge: false, drawAs: 'limb' }))).toBe(false);
  });

  it('drawAs:limb without explicit merge → true', () => {
    expect(boneMerges(bone({ id: 'b', drawAs: 'limb' }))).toBe(true);
  });

  it('no drawAs, no merge → false', () => {
    expect(boneMerges(bone({ id: 'b' }))).toBe(false);
  });
});

// ─── shapeMerges ──────────────────────────────────────────────────────────────

describe('shapeMerges', () => {
  it('explicit merge:false wins over skin fill', () => {
    const s = shape({ id: 'nose', bone: 'head', fill: 'skin', merge: false });
    expect(shapeMerges(s, COLORS)).toBe(false);
  });

  it('explicit merge:true wins even for non-skin fill', () => {
    const s = shape({ id: 'hair', bone: 'head', fill: 'hair', merge: true });
    expect(shapeMerges(s, COLORS)).toBe(true);
  });

  it('skin fill without explicit merge → true', () => {
    const s = shape({ id: 'torso', bone: 'root', fill: 'skin' });
    expect(shapeMerges(s, COLORS)).toBe(true);
  });

  it('stroke:false shape → false regardless of fill', () => {
    const s = shape({ id: 'eye', bone: 'head', fill: 'skin', stroke: false });
    expect(shapeMerges(s, COLORS)).toBe(false);
  });

  it('non-skin fill without explicit merge → false', () => {
    const s = shape({ id: 'hair', bone: 'head', fill: 'hair' });
    expect(shapeMerges(s, COLORS)).toBe(false);
  });

  it('shape with fill matching skin color via colors map → true', () => {
    const colors: PuppetColors = { ink: '#000', skin: '#fff', light: '#fff' };
    const s = shape({ id: 's', bone: 'b', fill: 'light' });
    expect(shapeMerges(s, colors)).toBe(true);
  });
});

// ─── resolveLayer ─────────────────────────────────────────────────────────────

describe('resolveLayer', () => {
  const bones = [
    bone({ id: 'root', layer: 'back' }),
    bone({ id: 'armUpper', parent: 'root' }),
    bone({ id: 'armLower', parent: 'armUpper', layer: 'front' }),
  ];
  const byId = Object.fromEntries(bones.map((b) => [b.id, b]));

  it('bone with layer:front → front', () => {
    expect(resolveLayer(byId, byId.armLower)).toBe('front');
  });

  it('bone with no layer → back', () => {
    expect(resolveLayer(byId, byId.armUpper)).toBe('back');
  });

  it('shape on front-layer bone inherits front', () => {
    const s = shape({ id: 'thumb', bone: 'armLower', fill: 'skin' });
    expect(resolveLayer(byId, s)).toBe('front');
  });

  it('shape on unlayered bone → back', () => {
    const s = shape({ id: 'dot', bone: 'armUpper', fill: 'skin' });
    expect(resolveLayer(byId, s)).toBe('back');
  });

  it('shape with own layer overrides parent bone layer', () => {
    const s = shape({ id: 'mark', bone: 'armLower', fill: 'skin', layer: 'back' });
    expect(resolveLayer(byId, s)).toBe('back');
  });

  it('unknown bone id → back', () => {
    expect(resolveLayer(byId, 'nonexistent')).toBe('back');
  });
});

// ─── polyPath ─────────────────────────────────────────────────────────────────

describe('polyPath', () => {
  it('empty pts → empty string', () => {
    expect(polyPath([])).toBe('');
  });

  it('closed by default — ends with Z', () => {
    const d = polyPath([[0, 0], [10, 0], [10, 10]]);
    expect(d.endsWith('Z')).toBe(true);
  });

  it('closed:false — no Z', () => {
    const d = polyPath([[0, 0], [10, 0]], false);
    expect(d.includes('Z')).toBe(false);
  });

  it('single point — M only', () => {
    const d = polyPath([[5, 7]]);
    expect(d).toMatch(/^M 5 7/);
  });
});
