import React from "react";
import { AbsoluteFill } from "remotion";
import { PredationPair } from "~/components";
import {
  PaperBackground,
  INK,
  PASTEL,
  FrogPencil,
  RatPencil,
  AmoebaPencil,
  FishPencil,
  WormPencil,
  ButterflyPencil,
} from "~/characters";

/**
 * Paper showcase: the four predation "meetings" replayed with the pencil-style
 * characters, so the macket set can be reviewed in motion (pop-in → leap → bite
 * → victim). A non-destructive paper twin of carnivores' PredationChaseScene —
 * the original dark scene is left untouched. Repoint CharacterLab here to watch.
 */
const pair = (over: Partial<React.ComponentProps<typeof PredationPair>>): React.ComponentProps<typeof PredationPair> => ({
  predatorLabel: "",
  preyLabel: "",
  renderPredator: () => null,
  renderPrey: () => null,
  predatorRestX: 720,
  preyX: 1090,
  attackX: 960,
  labelSize: 26,
  labelWidth: 340,
  predatorGap: 120,
  preyGap: 95,
  ...over,
});

const LANES: Array<{ y: number; delay: number; props: React.ComponentProps<typeof PredationPair> }> = [
  {
    y: 250,
    delay: 0,
    props: pair({
      predatorLabel: "Еукаріот",
      preyLabel: "Прокаріот",
      renderPredator: (cx, cy) => <AmoebaPencil x={cx} y={cy} size={150} color={PASTEL.blue} />,
      renderPrey: (hurt, _ff, x, yy) => <AmoebaPencil x={x} y={yy} size={hurt ? 74 : 84} color={PASTEL.pink} hurt={hurt} phase={1} />,
    }),
  },
  {
    y: 450,
    delay: 24,
    props: pair({
      predatorLabel: "Багатоклітинний",
      preyLabel: "Одноклітинний",
      renderPredator: (cx, cy) => <AmoebaPencil x={cx} y={cy} size={156} color={PASTEL.green} />,
      renderPrey: (hurt, _ff, x, yy) => <AmoebaPencil x={x} y={yy} size={hurt ? 70 : 80} color={PASTEL.pink} hurt={hurt} phase={2} />,
    }),
  },
  {
    y: 650,
    delay: 48,
    props: pair({
      predatorLabel: "Земноводне",
      preyLabel: "Риба, безхребетне",
      renderPredator: (cx, cy) => <FrogPencil x={cx} y={cy} size={170} facing={1} />,
      renderPrey: (hurt, _ff, x, yy) => (
        <>
          <FishPencil x={x} y={yy - 10} size={hurt ? 60 : 66} facing={-1} hurt={hurt} moving={!hurt} />
          <WormPencil x={x + 80} y={yy + 30} size={hurt ? 52 : 58} facing={-1} hurt={hurt} moving={!hurt} phase={1.2} />
        </>
      ),
    }),
  },
  {
    y: 850,
    delay: 72,
    props: pair({
      predatorLabel: "Ссавець",
      preyLabel: "Комаха",
      renderPredator: (cx, cy) => <RatPencil x={cx} y={cy} size={150} facing={1} />,
      renderPrey: (hurt, _ff, x, yy) => <ButterflyPencil x={x} y={yy} size={hurt ? 66 : 72} hurt={hurt} moving={!hurt} />,
    }),
  },
];

export const PredationPencilScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        color: INK,
        fontFamily: "Montserrat, sans-serif",
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: 2,
      }}
    >
      Нові види з'являються як хижаки
    </div>
    {LANES.map((lane, i) => (
      <PredationPair key={i} {...lane.props} y={lane.y} delay={lane.delay} glowColor={PASTEL.yellow} />
    ))}
  </AbsoluteFill>
);
