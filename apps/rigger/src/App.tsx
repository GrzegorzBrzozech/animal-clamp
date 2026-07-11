import React, { useEffect, useRef, useState } from 'react';
import { Puppet, samplePose } from '@animal-clamp/puppet';
import type { PuppetModel } from '@animal-clamp/puppet';

// Drop a model.js export here to preview it
const DEMO_MODEL: PuppetModel = {
  name: 'Default Biped',
  viewBox: '-200 -40 400 560',
  colors: { ink: '#3b3a37', skin: '#e9e2d2', hair: '#2b2a24', fur: '#8f8676' },
  bones: [
    { id: 'root', parent: null, x: 0, y: 300, angle: 0, len: 0, z: 0 },
    { id: 'head', parent: 'root', x: 0, y: -210, angle: 0, len: 0, z: 20 },
    { id: 'armUpperL', parent: 'root', x: -60, y: -150, angle: 96, len: 74, drawAs: 'limb', width: 34, z: 8 },
    { id: 'armLowerL', parent: 'armUpperL', x: 0, y: 0, angle: 0, len: 66, drawAs: 'limb', width: 30, z: 8 },
    { id: 'armUpperR', parent: 'root', x: 60, y: -150, angle: 84, len: 74, drawAs: 'limb', width: 34, z: 8 },
    { id: 'armLowerR', parent: 'armUpperR', x: 0, y: 0, angle: 0, len: 66, drawAs: 'limb', width: 30, z: 8 },
    { id: 'legUpperL', parent: 'root', x: -24, y: 0, angle: 92, len: 92, drawAs: 'limb', width: 44, z: 2 },
    { id: 'legLowerL', parent: 'legUpperL', x: 0, y: 0, angle: 0, len: 92, drawAs: 'limb', width: 40, z: 2 },
    { id: 'legUpperR', parent: 'root', x: 24, y: 0, angle: 88, len: 92, drawAs: 'limb', width: 44, z: 2 },
    { id: 'legLowerR', parent: 'legUpperR', x: 0, y: 0, angle: 0, len: 92, drawAs: 'limb', width: 40, z: 2 },
  ],
  shapes: [
    { id: 'torso', bone: 'root', kind: 'poly', z: 5, fill: 'skin', pts: [[-56, -152], [-62, 4], [62, 4], [56, -152]] },
    { id: 'cloth', bone: 'root', kind: 'poly', z: 6, fill: 'fur', pts: [[-66, -6], [66, -6], [72, 44], [68, 92], [40, 62], [18, 96], [-2, 62], [-22, 96], [-42, 62], [-68, 92], [-72, 44]] },
    { id: 'headbox', bone: 'head', kind: 'poly', z: 20, fill: 'skin', pts: [[-52, -34], [52, -34], [60, -4], [54, 30], [30, 44], [-30, 44], [-54, 30], [-60, -4]] },
    { id: 'hair', bone: 'head', kind: 'poly', z: 21, fill: 'hair', pts: [[-58, -14], [-64, -40], [-42, -24], [-46, -52], [-22, -30], [-26, -56], [-2, -32], [2, -58], [24, -32], [28, -56], [50, -28], [54, -12], [-58, -12]] },
    { id: 'earL', bone: 'head', kind: 'circle', z: 19, fill: 'skin', cx: -60, cy: 0, r: 11 },
    { id: 'earR', bone: 'head', kind: 'circle', z: 19, fill: 'skin', cx: 60, cy: 0, r: 11 },
    { id: 'eyeL', bone: 'head', kind: 'circle', z: 22, fill: 'ink', stroke: false, cx: -26, cy: 6, r: 4 },
    { id: 'eyeR', bone: 'head', kind: 'circle', z: 22, fill: 'ink', stroke: false, cx: 26, cy: 6, r: 4 },
    { id: 'mouth', bone: 'head', kind: 'poly', z: 22, fill: 'ink', stroke: false, pts: [[-18, 34], [18, 34], [18, 37], [-18, 37]] },
  ],
  actions: {
    idle: { dur: 3, loop: true, keys: [
      { t: 0, pose: { angles: {}, root: { x: 0, y: 0, r: 0 } } },
      { t: 1.5, pose: { angles: { armUpperL: 91, armUpperR: 89, head: 3 }, root: { y: -4 } } },
      { t: 3, pose: { angles: {}, root: { x: 0, y: 0, r: 0 } } },
    ] },
    walk: { dur: 1, loop: true, keys: [
      { t: 0, pose: { angles: { legUpperL: 78, legLowerL: 14, legUpperR: 102, legLowerR: 2, armUpperL: 102, armUpperR: 72 }, root: { y: 0 } } },
      { t: 0.5, pose: { angles: { legUpperL: 102, legLowerL: 2, legUpperR: 78, legLowerR: 14, armUpperL: 72, armUpperR: 102 }, root: { y: -6 } } },
      { t: 1, pose: { angles: { legUpperL: 78, legLowerL: 14, legUpperR: 102, legLowerR: 2, armUpperL: 102, armUpperR: 72 }, root: { y: 0 } } },
    ] },
  },
};

export function App() {
  const [time, setTime] = useState(0);
  const [action, setAction] = useState('idle');
  const [model, setModel] = useState<PuppetModel>(DEMO_MODEL);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      setTime((ts - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const actions = Object.keys(model.actions);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: '#111', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>ACTION</div>
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => setAction(a)}
            style={{
              background: action === a ? '#3b3a37' : 'transparent',
              color: '#e9e2d2',
              border: '1px solid #333',
              borderRadius: 4,
              padding: '6px 10px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
            }}
          >
            {a}
          </button>
        ))}
        <div style={{ marginTop: 16, fontSize: 11, color: '#888' }}>
          Load model: drop a caveman-studio export here (coming soon)
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f1e9' }}>
        <div style={{ width: 400, height: 560 }}>
          <Puppet model={model} action={action} time={time} />
        </div>
      </div>
    </div>
  );
}
