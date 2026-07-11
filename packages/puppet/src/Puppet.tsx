import React from 'react';
import { computeWorld, samplePose, polyPath } from './engine';
import type { PuppetModel, Pose, Shape, PuppetColors } from './types';

interface ShapeElProps {
  shape: Shape;
  colors: PuppetColors;
}

function ShapeEl({ shape, colors }: ShapeElProps) {
  if (shape.hidden) return null;
  const fill = shape.fill === 'none' ? 'none' : (colors[shape.fill] ?? shape.fill ?? colors.skin);
  const stroke = shape.stroke === false
    ? 'none'
    : (shape.strokeColor ? (colors[shape.strokeColor] ?? shape.strokeColor) : colors.ink);
  const sw = shape.width ?? 5;

  if (shape.kind === 'circle') {
    return (
      <circle
        cx={shape.cx ?? 0}
        cy={shape.cy ?? 0}
        r={shape.r ?? 5}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  }
  return (
    <path
      d={polyPath(shape.pts ?? [], shape.closed)}
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

export interface PuppetProps {
  model: PuppetModel;
  action?: string;
  time?: number;
  pose?: Pose;
  wobble?: boolean;
  style?: React.CSSProperties;
}

export function Puppet({ model, action, time = 0, pose: poseProp, wobble = true, style }: PuppetProps) {
  const { bones, shapes = [], colors = {} as PuppetColors } = model;

  const pose = poseProp ?? (
    action && model.actions?.[action]
      ? samplePose(model.actions[action], time)
      : { angles: {}, root: {} }
  );

  const W = computeWorld(bones, pose);
  const byId = Object.fromEntries(bones.map((b) => [b.id, b]));

  const items: { z: number; key: string; el: React.ReactNode }[] = [];

  bones.forEach((b) => {
    const wn = W[b.id];
    if (!wn) return;
    const deg = (wn.A * 180) / Math.PI;

    if (b.drawAs === 'limb' && b.len) {
      items.push({
        z: b.z ?? 0,
        key: `bone-${b.id}`,
        el: (
          <g key={`bone-${b.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
            <line x1="0" y1="0" x2={b.len} y2="0" stroke={colors.ink} strokeWidth={b.width ?? 30} strokeLinecap="round" />
            <line x1="0" y1="0" x2={b.len} y2="0" stroke={colors.skin} strokeWidth={Math.max(3, (b.width ?? 30) - 9)} strokeLinecap="round" />
          </g>
        ),
      });
      items.push({
        z: (b.z ?? 0) + 0.1,
        key: `cap-${b.id}`,
        el: (
          <circle
            key={`cap-${b.id}`}
            cx={wn.tipX}
            cy={wn.tipY}
            r={(b.width ?? 30) * 0.45 + 2}
            fill={colors.skin}
            stroke={colors.ink}
            strokeWidth="5"
          />
        ),
      });
    }

    shapes
      .filter((s) => s.bone === b.id)
      .forEach((s) => {
        items.push({
          z: s.z ?? (b.z ?? 0),
          key: `s-${s.id}`,
          el: (
            <g key={`s-${s.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
              <ShapeEl shape={s} colors={colors} />
            </g>
          ),
        });
      });
  });

  shapes
    .filter((s) => !byId[s.bone])
    .forEach((s) => {
      items.push({
        z: s.z ?? 0,
        key: `s-${s.id}`,
        el: (
          <g key={`s-${s.id}`}>
            <ShapeEl shape={s} colors={colors} />
          </g>
        ),
      });
    });

  items.sort((a, b) => a.z - b.z);

  const vb = model.viewBox ?? '-200 -40 400 560';
  return (
    <svg viewBox={vb} style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible', ...style }}>
      <defs>
        <filter id="pupWob" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={wobble ? 2.6 : 0} />
        </filter>
      </defs>
      <g filter="url(#pupWob)">{items.map((it) => it.el)}</g>
    </svg>
  );
}

export default Puppet;
