// puppet-studio.jsx — UNIVERSAL editor for the puppet engine.
// Two modes: RIG (edit bones + shape points) and ACTION (keyframe timeline).
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Puppet, computeWorld, samplePose, boneMerges, shapeMerges, groupOfIn, layerOf, effectiveZ, DEFAULT_PUPPET } from '@animal-clamp/puppet';

  const RAD = Math.PI / 180, DEG = 180 / Math.PI;
  const PAPER = '#f4f1e9', ACCENT = '#c25a3a', BONE = '#2f6fd0';
  const GROUP_PALETTE = ['#c25a3a', '#2f6fd0', '#3a8f5c', '#a0522d', '#8659b5', '#c98a1f', '#1f9e9e', '#b5457a'];
  const groupColor = (name) => { if (!name) return '#a49d8b'; let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return GROUP_PALETTE[h % GROUP_PALETTE.length]; };
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  const uid = (p) => p + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let CLIP = null; // shared clipboard: {kind:'shape'|'bone'|'key', ...}

  const btn = (active, i) => ({
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 20, lineHeight: 1.05, textAlign: 'center',
    padding: '4px 12px', cursor: 'pointer', color: '#2c2b28',
    background: active ? '#e7dcc4' : 'rgba(255,255,255,0.55)',
    border: active ? '2.5px solid #2c2b28' : '2px solid #a49d8b',
    borderRadius: i % 2 ? '12px 5px 11px 6px' : '6px 12px 5px 13px', fontWeight: active ? 700 : 400,
  });
  const STORE = 'puppet.model.v4';
  const SERVER_PATH_STORE = 'puppet.serverPath.v1';
  const HAS_FS = typeof window !== 'undefined' && 'showOpenFilePicker' in window;

  // ---- IndexedDB helpers for persisting FileSystemFileHandles ----
  const IDB_NAME = 'puppet-studio-v1';
  const IDB_STORE_HANDLES = 'recent-handles';
  const openIDB = () => new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE_HANDLES, { keyPath: 'name' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  const persistHandle = async (handle) => {
    try {
      const db = await openIDB();
      await new Promise((res, rej) => {
        const tx = db.transaction(IDB_STORE_HANDLES, 'readwrite');
        tx.objectStore(IDB_STORE_HANDLES).put({ name: handle.name, handle, ts: Date.now() });
        tx.oncomplete = res; tx.onerror = rej;
      });
    } catch (e) { /* IDB unavailable */ }
  };
  const loadRecentHandles = async () => {
    try {
      const db = await openIDB();
      return await new Promise((res) => {
        const tx = db.transaction(IDB_STORE_HANDLES, 'readonly');
        const req = tx.objectStore(IDB_STORE_HANDLES).getAll();
        req.onsuccess = () => res((req.result || []).sort((a, b) => b.ts - a.ts).slice(0, 8));
      });
    } catch { return []; }
  };

  const modelToJs = (m) =>
    '// puppet-model.js — exported from Puppet Studio ' + new Date().toISOString().slice(0, 10) + '\n'
    + 'export const model = ' + JSON.stringify(m, null, 2) + ';\nexport default model;\n';

  const parseModelFromText = (txt) => {
    // Match: export const <anyName>[: <Type>] = {   (handles TypeScript type annotations)
    // or:    export default {
    const exportRe = /export\s+(?:const\s+\w+(?:\s*:\s*[\w<>[\], ]+)?\s*=|default)\s*\{/;
    const exportMatch = txt.match(exportRe);
    const start = exportMatch
      ? exportMatch.index + exportMatch[0].length - 1
      : txt.indexOf('{');
    if (start < 0) throw new Error('no object found');
    let depth = 0, inStr = false, quote = '', escape = false, end = -1;
    for (let i = start; i < txt.length; i++) {
      const c = txt[i];
      if (inStr) { if (escape) escape = false; else if (c === '\\') escape = true; else if (c === quote) inStr = false; }
      else if (c === '"' || c === "'") { inStr = true; quote = c; }
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end < 0) throw new Error('unbalanced braces');
    const raw = txt.slice(start, end + 1);
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch {
      // JS object literal syntax (single quotes, unquoted keys) — common in hand-authored .ts model files
      obj = new Function('return (' + raw + ')')(); // eslint-disable-line no-new-func
    }
    if (!obj || !obj.bones || !obj.shapes) throw new Error('not a puppet model');
    return obj;
  };
  const UI = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  // consistent icon button + labelled group used across both modes
  function IBtn({ label, title, onClick, disabled, danger }) {
    return React.createElement('button', {
      onClick, title, disabled,
      style: {
        fontFamily: UI, fontSize: 17, lineHeight: 1, width: 30, height: 30,
        cursor: disabled ? 'default' : 'pointer', color: danger ? '#a23b28' : '#2c2b28',
        background: 'rgba(255,255,255,0.65)', border: '2px solid #a49d8b', borderRadius: 8,
        opacity: disabled ? 0.32 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
      },
    }, label);
  }
  function Grp({ label, children, style }) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, ...style } },
      React.createElement('span', { style: { fontSize: 14, opacity: 0.6, width: 46, flex: 'none' } }, label),
      React.createElement('div', { style: { display: 'flex', gap: 5 } }, children)
    );
  }
  // little illustrative icons for element buttons
  const boneIcon = (id) => { const s = (id || '').toLowerCase(); if (s === 'root') return '🧍'; if (s.includes('head')) return '😀'; if (s.includes('arm')) return s.includes('lower') ? '🤚' : '💪'; if (s.includes('leg')) return s.includes('lower') ? '🦶' : '🦵'; if (s.includes('hand')) return '✋'; if (s.includes('tail')) return '🐒'; return '🦴'; };
  const boneSide = (id) => (/l$/i.test(id) ? '◀' : /r$/i.test(id) ? '▶' : '');
  const shapeIcon = (s) => { const id = (s.id || '').toLowerCase(); if (id.includes('hair')) return '💇'; if (id.includes('ear')) return '👂'; if (id.includes('eye')) return '👁️'; if (id.includes('brow')) return '✏️'; if (id.includes('nose')) return '👃'; if (id.includes('mouth')) return '👄'; if (id.includes('torso') || id.includes('body')) return '🫄'; if (id.includes('cloth')) return '🧶'; if (id.includes('head')) return '🟫'; return s.kind === 'circle' ? '⭕' : '🔷'; };
  const actionIcon = (id) => { const s = (id || '').toLowerCase(); if (s.includes('idle')) return '🧍'; if (s.includes('walk')) return '🚶'; if (s.includes('run')) return '🏃'; if (s.includes('wave')) return '👋'; if (s.includes('jump')) return '🤸'; if (s.includes('dance')) return '🕺'; if (s.includes('sit')) return '🪑'; if (s.includes('eat')) return '🍖'; return '🎬'; };

  // ---- history (undo/redo) -------------------------------------------------
  // Coalesces rapid changes (e.g. a drag = many setModel calls) into ONE step
  // using a short time window, so undo feels natural.
  function useHistory(initial) {
    const [model, setRaw] = useState(initial);
    const past = useRef([]); const future = useRef([]); const lastPush = useRef(0);
    const [, force] = useState(0);
    const setModel = useCallback((updater) => {
      setRaw((cur) => {
        const next = typeof updater === 'function' ? updater(cur) : updater;
        if (next === cur) return cur;
        const now = performance.now();
        const coalesce = past.current.length > 0 && (now - lastPush.current) < 450;
        if (!coalesce) { past.current.push(cur); if (past.current.length > 120) past.current.shift(); }
        lastPush.current = now; future.current = [];
        return next;
      });
    }, []);
    const undo = useCallback(() => { setRaw((cur) => { if (!past.current.length) return cur; const prev = past.current.pop(); future.current.push(cur); lastPush.current = 0; force((x) => x + 1); return prev; }); }, []);
    const redo = useCallback(() => { setRaw((cur) => { if (!future.current.length) return cur; const nxt = future.current.pop(); past.current.push(cur); lastPush.current = 0; force((x) => x + 1); return nxt; }); }, []);
    return { model, setModel, undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 };
  }

  function useRaf(run) {
    const [t, setT] = useState(0); const ref = useRef(0);
    useEffect(() => { if (!run) return; let raf, last = performance.now(); const step = (n) => { ref.current += (n - last) / 1000; last = n; setT(ref.current); raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [run]);
    return run ? t : 0;
  }

  // ---- shared canvas with a pointer→svg mapper -----------------------------
  function useSvgPointer(svgRef) {
    return (clientX, clientY) => {
      const svg = svgRef.current; if (!svg) return [0, 0];
      const pt = svg.createSVGPoint(); pt.x = clientX; pt.y = clientY;
      const m = svg.getScreenCTM(); if (!m) return [0, 0];
      const p = pt.matrixTransform(m.inverse()); return [p.x, p.y];
    };
  }

  // =============================== RIG MODE ===============================
  function RigMode({ model, setModel }) {
    const [selBone, setSelBone] = useState('root');
    const [selShape, setSelShape] = useState(null);
    const [selPt, setSelPt] = useState(-1);
    const [collapsed, setCollapsed] = useState(() => new Set());
    const [renameTarget, setRenameTarget] = useState(null); // {kind:'bone'|'shape', id} | null — F2 or ✎ opens
    const [reattachShapeId, setReattachShapeId] = useState(null); // shape id currently choosing a new bone, or null
    const [groupPopup, setGroupPopup] = useState(null); // {mode:'new'|'rename', oldName, name, color, onSet}
    const svgRef = useRef(null); const drag = useRef(null);
    const toSvg = useSvgPointer(svgRef);
    const bones = model.bones, byId = {}; bones.forEach((b) => byId[b.id] = b);
    const W = computeWorld(bones, { angles: {}, root: {} });
    const shapesOn = (model.shapes || []).filter((s) => s.bone === selBone);

    const upBone = (id, patch) => setModel((m) => ({ ...m, bones: m.bones.map((b) => b.id === id ? { ...b, ...patch } : b) }));
    const upShape = (id, patch) => setModel((m) => ({ ...m, shapes: m.shapes.map((s) => s.id === id ? { ...s, ...patch } : s) }));

    // merge group management
    const allGroups = Array.from(new Set([...model.bones, ...(model.shapes || [])].map((n) => n.mergeGroup).filter(Boolean))).sort();
    const groupZ = {};
    const colorForGroup = (name) => (model.mergeGroupColors && model.mergeGroupColors[name]) || groupColor(name);
    model.bones.forEach((b) => { if (boneMerges(b)) { const g = groupOfIn(model.bones, b); if (g) groupZ[g] = groupZ[g] == null ? (b.z || 0) : Math.min(groupZ[g], b.z || 0); } });
    (model.shapes || []).forEach((s) => { const boneNode = model.bones.find((b) => b.id === s.bone); if (boneNode && shapeMerges(s, model.colors)) { const g = groupOfIn(model.bones, s); if (g) { const z = s.z != null ? s.z : (boneNode.z || 0); groupZ[g] = groupZ[g] == null ? z : Math.min(groupZ[g], z); } } });
    const commitGroupPopup = () => {
      const gp = groupPopup; if (!gp) return;
      const name = (gp.name || '').trim(); if (!name) { setGroupPopup(null); return; }
      if (gp.mode === 'new') {
        setModel((m) => ({ ...m, mergeGroupColors: { ...(m.mergeGroupColors || {}), [name]: gp.color } }));
        if (gp.onSet) gp.onSet(name);
      } else if (name !== gp.oldName) {
        setModel((m) => {
          const colors = { ...(m.mergeGroupColors || {}) }; delete colors[gp.oldName]; colors[name] = gp.color;
          return { ...m, bones: m.bones.map((b) => b.mergeGroup === gp.oldName ? { ...b, mergeGroup: name } : b), shapes: (m.shapes || []).map((s) => s.mergeGroup === gp.oldName ? { ...s, mergeGroup: name } : s), mergeGroupColors: colors };
        });
      } else {
        setModel((m) => ({ ...m, mergeGroupColors: { ...(m.mergeGroupColors || {}), [name]: gp.color } }));
      }
      setGroupPopup(null);
    };
    const deleteGroup = (name) => {
      if (!confirm('Delete group "' + name + '"? Its members become unjoined.')) return;
      setModel((m) => {
        const colors = { ...(m.mergeGroupColors || {}) }; delete colors[name];
        return { ...m, bones: m.bones.map((b) => b.mergeGroup === name ? { ...b, mergeGroup: undefined } : b), shapes: (m.shapes || []).map((s) => s.mergeGroup === name ? { ...s, mergeGroup: undefined } : s), mergeGroupColors: colors };
      });
    };
    const GroupPicker = ({ current, onSet }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.5)', border: '2px solid #cfc7b4', borderRadius: 10, padding: 4 }}>
        {allGroups.map((g) => (
          <div key={g} onClick={() => onSet(g === current ? undefined : g)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 7, cursor: 'pointer', background: current === g ? 'rgba(194,90,58,0.16)' : 'transparent' }}>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: colorForGroup(g), flex: 'none', border: '1px solid rgba(0,0,0,0.18)', display: 'inline-block' }} />
            <span style={{ fontSize: 14, flex: 1 }}>{g}</span>
            <span title="Render z of group" style={{ fontSize: 11, opacity: 0.55, flex: 'none' }}>z{groupZ[g] != null ? groupZ[g] : 0}</span>
            {current === g && <span style={{ fontSize: 13, opacity: 0.6 }}>✓</span>}
            <span onClick={(e) => { e.stopPropagation(); setGroupPopup({ mode: 'rename', oldName: g, name: g, color: colorForGroup(g) }); }} title="Rename" style={{ fontSize: 12, opacity: 0.45, cursor: 'pointer', flex: 'none' }}>✎</span>
            <span onClick={(e) => { e.stopPropagation(); deleteGroup(g); }} title="Delete group" style={{ fontSize: 12, opacity: 0.45, cursor: 'pointer', flex: 'none' }}>🗑</span>
          </div>
        ))}
        <div onClick={() => setGroupPopup({ mode: 'new', oldName: null, name: '', color: GROUP_PALETTE[allGroups.length % GROUP_PALETTE.length], onSet })} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 7, cursor: 'pointer', background: 'transparent' }}>
          <span style={{ width: 13, textAlign: 'center', fontSize: 14, opacity: 0.6, flex: 'none' }}>+</span>
          <span style={{ fontSize: 14, flex: 1, opacity: 0.75 }}>new group…</span>
        </div>
      </div>
    );
    // Re-parent a shape onto a different bone, OR group it under another
    // shape (e.g. a decoration that should ride along with "cloth"). Either
    // way its points/center get converted from the old bone's local frame
    // into the new bone's local frame (via each bone's rest-pose world
    // transform) so it stays exactly where it visually is now.
    //   target = { kind: 'bone', id } | { kind: 'shape', id }
    // Grouping under a shape just means "use that shape's bone, and show me
    // nested under it in the tree" — shapes have no transform of their own,
    // so following the same bone as the parent shape IS following it.
    const wouldCycle = (shapes, childId, newParentShapeId) => {
      let cur = newParentShapeId; const seen = new Set();
      while (cur) {
        if (cur === childId) return true;
        if (seen.has(cur)) break; seen.add(cur);
        const s = shapes.find((x) => x.id === cur);
        cur = s ? s.groupWith : null;
      }
      return false;
    };
    const reattachShape = (shapeId, target) => {
      if (!target) return;
      let newBoneId = null;
      setModel((m) => {
        const s = m.shapes.find((x) => x.id === shapeId);
        if (!s) return m;
        let groupWith;
        if (target.kind === 'shape') {
          if (target.id === shapeId || wouldCycle(m.shapes, shapeId, target.id)) return m;
          const parentShape = m.shapes.find((x) => x.id === target.id);
          if (!parentShape) return m;
          newBoneId = parentShape.bone; groupWith = target.id;
        } else {
          newBoneId = target.id; groupWith = null;
        }
        if (s.bone === newBoneId && (s.groupWith || null) === groupWith) return m;
        const Wr = computeWorld(m.bones, { angles: {}, root: {} });
        const oldO = Wr[s.bone], newO = Wr[newBoneId];
        const toNewLocal = (lx, ly) => {
          if (!oldO || !newO) return [lx, ly];
          const w = rot(lx, ly, oldO.A); const wx = oldO.ox + w[0], wy = oldO.oy + w[1];
          const rel = rot(wx - newO.ox, wy - newO.oy, -newO.A);
          return [Math.round(rel[0]), Math.round(rel[1])];
        };
        return { ...m, shapes: m.shapes.map((x) => {
          if (x.id !== shapeId) return x;
          const nx = { ...x, bone: newBoneId, groupWith };
          if (nx.pts) nx.pts = nx.pts.map((p) => toNewLocal(p[0], p[1]));
          else { const c = toNewLocal(nx.cx || 0, nx.cy || 0); nx.cx = c[0]; nx.cy = c[1]; }
          return nx;
        }) };
      });
      if (newBoneId) setSelBone(newBoneId);
    };
    const setKind = (id, kind) => setModel((m) => ({ ...m, shapes: m.shapes.map((s) => {
      if (s.id !== id || s.kind === kind) return s;
      const keep = { id: s.id, bone: s.bone, z: s.z, fill: s.fill, stroke: s.stroke, width: s.width };
      if (kind === 'circle') {
        const pts = s.pts && s.pts.length ? s.pts : [[0, 0]];
        const cx = Math.round(pts.reduce((a, p) => a + p[0], 0) / pts.length), cy = Math.round(pts.reduce((a, p) => a + p[1], 0) / pts.length);
        const r = Math.max(4, Math.round(pts.reduce((a, p) => a + Math.hypot(p[0] - cx, p[1] - cy), 0) / pts.length));
        return { ...keep, kind: 'circle', cx, cy, r };
      }
      const cx = s.cx || 0, cy = s.cy || 0, r = s.r || 20, n = 12, pts = [];
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r)]); }
      return { ...keep, kind: 'poly', pts };
    }) }));

    useEffect(() => {
      const move = (e) => {
        if (!drag.current) return;
        if (e.pointerType !== 'touch' && e.buttons === 0) { drag.current = null; return; } // self-heal a stuck drag
        e.preventDefault();
        const [wx, wy] = toSvg(e.clientX, e.clientY); const d = drag.current;
        if (d.type === 'tip') {
          const b = byId[d.id]; const o = W[d.id];
          const wa = Math.atan2(wy - o.oy, wx - o.ox);
          const len = e.shiftKey ? (b.len || 0) : Math.round(Math.hypot(wx - o.ox, wy - o.oy));
          if (b.parent == null) upBone(d.id, { angle: +(wa * DEG).toFixed(1), len });
          else { const pa = W[b.parent].A; upBone(d.id, { angle: +((wa - pa) * DEG).toFixed(1), len }); }
        } else if (d.type === 'origin') {
          const b = byId[d.id];
          if (b.parent == null) upBone(d.id, { x: Math.round(wx), y: Math.round(wy) });
          else { const p = W[b.parent]; const l = rot(wx - p.tipX, wy - p.tipY, -p.A); upBone(d.id, { x: Math.round(l[0]), y: Math.round(l[1]) }); }
        } else if (d.type === 'pt') {
          const o = W[d.bone]; const l = rot(wx - o.ox, wy - o.oy, -o.A);
          setModel((m) => ({ ...m, shapes: m.shapes.map((s) => s.id === d.shape ? { ...s, pts: s.pts.map((q, i) => i === d.i ? [Math.round(l[0]), Math.round(l[1])] : q) } : s) }));
        } else if (d.type === 'shapeMove') {
          const o = W[d.bone]; const l = rot(wx - o.ox, wy - o.oy, -o.A);
          setModel((m) => ({ ...m, shapes: m.shapes.map((s) => {
            if (s.id !== d.shape) return s;
            if (s.kind === 'circle') return { ...s, cx: Math.round(l[0]), cy: Math.round(l[1]) };
            if (!s.pts || !s.pts.length) return s;
            const cx = s.pts.reduce((a, p) => a + p[0], 0) / s.pts.length, cy = s.pts.reduce((a, p) => a + p[1], 0) / s.pts.length;
            const dx = l[0] - cx, dy = l[1] - cy;
            return { ...s, pts: s.pts.map((p) => [Math.round(p[0] + dx), Math.round(p[1] + dy)]) };
          }) }));
        } else if (d.type === 'circleRim') {
          const o = W[d.bone]; const l = rot(wx - o.ox, wy - o.oy, -o.A);
          const s = byId._noop || model.shapes.find((x) => x.id === d.shape);
          if (s) { const r = Math.max(2, Math.round(Math.hypot(l[0] - (s.cx || 0), l[1] - (s.cy || 0)))); upShape(d.shape, { r }); }
        }
      };
      const up = () => { drag.current = null; };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    });

    const addBone = () => { const id = uid('bone'); const par = selBone || 'root'; setModel((m) => ({ ...m, bones: [...m.bones, { id, parent: par, x: 0, y: 0, angle: 20, len: 70, drawAs: 'limb', width: 28, z: 8 }] })); setSelBone(id); setSelShape(null); setSelPt(-1); setCollapsed((c) => { if (!c.has(par)) return c; const n = new Set(c); n.delete(par); return n; }); };
    const delBone = () => { if (selBone === 'root') return; setModel((m) => ({ ...m, bones: m.bones.filter((b) => b.id !== selBone && b.parent !== selBone), shapes: m.shapes.filter((s) => s.bone !== selBone) })); setSelBone('root'); setSelShape(null); setSelPt(-1); };
    const addShape = () => { const id = uid('shape'); setModel((m) => ({ ...m, shapes: [...m.shapes, { id, bone: selBone, kind: 'poly', z: 10, fill: 'skin', pts: [[-30, -30], [30, -30], [30, 30], [-30, 30]] }] })); setSelShape(id); setSelPt(-1); setCollapsed((c) => { if (!c.has(selBone)) return c; const n = new Set(c); n.delete(selBone); return n; }); };
    const delShape = () => { if (!selShape) return; setModel((m) => ({ ...m, shapes: m.shapes.filter((s) => s.id !== selShape) })); setSelShape(null); setSelPt(-1); };
    const toggleHidden = (id) => setModel((m) => ({ ...m, shapes: m.shapes.map((s) => s.id === id ? { ...s, hidden: !s.hidden } : s) }));
    const addPt = () => { if (!selShape) return; setModel((m) => ({ ...m, shapes: m.shapes.map((s) => { if (s.id !== selShape || !s.pts) return s; const i = selPt >= 0 ? selPt : s.pts.length - 1; const a = s.pts[i], b = s.pts[(i + 1) % s.pts.length]; const n = s.pts.slice(); n.splice(i + 1, 0, [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)]); return { ...s, pts: n }; }) })); };
    const delPt = () => { if (!selShape || selPt < 0) return; setModel((m) => ({ ...m, shapes: m.shapes.map((s) => (s.id === selShape && s.pts && s.pts.length > 3) ? { ...s, pts: s.pts.filter((_, i) => i !== selPt) } : s) })); setSelPt(-1); };

    const copySel = (mode) => {
      if (mode !== 'bone' && selShape) { const s = model.shapes.find((x) => x.id === selShape); if (s) { CLIP = { kind: 'shape', data: clone(s) }; return; } }
      if (selBone && selBone !== 'root') { CLIP = { kind: 'bone', data: clone(byId[selBone]), shapes: clone(model.shapes.filter((s) => s.bone === selBone)) }; }
    };
    const pasteSel = () => {
      if (!CLIP) return;
      if (CLIP.kind === 'shape') {
        const ns = clone(CLIP.data); ns.id = uid('shape'); ns.bone = selBone;
        if (ns.pts) ns.pts = ns.pts.map((p) => [p[0] + 14, p[1] + 14]); else { ns.cx = (ns.cx || 0) + 14; ns.cy = (ns.cy || 0) + 14; }
        setModel((m) => ({ ...m, shapes: [...m.shapes, ns] })); setSelShape(ns.id); setSelPt(-1);
      } else if (CLIP.kind === 'bone') {
        const nb = clone(CLIP.data); nb.id = uid('bone'); nb.parent = byId[nb.parent] ? nb.parent : (selBone || 'root'); nb.x = (nb.x || 0) + 16; nb.y = (nb.y || 0) + 16;
        const ns = (CLIP.shapes || []).map((s) => { const c = clone(s); c.id = uid('shape'); c.bone = nb.id; return c; });
        setModel((m) => ({ ...m, bones: [...m.bones, nb], shapes: [...m.shapes, ...ns] })); setSelBone(nb.id); setSelShape(null); setSelPt(-1);
      }
    };
    useEffect(() => {
      const onKey = (e) => {
        const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') return;
        if (e.key === 'F2') { e.preventDefault(); if (selShape) setRenameTarget({ kind: 'shape', id: selShape }); else if (selBone) setRenameTarget({ kind: 'bone', id: selBone }); return; }
        if (!(e.metaKey || e.ctrlKey)) return;
        const k = e.key.toLowerCase();
        if (k === 'c') { copySel(); } else if (k === 'v') { e.preventDefault(); pasteSel(); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });

    const sb = byId[selBone];
    const shp = shapesOn.find((s) => s.id === selShape);
    const editingShape = !!shp; // while editing a shape, bones step back so only points are grabbable

    // ---- element tree: root -> child bones -> shapes, in draw order --------
    const childrenOf = {}; bones.forEach((b) => { if (b.parent != null) (childrenOf[b.parent] = childrenOf[b.parent] || []).push(b.id); });
    // shapes attach to a bone directly, UNLESS grouped under another shape
    // (shape.groupWith) — then they nest under that shape in the tree instead
    // (they still share its bone under the hood; grouping is purely visual
    // organization, e.g. keeping decorations together with "cloth").
    const shapesOfBone = {}; (model.shapes || []).forEach((s) => { if (!s.groupWith) (shapesOfBone[s.bone] = shapesOfBone[s.bone] || []).push(s); });
    const childShapesOf = {}; (model.shapes || []).forEach((s) => { if (s.groupWith) (childShapesOf[s.groupWith] = childShapesOf[s.groupWith] || []).push(s); });
    const toggleCollapse = (id) => setCollapsed((c) => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const treeRows = [];
    const walkShape = (s, depth) => {
      treeRows.push({ type: 'shape', id: s.id, boneId: s.bone, depth: depth });
      if (collapsed.has(s.id)) return;
      (childShapesOf[s.id] || []).forEach((cs) => walkShape(cs, depth + 1));
    };
    const walkTree = (id, depth) => {
      treeRows.push({ type: 'bone', id: id, depth: depth });
      if (collapsed.has(id)) return;
      (childrenOf[id] || []).forEach((cid) => walkTree(cid, depth + 1));
      (shapesOfBone[id] || []).forEach((s) => walkShape(s, depth + 1));
    };
    if (byId.root) walkTree('root', 0);
    const treeRowStyle = (active, depth) => ({
      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', paddingLeft: 6 + depth * 15,
      cursor: 'pointer', borderRadius: 7, fontSize: 14.5, background: active ? '#e7dcc4' : 'transparent', fontWeight: active ? 700 : 400,
    });
    const nothingSelected = !selShape && selBone === 'root';

    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#2c2b28' }}>
        {/* ---- element tree ---- */}
        <div style={{ width: 236, flex: 'none', padding: '12px 10px 20px', overflowY: 'auto', borderRight: '2px solid #ded7c6', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.7, margin: '2px 4px 8px' }}>Elements</div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 10, paddingLeft: 3 }}>
            <button onClick={addBone} title="Add bone (child of selected)" style={{ fontFamily: UI, fontSize: 15, height: 30, minWidth: 36, padding: '0 6px', cursor: 'pointer', color: '#2c2b28', background: 'rgba(255,255,255,0.65)', border: '2px solid #a49d8b', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>🦴<span style={{ fontSize: 13 }}>+</span></button>
            <button onClick={addShape} title="Add shape (on selected bone)" style={{ fontFamily: UI, fontSize: 15, height: 30, minWidth: 36, padding: '0 6px', cursor: 'pointer', color: '#2c2b28', background: 'rgba(255,255,255,0.65)', border: '2px solid #a49d8b', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>🔷<span style={{ fontSize: 13 }}>+</span></button>
            <span style={{ width: 1, background: '#cfc7b4', margin: '2px 3px' }}></span>
            <IBtn label="⧉" title="Copy selected (⌘C)" onClick={() => copySel()} disabled={nothingSelected} />
            <IBtn label="⎘" title="Paste (⌘V)" onClick={pasteSel} disabled={!CLIP} />
            <IBtn label="－" title="Delete selected" onClick={() => (selShape ? delShape() : delBone())} disabled={nothingSelected} danger />
          </div>
          {treeRows.map((r) => {
            if (r.type === 'bone') {
              const hasKids = !!(childrenOf[r.id] || shapesOfBone[r.id]);
              const rb = byId[r.id];
              return (
                <div key={'b-' + r.id} style={treeRowStyle(r.id === selBone && !selShape, r.depth)}
                  onClick={() => { setSelBone(r.id); setSelShape(null); setSelPt(-1); }}>
                  {hasKids ? (
                    <span onClick={(e) => { e.stopPropagation(); toggleCollapse(r.id); }} style={{ width: 13, fontSize: 11, opacity: 0.55, textAlign: 'center', flex: 'none' }}>{collapsed.has(r.id) ? '▶' : '▼'}</span>
                  ) : <span style={{ width: 13, flex: 'none' }}></span>}
                  <span style={{ flex: 'none' }}>{rb.icon || boneIcon(r.id)}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rb.label || r.id}{boneSide(r.id) ? ' ' + boneSide(r.id) : ''}</span>
                  {model.merge && boneMerges(rb) && (() => { const g = groupOfIn(bones, rb); return g ? <span style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: colorForGroup(g), flex: 'none', border: '1px solid rgba(0,0,0,0.2)', display: 'inline-block' }} title={'Merge group: ' + g} /> : <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4, flex: 'none' }} title="Seamless, no named group">{layerOf(bones, r.id) === 'front' ? '△' : '▽'}</span>; })()}
                </div>
              );
            }
            const rs = (model.shapes || []).find((x) => x.id === r.id); if (!rs) return null;
            const rsMerged = model.merge && shapeMerges(rs, model.colors);
            const rsHasKids = !!childShapesOf[r.id];
            return (
              <div key={'s-' + r.id} style={treeRowStyle(r.id === selShape, r.depth)}
                onClick={() => { setSelBone(r.boneId); setSelShape(r.id); setSelPt(-1); }}>
                {rsHasKids ? (
                  <span onClick={(e) => { e.stopPropagation(); toggleCollapse(r.id); }} style={{ width: 13, fontSize: 11, opacity: 0.55, textAlign: 'center', flex: 'none' }}>{collapsed.has(r.id) ? '▶' : '▼'}</span>
                ) : <span style={{ width: 13, flex: 'none' }}></span>}
                <span style={{ flex: 'none' }}>{rs.icon || shapeIcon(rs)}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: rs.hidden ? 0.45 : 1 }}>{rs.label || r.id}</span>
                {rsMerged && (() => { const g = groupOfIn(bones, rs); return g ? <span style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: colorForGroup(g), flex: 'none', border: '1px solid rgba(0,0,0,0.2)', display: 'inline-block' }} title={'Merge group: ' + g} /> : <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4, flex: 'none' }} title="Seamless, no named group">{layerOf(bones, rs) === 'front' ? '△' : '▽'}</span>; })()}
                <span onClick={(e) => { e.stopPropagation(); toggleHidden(r.id); }} title={rs.hidden ? 'Hidden — click to show' : 'Visible — click to hide'} style={{ fontSize: 12, opacity: 0.6, cursor: 'pointer', flex: 'none', marginLeft: rsMerged ? 5 : 'auto' }}>{rs.hidden ? '🚫' : '👁️'}</span>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ position: 'relative', height: '90%', aspectRatio: '400 / 560' }}>
            <Puppet model={model} pose={{ angles: {}, root: {} }} wobble={false} visible={selShape ? { [selShape]: true } : undefined} />
            <svg ref={svgRef} viewBox={model.viewBox || '-200 -40 400 560'} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', touchAction: 'none' }}>
              {/* bones — dimmed & non-interactive while a shape is being edited */}
              {bones.map((b) => { const o = W[b.id]; if (!o) return null; const sel = b.id === selBone; const op = editingShape ? 0.2 : 1; const pe = editingShape ? 'none' : 'auto'; return (
                <g key={b.id} style={{ opacity: op }}>
                  {b.len > 0 && <line x1={o.ox} y1={o.oy} x2={o.tipX} y2={o.tipY} stroke={sel ? ACCENT : BONE} strokeWidth={sel ? 3 : 2} opacity="0.85" />}
                  <circle cx={o.ox} cy={o.oy} r={sel ? 7 : 5} fill="#fff" stroke={sel ? ACCENT : BONE} strokeWidth="2.4" style={{ cursor: 'move', pointerEvents: pe }}
                    onPointerDown={(e) => { e.preventDefault(); setSelBone(b.id); setSelShape(null); setSelPt(-1); drag.current = { type: 'origin', id: b.id }; }} />
                  {b.len > 0 && <circle cx={o.tipX} cy={o.tipY} r={sel ? 8 : 6} fill={sel ? ACCENT : BONE} stroke="#fff" strokeWidth="2" style={{ cursor: 'grab', pointerEvents: pe }}
                    onPointerDown={(e) => { e.preventDefault(); setSelBone(b.id); setSelShape(null); setSelPt(-1); drag.current = { type: 'tip', id: b.id }; }} />}
                </g>
              ); })}
              {/* handles of selected shape */}
              {shp && (() => {
                const o = W[selBone]; const toW = (lx, ly) => { const w = rot(lx, ly, o.A); return [o.ox + w[0], o.oy + w[1]]; };
                if (shp.kind === 'circle') {
                  const c = toW(shp.cx || 0, shp.cy || 0), rim = toW((shp.cx || 0) + (shp.r || 5), shp.cy || 0);
                  return (
                    <g>
                      <circle cx={c[0]} cy={c[1]} r={shp.r || 5} fill="none" stroke={ACCENT} strokeWidth="1.4" strokeDasharray="4 3" />
                      <circle cx={c[0]} cy={c[1]} r="7" fill={ACCENT} stroke="#fff" strokeWidth="2" style={{ cursor: 'move' }} onPointerDown={(e) => { e.preventDefault(); drag.current = { type: 'shapeMove', shape: shp.id, bone: selBone }; }} />
                      <circle cx={rim[0]} cy={rim[1]} r="5.5" fill="#fff" stroke={ACCENT} strokeWidth="2.2" style={{ cursor: 'ew-resize' }} onPointerDown={(e) => { e.preventDefault(); drag.current = { type: 'circleRim', shape: shp.id, bone: selBone }; }} />
                    </g>
                  );
                }
                if (shp.pts) {
                  const cx = shp.pts.reduce((a, p) => a + p[0], 0) / shp.pts.length, cy = shp.pts.reduce((a, p) => a + p[1], 0) / shp.pts.length;
                  const ctr = toW(cx, cy);
                  return (
                    <g>
                      <polygon points={shp.pts.map((q) => toW(q[0], q[1]).join(',')).join(' ')} fill="none" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="5 4" />
                      {shp.pts.map((q, i) => { const w = toW(q[0], q[1]); return <circle key={i} cx={w[0]} cy={w[1]} r={selPt === i ? 7 : 5} fill={selPt === i ? ACCENT : '#fff'} stroke={ACCENT} strokeWidth="2.2" style={{ cursor: 'grab' }} onPointerDown={(e) => { e.preventDefault(); setSelPt(i); drag.current = { type: 'pt', shape: shp.id, bone: selBone, i }; }} />; })}
                      <rect x={ctr[0] - 5.5} y={ctr[1] - 5.5} width="11" height="11" fill={ACCENT} stroke="#fff" strokeWidth="2" style={{ cursor: 'move' }} onPointerDown={(e) => { e.preventDefault(); drag.current = { type: 'shapeMove', shape: shp.id, bone: selBone }; }} />
                    </g>
                  );
                }
                return null;
              })()}
            </svg>
          </div>
          <div style={{ position: 'absolute', left: 16, bottom: 12, fontSize: 16, opacity: 0.6, maxWidth: 380 }}>{editingShape ? <span><b style={{ color: ACCENT }}>Editing "{selShape}".</b> Drag the orange <b>points</b> (bones are locked). Deselect the shape to pose bones again.</span> : <span>Blue = bones. Drag a <b>tip</b> to set angle/length (hold <b>Shift</b> to keep length fixed), a <b>dot</b> to move the joint. Select a shape in the tree to edit its points.</span>}</div>
        </div>
        {/* panel */}
        <div style={{ width: 292, padding: '14px 18px 26px', overflowY: 'auto', borderLeft: '2px solid #ded7c6', background: 'rgba(255,255,255,0.4)' }}>
          {!sb && !shp && <div style={{ fontSize: 15, opacity: 0.55, marginTop: 4 }}>Select an element in the tree to edit it.</div>}
          {sb && !shp && (
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{sb.icon || boneIcon(sb.id)}</span>{sb.label || sb.id}
                <button onClick={() => setRenameTarget({ kind: 'bone', id: sb.id })} title="Rename / change icon (F2)" style={{ fontSize: 13, width: 24, height: 24, padding: 0, marginLeft: 2, cursor: 'pointer', color: '#2c2b28', background: 'rgba(255,255,255,0.65)', border: '2px solid #a49d8b', borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
              </div>
              <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 14 }}>Bone{sb.parent ? ' (child of ' + sb.parent + ')' : ' (root)'}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <button onClick={() => upBone(sb.id, { drawAs: sb.drawAs === 'limb' ? null : 'limb' })} style={{ ...btn(sb.drawAs === 'limb', 0), fontSize: 15, padding: '3px 10px' }}>{sb.drawAs === 'limb' ? 'draws limb: yes' : 'draws limb: no'}</button>
                {sb.drawAs === 'limb' && <button onClick={() => upBone(sb.id, { endCap: sb.endCap === false ? true : false })} style={{ ...btn(sb.endCap !== false, 1), fontSize: 15, padding: '3px 10px' }}>{sb.endCap === false ? 'end cap: no' : 'end cap: yes'}</button>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ opacity: 0.7, fontSize: 15, width: 62 }}>Z-order</span>
                <button onClick={() => upBone(sb.id, { z: (sb.z || 0) - 1 })} style={{ ...btn(false, 0), fontSize: 15, padding: '3px 10px' }}>down</button>
                <span style={{ fontSize: 15, minWidth: 26, textAlign: 'center' }}>{sb.z || 0}</span>
                <button onClick={() => upBone(sb.id, { z: (sb.z || 0) + 1 })} style={{ ...btn(false, 1), fontSize: 15, padding: '3px 10px' }}>up</button>
              </div>
              {model.merge && boneMerges(sb) && (() => {
                const eff = effectiveZ(model, sb, true);
                const mismatch = eff.z !== (sb.z || 0);
                return (
                  <div style={{ fontSize: 13, marginTop: -6, marginBottom: 12, color: mismatch ? '#a23b28' : undefined, opacity: mismatch ? 1 : 0.5 }}>
                    {mismatch ? '⚠ ' : ''}renders at z={eff.z} <span style={{ opacity: 0.7 }}>(seamless group "{eff.group}" — lowest z of its members wins)</span>
                  </div>
                );
              })()}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ opacity: 0.7, fontSize: 15, width: 62 }}>Length</span>
                <input type="number" step="1" value={Math.round(sb.len || 0)} onChange={(e) => upBone(sb.id, { len: +e.target.value || 0 })}
                  style={{ width: 70, fontFamily: 'Caveat, cursive', fontSize: 16, padding: '2px 8px', color: model.colors.ink, background: '#fff', border: '2px solid #a49d8b', borderRadius: 8 }} />
                <span style={{ opacity: 0.5, fontSize: 14 }}>px</span>
              </div>
              {sb.drawAs === 'limb' && <div style={{ marginBottom: 8 }}><div style={{ opacity: 0.7, fontSize: 15 }}>Thickness {sb.width || 30}</div><input type="range" min="8" max="60" value={sb.width || 30} onChange={(e) => upBone(sb.id, { width: +e.target.value })} style={{ width: '100%', accentColor: ACCENT }} /></div>}
              {model.merge && sb.drawAs === 'limb' && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '2px dashed #d8d0bd' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5 }}>SEAMLESS</span>
                    <button onClick={() => upBone(sb.id, boneMerges(sb) ? { merge: false, mergeGroup: undefined } : { merge: true })} style={{ ...btn(boneMerges(sb), 0), fontSize: 13, padding: '2px 11px', borderRadius: 20 }}>{boneMerges(sb) ? 'on' : 'off'}</button>
                  </div>
                  {boneMerges(sb) && <GroupPicker current={sb.mergeGroup} onSet={(g) => upBone(sb.id, { mergeGroup: g })} />}
                </div>
              )}
            </div>
          )}
          {shp && (
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{shp.icon || shapeIcon(shp)}</span>{shp.label || shp.id}
                <button onClick={() => setRenameTarget({ kind: 'shape', id: shp.id })} title="Rename / change icon (F2)" style={{ fontSize: 13, width: 24, height: 24, padding: 0, marginLeft: 2, cursor: 'pointer', color: '#2c2b28', background: 'rgba(255,255,255,0.65)', border: '2px solid #a49d8b', borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
              </div>
              <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 10 }}>Shape</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Attached to</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {shp.groupWith ? (() => {
                    const parentShape = (model.shapes || []).find((x) => x.id === shp.groupWith);
                    return <span style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 5 }}>{parentShape ? (parentShape.icon || shapeIcon(parentShape)) : '⚠'} {parentShape ? (parentShape.label || parentShape.id) : shp.groupWith} <span style={{ opacity: 0.5, fontSize: 13 }}>(shape)</span></span>;
                  })() : (
                    <span style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 5 }}>{(byId[shp.bone] && (byId[shp.bone].icon || boneIcon(shp.bone))) || '⚠'} {(byId[shp.bone] && (byId[shp.bone].label || shp.bone)) || shp.bone}</span>
                  )}
                  <button onClick={() => setReattachShapeId(shp.id)} style={{ ...btn(false, 0), fontSize: 14, padding: '3px 10px' }}>Change…</button>
                </div>
                {!byId[shp.bone] && <div style={{ fontSize: 13, color: '#a23b28', marginTop: 4 }}>⚠ unknown bone id — pick one above to fix it</div>}
              </div>
              <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Type</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <button onClick={() => setKind(shp.id, 'poly')} style={{ ...btn(shp.kind !== 'circle', 0), fontSize: 14, padding: '2px 9px' }}>polygon</button>
                <button onClick={() => setKind(shp.id, 'circle')} style={{ ...btn(shp.kind === 'circle', 1), fontSize: 14, padding: '2px 9px' }}>circle</button>
              </div>
              {shp.kind === 'circle' && <div style={{ marginBottom: 10 }}><div style={{ opacity: 0.7, fontSize: 15 }}>Radius {shp.r || 5}</div><input type="range" min="3" max="120" value={shp.r || 5} onChange={(e) => upShape(shp.id, { r: +e.target.value })} style={{ width: '100%', accentColor: ACCENT }} /></div>}
              <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Fill</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {[...Object.keys(model.colors || {}), 'none'].map((c) => <button key={c} onClick={() => upShape(shp.id, { fill: c })} style={{ ...btn(shp.fill === c, 0), fontSize: 14, padding: '2px 7px' }}>{c}</button>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ opacity: 0.7, fontSize: 15, width: 62 }}>Z-order</span>
                <button onClick={() => upShape(shp.id, { z: (shp.z != null ? shp.z : 0) - 1 })} style={{ ...btn(false, 0), fontSize: 15, padding: '3px 10px' }}>down</button>
                <span style={{ fontSize: 15, minWidth: 26, textAlign: 'center' }}>{shp.z != null ? shp.z : 0}</span>
                <button onClick={() => upShape(shp.id, { z: (shp.z != null ? shp.z : 0) + 1 })} style={{ ...btn(false, 1), fontSize: 15, padding: '3px 10px' }}>up</button>
              </div>
              {model.merge && shapeMerges(shp, model.colors) && (() => {
                const eff = effectiveZ(model, shp, false);
                const ownZ = shp.z != null ? shp.z : 0;
                const mismatch = eff.z !== ownZ;
                return (
                  <div style={{ fontSize: 13, marginTop: -2, marginBottom: 10, color: mismatch ? '#a23b28' : undefined, opacity: mismatch ? 1 : 0.5 }}>
                    {mismatch ? '⚠ ' : ''}renders at z={eff.z} <span style={{ opacity: 0.7 }}>(seamless group "{eff.group}" — lowest z of its members wins)</span>
                  </div>
                );
              })()}
              {model.merge && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '2px dashed #d8d0bd' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5 }}>SEAMLESS</span>
                    <button onClick={() => upShape(shp.id, shapeMerges(shp, model.colors) ? { merge: false, mergeGroup: undefined } : { merge: true })} style={{ ...btn(shapeMerges(shp, model.colors), 0), fontSize: 13, padding: '2px 11px', borderRadius: 20 }}>{shapeMerges(shp, model.colors) ? 'on' : 'off'}</button>
                  </div>
                  {shapeMerges(shp, model.colors) && <GroupPicker current={shp.mergeGroup} onSet={(g) => upShape(shp.id, { mergeGroup: g })} />}
                </div>
              )}
              <div style={{ marginTop: 16, paddingTop: 13, borderTop: '2px solid #ded7c6' }}>
                {shp.pts ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5 }}>POINTS ({shp.pts.length})</span>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <IBtn label="+" title="Add point" onClick={addPt} />
                        <IBtn label="-" title="Delete selected point" onClick={delPt} disabled={selPt < 0} danger />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                      {shp.pts.map((p, i) => <button key={i} onClick={() => setSelPt(i)} style={{ ...btn(selPt === i, i), fontSize: 13, padding: '2px 8px' }}>P{i}</button>)}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.4 }}>Drag a point on the canvas, or pick one above, then add/delete around it.</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, opacity: 0.5 }}>Circles have no editable points — use Radius above.</div>
                )}
              </div>
            </div>
          )}
        </div>
        <ElementNamePopup target={renameTarget} bones={bones} shapes={model.shapes || []} upBone={upBone} upShape={upShape} onClose={() => setRenameTarget(null)} />
        <ReattachPopup shapeId={reattachShapeId} shapes={model.shapes || []} bones={bones} boneIcon={boneIcon} shapeIcon={shapeIcon} onPick={(target) => reattachShape(reattachShapeId, target)} onClose={() => setReattachShapeId(null)} />
        <GroupNamePopup state={groupPopup} setState={setGroupPopup} onCommit={commitGroupPopup} onClose={() => setGroupPopup(null)} />
      </div>
    );
  }

  // popup for moving a shape onto a different bone, or grouping it under
  // another shape (e.g. a decoration that should ride along with "cloth") —
  // the tree shows the result immediately; see reattachShape() for the
  // coordinate conversion that keeps the shape visually in place.
  function ReattachPopup({ shapeId, shapes, bones, boneIcon, shapeIcon, onPick, onClose }) {
    if (!shapeId) return null;
    const shp = shapes.find((s) => s.id === shapeId);
    if (!shp) return null;
    const otherShapes = shapes.filter((s) => s.id !== shapeId);
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ width: 300, maxHeight: '76vh', display: 'flex', flexDirection: 'column', background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>Move "{shp.label || shp.id}"</div>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 14 }}>Pick a bone, or a shape to group it with (e.g. keep a decoration together with "cloth"). It stays put visually.</div>
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, margin: '0 0 4px' }}>BONES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {bones.map((b, i) => (
                  <button key={b.id} onClick={() => { onPick({ kind: 'bone', id: b.id }); onClose(); }} style={{ ...btn(!shp.groupWith && b.id === shp.bone, i), fontSize: 15, padding: '6px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{b.icon || boneIcon(b.id)} {b.label || b.id}</button>
                ))}
              </div>
            </div>
            {otherShapes.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, margin: '10px 0 4px' }}>SHAPES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {otherShapes.map((s, i) => (
                    <button key={s.id} onClick={() => { onPick({ kind: 'shape', id: s.id }); onClose(); }} style={{ ...btn(shp.groupWith === s.id, i), fontSize: 15, padding: '6px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{s.icon || shapeIcon(s)} {s.label || s.id}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={onClose} style={{ ...btn(false, 0), fontSize: 16, padding: '5px 18px' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // little modal for renaming a bone/shape and picking its icon — opened via
  // the ✎ button in the inspector or the F2 hotkey.
  function ElementNamePopup({ target, bones, shapes, upBone, upShape, onClose }) {
    if (!target) return null;
    const isBone = target.kind === 'bone';
    const obj = isBone ? bones.find((b) => b.id === target.id) : shapes.find((s) => s.id === target.id);
    if (!obj) return null;
    const update = (patch) => (isBone ? upBone(obj.id, patch) : upShape(obj.id, patch));
    const icons = isBone ? ['🦴', '💪', '🤚', '✋', '🦵', '🦶', '😀', '🧍', '🐒', '🦅'] : ['🔷', '⭕', '🫄', '🟫', '🧶', '💇', '👂', '👁️', '✏️', '👃', '👄'];
    const defaultIcon = isBone ? boneIcon(obj.id) : shapeIcon(obj);
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); onClose(); } }}>
        <div style={{ width: 320, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>Rename {isBone ? 'bone' : 'shape'}</div>
          <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Name</div>
          <input autoFocus type="text" value={obj.label || ''} placeholder={obj.id} onChange={(e) => update({ label: e.target.value })}
            style={{ width: '100%', fontFamily: UI, fontSize: 16, padding: '7px 10px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8, boxSizing: 'border-box', marginBottom: 16 }} />
          <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Icon</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            {icons.map((ic) => <button key={ic} onClick={() => update({ icon: ic })} style={{ ...btn((obj.icon || defaultIcon) === ic, 0), fontSize: 17, padding: '4px 9px' }}>{ic}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 18 }}>
            <input type="text" value={obj.icon || ''} placeholder="custom emoji" onChange={(e) => update({ icon: e.target.value.slice(0, 4) })}
              style={{ width: 130, fontFamily: UI, fontSize: 15, padding: '5px 9px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8 }} />
            {obj.icon && <button onClick={() => update({ icon: null })} style={{ ...btn(false, 0), fontSize: 13, padding: '4px 9px' }}>reset icon</button>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ ...btn(true, 0), fontSize: 16, padding: '5px 18px' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  function GroupNamePopup({ state, setState, onCommit, onClose }) {
    if (!state) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } if (e.key === 'Enter') { e.preventDefault(); onCommit(); } }}>
        <div style={{ width: 320, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>{state.mode === 'new' ? 'New seam group' : 'Rename group'}</div>
          <input autoFocus type="text" value={state.name} placeholder="e.g. armL"
            onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))}
            style={{ width: '100%', fontFamily: UI, fontSize: 16, padding: '7px 10px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8, boxSizing: 'border-box', marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
            {GROUP_PALETTE.map((c) => (
              <button key={c} onClick={() => setState((p) => ({ ...p, color: c }))}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', padding: 0, border: state.color === c ? '3px solid #2c2b28' : '2px solid rgba(0,0,0,0.15)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={onClose} style={{ ...btn(false, 0), fontSize: 15, padding: '5px 16px' }}>Cancel</button>
            <button onClick={onCommit} style={{ ...btn(true, 0), fontSize: 16, padding: '5px 18px' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================= PALETTE MODE =============================
  const BUILTIN_COLORS = ['ink', 'skin', 'hair', 'fur'];
  const colorLabel = (k) => k ? k.charAt(0).toUpperCase() + k.slice(1) : '';

  function PaletteMode({ model, setModel }) {
    const keys = Object.keys(model.colors || {});
    const [selKey, setSelKey] = useState(keys[0] || null);
    const [renameKey, setRenameKey] = useState(null);
    const key = keys.includes(selKey) ? selKey : keys[0] || null;
    const usedBy = (k) => (model.shapes || []).some((s) => s.fill === k);
    const addColor = () => {
      const name = (prompt('Color name?', 'color' + (keys.length + 1)) || '').trim();
      if (!name || model.colors[name]) return;
      setModel((m) => ({ ...m, colors: { ...m.colors, [name]: '#a49d8b' } }));
      setSelKey(name);
    };
    const deleteColor = () => {
      if (!key || BUILTIN_COLORS.includes(key)) return;
      if (usedBy(key)) { alert('"' + key + '" is still used by a shape — reassign it first.'); return; }
      setModel((m) => { const c = { ...m.colors }; delete c[key]; return { ...m, colors: c }; });
      setSelKey(null);
    };
    const setHex = (k, hex) => setModel((m) => ({ ...m, colors: { ...m.colors, [k]: hex } }));
    const renameColor = (oldKey, newKey) => {
      if (!newKey || newKey === oldKey || model.colors[newKey]) return;
      setModel((m) => {
        const entries = Object.keys(m.colors).map((k) => [k === oldKey ? newKey : k, m.colors[k]]);
        const shapes = (m.shapes || []).map((s) => ({ ...s, fill: s.fill === oldKey ? newKey : s.fill }));
        return { ...m, colors: Object.fromEntries(entries), shapes };
      });
      if (selKey === oldKey) setSelKey(newKey);
    };
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#2c2b28' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', height: '84%', aspectRatio: '400 / 560' }}>
            <Puppet model={model} pose={{ angles: {}, root: {} }} wobble={false} />
          </div>
        </div>
        <div style={{ width: 300, padding: '18px 22px', overflowY: 'auto', borderLeft: '2px solid #ded7c6', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Palette</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <IBtn label="＋" title="Add color" onClick={addColor} />
              <IBtn label="✎" title="Rename color" onClick={() => setRenameKey(key)} disabled={!key} />
              <IBtn label="－" title="Delete color" onClick={deleteColor} disabled={!key || BUILTIN_COLORS.includes(key)} danger />
            </div>
          </div>
          <div style={{ fontSize: 15, opacity: 0.6, marginBottom: 18 }}>Applies everywhere this color is used — bones, shapes, outlines.</div>
          {keys.map((k) => (
            <div key={k} onClick={() => setSelKey(k)} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, cursor: 'pointer', padding: '4px 6px', borderRadius: 8, background: k === key ? 'rgba(194,90,58,0.14)' : 'transparent' }}>
              <input type="color" value={model.colors[k] || '#000000'} onClick={(e) => e.stopPropagation()} onChange={(e) => setHex(k, e.target.value)}
                style={{ width: 52, height: 52, border: '2px solid #a49d8b', borderRadius: 10, cursor: 'pointer', background: 'none', padding: 0 }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 700 }}>{colorLabel(k)}</div>
                <div style={{ fontSize: 14, opacity: 0.55, fontFamily: 'monospace' }}>{(model.colors[k] || '').toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
        <ColorNamePopup id={renameKey} colors={model.colors} onRename={renameColor} onClose={() => setRenameKey(null)} />
      </div>
    );
  }

  function ColorNamePopup({ id, colors, onRename, onClose }) {
    const [draft, setDraft] = useState(colorLabel(id));
    useEffect(() => { setDraft(colorLabel(id)); }, [id]);
    if (!id || !colors[id]) return null;
    const commit = () => { const name = draft.trim().toLowerCase(); if (name && name !== id && !colors[name]) onRename(id, name); };
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) { commit(); onClose(); } }}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setDraft(colorLabel(id)); onClose(); } if (e.key === 'Enter') { e.preventDefault(); commit(); onClose(); } }}>
        <div style={{ width: 320, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>Rename color</div>
          <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Name</div>
          <input autoFocus type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
            style={{ width: '100%', fontFamily: UI, fontSize: 16, padding: '7px 10px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8, boxSizing: 'border-box', marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => { commit(); onClose(); }} style={{ ...btn(true, 0), fontSize: 16, padding: '5px 18px' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================= ACTION MODE =============================
  function ActionMode({ model, setModel }) {
    const actions = model.actions || {};
    const ids = Object.keys(actions);
    const [actId, setActId] = useState(ids[0] || null);
    const [time, setTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [selBone, setSelBone] = useState(null);
    const [selShape, setSelShape] = useState(null);
    const [collapsed, setCollapsed] = useState(() => new Set());
    const [selKey, setSelKey] = useState(-1);
    const [working, setWorking] = useState(null); // {angles, root}
    const svgRef = useRef(null); const drag = useRef(null); const trackRef = useRef(null); const workingRef = useRef(null);
    const toSvg = useSvgPointer(svgRef);
    const act = actId ? actions[actId] : null;

    // always-on clock; advances time only while playing (rAF-gated hooks proved flaky)
    const timeRef = useRef(0);
    const playingRef = useRef(false); useEffect(() => { playingRef.current = playing; }, [playing]);
    const actRef = useRef(act); useEffect(() => { actRef.current = act; }, [act]);
    useEffect(() => {
      let last = performance.now();
      const id = setInterval(() => {
        const now = performance.now(); const dt = (now - last) / 1000; last = now;
        const a = actRef.current;
        if (playingRef.current && a) { timeRef.current = (timeRef.current + dt) % (a.dur || 1); setTime(timeRef.current); }
      }, 33);
      return () => clearInterval(id);
    }, []);
    // sync working pose from the sampled action whenever time/action changes —
    // OR whenever the action's keys change underneath us (undo/redo, paste,
    // key-delete). Without `act` in the deps, an undo reverts the model but the
    // displayed pose stays stale until you scrub. Skip ONLY while actively
    // posing a joint (tip/root drag); scrubbing or dragging a key SHOULD resample.
    useEffect(() => {
      if (!act) { setWorking({ angles: {}, root: {} }); return; }
      const posing = drag.current && (drag.current.type === 'tip' || drag.current.type === 'root');
      if (!posing) setWorking(clone(samplePose(act, timeRef.current)));
    }, [time, actId, act]);
    useEffect(() => { workingRef.current = working; });

    const bones = model.bones, byId = {}; bones.forEach((b) => byId[b.id] = b);
    const pose = working || { angles: {}, root: {} };
    const W = computeWorld(bones, pose);

    useEffect(() => {
      const move = (e) => {
        if (!drag.current) return;
        if (e.pointerType !== 'touch' && e.buttons === 0) { drag.current = null; return; } // self-heal a stuck drag
        e.preventDefault();
        const [wx, wy] = toSvg(e.clientX, e.clientY); const d = drag.current;
        if (d.type === 'scrub' || d.type === 'key') {
          const rect = trackRef.current && trackRef.current.getBoundingClientRect();
          if (!rect) return;
          const dur = actRef.current ? (actRef.current.dur || 1) : 1;
          const u = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const nt = +(u * dur).toFixed(2);
          if (d.type === 'key' && actId != null) {
            setModel((m) => { const a = clone(m.actions[actId]); if (a.keys[d.idx]) a.keys[d.idx] = { ...a.keys[d.idx], t: nt }; return { ...m, actions: { ...m.actions, [actId]: a } }; });
          }
          timeRef.current = nt; setTime(nt);
          return;
        }
        if (d.type === 'tip') {
          const b = byId[d.id]; const o = W[d.id];
          const wa = Math.atan2(wy - o.oy, wx - o.ox);
          const deg = b.parent == null ? wa * DEG : (wa - W[b.parent].A) * DEG;
          setWorking((p) => { const np = { angles: { ...p.angles, [d.id]: +deg.toFixed(1) }, root: p.root || {}, visible: p.visible }; workingRef.current = np; return np; });
        } else if (d.type === 'root') {
          setWorking((p) => { const np = { angles: p.angles || {}, root: { ...(p.root || {}), x: Math.round(wx - (byId.root.x || 0)), y: Math.round(wy - (byId.root.y || 0)) }, visible: p.visible }; workingRef.current = np; return np; });
        }
      };
      const up = () => {
        const d = drag.current; drag.current = null;
        // auto-commit the posed joints as a keyframe at the current time —
        // merge angles/root into the existing key's pose rather than
        // replacing it wholesale, so a shape's `visible` state set on this
        // key (e.g. via the eye toggle) survives re-posing a joint here.
        if (d && (d.type === 'tip' || d.type === 'root') && actRef.current && actId != null) {
          const wp = workingRef.current || { angles: {}, root: {} };
          const angles = clone(wp.angles || {}), root = clone(wp.root || {});
          const t = timeRef.current;
          setModel((m) => { const a = clone(m.actions[actId]); const eps = 0.02; const i = a.keys.findIndex((k) => Math.abs(k.t - t) < eps); if (i >= 0) a.keys[i] = { ...a.keys[i], t: +t.toFixed(2), pose: { ...a.keys[i].pose, angles, root } }; else { a.keys.push({ t: +t.toFixed(2), pose: { angles, root } }); a.keys.sort((x, y) => x.t - y.t); } return { ...m, actions: { ...m.actions, [actId]: a } }; });
        }
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    });

    const setKey = () => { if (!act) return; setModel((m) => { const a = clone(m.actions[actId]); const eps = 0.02; const pose = clone(working); let i = a.keys.findIndex((k) => Math.abs(k.t - time) < eps); if (i >= 0) a.keys[i] = { t: +time.toFixed(2), pose }; else { a.keys.push({ t: +time.toFixed(2), pose }); a.keys.sort((x, y) => x.t - y.t); } return { ...m, actions: { ...m.actions, [actId]: a } }; }); };
    const delKey = () => { if (!act) return; setModel((m) => { const a = clone(m.actions[actId]); if (a.keys.length <= 1) return m; let idx = selKey; if (idx < 0 || idx >= a.keys.length) { let bd = 1e9, best = -1; a.keys.forEach((k, i) => { const dd = Math.abs(k.t - time); if (dd < bd) { bd = dd; best = i; } }); idx = bd < 0.1 ? best : -1; } if (idx >= 0) a.keys.splice(idx, 1); return { ...m, actions: { ...m.actions, [actId]: a } }; }); setSelKey(-1); };
    const [renamePopupId, setRenamePopupId] = useState(null);
    const addAction = () => { const name = (prompt('Action name?', 'action' + (ids.length + 1)) || '').trim(); if (!name) return; setModel((m) => ({ ...m, actions: { ...m.actions, [name]: { dur: 1.5, loop: true, keys: [{ t: 0, pose: { angles: {}, root: {} } }] } } })); setActId(name); timeRef.current = 0; setTime(0); };
    const delAction = () => { if (!actId) return; setModel((m) => { const a = { ...m.actions }; delete a[actId]; return { ...m, actions: a }; }); const rem = ids.filter((x) => x !== actId); setActId(rem[0] || null); };
    const renameAction = (id) => { if (id || actId) setRenamePopupId(id || actId); };
    const setDur = (v) => setModel((m) => { const a = m.actions[actId]; const old = a.dur || 1; const f = old > 0 ? v / old : 1; const keys = (a.keys || []).map((k) => ({ ...k, t: +Math.max(0, Math.min(v, k.t * f)).toFixed(2) })); return { ...m, actions: { ...m.actions, [actId]: { ...a, dur: v, keys } } }; });
    const toggleLoop = () => setModel((m) => ({ ...m, actions: { ...m.actions, [actId]: { ...m.actions[actId], loop: !m.actions[actId].loop } } }));
    // Shape visibility, kept per-keyframe (a step curve): toggling writes into
    // the keyframe at the current playhead time (creating one there if none
    // exists yet), same auto-commit pattern as posing a joint.
    const effectiveVisible = (s) => (working && working.visible && Object.prototype.hasOwnProperty.call(working.visible, s.id)) ? !!working.visible[s.id] : !s.hidden;
    // Which key am I editing: prefer the explicitly selected key, else a key
    // sitting right at the playhead, else "none" (meaning: create a fresh key
    // at the exact playhead time). Visibility is a held/step curve computed
    // from keys at or before the playhead (see heldVisible in engine.ts), so
    // picking the *nearest* key here — even one still ahead of the playhead —
    // wrote the toggle into a keyframe that hadn't taken effect yet, making
    // the eye icon look like it silently reverted itself.
    const keyIndexAt = () => {
      if (!act) return -1;
      if (selKey >= 0 && selKey < act.keys.length) return selKey;
      const eps = 0.02;
      return act.keys.findIndex((k) => Math.abs(k.t - time) < eps);
    };
    const setShapeVisible = (shapeId, val) => {
      if (!act) return;
      const nextWorking = { angles: (working && working.angles) || {}, root: (working && working.root) || {}, visible: { ...((working && working.visible) || {}), [shapeId]: val } };
      setWorking(nextWorking);
      setModel((m) => {
        const a = clone(m.actions[actId]);
        const i = keyIndexAt();
        if (i >= 0 && a.keys[i]) {
          a.keys[i] = { ...a.keys[i], pose: { ...a.keys[i].pose, visible: { ...((a.keys[i].pose && a.keys[i].pose.visible) || {}), [shapeId]: val } } };
        } else {
          // brand new key: only record the shape being toggled (not the whole
          // inherited/merged snapshot) so it doesn't duplicate state that
          // already lives on earlier keys.
          a.keys.push({ t: +time.toFixed(2), pose: { angles: clone(nextWorking.angles), root: clone(nextWorking.root), visible: { [shapeId]: val } } });
          a.keys.sort((x, y) => x.t - y.t);
        }
        return { ...m, actions: { ...m.actions, [actId]: a } };
      });
    };

    const copyKey = () => { if (!act) return; let idx = selKey; if (idx < 0) { let bd = 1e9; act.keys.forEach((k, i) => { const dd = Math.abs(k.t - time); if (dd < bd) { bd = dd; idx = i; } }); if (bd >= 0.1) idx = -1; } const pose = idx >= 0 ? act.keys[idx].pose : working; if (pose) CLIP = { kind: 'key', pose: clone(pose) }; };
    const pasteKey = () => { if (!act || !CLIP || CLIP.kind !== 'key') return; setModel((m) => { const a = clone(m.actions[actId]); const eps = 0.02; const i = a.keys.findIndex((k) => Math.abs(k.t - time) < eps); const nk = { t: +time.toFixed(2), pose: clone(CLIP.pose) }; if (i >= 0) a.keys[i] = nk; else { a.keys.push(nk); a.keys.sort((x, y) => x.t - y.t); } return { ...m, actions: { ...m.actions, [actId]: a } }; }); setWorking(clone(CLIP.pose)); };
    // Nudge a bone's angle numerically at the current time (same auto-commit
    // pattern as dragging its tip): updates the live pose AND writes/updates
    // a keyframe at the playhead, so typing a number works like posing by hand.
    const setBoneAngle = (boneId, deg) => {
      if (!act) return;
      const nextWorking = { angles: { ...((working && working.angles) || {}), [boneId]: deg }, root: (working && working.root) || {}, visible: working && working.visible };
      setWorking(nextWorking); workingRef.current = nextWorking;
      setModel((m) => {
        const a = clone(m.actions[actId]); const eps = 0.02;
        const i = a.keys.findIndex((k) => Math.abs(k.t - time) < eps);
        if (i >= 0) a.keys[i] = { ...a.keys[i], pose: { ...a.keys[i].pose, angles: { ...((a.keys[i].pose && a.keys[i].pose.angles) || {}), [boneId]: deg } } };
        else { a.keys.push({ t: +time.toFixed(2), pose: { angles: { [boneId]: deg }, root: {} } }); a.keys.sort((x, y) => x.t - y.t); }
        return { ...m, actions: { ...m.actions, [actId]: a } };
      });
    };
    useEffect(() => {
      const onKey = (e) => {
        if (!(e.metaKey || e.ctrlKey)) return;
        const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') return;
        const k = e.key.toLowerCase();
        if (k === 'c') { copyKey(); } else if (k === 'v') { e.preventDefault(); pasteKey(); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });

    // ---- element tree (mirrors Rig's — read-only structure, click to select) ----
    const childrenOf = {}; bones.forEach((b) => { if (b.parent != null) (childrenOf[b.parent] = childrenOf[b.parent] || []).push(b.id); });
    const shapesOfBone = {}; (model.shapes || []).forEach((s) => { if (!s.groupWith) (shapesOfBone[s.bone] = shapesOfBone[s.bone] || []).push(s); });
    const childShapesOf = {}; (model.shapes || []).forEach((s) => { if (s.groupWith) (childShapesOf[s.groupWith] = childShapesOf[s.groupWith] || []).push(s); });
    const toggleCollapse = (id) => setCollapsed((c) => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; });
    const treeRows = [];
    const walkShapeA = (s, depth) => {
      treeRows.push({ type: 'shape', id: s.id, depth: depth });
      if (collapsed.has(s.id)) return;
      (childShapesOf[s.id] || []).forEach((cs) => walkShapeA(cs, depth + 1));
    };
    const walkTreeA = (id, depth) => {
      treeRows.push({ type: 'bone', id: id, depth: depth });
      if (collapsed.has(id)) return;
      (childrenOf[id] || []).forEach((cid) => walkTreeA(cid, depth + 1));
      (shapesOfBone[id] || []).forEach((s) => walkShapeA(s, depth + 1));
    };
    if (byId.root) walkTreeA('root', 0);
    const treeRowStyle = (active, depth) => ({
      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', paddingLeft: 6 + depth * 15,
      cursor: 'pointer', borderRadius: 7, fontSize: 14.5, background: active ? '#e7dcc4' : 'transparent', fontWeight: active ? 700 : 400,
    });
    const selShapeObj = selShape ? (model.shapes || []).find((s) => s.id === selShape) : null;
    const selBoneObj = selBone ? byId[selBone] : null;
    const curAngle = selBone ? ((pose.angles && pose.angles[selBone] != null) ? pose.angles[selBone] : (byId[selBone] ? byId[selBone].angle || 0 : 0)) : 0;

    return (
      <>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#2c2b28' }}>
        {/* ---- element tree ---- */}
        <div style={{ width: 220, flex: 'none', padding: '12px 10px 20px', overflowY: 'auto', borderRight: '2px solid #ded7c6', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.7, margin: '2px 4px 10px' }}>Elements</div>
          {treeRows.map((r) => {
            if (r.type === 'bone') {
              const hasKids = !!(childrenOf[r.id] || shapesOfBone[r.id]);
              const rb = byId[r.id];
              return (
                <div key={'b-' + r.id} style={treeRowStyle(r.id === selBone && !selShape, r.depth)}
                  onClick={() => { setSelBone(r.id); setSelShape(null); }}>
                  {hasKids ? (
                    <span onClick={(e) => { e.stopPropagation(); toggleCollapse(r.id); }} style={{ width: 13, fontSize: 11, opacity: 0.55, textAlign: 'center', flex: 'none' }}>{collapsed.has(r.id) ? '▶' : '▼'}</span>
                  ) : <span style={{ width: 13, flex: 'none' }}></span>}
                  <span style={{ flex: 'none' }}>{rb.icon || boneIcon(r.id)}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rb.label || r.id}{boneSide(r.id) ? ' ' + boneSide(r.id) : ''}</span>
                </div>
              );
            }
            const rs = (model.shapes || []).find((x) => x.id === r.id); if (!rs) return null;
            const rsHasKids = !!childShapesOf[r.id];
            const rsVisible = effectiveVisible(rs);
            return (
              <div key={'s-' + r.id} style={treeRowStyle(r.id === selShape, r.depth)}
                onClick={() => { setSelShape(r.id); setSelBone(null); }}>
                {rsHasKids ? (
                  <span onClick={(e) => { e.stopPropagation(); toggleCollapse(r.id); }} style={{ width: 13, fontSize: 11, opacity: 0.55, textAlign: 'center', flex: 'none' }}>{collapsed.has(r.id) ? '▶' : '▼'}</span>
                ) : <span style={{ width: 13, flex: 'none' }}></span>}
                <span style={{ flex: 'none' }}>{rs.icon || shapeIcon(rs)}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: rsVisible ? 1 : 0.4 }}>{rs.label || r.id}</span>
                <span onClick={(e) => { e.stopPropagation(); setShapeVisible(r.id, !rsVisible); }} title={rsVisible ? 'Visible now — click to hide from here' : 'Hidden now — click to show from here'} style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6, cursor: 'pointer', flex: 'none' }}>{rsVisible ? '👁️' : '🚫'}</span>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
          <div style={{ flex: '1 1 auto', minHeight: 160, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', height: '100%', maxHeight: 420, aspectRatio: '400 / 560' }}>
              <Puppet model={model} pose={pose} wobble={!playing ? false : true} />
              {!playing && (
                <svg ref={svgRef} viewBox={model.viewBox || '-200 -40 400 560'} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', touchAction: 'none' }}>
                  {bones.map((b) => { const o = W[b.id]; if (!o) return null; if (b.parent == null) return <circle key={b.id} cx={o.ox} cy={o.oy} r="7" fill="#fff" stroke={BONE} strokeWidth="2.4" style={{ cursor: 'move' }} onPointerDown={(e) => { e.preventDefault(); drag.current = { type: 'root' }; }} />; if (!(b.len > 0)) return null; const sel = b.id === selBone; return (
                    <g key={b.id}>
                      <line x1={o.ox} y1={o.oy} x2={o.tipX} y2={o.tipY} stroke={sel ? ACCENT : BONE} strokeWidth="2" opacity="0.7" />
                      <circle cx={o.tipX} cy={o.tipY} r={sel ? 8 : 6} fill={sel ? ACCENT : BONE} stroke="#fff" strokeWidth="2" style={{ cursor: 'grab' }} onPointerDown={(e) => { e.preventDefault(); setSelBone(b.id); drag.current = { type: 'tip', id: b.id }; }} />
                    </g>
                  ); })}
                </svg>
              )}
            </div>
            <div style={{ position: 'absolute', left: 16, bottom: 8, fontSize: 16, opacity: 0.6, maxWidth: 400 }}>{playing ? 'Playing…' : 'Drag a joint — the pose auto-saves as a key at the current time. Drag ◆ on the timeline to move a key; select a key + "－" to remove it.'}</div>
          </div>
          {/* timeline */}
          <div style={{ flex: 'none', padding: '8px 18px 12px', borderTop: '2px solid #e3dcca', background: 'rgba(255,255,255,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <button onClick={() => setPlaying((v) => { const nv = !v; if (nv) setSelKey(-1); return nv; })} style={btn(playing, 0)}>{playing ? '⏹ stop' : '▶ play'}</button>
              <Grp label="Key" style={{ margin: 0 }}>
                <IBtn label="◆" title="Set key at playhead" onClick={setKey} disabled={!act} />
                <IBtn label="－" title="Delete selected key" onClick={delKey} disabled={!act} danger />
                <IBtn label="⧉" title="Copy pose (⌘C)" onClick={copyKey} disabled={!act} />
                <IBtn label="⎘" title="Paste pose here (⌘V)" onClick={pasteKey} disabled={!(CLIP && CLIP.kind === 'key')} />
              </Grp>
              <span style={{ fontSize: 15, opacity: 0.7 }}>t = {time.toFixed(2)}s / {act ? act.dur : 0}s{selKey >= 0 ? ' · key ' + (selKey + 1) : ''}</span>
              <span style={{ flex: 1 }}></span>
              {act && <button onClick={toggleLoop} style={btn(act.loop, 0)}>{act.loop ? '↻ loop' : '→ once'}</button>}
            </div>
            <div ref={trackRef} onPointerDown={(e) => { if (!act) return; e.preventDefault(); const rect = trackRef.current.getBoundingClientRect(); const u = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); const nt = +(u * (act.dur || 1)).toFixed(2); setPlaying(false); setSelKey(-1); timeRef.current = nt; setTime(nt); drag.current = { type: 'scrub' }; }}
              style={{ position: 'relative', height: 40, margin: '2px 0 6px', cursor: 'pointer', touchAction: 'none' }}>
              <div style={{ position: 'absolute', top: 19, left: 0, right: 0, height: 3, background: '#d9d1bf', borderRadius: 2 }}></div>
              <div style={{ position: 'absolute', top: 5, bottom: 5, left: (100 * time / (act ? (act.dur || 1) : 1)) + '%', width: 2, background: '#2c2b28', transform: 'translateX(-1px)', pointerEvents: 'none' }}></div>
              {act && act.keys.map((k, i) => (
                <div key={i} title={'key @ ' + k.t.toFixed(2) + 's — drag to move, select + "del key" to remove'}
                  onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setPlaying(false); setSelKey(i); timeRef.current = k.t; setTime(k.t); drag.current = { type: 'key', idx: i }; }}
                  style={{ position: 'absolute', top: 13, left: (100 * k.t / (act.dur || 1)) + '%', width: 15, height: 15, transform: 'translateX(-50%) rotate(45deg)', background: selKey === i ? '#2c2b28' : ACCENT, border: '2px solid #fff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.3)', cursor: 'grab' }}></div>
              ))}
            </div>
            {act && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, marginTop: 2 }}><span style={{ opacity: 0.7 }}>duration</span><input type="range" min="0.4" max="5" step="0.1" value={act.dur} onChange={(e) => setDur(+e.target.value)} style={{ width: 160, accentColor: ACCENT }} /><span>{act.dur}s · {act.keys.length} keys</span></div>}
          </div>
        </div>
        {/* actions panel */}
        <div style={{ width: 240, padding: '14px 18px', overflowY: 'auto', borderLeft: '2px solid #ded7c6', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, marginBottom: 12 }}>
            {ids.map((id, i) => <button key={id} onClick={() => { setPlaying(false); setActId(id); setSelKey(-1); timeRef.current = 0; setTime(0); }} onDoubleClick={() => renameAction(id)} title="Double-click to rename" style={{ ...btn(id === actId, i), textAlign: 'left', whiteSpace: 'nowrap' }}>{actions[id].loop ? '🔁' : ''}{actions[id].icon || actionIcon(id)}  {id}</button>)}
          </div>
          <Grp label="Action">
            <IBtn label="＋" title="Add action" onClick={addAction} />
            <IBtn label="✎" title="Rename / change icon" onClick={() => renameAction(actId)} disabled={!actId} />
            <IBtn label="－" title="Delete action" onClick={delAction} disabled={!actId} danger />
          </Grp>
          {act && (selBoneObj || selShapeObj) && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '2px solid #ded7c6' }}>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, marginBottom: 8 }}>SELECTED</div>
              {selBoneObj && (
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}><span>{selBoneObj.icon || boneIcon(selBoneObj.id)}</span>{selBoneObj.label || selBoneObj.id}</div>
                  {selBoneObj.parent != null ? (
                    <div>
                      <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Angle @ t={time.toFixed(2)}s</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="number" step="0.5" value={Math.round(curAngle * 10) / 10} onChange={(e) => setBoneAngle(selBoneObj.id, +e.target.value || 0)}
                          style={{ width: 84, fontFamily: 'Caveat, cursive', fontSize: 16, padding: '4px 8px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8 }} />
                        <span style={{ opacity: 0.5, fontSize: 14 }}>°</span>
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.55, marginTop: 6, lineHeight: 1.4 }}>Or drag its tip on the canvas — both auto-save a key here.</div>
                    </div>
                  ) : <div style={{ fontSize: 13, opacity: 0.55 }}>Root — drag it on the canvas to move the whole body.</div>}
                </div>
              )}
              {selShapeObj && (
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}><span>{selShapeObj.icon || shapeIcon(selShapeObj)}</span>{selShapeObj.label || selShapeObj.id}</div>
                  {(() => { const vis = effectiveVisible(selShapeObj); return (
                    <button onClick={() => setShapeVisible(selShapeObj.id, !vis)} title="Toggle this shape on/off at the current time (writes a keyframe)"
                      style={{ ...btn(vis, 0), fontSize: 15, padding: '5px 14px', width: '100%' }}>{vis ? '👁️ visible here' : '🚫 hidden here'}</button>
                  ); })()}
                  <div style={{ fontSize: 13, opacity: 0.55, marginTop: 8, lineHeight: 1.4 }}>Holds from this time until the next keyframe that changes it — e.g. hide "spear" everywhere, show it only during a throw.</div>
                </div>
              )}
            </div>
          )}
          {!act && <div style={{ fontSize: 15, opacity: 0.55, marginTop: 16 }}>Pick or add an action to start posing.</div>}
          {act && !selBoneObj && !selShapeObj && <div style={{ fontSize: 14, opacity: 0.5, marginTop: 16, lineHeight: 1.5 }}>Select an element in the tree, or drag a joint on the canvas.</div>}
        </div>
      </div>
      <ActionNamePopup id={renamePopupId} actions={actions} setModel={setModel} actId={actId} setActId={setActId} onClose={() => setRenamePopupId(null)} />
      </>
    );
  }

  function ActionNamePopup({ id, actions, setModel, actId, setActId, onClose }) {
    const [draft, setDraft] = useState(id || '');
    useEffect(() => { setDraft(id || ''); }, [id]);
    if (!id || !actions[id]) return null;
    const act = actions[id];
    const icons = ['🧍', '🚶', '🏃', '🤾', '👋', '🙆', '🛌', '🤸', '💃', '🎯', '🔁'];
    const commitName = () => {
      const name = draft.trim();
      if (!name || name === id || actions[name]) { setDraft(id); return; }
      setModel((m) => {
        const entries = Object.keys(m.actions).map((k) => [k === id ? name : k, m.actions[k]]);
        return { ...m, actions: Object.fromEntries(entries) };
      });
      if (actId === id) setActId(name);
    };
    const setIcon = (icon) => setModel((m) => ({ ...m, actions: { ...m.actions, [id]: { ...m.actions[id], icon } } }));
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) { commitName(); onClose(); } }}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setDraft(id); onClose(); } if (e.key === 'Enter') { e.preventDefault(); commitName(); onClose(); } }}>
        <div style={{ width: 320, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>Rename action</div>
          <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Name</div>
          <input autoFocus type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
            style={{ width: '100%', fontFamily: UI, fontSize: 16, padding: '7px 10px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8, boxSizing: 'border-box', marginBottom: 16 }} />
          <div style={{ opacity: 0.7, fontSize: 15, marginBottom: 4 }}>Icon</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            {icons.map((ic) => <button key={ic} onClick={() => setIcon(ic)} style={{ ...btn((act.icon || actionIcon(id)) === ic, 0), fontSize: 17, padding: '4px 9px' }}>{ic}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 18 }}>
            <input type="text" value={act.icon || ''} placeholder="custom emoji" onChange={(e) => setIcon(e.target.value.slice(0, 4))}
              style={{ width: 130, fontFamily: UI, fontSize: 15, padding: '5px 9px', color: '#2c2b28', background: '#fff', border: '2px solid #a49d8b', borderRadius: 8 }} />
            {act.icon && <button onClick={() => setIcon(null)} style={{ ...btn(false, 0), fontSize: 13, padding: '4px 9px' }}>reset icon</button>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => { commitName(); onClose(); }} style={{ ...btn(true, 0), fontSize: 16, padding: '5px 18px' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // popup for linking the studio to a file on disk — shows a path input + quick
  // hints for finding the path on macOS. Once confirmed the studio auto-saves
  // every change there without further interaction.
  function LinkFilePopup({ open, currentPath, model, onLink, onClose }) {
    const [path, setPath] = useState(currentPath || '');
    const [status, setStatus] = useState(null); // null | 'checking' | 'ok' | 'new' | 'error'
    useEffect(() => { if (open) { setPath(currentPath || ''); setStatus(null); } }, [open, currentPath]);

    const check = async (p) => {
      setStatus('checking');
      try {
        const res = await fetch('/api/puppet/load?' + new URLSearchParams({ path: p }));
        const data = await res.json();
        setStatus(data.ok ? 'ok' : 'new');
      } catch { setStatus('new'); }
    };

    if (!open) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ width: 520, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: '22px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Link to file</div>
          <div style={{ fontSize: 14, opacity: 0.65, marginBottom: 16, lineHeight: 1.5 }}>
            The studio will auto-save every change directly to this file. Paste the full path or drag the file onto the field below.
            <br />Tip on macOS: right-click a file → Get Info → copy the path from "Where", or drag it into Terminal first.
          </div>
          <input
            autoFocus
            type="text"
            value={path}
            placeholder="/Users/you/project/puppet-model.js"
            onChange={(e) => { setPath(e.target.value); setStatus(null); }}
            onBlur={() => { if (path.trim()) check(path.trim()); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && path.trim()) { check(path.trim()); } if (e.key === 'Escape') onClose(); }}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: 13, padding: '9px 12px', color: '#2c2b28', background: '#fff', border: '2px solid ' + (status === 'error' ? '#a23b28' : '#a49d8b'), borderRadius: 8, boxSizing: 'border-box', marginBottom: 8 }}
          />
          {status === 'ok'       && <div style={{ fontSize: 13, color: '#4a8c5c', marginBottom: 8 }}>✓ File found — existing content will be loaded.</div>}
          {status === 'new'      && <div style={{ fontSize: 13, color: '#b0955a', marginBottom: 8 }}>⬆ File not found — it will be created on first save.</div>}
          {status === 'error'    && <div style={{ fontSize: 13, color: '#a23b28', marginBottom: 8 }}>⚠ Could not reach the dev server.</div>}
          {status === 'checking' && <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 8 }}>Checking…</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button onClick={onClose} style={{ ...btn(false, 0), fontSize: 15, padding: '5px 16px' }}>Cancel</button>
            <button onClick={() => { const p = path.trim(); if (p) onLink(p); }} disabled={!path.trim()} style={{ ...btn(true, 1), fontSize: 15, padding: '5px 18px', opacity: path.trim() ? 1 : 0.4 }}>Link &amp; save</button>
          </div>
        </div>
      </div>
    );
  }

  // little reference card listing every keyboard shortcut — opened from
  // File ▾ → Shortcuts… or the "?" hotkey.
  function ShortcutsPopup({ open, onClose }) {
    if (!open) return null;
    const Row = ({ keys, desc }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid #eee3ca' }}>
        <div style={{ display: 'flex', gap: 4, flex: 'none', width: 128 }}>
          {keys.map((k) => <kbd key={k} style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, padding: '3px 7px', background: '#f4eee0', border: '1.5px solid #cfc7b4', borderRadius: 6, color: '#2c2b28' }}>{k}</kbd>)}
        </div>
        <div style={{ fontSize: 15, opacity: 0.85 }}>{desc}</div>
      </div>
    );
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{ width: 400, background: '#fdfaf3', border: '2px solid #a49d8b', borderRadius: 14, padding: '20px 22px', boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: UI, color: '#2c2b28' }} onPointerDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>Keyboard shortcuts</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, margin: '4px 0 2px' }}>GLOBAL</div>
          <Row keys={['⌘Z']} desc="Undo" />
          <Row keys={['⇧', '⌘Z']} desc="Redo" />
          <Row keys={['⌘S']} desc="Save model" />
          <Row keys={['?']} desc="Show this help" />
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, margin: '14px 0 2px' }}>RIG</div>
          <Row keys={['F2']} desc="Rename / change icon of selection" />
          <Row keys={['⌘C']} desc="Copy selected bone or shape" />
          <Row keys={['⌘V']} desc="Paste" />
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.55, letterSpacing: 0.5, margin: '14px 0 2px' }}>ACTION</div>
          <Row keys={['⌘C']} desc="Copy the current pose" />
          <Row keys={['⌘V']} desc="Paste pose at playhead" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={onClose} style={{ ...btn(true, 0), fontSize: 16, padding: '5px 18px' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // =============================== SHELL ===============================
  function PuppetStudio(props) {
    const DEFAULT = DEFAULT_PUPPET;
    const { model, setModel, undo, redo, canUndo, canRedo } = useHistory(() => { try { const s = localStorage.getItem(STORE); if (s) return JSON.parse(s); } catch (e) {} return clone(DEFAULT); });
    useEffect(() => { try { localStorage.setItem(STORE, JSON.stringify(model)); } catch (e) {} }, [model]);

    // ---- file source: either a server path or a File System Access handle ----
    // serverPath is persisted across reloads (unlike fileHandle, which the browser
    // can't serialize): otherwise a page refresh silently drops the auto-save link
    // — the model itself survives via localStorage, so nothing *looks* wrong until
    // you notice "unsaved" in the header and wonder why your edits aren't hitting disk.
    const [fileHandle, setFileHandle] = useState(null);   // FileSystemFileHandle | null
    const [serverPath, setServerPath] = useState(() => { try { return localStorage.getItem(SERVER_PATH_STORE) || null; } catch (e) { return null; } });
    const [recentFiles, setRecentFiles] = useState([]);
    const [projectModels, setProjectModels] = useState([]); // [{name, path}] from /api/puppet/list
    const [saveStatus, setSaveStatus] = useState('idle');
    const [showLibrary, setShowLibrary] = useState(false);
    const saveTimerRef = useRef(null);
    const fileHandleRef = useRef(fileHandle);
    const serverPathRef = useRef(serverPath);
    useEffect(() => { fileHandleRef.current = fileHandle; }, [fileHandle]);
    useEffect(() => { serverPathRef.current = serverPath; try { if (serverPath) localStorage.setItem(SERVER_PATH_STORE, serverPath); else localStorage.removeItem(SERVER_PATH_STORE); } catch (e) {} }, [serverPath]);

    // load IDB handles + project model list on mount
    useEffect(() => { loadRecentHandles().then(setRecentFiles); }, []);
    useEffect(() => {
      fetch('/api/puppet/list').then((r) => r.json()).then((d) => { if (d.ok) setProjectModels(d.models); }).catch(() => {});
    }, []);

    const saveToHandle = useCallback(async (m, handle) => {
      if (!handle) return;
      setSaveStatus('saving');
      try {
        const writable = await handle.createWritable();
        await writable.write(modelToJs(m));
        await writable.close();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) { setSaveStatus('error'); console.error('Save failed:', e); }
    }, []);

    const saveToServer = useCallback(async (m, path) => {
      if (!path) return;
      setSaveStatus('saving');
      try {
        const res = await fetch('/api/puppet/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, content: modelToJs(m) }) });
        if (!res.ok) throw new Error(await res.text());
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) { setSaveStatus('error'); console.error('Save failed:', e); }
    }, []);

    const saveNow = useCallback((m) => {
      if (fileHandleRef.current) saveToHandle(m, fileHandleRef.current);
      else if (serverPathRef.current) saveToServer(m, serverPathRef.current);
    }, [saveToHandle, saveToServer]);

    // debounced auto-save
    useEffect(() => {
      if (!fileHandle && !serverPath) return;
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveNow(model), 1200);
      return () => clearTimeout(saveTimerRef.current);
    }, [model, fileHandle, serverPath, saveNow]);

    const applyHandle = async (handle) => {
      setFileHandle(handle); setServerPath(null);
      await persistHandle(handle);
      setRecentFiles(await loadRecentHandles());
    };

    // open via File System Access API (external file)
    const openFile = async () => {
      if (!HAS_FS) { fileRef.current && fileRef.current.click(); return; }
      try {
        const [handle] = await window.showOpenFilePicker({ types: [{ description: 'Puppet model', accept: { 'text/javascript': ['.js', '.ts'] } }] });
        const text = await (await handle.getFile()).text();
        setModel(parseModelFromText(text));
        await applyHandle(handle);
      } catch (e) { if (e.name !== 'AbortError') alert('Could not open: ' + e.message); }
    };

    // open from library (server path)
    const openFromLibrary = async (path) => {
      try {
        const res = await fetch('/api/puppet/load?' + new URLSearchParams({ path }));
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        setModel(parseModelFromText(data.content));
        setServerPath(path); setFileHandle(null);
        setShowLibrary(false);
      } catch (e) { alert('Could not load: ' + e.message); }
    };

    const saveAs = async () => {
      if (!HAS_FS) { exportModel(); return; }
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: (fileHandle?.name) || (serverPath?.split('/').pop()) || ((model.name || 'puppet-model').replace(/\s+/g, '-').toLowerCase() + '.js'),
          types: [{ description: 'Puppet model', accept: { 'text/javascript': ['.js'] } }],
        });
        await saveToHandle(model, handle);
        await applyHandle(handle);
      } catch (e) { if (e.name !== 'AbortError') alert('Could not save: ' + e.message); }
    };

    const openRecent = async (entry) => {
      try {
        const perm = await entry.handle.queryPermission({ mode: 'readwrite' });
        if (perm !== 'granted' && await entry.handle.requestPermission({ mode: 'readwrite' }) !== 'granted') return;
        const text = await (await entry.handle.getFile()).text();
        setModel(parseModelFromText(text));
        await applyHandle(entry.handle);
      } catch (e) { alert('Could not open: ' + e.message); }
    };

    // ---- ui state ----
    const [mode, setMode] = useState(props.startMode || 'rig');
    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const fileMenuRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
      if (!fileMenuOpen) return;
      const onDoc = (e) => { if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) setFileMenuOpen(false); };
      window.addEventListener('pointerdown', onDoc);
      return () => window.removeEventListener('pointerdown', onDoc);
    }, [fileMenuOpen]);

    const exportModel = () => {
      const blob = new Blob([modelToJs(model)], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = (model.name || 'puppet-model').replace(/\s+/g, '-').toLowerCase() + '.js';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    };

    const loadFromFile = (file) => {
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try { const m = parseModelFromText(String(r.result)); setModel(m); }
        catch (err) { alert('Could not read that model file.'); }
      };
      r.readAsText(file);
    };

    const renameModel = () => { const name = prompt('Puppet name?', model.name || 'Untitled puppet'); if (name && name.trim()) setModel((m) => ({ ...m, name: name.trim() })); setFileMenuOpen(false); };

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === '?' && !(e.metaKey || e.ctrlKey)) {
          const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') return;
          e.preventDefault(); setHelpOpen(true); return;
        }
        const meta = e.metaKey || e.ctrlKey; if (!meta) return;
        const k = e.key.toLowerCase();
        if (k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
        else if (k === 'y') { e.preventDefault(); redo(); }
        else if (k === 'o') { e.preventDefault(); openFile(); }
        else if (k === 'l') { e.preventDefault(); setShowLibrary((v) => !v); }
        else if (k === 's') { e.preventDefault(); if (e.shiftKey) saveAs(); else if (fileHandleRef.current || serverPathRef.current) saveNow(model); else saveAs(); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });

    const hasFile = !!(fileHandle || serverPath);
    const saveIndicator = hasFile
      ? saveStatus === 'saving' ? { text: '● Saving…', color: '#b0955a' }
      : saveStatus === 'saved'  ? { text: '✓ Saved',   color: '#4a8c5c' }
      : saveStatus === 'error'  ? { text: '⚠ Error',   color: '#a23b28' }
      : { text: '● Auto-save on', color: '#4a8c5c' }
      : { text: 'unsaved', color: '#a49d8b' };

    const fileName = fileHandle ? fileHandle.name : serverPath ? serverPath.split('/').pop() : null;

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 50% 36%, #faf7f0 0%, ' + PAPER + ' 62%, #ece5d6 100%)', overflow: 'hidden', fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <div style={{ position: 'relative', height: 54, borderBottom: '2px solid #ded7c6', background: 'rgba(255,255,255,0.5)', zIndex: 40, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
          <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setShowLibrary((v) => !v)} style={{ ...btn(showLibrary, 0), fontSize: 17 }} title="Model library (⌘L)">📚</button>
            <div ref={fileMenuRef} style={{ position: 'relative' }}>
              <button onClick={() => setFileMenuOpen((v) => !v)} style={{ ...btn(fileMenuOpen, 1), fontSize: 19, fontWeight: 700 }}>File ▾</button>
              {fileMenuOpen && (
                <div style={{ position: 'absolute', top: '115%', left: 0, background: '#fffdf8', border: '2px solid #a49d8b', borderRadius: 10, boxShadow: '0 8px 22px rgba(0,0,0,0.18)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 230, zIndex: 50 }}>
                  <button onClick={() => { setFileMenuOpen(false); openFile(); }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>📂 Open… (⌘O)</button>
                  <button onClick={() => { setFileMenuOpen(false); saveAs(); }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>💾 Save As… (⇧⌘S)</button>
                  {hasFile && <button onClick={() => { setFileMenuOpen(false); saveNow(model); }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>💾 Save now (⌘S)</button>}
                  {hasFile && <button onClick={() => { setFileMenuOpen(false); if (confirm('Close file? Auto-save will stop.')) { setFileHandle(null); setServerPath(null); } }} style={{ fontFamily: UI, fontSize: 15, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#a49d8b' }}>✕ Close file</button>}
                  {recentFiles.length > 0 && <div style={{ height: 1, background: '#e8e0d0', margin: '3px 6px' }} />}
                  {recentFiles.length > 0 && <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, opacity: 0.45, letterSpacing: 0.5, padding: '2px 10px' }}>RECENT</div>}
                  {recentFiles.map((r) => (
                    <button key={r.name} onClick={() => { setFileMenuOpen(false); openRecent(r); }} style={{ fontFamily: UI, fontSize: 15, textAlign: 'left', padding: '5px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: r.name === fileHandle?.name ? '#c25a3a' : '#2c2b28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 226 }} title={r.name}>
                      {r.name === fileHandle?.name ? '● ' : '○ '}{r.name}
                    </button>
                  ))}
                  <div style={{ height: 1, background: '#e8e0d0', margin: '3px 6px' }} />
                  <button onClick={() => { setFileMenuOpen(false); if (confirm('New puppet? Unsaved changes will be lost.')) { setModel(clone(DEFAULT)); setFileHandle(null); } }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>✦ New puppet</button>
                  <button onClick={() => { exportModel(); setFileMenuOpen(false); }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>⬇ Download copy…</button>
                  <div style={{ height: 1, background: '#e8e0d0', margin: '3px 6px' }} />
                  <button onClick={renameModel} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>✎ Rename…</button>
                  <button onClick={() => { setFileMenuOpen(false); setHelpOpen(true); }} style={{ fontFamily: UI, fontSize: 16, textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 7, color: '#2c2b28' }}>❓ Shortcuts…</button>
                </div>
              )}
            </div>
            <span style={{ fontSize: 16, opacity: 0.75, maxWidth: 160, flex: '0 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.name || 'Untitled puppet'}</span>
            <span style={{ fontSize: 13, color: saveIndicator.color, flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: hasFile ? 'default' : 'pointer' }} onClick={() => !hasFile && setShowLibrary(true)} title={fileName || 'Click to open library'}>
              {saveIndicator.text}{fileName ? <span style={{ opacity: 0.6 }}> · {fileName}</span> : null}
            </span>
            <span style={{ width: 1, height: 22, background: '#cfc7b4', flex: 'none' }}></span>
            <button onClick={undo} title="Undo (⌘Z)" style={{ ...btn(false, 0), fontSize: 19, opacity: canUndo ? 1 : 0.4, flex: 'none' }}>↶</button>
            <button onClick={redo} title="Redo (⇧⌘Z)" style={{ ...btn(false, 1), fontSize: 19, opacity: canRedo ? 1 : 0.4, flex: 'none' }}>↷</button>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setMode('rig')} style={{ ...btn(mode === 'rig', 0), fontSize: 22, padding: '4px 20px' }}>Rig</button>
            <button onClick={() => setMode('action')} style={{ ...btn(mode === 'action', 1), fontSize: 22, padding: '4px 20px' }}>Action</button>
            <button onClick={() => setMode('palette')} style={{ ...btn(mode === 'palette', 0), fontSize: 22, padding: '4px 20px' }}>Palette</button>
          </div>
          <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setModel((m) => ({ ...m, merge: !m.merge }))} title="Merge body parts into one seamless silhouette — inner contact lines dissolve, outer edges stay. Fine-tune per part in Rig mode." style={{ ...btn(!!model.merge, 0), fontSize: 19, fontWeight: model.merge ? 700 : 400, flex: 'none' }}>{model.merge ? '✓ Seamless' : '⊙ Seamless'}</button>
          </div>
          <input ref={fileRef} type="file" accept=".js,.json,application/json,text/javascript" style={{ display: 'none' }} onChange={(e) => { loadFromFile(e.target.files && e.target.files[0]); e.target.value = ''; }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, top: 54 }}>
          {mode === 'rig' ? <RigMode model={model} setModel={setModel} /> : mode === 'palette' ? <PaletteMode model={model} setModel={setModel} /> : <ActionMode model={model} setModel={setModel} />}
        </div>
        <ShortcutsPopup open={helpOpen} onClose={() => setHelpOpen(false)} />
        {showLibrary && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 100, display: 'flex', alignItems: 'stretch' }}
            onPointerDown={(e) => { if (e.target === e.currentTarget) setShowLibrary(false); }}>
            <div style={{ width: 340, background: '#fdfaf3', borderRight: '2px solid #ded7c6', display: 'flex', flexDirection: 'column', fontFamily: UI, overflowY: 'auto' }}>
              <div style={{ padding: '18px 20px 10px', borderBottom: '2px solid #ded7c6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#2c2b28' }}>Model Library</div>
                <button onClick={() => setShowLibrary(false)} style={{ ...btn(false, 0), fontSize: 18, padding: '2px 8px', opacity: 0.5 }}>✕</button>
              </div>
              <div style={{ padding: '10px 12px', flex: 1 }}>
                {projectModels.length === 0 && (
                  <div style={{ fontSize: 14, opacity: 0.5, padding: '12px 8px' }}>No models found. Start the dev server to scan the project.</div>
                )}
                {projectModels.map((m) => {
                  const active = serverPath === m.path || fileHandle?.name === m.name;
                  return (
                    <button key={m.path} onClick={() => openFromLibrary(m.path)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 12px', border: 'none', borderRadius: 9, cursor: 'pointer', background: active ? 'rgba(194,90,58,0.13)' : 'transparent', marginBottom: 2, fontFamily: UI }}>
                      <span style={{ fontSize: 22, flex: 'none' }}>🧸</span>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 16, fontWeight: active ? 700 : 500, color: active ? '#c25a3a' : '#2c2b28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.modelName || m.name.replace(/\.(js|ts)$/, '')}</div>
                        <div style={{ fontSize: 11, opacity: 0.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                      </div>
                      {active && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#c25a3a', fontWeight: 700, flex: 'none' }}>editing</span>}
                    </button>
                  );
                })}
              </div>
              <div style={{ padding: '10px 12px', borderTop: '2px solid #ded7c6', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => { setShowLibrary(false); openFile(); }} style={{ ...btn(false, 0), fontSize: 15, textAlign: 'left', padding: '7px 12px' }}>📂 Open external file…</button>
                <button onClick={() => { setShowLibrary(false); if (confirm('New puppet? Unsaved changes will be lost.')) { setModel(clone(DEFAULT)); setFileHandle(null); setServerPath(null); } }} style={{ ...btn(false, 1), fontSize: 15, textAlign: 'left', padding: '7px 12px' }}>✦ New puppet</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

export default PuppetStudio;
