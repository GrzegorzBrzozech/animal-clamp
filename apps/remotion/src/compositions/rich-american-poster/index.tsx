import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { colors } from "~/theme";
import { AUDIO, timedFromFrames, type RichAmericanPosterProps } from "./plan";

import { HookScene } from "./scenes/HookScene";
import { NuanceScene } from "./scenes/NuanceScene";
import { ManIntroScene } from "./scenes/ManIntroScene";
import { UsReceiptScene } from "./scenes/UsReceiptScene";
import { UsWageScene } from "./scenes/UsWageScene";
import { UssrCostScene } from "./scenes/UssrCostScene";
import { CarComparisonScene } from "./scenes/CarComparisonScene";
import { IronyScene } from "./scenes/IronyScene";
import { KidsStatScene } from "./scenes/KidsStatScene";
import { CloserScene } from "./scenes/CloserScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: HookScene,
  nuance: NuanceScene,
  manIntro: ManIntroScene,
  usReceipt: UsReceiptScene,
  usWage: UsWageScene,
  ussrCost: UssrCostScene,
  carComparison: CarComparisonScene,
  irony: IronyScene,
  kidsStat: KidsStatScene,
  closer: CloserScene,
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
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      🗽 {title}
    </div>
  </AbsoluteFill>
);

export const RichAmericanPoster: React.FC<RichAmericanPosterProps> = (starts) => {
  const isStudio = getRemotionEnvironment().isStudio;
  const timed = timedFromFrames(starts);

  return (
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: colors.bg }}>
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
  );
};
