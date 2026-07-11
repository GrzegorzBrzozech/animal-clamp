import React from "react";
import { Composition } from "remotion";
import "./lib/fonts"; // ensure fonts are loaded for all compositions

import { Frendcoin } from "./compositions/frendcoin";
import { frendcoinConfig } from "./compositions/frendcoin/config";
import { Carnivores } from "./compositions/carnivores";
import { carnivoresConfig } from "./compositions/carnivores/config";
import { carnivoresSchema } from "./compositions/carnivores/plan";
import { Education } from "./compositions/education";
import { educationConfig } from "./compositions/education/config";
import { educationSchema, DEFAULT_STARTS as EDU_STARTS } from "./compositions/education/plan";
import { Homeschool } from "./compositions/homeschool";
import { homeschoolConfig } from "./compositions/homeschool/config";
import { homeschoolSchema, DEFAULT_STARTS as HOME_STARTS } from "./compositions/homeschool/plan";
import { Rothbard } from "./compositions/rothbard";
import { rothbardConfig } from "./compositions/rothbard/config";
import { rothbardSchema, DEFAULT_STARTS as ROTH_STARTS } from "./compositions/rothbard/plan";
import { EuRegulations } from "./compositions/eu-regulations";
import { euRegulationsConfig } from "./compositions/eu-regulations/config";
import { EuManufacturers } from "./compositions/eu-manufacturers";
import { euManufacturersConfig } from "./compositions/eu-manufacturers/config";
import { CharacterLab } from "./compositions/_lab/CharacterLab";
import { CharacterGallery } from "./compositions/_lab/CharacterGallery";
import { PredationPencilScene } from "./compositions/_lab/PredationPencilScene";
import { VegansVsHunters } from "./compositions/_lab/VegansVsHunters";
import { characterLabConfig, characterGalleryConfig, predationPencilConfig, vegansVsHuntersConfig } from "./compositions/_lab/config";

/**
 * Register every video here. To add a new animation:
 *   1. Create a folder under src/compositions/<name>/
 *   2. Export its component + a config object
 *   3. Add a <Composition /> entry below
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={frendcoinConfig.id}
        component={Frendcoin}
        durationInFrames={frendcoinConfig.durationInFrames}
        fps={frendcoinConfig.fps}
        width={frendcoinConfig.width}
        height={frendcoinConfig.height}
      />
      <Composition
        id={carnivoresConfig.id}
        component={Carnivores}
        schema={carnivoresSchema}
        defaultProps={{
          hook: 0,
          firstLife: 467,
          symbiosis: 1307,
          goodTimeline: 2621,
          predationAppears: 3412,
          whyPredation: 4384,
          divisionRates: 5071,
          deerExample: 5648,
          persistence: 6116,
          predationChase: 6511,
          peacefulTurn: 7103,
          frequencyPayoff: 7740,
          preyDefenses: 9001,
          bioenergetics: 9368,
          humans: 10301,
          cliffhanger: 11375,
        }}
        durationInFrames={carnivoresConfig.durationInFrames}
        fps={carnivoresConfig.fps}
        width={carnivoresConfig.width}
        height={carnivoresConfig.height}
      />
      <Composition
        id={educationConfig.id}
        component={Education}
        schema={educationSchema}
        defaultProps={EDU_STARTS}
        durationInFrames={educationConfig.durationInFrames}
        fps={educationConfig.fps}
        width={educationConfig.width}
        height={educationConfig.height}
      />
      <Composition
        id={homeschoolConfig.id}
        component={Homeschool}
        schema={homeschoolSchema}
        defaultProps={HOME_STARTS}
        durationInFrames={homeschoolConfig.durationInFrames}
        fps={homeschoolConfig.fps}
        width={homeschoolConfig.width}
        height={homeschoolConfig.height}
      />
      <Composition
        id={rothbardConfig.id}
        component={Rothbard}
        schema={rothbardSchema}
        defaultProps={ROTH_STARTS}
        durationInFrames={rothbardConfig.durationInFrames}
        fps={rothbardConfig.fps}
        width={rothbardConfig.width}
        height={rothbardConfig.height}
      />
      <Composition
        id={euRegulationsConfig.id}
        component={EuRegulations}
        durationInFrames={euRegulationsConfig.durationInFrames}
        fps={euRegulationsConfig.fps}
        width={euRegulationsConfig.width}
        height={euRegulationsConfig.height}
      />
      <Composition
        id={euManufacturersConfig.id}
        component={EuManufacturers}
        durationInFrames={euManufacturersConfig.durationInFrames}
        fps={euManufacturersConfig.fps}
        width={euManufacturersConfig.width}
        height={euManufacturersConfig.height}
      />
      <Composition
        id={characterLabConfig.id}
        component={CharacterLab}
        durationInFrames={characterLabConfig.durationInFrames}
        fps={characterLabConfig.fps}
        width={characterLabConfig.width}
        height={characterLabConfig.height}
      />
      <Composition
        id={characterGalleryConfig.id}
        component={CharacterGallery}
        durationInFrames={characterGalleryConfig.durationInFrames}
        fps={characterGalleryConfig.fps}
        width={characterGalleryConfig.width}
        height={characterGalleryConfig.height}
      />
      <Composition
        id={predationPencilConfig.id}
        component={PredationPencilScene}
        durationInFrames={predationPencilConfig.durationInFrames}
        fps={predationPencilConfig.fps}
        width={predationPencilConfig.width}
        height={predationPencilConfig.height}
      />
      <Composition
        id={vegansVsHuntersConfig.id}
        component={VegansVsHunters}
        durationInFrames={vegansVsHuntersConfig.durationInFrames}
        fps={vegansVsHuntersConfig.fps}
        width={vegansVsHuntersConfig.width}
        height={vegansVsHuntersConfig.height}
      />
    </>
  );
};
