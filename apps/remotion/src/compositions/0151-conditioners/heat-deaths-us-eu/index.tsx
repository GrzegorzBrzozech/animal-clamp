import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, timedFromFrames, type HeatDeathsUsEuProps } from "./plan";

import { ClaimScene } from "./scenes/ClaimScene";
import { UsaCountingScene } from "./scenes/UsaCountingScene";
import { EuModelScene } from "./scenes/EuModelScene";
import { EuTotalsScene } from "./scenes/EuTotalsScene";
import { UsaEstimatesScene } from "./scenes/UsaEstimatesScene";
import { ComparisonScene } from "./scenes/ComparisonScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  claim: ClaimScene,
  usaCounting: UsaCountingScene,
  euModel: EuModelScene,
  euTotals: EuTotalsScene,
  usaEstimates: UsaEstimatesScene,
  comparison: ComparisonScene,
};

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
      🌡️ {title}
    </div>
  </AbsoluteFill>
);

export const HeatDeathsUsEu: React.FC<HeatDeathsUsEuProps> = (starts) => {
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
            <Sequence
              key={scene.id}
              from={scene.fromFrame}
              durationInFrames={scene.durationInFrames}
              name={label}
            >
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
