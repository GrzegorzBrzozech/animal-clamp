import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Puppet, samplePose } from '@animal-clamp/puppet';
import type { PuppetModel } from '@animal-clamp/puppet';

interface PuppetActorProps {
  model: PuppetModel;
  action?: string;
  /** Optional manual time override (seconds). Defaults to frame/fps. */
  time?: number;
  wobble?: boolean;
  style?: React.CSSProperties;
}

export function PuppetActor({ model, action = 'idle', time: timeProp, wobble = true, style }: PuppetActorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = timeProp ?? frame / fps;

  const act = action ? model.actions?.[action] : undefined;
  const pose = act ? samplePose(act, time) : { angles: {}, root: {} };

  return <Puppet model={model} pose={pose} wobble={wobble} style={style} />;
}
