import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, timedFromFrames, type EducationProps } from "./plan";

import { LawScene } from "./scenes/LawScene";
import { StructureScene } from "./scenes/StructureScene";
import { MinistryScene } from "./scenes/MinistryScene";
import { PrivateFreedomScene } from "./scenes/PrivateFreedomScene";
import { AltMethodsScene } from "./scenes/AltMethodsScene";
import { BoundaryScene } from "./scenes/BoundaryScene";
import { StandardScene } from "./scenes/StandardScene";
import { DpaScene } from "./scenes/DpaScene";
import { EvolutionScene } from "./scenes/EvolutionScene";
import { AlgebraScene } from "./scenes/AlgebraScene";
import { ChemistryScene } from "./scenes/ChemistryScene";
import { ConclusionScene } from "./scenes/ConclusionScene";

/**
 * Scene registry: plan `id` → component. A plan entry with no match here renders
 * <ScenePlaceholder> from its plan text instead.
 */
const SCENE_COMPONENTS: Record<string, React.FC> = {
  law: LawScene,
  structure: StructureScene,
  ministry: MinistryScene,
  privateFreedom: PrivateFreedomScene,
  altMethods: AltMethodsScene,
  boundary: BoundaryScene,
  standard: StandardScene,
  dpa: DpaScene,
  evolution: EvolutionScene,
  algebra: AlgebraScene,
  chemistry: ChemistryScene,
  conclusion: ConclusionScene,
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
      📄 {title}
    </div>
  </AbsoluteFill>
);

export const Education: React.FC<EducationProps> = (starts) => {
  const isStudio = getRemotionEnvironment().isStudio;
  const timed = timedFromFrames(starts);
  return (
    <PaletteProvider value={paperPalette}>
      <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: paperPalette.bg }}>
        {/* Voiceover — drives the whole timeline; scenes are placed against it. */}
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
