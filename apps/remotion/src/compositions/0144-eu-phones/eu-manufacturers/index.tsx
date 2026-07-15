import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { montserrat } from "~/lib/fonts";
import { light } from "~/theme";
import { AUDIO, TIMED_PLAN } from "./plan";

import { CorrectionScene } from "./scenes/CorrectionScene";
import { FairphoneRevealScene } from "./scenes/FairphoneRevealScene";
import { FairphoneTraitsScene } from "./scenes/FairphoneTraitsScene";
import { QuestionScene } from "./scenes/QuestionScene";
import { YesUkraineScene } from "./scenes/YesUkraineScene";
import { NoShareScene } from "./scenes/NoShareScene";
import { MarketBarsScene } from "./scenes/MarketBarsScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  correction: CorrectionScene,
  fairphoneReveal: FairphoneRevealScene,
  fairphoneTraits: FairphoneTraitsScene,
  question: QuestionScene,
  yesUkraine: YesUkraineScene,
  noShare: NoShareScene,
  marketBars: MarketBarsScene,
};

export const EuManufacturers: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: light.bg }}>
      <Audio src={staticFile(AUDIO)} />

      {TIMED_PLAN.map((scene) => {
        const Component = SCENE_COMPONENTS[scene.id];
        if (!Component) return null;
        return (
          <Sequence
            key={scene.id}
            from={scene.fromFrame}
            durationInFrames={scene.durationInFrames}
            name={`scenes/${scene.id}`}
          >
            <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
              <Component />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
