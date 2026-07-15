import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BarrierPencil, PaperBackground, PersonPencil } from "~/characters";
import { AnimatedText, PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const RED = "#E74C3C";

// Scene 3: 22 s → 31 s = 270 frames.
// Transcription-based triggers (relative to scene start):
//   frame  0 — "Але довоєнних умов більше не існувало"
//   frame 73 — "Велика депресія, Друга світова, Холодна війна"  (2.44 s)
//   frame 159 — "кожна криза давала нову причину…"             (5.30 s)

const DEPR_AT  = 73;
const WWII_AT  = 110;
const COLD_AT  = 127;

// ── One full crisis unit: image/card + barrier ────────────────────────────────

const CrisisUnit: React.FC<{
  /** Left edge of the whole unit (card + barrier). */
  x: number;
  /** Y for the top of the card. */
  cardY: number;
  /** X for barrier post (absolute on canvas). */
  barrierX: number;
  /** Frame to appear. */
  appearAt: number;
  /** Card content — rendered inside spring wrapper. */
  card: React.ReactNode;
}> = ({ x, cardY, barrierX, appearAt, card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ fps, frame: frame - appearAt, config: { damping: 14, mass: 0.7 } });
  const close  = spring({ fps, frame: frame - (appearAt + 15), config: { damping: 12, mass: 0.9 } });
  const angle  = interpolate(close, [0, 1], [-80, 0]);

  return (
    <>
      {/* Card / photo */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: cardY,
          opacity: appear,
          transform: `scale(${appear})`,
          transformOrigin: "top center",
        }}
      >
        {card}
      </div>

      {/* Barrier */}
      <div
        style={{
          position: "absolute",
          left: barrierX,
          top: 660,
          opacity: appear,
          transform: `scaleY(${appear})`,
          transformOrigin: "bottom center",
        }}
      >
        <BarrierPencil size={150} angle={angle} color={RED} />
      </div>
    </>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const CrisesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const personIn = spring({ fps, frame, config: { damping: 14 } });
  // Person bobs when fully boxed in
  const bob = frame > 150 ? Math.sin(frame * 0.28) * 5 : 0;

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* ── Person in the middle — gets boxed in by barriers ── */}
      <div
        style={{
          position: "absolute",
          left: 855,
          top: 580,
          transform: `scale(${personIn}) translateY(${bob}px)`,
          transformOrigin: "bottom center",
          opacity: personIn,
        }}
      >
        <PersonPencil size={210} facing={1} pose="stand" />
      </div>

      {/* ── Crisis 1: Велика депресія ── left side ── */}
      <CrisisUnit
        x={200}
        cardY={230}
        barrierX={230}
        appearAt={DEPR_AT}
        card={
          <PhotoPin
            src="projects/passport-ww1/great-depression.webp"
            width={380}
            height={250}
            delay={0}
            rotate={-12}
            zoom={0.02}
            caption="Черга за їжею · Чикаго, 1930"
            date="1929–1939"
            hold="tape"
            objectFit="cover"
          />
        }
      />

      {/* ── Crisis 2: Холодна війна ── center, triggers last ── */}
      <CrisisUnit
        x={760}
        cardY={210}
        barrierX={730}
        appearAt={COLD_AT}
        card={
          <PhotoPin
            src="projects/passport-ww1/cold-war.avif"
            width={460}
            height={240}
            delay={0}
            rotate={1}
            zoom={0.02}
            caption="Холодна війна"
            date="1947–1991"
            hold="tape"
            objectFit="cover"
          />
        }
      />

      {/* ── Crisis 3: Друга світова — WWII photo ── right side ── */}
      <CrisisUnit
        x={1340}
        cardY={180}
        barrierX={1310}
        appearAt={WWII_AT}
        card={
          <PhotoPin
            src="projects/passport-ww1/wwii-collage.jpg"
            width={380}
            height={400}
            delay={0}
            rotate={9}
            zoom={0.03}
            date="1939–1945"
            caption="Друга світова"
            hold="tape"
            objectFit="cover"
          />
        }
      />

      {/* ── Narration ── */}
      <div style={{ position: "absolute", left: 80, top: 64, width: 1760 }}>
        <AnimatedText
          size={fontSizes.heading}
          weight={fontWeights.black}
          delay={0}
          align="center"
          maxWidth={1760}
        >
          Раніше було <span style={{ color: colors.danger }}>краще</span>!
        </AnimatedText>
      </div>

      <div style={{ position: "absolute", left: 200, top: 930, width: 1520 }}>
        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={159}
          align="center"
          maxWidth={1520}
          color={colors.text}
        >
          Новий день - {" "}
          <span style={{ color: colors.danger, fontWeight: fontWeights.black }}>
            нова відмазка
          </span>
          ...
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};
