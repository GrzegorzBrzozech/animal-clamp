import type { Bone, Shape, Pose, PuppetAction, PuppetColors, WorldMap, WorldNode } from './types';

export const RAD = Math.PI / 180;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ss = (u: number) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpAngle = (a: number, b: number, u: number) => {
  const delta = b - a - Math.round((b - a) / 360) * 360;
  return a + delta * u;
};

export function computeWorld(bones: Bone[], pose: Pose): WorldMap {
  const byId: Record<string, Bone> = {};
  bones.forEach((b) => { byId[b.id] = b; });
  const cache: WorldMap = {};
  const root = pose?.root ?? {};
  const rx = root.x ?? 0, ry = root.y ?? 0, rr = root.r ?? 0;

  function w(b: Bone): WorldNode {
    if (cache[b.id]) return cache[b.id];
    const ang = pose?.angles?.[b.id] ?? b.angle;
    let node: WorldNode;
    if (b.parent == null) {
      const A = (ang + rr) * RAD;
      const ox = (b.x ?? 0) + rx, oy = (b.y ?? 0) + ry;
      node = { ox, oy, A, tipX: ox + Math.cos(A) * (b.len ?? 0), tipY: oy + Math.sin(A) * (b.len ?? 0) };
    } else {
      const parentBone = b.parent ? byId[b.parent] : null;
      const p = parentBone ? w(parentBone) : { ox: 0, oy: 0, A: 0, tipX: 0, tipY: 0 };
      const c = Math.cos(p.A), s = Math.sin(p.A);
      const ox = p.tipX + ((b.x ?? 0) * c - (b.y ?? 0) * s);
      const oy = p.tipY + ((b.x ?? 0) * s + (b.y ?? 0) * c);
      const A = p.A + ang * RAD;
      node = { ox, oy, A, tipX: ox + Math.cos(A) * (b.len ?? 0), tipY: oy + Math.sin(A) * (b.len ?? 0) };
    }
    cache[b.id] = node;
    return node;
  }

  bones.forEach(w);
  return cache;
}

export function blend(p0: Pose, p1: Pose, u: number): Pose {
  const a0 = p0?.angles ?? {}, a1 = p1?.angles ?? {};
  const out: Record<string, number> = {};
  const keys = new Set([...Object.keys(a0), ...Object.keys(a1)]);
  keys.forEach((k) => {
    const v0 = a0[k], v1 = a1[k];
    if (v0 == null) out[k] = v1 ?? 0;
    else if (v1 == null) out[k] = v0 ?? 0;
    else out[k] = lerpAngle(v0, v1, u);
  });
  const r0 = p0?.root ?? {}, r1 = p1?.root ?? {};
  return {
    angles: out,
    root: {
      x: lerp(r0.x ?? 0, r1.x ?? 0, u),
      y: lerp(r0.y ?? 0, r1.y ?? 0, u),
      r: lerpAngle(r0.r ?? 0, r1.r ?? 0, u),
    },
  };
}

export function samplePose(action: PuppetAction, time: number): Pose {
  if (!action?.keys?.length) return { angles: {}, root: {} };
  const keys = [...action.keys].sort((a, b) => a.t - b.t);
  const dur = action.dur > 0 ? action.dur : (keys[keys.length - 1].t || 1);
  let t = action.loop ? ((time % dur) + dur) % dur : clamp(time, 0, dur);

  const heldVisible = (upto: number): Record<string, boolean> => {
    const acc: Record<string, boolean> = {};
    for (let idx = 0; idx <= upto; idx++) {
      const v = keys[idx].pose?.visible;
      if (v) Object.assign(acc, v);
    }
    return acc;
  };

  if (t <= keys[0].t) return { ...keys[0].pose };
  if (t >= keys[keys.length - 1].t) {
    if (action.loop) {
      const k0 = keys[keys.length - 1], k1 = keys[0];
      const span = dur - k0.t + k1.t;
      const out = blend(k0.pose, k1.pose, ss(span > 0 ? (t - k0.t) / span : 0));
      out.visible = heldVisible(keys.length - 1);
      return out;
    }
    const out = { ...keys[keys.length - 1].pose };
    out.visible = heldVisible(keys.length - 1);
    return out;
  }
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  const out = blend(k0.pose, k1.pose, ss((t - k0.t) / ((k1.t - k0.t) || 1)));
  out.visible = heldVisible(i);
  return out;
}

export function boneMerges(b: Bone): boolean {
  if (b.merge != null) return !!b.merge;
  return b.drawAs === 'limb';
}

export function shapeMerges(s: Shape, colors: PuppetColors): boolean {
  if (s.merge != null) return !!s.merge;
  if (s.stroke === false) return false;
  const isSkin = s.fill === 'skin' || colors[s.fill] === colors.skin;
  if (!isSkin) return false;
  const id = (s.id || '').toLowerCase();
  return !/nose|eye|brow|mouth|pupil|tooth|lip/.test(id);
}

export function groupOf(byId: Record<string, Bone>, node: Bone | Shape | string): string | null {
  const cur: Bone | Shape | undefined = typeof node === 'string' ? byId[node] : node;
  if (!cur) return null;
  if (cur.mergeGroup) return cur.mergeGroup;
  if ('bone' in cur && !('parent' in cur)) {
    const bone = byId[(cur as Shape).bone];
    if (bone?.mergeGroup) return bone.mergeGroup;
  }
  return null;
}

export function groupOfIn(bones: Bone[], node: Bone | Shape | string): string | null {
  const byId: Record<string, Bone> = {};
  bones.forEach((b) => { byId[b.id] = b; });
  return groupOf(byId, node);
}

export function resolveLayer(byId: Record<string, Bone>, node: Bone | Shape | string): string {
  const cur: Bone | Shape | undefined = typeof node === 'string' ? byId[node] : node;
  if (cur?.layer) return cur.layer as string;
  if (cur && 'bone' in cur && !('parent' in cur)) {
    const bone = byId[(cur as Shape).bone];
    if (bone?.layer) return bone.layer as string;
  }
  return 'back';
}

export function layerOf(bones: Bone[], node: Bone | Shape | string): string {
  const byId: Record<string, Bone> = {};
  bones.forEach((b) => { byId[b.id] = b; });
  return resolveLayer(byId, node);
}

export function polyPath(pts: [number, number][], closed?: boolean): string {
  if (!pts?.length) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0]} ${pts[i][1]}`;
  return closed === false ? d : d + ' Z';
}
