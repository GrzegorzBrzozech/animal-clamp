import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { SCENES, TRANSITION_FRAMES, NARRATION_FILE, type SceneId } from "./script";
import { IntroScene } from "./scenes/IntroScene";
import { BalanceScene } from "./scenes/BalanceScene";
import { QuidProQuoScene } from "./scenes/QuidProQuoScene";
import { WarrenScene } from "./scenes/WarrenScene";
import { TimebanksScene } from "./scenes/TimebanksScene";
import { LimitScene } from "./scenes/LimitScene";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  intro: IntroScene,
  balance: BalanceScene,
  quidProQuo: QuidProQuoScene,
  warren: WarrenScene,
  timebanks: TimebanksScene,
  limit: LimitScene,
};

// Alternate the transition style between scenes for visual variety.
const transitionFor = (index: number) =>
  index % 2 === 0 ? fade() : slide();

export const Frendcoin: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Voiceover spans the whole composition; scene timings sync to it. */}
      <Audio src={staticFile(NARRATION_FILE)} />
      <TransitionSeries>
        {SCENES.map((scene, i) => {
          const Component = SCENE_COMPONENTS[scene.id];
          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
                <Component />
              </TransitionSeries.Sequence>
              {i < SCENES.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={transitionFor(i)}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
