import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { MediaKenBurns, ScenePlaceholder, SourceCredit } from "~/components";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, MEDIA, CREDIT, TOTAL_FRAMES, timedFromFrames, type MintCoinsProps } from "./plan";

import { SecrecyScene } from "./scenes/SecrecyScene";
import { FactsScene } from "./scenes/FactsScene";
import { CostBreakdownScene } from "./scenes/CostBreakdownScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  secrecy: SecrecyScene,
  facts: FactsScene,
  costBreakdown: CostBreakdownScene,
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
        fontSize: 22,
        fontWeight: 700,
      }}
    >
      🪙 {title}
    </div>
  </AbsoluteFill>
);

export const MintCoins: React.FC<MintCoinsProps> = (starts) => {
  const isStudio = getRemotionEnvironment().isStudio;
  const timed = timedFromFrames(starts);

  return (
    <PaletteProvider value={paperPalette}>
      <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: "#000" }}>
        <Audio src={staticFile(AUDIO)} />

        {/* Real B-roll runs full-bleed and continuously for the whole insert —
            outside the per-beat Sequences below, so it never resets/restarts
            when the on-screen text swaps between beats. */}
        <MediaKenBurns
          src={MEDIA}
          durationInFrames={TOTAL_FRAMES}
          muted
          zoom={0.05}
          gradient="full"
          gradientStrength={0.55}
        />

        <SourceCredit channel={CREDIT.channel} title={CREDIT.title} corner="bottom-left" />

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
                  mode="generated"
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
