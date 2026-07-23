import React from "react";
import { PencilDefs, Part, Sketch } from "./_pencil";

const GOLD     = "#C8A824";
const GOLD_DARK = "#8B6810";
const CRIMSON  = "#8B1A1A";
const STONE    = "#C4BCB0";
const WOOD     = "#9A7230";

/**
 * Ornate throne: gold columns, crimson backrest, stone pedestal, crown finial.
 * viewBox 540×740. Default position: absolute, left=450, top=20 on a 1920×1080 canvas.
 * Pass `style` to override position/size.
 */
export const GrandThrone: React.FC<{
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ opacity = 1, style }) => (
  <svg
    viewBox="0 0 540 740"
    style={{ position: "absolute", left: 450, top: 20, width: 540, height: 740, opacity, ...style }}
  >
    <PencilDefs scale={4.0} />

    {/* Pedestal — three receding stone tiers */}
    <Part hatch={{ gap: 9, color: STONE, opacity: 0.55 }}>
      <polygon points="0,740 540,740 520,700 20,700" />
    </Part>
    <Part hatch={{ gap: 8, color: STONE, opacity: 0.62 }}>
      <polygon points="28,700 512,700 492,660 48,660" />
    </Part>
    <Part hatch={{ gap: 7, color: STONE, opacity: 0.68 }}>
      <polygon points="68,660 472,660 452,620 88,620" />
    </Part>

    {/* Left armrest column */}
    <Part hatch={{ gap: 5, color: GOLD, opacity: 0.8 }}>
      <polygon points="82,620 128,620 128,86 82,86" />
    </Part>
    <Part hatch={{ gap: 4, color: GOLD, opacity: 0.88 }}>
      <polygon points="68,86 142,86 138,68 72,68" />
    </Part>
    <Part hatch={{ gap: 4, color: GOLD, opacity: 0.82 }}>
      <polygon points="68,620 142,620 142,636 68,636" />
    </Part>

    {/* Right armrest column */}
    <Part hatch={{ gap: 5, color: GOLD, opacity: 0.8 }}>
      <polygon points="412,620 458,620 458,86 412,86" />
    </Part>
    <Part hatch={{ gap: 4, color: GOLD, opacity: 0.88 }}>
      <polygon points="398,86 472,86 468,68 402,68" />
    </Part>
    <Part hatch={{ gap: 4, color: GOLD, opacity: 0.82 }}>
      <polygon points="398,620 472,620 472,636 398,636" />
    </Part>

    {/* Crown arch */}
    <Part hatch={{ gap: 5, color: GOLD, opacity: 0.85 }}>
      <polygon points="68,68 142,68 142,44 270,14 398,44 472,68 472,44 400,28 270,0 140,28 68,44" />
    </Part>

    {/* Crimson backrest */}
    <Part hatch={{ gap: 6, color: CRIMSON, opacity: 0.78 }}>
      <polygon points="128,86 412,86 412,582 128,582" />
    </Part>

    {/* Top arch gold trim */}
    <Part hatch={{ gap: 4, color: GOLD, opacity: 0.82 }}>
      <polygon points="128,86 190,52 270,30 350,52 412,86 380,100 270,48 160,100" />
    </Part>

    {/* Seat */}
    <Part hatch={{ gap: 5, color: WOOD, opacity: 0.85 }}>
      <polygon points="82,582 458,582 472,620 68,620" />
    </Part>
    <Part hatch={{ gap: 4, color: CRIMSON, opacity: 0.75 }}>
      <polygon points="94,570 446,570 452,582 88,582" />
    </Part>

    {/* Armrests */}
    <Part hatch={{ gap: 5, color: GOLD, opacity: 0.78 }}>
      <polygon points="82,490 140,490 140,582 82,582" />
    </Part>
    <Part hatch={{ gap: 5, color: GOLD, opacity: 0.78 }}>
      <polygon points="400,490 458,490 458,582 400,582" />
    </Part>

    {/* Crown finial */}
    <Part hatch={{ gap: 3, color: GOLD, opacity: 0.96 }} stroke={GOLD_DARK} width={3}>
      <polygon points="250,0 256,16 270,6 284,16 290,0 278,22 270,14 262,22" />
    </Part>
    <circle cx={270} cy={8} r={7} fill={CRIMSON} stroke={GOLD_DARK} strokeWidth={2} />

    {/* Fabric texture lines on backrest */}
    <Sketch width={2.5} stroke={`${CRIMSON}66`}>
      <polyline points="148,86 155,160 146,230 154,300 145,370 152,440" />
      <polyline points="163,86 170,155 162,225 169,295 160,365" />
    </Sketch>
    <Sketch width={2.5} stroke={`${CRIMSON}66`}>
      <polyline points="392,86 385,160 394,230 386,300 395,370 388,440" />
      <polyline points="377,86 370,155 378,225 371,295 380,365" />
    </Sketch>

    {/* Footstool */}
    <Part hatch={{ gap: 5, color: WOOD, opacity: 0.65 }}>
      <polygon points="170,636 370,636 360,660 180,660" />
    </Part>
    <Part hatch={{ gap: 4, color: CRIMSON, opacity: 0.6 }}>
      <polygon points="178,628 362,628 368,636 172,636" />
    </Part>
  </svg>
);
