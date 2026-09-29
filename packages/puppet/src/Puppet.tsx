import React from 'react';
import { computeWorld, samplePose, polyPath, boneMerges, shapeMerges, groupOf } from './engine';
import type { PuppetModel, Pose, Shape, PuppetColors } from './types';

interface ShapeElProps {
  shape: Shape;
  colors: PuppetColors;
}

function ShapeEl({ shape, colors }: ShapeElProps) {
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
  visible?: Record<string, boolean>;
}

export function Puppet({ model, action, time = 0, pose: poseProp, wobble = true, style, visible: visibleOverride }: PuppetProps) {
  const { bones, shapes = [], colors = {} as PuppetColors } = model;
  const merged = !!model.merge;

  const pose = poseProp ?? (
    action && model.actions?.[action]
      ? samplePose(model.actions[action], time)
      : { angles: {}, root: {} }
  );

  const W = computeWorld(bones, pose);
  const byId = Object.fromEntries(bones.map((b) => [b.id, b]));

  const items: { z: number; key: string; el: React.ReactNode }[] = [];
  const groupEls: Record<string, React.ReactNode[]> = {};
  const groupMinZ: Record<string, number> = {};

  const resolveGroup = (node: { mergeGroup?: string | null; layer?: string | null }): string => {
    if (node.mergeGroup) return node.mergeGroup;
    return node.layer === 'front' ? '__front__' : '__back__';
  };

  const pushMerge = (z: number, el: React.ReactNode, grp: string) => {
    (groupEls[grp] = groupEls[grp] ?? []).push(el);
    if (groupMinZ[grp] == null || z < groupMinZ[grp]) groupMinZ[grp] = z;
  };

  bones.forEach((b) => {
    const wn = W[b.id];
    if (!wn) return;
    const deg = (wn.A * 180) / Math.PI;

    const bWantsMerge = merged && boneMerges(b);
    const bGroup = bWantsMerge ? (groupOf(byId, b) ?? resolveGroup(b)) : null;
    const bMerge = bGroup !== null;

    if (b.drawAs === 'limb' && b.len) {
      if (bMerge) {
        pushMerge(b.z ?? 0, (
          <g key={`bone-${b.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
            <line x1="0" y1="0" x2={b.len} y2="0" stroke={colors.skin} strokeWidth={b.width ?? 30} strokeLinecap="round" />
          </g>
        ), bGroup!);
        const rr = (b.width ?? 30) / 2, off = rr + 2.25, x0 = rr * 0.25, x1 = b.len - rr * 0.15;
        if (x1 > x0) items.push({ z: (b.z ?? 0) + 0.05, key: `edge-${b.id}`, el: (
          <g key={`edge-${b.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
            <line x1={x0} y1={-off} x2={x1} y2={-off} stroke={colors.ink} strokeWidth="4.5" strokeLinecap="round" />
            <line x1={x0} y1={off} x2={x1} y2={off} stroke={colors.ink} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )});
      } else {
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
      }

      if (b.endCap !== false) {
        if (bMerge) {
          pushMerge((b.z ?? 0) + 0.1, (
            <circle key={`cap-${b.id}`} cx={wn.tipX} cy={wn.tipY} r={(b.width ?? 30) * 0.45 + 2} fill={colors.skin} />
          ), bGroup!);
        } else {
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
      }
    }

    shapes.filter((s) => s.bone === b.id).forEach((s) => {
      const isVisible = visibleOverride && Object.prototype.hasOwnProperty.call(visibleOverride, s.id)
        ? !!visibleOverride[s.id]
        : (pose.visible && Object.prototype.hasOwnProperty.call(pose.visible, s.id)
          ? !!pose.visible[s.id]
          : !s.hidden);
      if (!isVisible) return;
      const z = s.z ?? (b.z ?? 0);
      const sWantsMerge = merged && shapeMerges(s, colors);
      const sGroup = sWantsMerge ? (groupOf(byId, s) ?? resolveGroup({ mergeGroup: s.mergeGroup, layer: s.layer ?? b.layer })) : null;
      if (sGroup !== null) {
        pushMerge(z, (
          <g key={`s-${s.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
            <ShapeEl shape={{ ...s, stroke: false }} colors={colors} />
          </g>
        ), sGroup);
      } else {
        items.push({
          z,
          key: `s-${s.id}`,
          el: (
            <g key={`s-${s.id}`} transform={`translate(${wn.ox} ${wn.oy}) rotate(${deg})`}>
              <ShapeEl shape={s} colors={colors} />
            </g>
          ),
        });
      }
    });
  });

  shapes.filter((s) => !byId[s.bone]).forEach((s) => {
    const z = s.z ?? 0;
    const sWantsMerge = merged && shapeMerges(s, colors);
    const sGroup = sWantsMerge ? (s.mergeGroup ?? '__back__') : null;
    if (sGroup !== null) {
      pushMerge(z, <g key={`s-${s.id}`}><ShapeEl shape={{ ...s, stroke: false }} colors={colors} /></g>, sGroup);
    } else {
      items.push({ z, key: `s-${s.id}`, el: <g key={`s-${s.id}`}><ShapeEl shape={s} colors={colors} /></g> });
    }
  });

  Object.keys(groupEls).forEach((g) => {
    const z = groupMinZ[g] ?? 0;
    items.push({ z, key: `merged-${g}`, el: (<g key={`merged-${g}`} filter="url(#pupMerge)">{groupEls[g]}</g>) });
  });
  items.sort((a, b) => a.z - b.z);

  const vb = model.viewBox ?? '-200 -40 400 560';
  return (
    <svg viewBox={vb} style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible', ...style }}>
      <defs>
        <filter id="pupWob" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={wobble ? 2.6 : 0} />
        </filter>
        <filter id="pupMerge" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4.5" result="dil" />
          <feFlood floodColor={colors.ink || '#3b3a37'} result="inkfill" />
          <feComposite in="inkfill" in2="dil" operator="in" result="edge" />
          <feMerge><feMergeNode in="edge" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#pupWob)">{items.map((it) => it.el)}</g>
    </svg>
  );
}

export default Puppet;
