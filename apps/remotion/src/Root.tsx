import React from "react";
import { Composition, Folder } from "remotion";
import "./lib/fonts"; // ensure fonts are loaded for all compositions

import { Frendcoin } from "~/compositions/0143-why-borshch/frendcoin";
import { frendcoinConfig } from "~/compositions/0143-why-borshch/frendcoin/config";
import { EuRegulations } from "~/compositions/0144-eu-phones/eu-regulations";
import { euRegulationsConfig } from "~/compositions/0144-eu-phones/eu-regulations/config";
import { EuManufacturers } from "~/compositions/0144-eu-phones/eu-manufacturers";
import { euManufacturersConfig } from "~/compositions/0144-eu-phones/eu-manufacturers/config";
import { Education } from "~/compositions/0147-evil-education/education";
import { educationConfig } from "~/compositions/0147-evil-education/education/config";
import { educationSchema, DEFAULT_STARTS as EDU_STARTS } from "~/compositions/0147-evil-education/education/plan";
import { Homeschool } from "~/compositions/0147-evil-education/homeschool";
import { homeschoolConfig } from "~/compositions/0147-evil-education/homeschool/config";
import { homeschoolSchema, DEFAULT_STARTS as HOME_STARTS } from "~/compositions/0147-evil-education/homeschool/plan";
import { Rothbard } from "~/compositions/0147-evil-education/rothbard";
import { rothbardConfig } from "~/compositions/0147-evil-education/rothbard/config";
import { rothbardSchema, DEFAULT_STARTS as ROTH_STARTS } from "~/compositions/0147-evil-education/rothbard/plan";
import { HabsburgInbreeding } from "~/compositions/0148-carnivore-state/habsburg-inbreeding";
import { habsburgInbreedingConfig } from "~/compositions/0148-carnivore-state/habsburg-inbreeding/config";
import { habsburgInbreedingSchema, DEFAULT_STARTS as HABSBURG_STARTS } from "~/compositions/0148-carnivore-state/habsburg-inbreeding/plan";
import { Oppenheimer } from "~/compositions/0148-carnivore-state/oppenheimer";
import { oppenheimerConfig } from "~/compositions/0148-carnivore-state/oppenheimer/config";
import { oppenheimerSchema, DEFAULT_STARTS as OPP_STARTS } from "~/compositions/0148-carnivore-state/oppenheimer/plan";
import { PassportWw1 } from "~/compositions/0148-carnivore-state/passport-ww1";
import { passportWw1Config } from "~/compositions/0148-carnivore-state/passport-ww1/config";
import { passportWw1Schema, DEFAULT_STARTS as PASSPORT_STARTS } from "~/compositions/0148-carnivore-state/passport-ww1/plan";
import { PredatoryBacteriaBiology } from "~/compositions/0148-carnivore-state/predatory-bacteria-biology";
import { predatoryBacteriaBiologyConfig } from "~/compositions/0148-carnivore-state/predatory-bacteria-biology/config";
import {
  predatoryBacteriaBiologySchema,
  DEFAULT_STARTS as PREDATORY_BACTERIA_STARTS,
} from "~/compositions/0148-carnivore-state/predatory-bacteria-biology/plan";
import { Carnivores } from "~/compositions/lab-complex/carnivores";
import { carnivoresConfig } from "~/compositions/lab-complex/carnivores/config";
import { carnivoresSchema } from "~/compositions/lab-complex/carnivores/plan";
import { HomoErectus } from "~/compositions/lab-complex/homo-erectus";
import { homoErectusConfig } from "~/compositions/lab-complex/homo-erectus/config";
import { CharacterGallery } from "~/compositions/lab-simple/CharacterGallery";
import { PredationPencilScene } from "~/compositions/lab-simple/PredationPencilScene";
import { VegansVsHunters } from "~/compositions/lab-simple/VegansVsHunters";
import { characterGalleryConfig, predationPencilConfig, vegansVsHuntersConfig } from "~/compositions/lab-simple/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="0143-why-borshch">
        <Composition
          id={frendcoinConfig.id}
          component={Frendcoin}
          durationInFrames={frendcoinConfig.durationInFrames}
          fps={frendcoinConfig.fps}
          width={frendcoinConfig.width}
          height={frendcoinConfig.height}
        />
      </Folder>

      <Folder name="0144-eu-phones">
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
      </Folder>

      <Folder name="0147-evil-education">
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
      </Folder>

      <Folder name="0148-carnivore-state">
        <Composition
          id={habsburgInbreedingConfig.id}
          component={HabsburgInbreeding}
          schema={habsburgInbreedingSchema}
          defaultProps={HABSBURG_STARTS}
          durationInFrames={habsburgInbreedingConfig.durationInFrames}
          fps={habsburgInbreedingConfig.fps}
          width={habsburgInbreedingConfig.width}
          height={habsburgInbreedingConfig.height}
        />
        <Composition
          id={oppenheimerConfig.id}
          component={Oppenheimer}
          schema={oppenheimerSchema}
          defaultProps={OPP_STARTS}
          durationInFrames={oppenheimerConfig.durationInFrames}
          fps={oppenheimerConfig.fps}
          width={oppenheimerConfig.width}
          height={oppenheimerConfig.height}
        />
        <Composition
          id={passportWw1Config.id}
          component={PassportWw1}
          schema={passportWw1Schema}
          defaultProps={PASSPORT_STARTS}
          durationInFrames={passportWw1Config.durationInFrames}
          fps={passportWw1Config.fps}
          width={passportWw1Config.width}
          height={passportWw1Config.height}
        />
        <Composition
          id={predatoryBacteriaBiologyConfig.id}
          component={PredatoryBacteriaBiology}
          schema={predatoryBacteriaBiologySchema}
          defaultProps={PREDATORY_BACTERIA_STARTS}
          durationInFrames={predatoryBacteriaBiologyConfig.durationInFrames}
          fps={predatoryBacteriaBiologyConfig.fps}
          width={predatoryBacteriaBiologyConfig.width}
          height={predatoryBacteriaBiologyConfig.height}
        />
      </Folder>

      <Folder name="lab-complex">
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
          id={homoErectusConfig.id}
          component={HomoErectus}
          durationInFrames={homoErectusConfig.durationInFrames}
          fps={homoErectusConfig.fps}
          width={homoErectusConfig.width}
          height={homoErectusConfig.height}
        />
      </Folder>

      <Folder name="lab-simple">
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
      </Folder>
    </>
  );
};
