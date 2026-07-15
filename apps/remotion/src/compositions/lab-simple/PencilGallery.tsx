import React from "react";
import { AbsoluteFill } from "remotion";
import { FrogPencil } from "~/characters/svg/FrogPencil";
import { RatPencil } from "~/characters/svg/RatPencil";
import { DeerPencil } from "~/characters/svg/DeerPencil";
import { HominidPencil } from "~/characters/svg/HominidPencil";
import { AmoebaPencil } from "~/characters/svg/AmoebaPencil";
import { PaperBackground, INK } from "~/characters/svg/_pencil";

/**
 * Macket recreated in the shared pencil-on-paper style. Repoint CharacterLab here
 * to review every macket character at once.
 */
export const PencilGallery: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />

    <Title />

    <HominidPencil x={240} y={760} scale={1.7} phase={0} />
    <Label x={240} y={800} text="ПЕРВІСНА ЛЮДИНА" />

    <FrogPencil x={620} y={620} size={250} phase={1} />
    <Label x={620} y={800} text="ЖАБА" />

    <AmoebaPencil x={960} y={600} size={300} phase={0.5} />
    <Label x={960} y={800} text="АМЕБА" />

    <RatPencil x={1320} y={640} size={210} phase={2} />
    <Label x={1320} y={800} text="ЩУР (ПРЕДОК)" />

    <DeerPencil x={1660} y={770} scale={1.55} />
    <Label x={1660} y={800} text="ОЛЕНЬ" />
  </AbsoluteFill>
);

const Title: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      width: "100%",
      textAlign: "center",
      color: INK,
      fontFamily: "Montserrat, sans-serif",
      fontSize: 60,
      fontWeight: 800,
      letterSpacing: 4,
    }}
  >
    МАКЕТ ПЕРСОНАЖІВ
  </div>
);

const Label: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, 0)",
      color: INK,
      fontFamily: "Montserrat, sans-serif",
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: 1,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);
