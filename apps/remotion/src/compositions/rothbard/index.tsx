import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, timedFromFrames, type RothbardProps } from "./plan";

import { ThesisScene } from "./scenes/ThesisScene";
import { PrussiaScene } from "./scenes/PrussiaScene";
import { FriedrichScene } from "./scenes/FriedrichScene";
import { DesertionScene } from "./scenes/DesertionScene";
import { NewSchoolScene } from "./scenes/NewSchoolScene";
import { DogTrainingScene } from "./scenes/DogTrainingScene";
import { NapoleonFichteScene } from "./scenes/NapoleonFichteScene";
import { FichteQuoteScene } from "./scenes/FichteQuoteScene";
import { SpreadScene } from "./scenes/SpreadScene";
import { SovietScene } from "./scenes/SovietScene";

/** Scene registry: plan `id` → component. No match ⇒ <ScenePlaceholder>. */
const SCENE_COMPONENTS: Record<string, React.FC> = {
  thesis: ThesisScene,
  prussia: PrussiaScene,
  friedrich: FriedrichScene,
  desertion: DesertionScene,
  newSchool: NewSchoolScene,
  dogTraining: DogTrainingScene,
  napoleonFichte: NapoleonFichteScene,
  fichteQuote: FichteQuoteScene,
  spread: SpreadScene,
  soviet: SovietScene,
};

/** Current-scene label shown only in Remotion Studio — never in renders. */
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
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      📜 {title}
    </div>
  </AbsoluteFill>
);

export const Rothbard: React.FC<RothbardProps> = (starts) => {
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
