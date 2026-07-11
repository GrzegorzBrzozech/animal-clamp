import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";

import { montserrat } from "~/lib/fonts";
import { FlowStrip, type FlowStep } from "~/components";
import { light } from "~/theme";
import { AUDIO, TIMED_PLAN } from "./plan";

import { IntroScene } from "./scenes/IntroScene";
import { TypeCScene } from "./scenes/TypeCScene";
import { EcodesignScene } from "./scenes/EcodesignScene";
import { AlreadyDoneScene } from "./scenes/AlreadyDoneScene";
import { RightToRepairScene } from "./scenes/RightToRepairScene";
import { BatteryScene } from "./scenes/BatteryScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  intro: IntroScene,
  typeC: TypeCScene,
  ecodesign: EcodesignScene,
  alreadyDone: AlreadyDoneScene,
  rightToRepair: RightToRepairScene,
  battery: BatteryScene,
};

/** The four regulations, drawn live as a persistent flow strip (the "chart"). */
const FLOW_STEPS: FlowStep[] = [
  { emoji: "🔌", label: "Type-C\nгрудень 2024", color: light.primary },
  { emoji: "🔧", label: "Ecodesign\nчервень 2025", color: light.primary },
  { emoji: "⚖️", label: "Право на ремонт\nлипень 2026", color: light.secondary },
  { emoji: "🔋", label: "Знімна батарея\nлютий 2027", color: light.success },
];

/** Which strip step is emphasised / already in force, given the current beat. */
const FLOW_STATE: Record<string, { active: number; done: number[] }> = {
  intro: { active: -1, done: [] },
  typeC: { active: 0, done: [] },
  ecodesign: { active: 1, done: [0] },
  alreadyDone: { active: -1, done: [0, 1] },
  rightToRepair: { active: 2, done: [0, 1] },
  battery: { active: 3, done: [0, 1] },
};

const PersistentStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const current = TIMED_PLAN.find(
    (s) => frame >= s.fromFrame && frame < s.fromFrame + s.durationInFrames,
  );
  const state = FLOW_STATE[current?.id ?? "intro"] ?? { active: -1, done: [] };

  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center" }}>
      <FlowStrip steps={FLOW_STEPS} activeIndex={state.active} done={state.done} disc={140} width={1600} />
    </div>
  );
};

export const EuRegulations: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: light.bg }}>
      <Audio src={staticFile(AUDIO)} />

      {/* Upper stage — per-beat hero, leaving room for the strip below. */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
        {TIMED_PLAN.map((scene) => {
          const Component = SCENE_COMPONENTS[scene.id];
          if (!Component) return null;
          return (
            <Sequence
              key={scene.id}
              from={scene.fromFrame}
              durationInFrames={scene.durationInFrames}
              name={`scenes/${scene.id}`}
              layout="none"
            >
              <Component />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      <PersistentStrip />
    </AbsoluteFill>
  );
};
