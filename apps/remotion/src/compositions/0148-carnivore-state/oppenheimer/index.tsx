import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, timedFromFrames, type OppenheimerProps } from "./plan";

import { HookScene } from "./scenes/HookScene";
import { ThreePathsScene } from "./scenes/ThreePathsScene";
import { OppIntroScene } from "./scenes/OppIntroScene";
import { TwoMeansScene } from "./scenes/TwoMeansScene";
import { VoluntaryScene } from "./scenes/VoluntaryScene";
import { MandatoryScene } from "./scenes/MandatoryScene";
import { StateQuoteScene } from "./scenes/StateQuoteScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: HookScene,
  threePaths: ThreePathsScene,
  oppIntro: OppIntroScene,
  twoMeans: TwoMeansScene,
  voluntary: VoluntaryScene,
  mandatory: MandatoryScene,
  stateQuote: StateQuoteScene,
};

const SceneBadge: React.FC<{ title: string }> = ({ title }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute",
      left: 24,
      bottom: 24,
      padding: "8px 18px",
      borderRadius: 999,
      background: "#000000aa",
      border: "1px solid #ffffff33",
      color: "#fff",
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 0.5,
    }}>
      🐺 {title}
    </div>
  </AbsoluteFill>
);

export const Oppenheimer: React.FC<OppenheimerProps> = (starts) => {
  const isStudio = getRemotionEnvironment().isStudio;
  const timed = timedFromFrames(starts);

  return (
    <PaletteProvider value={paperPalette}>
      <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: paperPalette.bg }}>
        <Audio src={staticFile(AUDIO)} />

        {timed.map((scene, i) => {
          const Component = SCENE_COMPONENTS[scene.id];
          const label = Component
            ? `scenes/${Component.displayName || Component.name || scene.id}.tsx`
            : `${scene.id} · PLACEHOLDER`;
          return (
            <Sequence key={scene.id} from={scene.fromFrame} durationInFrames={scene.durationInFrames} name={label}>
              {Component ? (
                <Component />
              ) : (
                <ScenePlaceholder
                  title={scene.title}
                  description={scene.description}
                  narration={scene.narration}
                  mode={scene.mode}
                  index={i + 1}
                  total={timed.length}
                  startSec={scene.startSec}
                  endSec={scene.endSec}
                />
              )}
              {isStudio ? <SceneBadge title={label} /> : null}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
