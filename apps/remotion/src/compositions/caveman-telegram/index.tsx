import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { montserrat } from "~/lib/fonts";
import { PaletteProvider } from "~/theme/palette";
import { paperPalette } from "./paper";
import { AUDIO } from "./plan";
import { CavemanTelegramScene } from "./scenes/CavemanTelegramScene";

export const CavemanTelegram: React.FC = () => (
  <PaletteProvider value={paperPalette}>
    <AbsoluteFill style={{ fontFamily: montserrat.fontFamily, background: paperPalette.bg }}>
      <Audio src={staticFile(AUDIO)} />
      <CavemanTelegramScene />
    </AbsoluteFill>
  </PaletteProvider>
);
