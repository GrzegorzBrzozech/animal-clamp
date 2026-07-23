import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, getRemotionEnvironment } from "remotion";

import { montserrat } from "~/lib/fonts";
import { ScenePlaceholder } from "~/components";
import { AUDIO, timedFromFrames, type TeachersSalaryProps } from "./plan";
import { TeacherVsEngineerScene } from "./scenes/TeacherVsEngineerScene";
import { WorldwidePatternScene } from "./scenes/WorldwidePatternScene";
import { NordicCountriesScene } from "./scenes/NordicCountriesScene";
import { VoluntaryTeachingScene } from "./scenes/VoluntaryTeachingScene";
import { MarketSignalScene } from "./scenes/MarketSignalScene";
import { MinisterClientScene } from "./scenes/MinisterClientScene";
import { ChronicShortageScene } from "./scenes/ChronicShortageScene";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  teacherVsEngineer: TeacherVsEngineerScene,
  worldwidePattern: WorldwidePatternScene,
  nordicCountries: NordicCountriesScene,
  voluntaryTeaching: VoluntaryTeachingScene,
  marketSignal: MarketSignalScene,
  ministerClient: MinisterClientScene,
  chronicShortage: ChronicShortageScene,
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
      fontFamily: montserrat.fontFamily,
    }}>
      📊 {title}
    </div>
  </AbsoluteFill>
);

export const TeachersSalary: React.FC<TeachersSalaryProps> = (starts) => {
  const isStudio = getRemotionEnvironment().isStudio;
  const timed = timedFromFrames(starts);

  return (
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: "#F5ECD4" }}>
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
