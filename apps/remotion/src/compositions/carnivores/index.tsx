import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, timedFromFrames, type CarnivoresProps } from "./plan";

import { HookScene } from "./scenes/HookScene";
import { FirstLifeScene } from "./scenes/FirstLifeScene";
import { SymbiosisScene } from "./scenes/SymbiosisScene";
import { GoodTimelineScene } from "./scenes/GoodTimelineScene";
import { PredationAppearsScene } from "./scenes/PredationAppearsScene";
import { WhyPredationScene } from "./scenes/WhyPredationScene";
import { DivisionRatesScene } from "./scenes/DivisionRatesScene";
import { DeerExampleScene } from "./scenes/DeerExampleScene";
import { PredationChaseScene } from "./scenes/PredationChaseScene";
import { PeacefulTurnScene } from "./scenes/PeacefulTurnScene";
import { FrequencyPayoffScene } from "./scenes/FrequencyPayoffScene";
import { PreyDefensesScene } from "./scenes/PreyDefensesScene";
import { BioenergeticsScene } from "./scenes/BioenergeticsScene";
import { HumansScene } from "./scenes/HumansScene";
import { CliffhangerScene } from "./scenes/CliffhangerScene";

/**
 * Scene registry: plan `id` → component. A plan entry with no match here renders
 * <ScenePlaceholder> from its plan text instead. Add a scene by building the
 * component and wiring it here; remove the entry to fall back to the placeholder.
 */
const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: HookScene,
  firstLife: FirstLifeScene,
  symbiosis: SymbiosisScene,
  goodTimeline: GoodTimelineScene,
  predationAppears: PredationAppearsScene,
  whyPredation: WhyPredationScene,
  divisionRates: DivisionRatesScene,
  deerExample: DeerExampleScene,
  // One accumulating block; per-pair timing lives in PredationChaseScene's LANES.
  predationChase: PredationChaseScene,
  peacefulTurn: PeacefulTurnScene,
  frequencyPayoff: FrequencyPayoffScene,
  preyDefenses: PreyDefensesScene,
  bioenergetics: BioenergeticsScene,
  humans: HumansScene,
  cliffhanger: CliffhangerScene,
  // "persistence" — intentionally absent → placeholder.
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

export const Carnivores: React.FC<CarnivoresProps> = (starts) => {
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
