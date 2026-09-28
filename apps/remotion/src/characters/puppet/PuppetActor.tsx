import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Puppet, samplePose, blend } from '@animal-clamp/puppet';
import type { PuppetModel, Pose } from '@animal-clamp/puppet';

const TRANSITION_FRAMES = 8;

interface PuppetActorProps {
  model: PuppetModel;
  action?: string;
  /**
   * Frame at which `action` started playing (e.g. the same threshold used to
   * pick `action` in the composition). When set, the action's own clock is
   * reset to 0 at that frame instead of using absolute video time — so a
   * switch always starts from the action's first keyframe rather than an
   * arbitrary phase of its loop, and (combined with `prevAction`) can be
   * cross-faded smoothly.
   */
  actionStartFrame?: number;
  /** Action that was playing right before `actionStartFrame`, for cross-fade. */
  prevAction?: string;
  /** Frame at which `prevAction` started playing. */
  prevActionStartFrame?: number;
  /** Optional manual time override (seconds). Defaults to frame/fps. */
  time?: number;
  wobble?: boolean;
  style?: React.CSSProperties;
}

export function PuppetActor({
  model,
  action = 'idle',
  actionStartFrame,
  prevAction,
  prevActionStartFrame,
  time: timeProp,
  wobble = true,
  style,
}: PuppetActorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = timeProp ?? (actionStartFrame != null ? Math.max(0, frame - actionStartFrame) / fps : frame / fps);

  const act = action ? model.actions?.[action] : undefined;
  const pose: Pose = act ? samplePose(act, time) : { angles: {}, root: {} };

  const framesSinceSwitch = actionStartFrame != null ? frame - actionStartFrame : Infinity;
  const inTransition = prevAction && actionStartFrame != null && framesSinceSwitch >= 0 && framesSinceSwitch < TRANSITION_FRAMES;

  let outPose = pose;
  if (inTransition) {
    const prevAct = model.actions?.[prevAction!];
    const prevTime = prevActionStartFrame != null ? Math.max(0, actionStartFrame! - 1 - prevActionStartFrame) / fps : 0;
    const prevPose: Pose = prevAct ? samplePose(prevAct, prevTime) : { angles: {}, root: {} };
    outPose = { ...blend(prevPose, pose, framesSinceSwitch / TRANSITION_FRAMES), visible: pose.visible };
  }

  return <Puppet model={model} pose={outPose} wobble={wobble} style={style} />;
}
