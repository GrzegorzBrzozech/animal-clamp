import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { montserrat } from "~/lib/fonts";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO, CLICK_SFX, FRAME_CLICK } from "./plan";
import { CavemanCTAScene } from "./scenes/CavemanCTAScene";

export const CavemanSubscribe: React.FC = () => (
  <PaletteProvider value={paperPalette}>
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: paperPalette.bg }}>
      <Audio src={staticFile(AUDIO)} />
      <Sequence from={FRAME_CLICK} durationInFrames={15}>
        <Audio src={staticFile(CLICK_SFX)} />
      </Sequence>
      <CavemanCTAScene />
    </AbsoluteFill>
  </PaletteProvider>
);
