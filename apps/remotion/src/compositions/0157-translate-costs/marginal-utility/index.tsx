import React from "react";
import { AbsoluteFill, Audio, getRemotionEnvironment, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { montserrat } from "~/lib/fonts";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { SCENES, TRANSITION_FRAMES, type SceneId } from "./script";

import { HookScene } from "./scenes/HookScene";
import { LaborTheoryScene } from "./scenes/LaborTheoryScene";
import { MengerValueScene } from "./scenes/MengerValueScene";
import { DiminishingScene } from "./scenes/DiminishingScene";
import { DemandCurveScene } from "./scenes/DemandCurveScene";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: HookScene,
  laborTheory: LaborTheoryScene,
  mengerValue: MengerValueScene,
  diminishing: DiminishingScene,
  demandCurve: DemandCurveScene,
};

// Alternate the transition style between scenes for visual variety.
const transitionFor = (index: number) => (index % 2 === 0 ? fade() : slide());

const SceneBadge: React.FC<{ title: string }> = ({ title }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 24,
        bottom: 24,
        padding: "8px 18px",
        borderRadius: 999,
        background: "#000000aa",
        border: "1px solid #ffffff33",
        color: "#fff",
        fontSize: 22,
        fontWeight: 700,
      }}
    >
      💰 {title}
    </div>
  </AbsoluteFill>
);

export const MarginalUtility: React.FC = () => {
  const isStudio = getRemotionEnvironment().isStudio;

  return (
    <PaletteProvider value={paperPalette}>
      <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: paperPalette.bg }}>
        <Audio src={staticFile("projects/marginal-utility/speech.mp3")} />
        <TransitionSeries>
          {SCENES.map((scene, i) => {
            const Component = SCENE_COMPONENTS[scene.id];
            return (
              <React.Fragment key={scene.id}>
                <TransitionSeries.Sequence
                  durationInFrames={scene.durationInFrames}
                  name={`${i + 1}. ${scene.id}`}
                >
                  <Component />
                  {isStudio ? <SceneBadge title={scene.title} /> : null}
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
    </PaletteProvider>
  );
};
