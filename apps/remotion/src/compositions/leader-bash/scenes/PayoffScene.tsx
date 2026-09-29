import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { PaperBackground } from "~/characters";
import { INK, PASTEL } from "~/characters/svg/_pencil";
import { colors, fontWeights } from "../paper";

/**
 * 9.30–13.5s · "проти гравця, який зараз лідирує, щоб зрівняти шанси на
 * перемогу". No on-screen title (removed per feedback — the vertical axis
 * label below IS the "what is this" cue, a title on top of it was
 * redundant). 5 players, each column numbered ("Гравець 1"…"Гравець 5") —
 * no "Лідер"/"Аутсайдер" text labels, only the crown marks the leader.
 *
 * The chunk that leaves the leader is the SAME SIZE that lands on the
 * outsider — conservation, no shrinking mid-flight. It's a small chunk
 * (0.20 of the scale) precisely so the outsider catches up without
 * overtaking anyone or becoming the new "leader".
 *
 * The chart fills the whole frame (no dead space above it) — bars run from
 * near the top edge down to the labels at the bottom.
 */
const BAR_W = 220;
const GAP = 36;
const BASE_Y = 990; // bars' baseline — leaves just enough room below for labels
const MAX_H = 940; // leader's initial height (0.95 · MAX_H) reaches ~50px from the top edge
const AXIS_X = 320;
const START_X = AXIS_X + 100;
const N = 5;
const X = Array.from({ length: N }, (_, i) => START_X + i * (BAR_W + GAP));

const LEADER_I = 0;
const OUTSIDER_I = 4;
const LEADER_INITIAL = 0.95; // leader's full height before the coalition acts
const CHUNK = 0.2; // exactly what leaves the leader — the SAME amount lands on the outsider

// Static base heights (fraction of MAX_H) for each of the 5 players.
const BASE_FRAC = [LEADER_INITIAL - CHUNK, 0.55, 0.45, 0.35, 0.12]; // index 4 (outsider) grows via the chunk

const FLIGHT_START = 50;
const FLIGHT_END = 100;
const ARC = 180; // clears above every column, including the leader's original height

const COLORS = [PASTEL.yellow, PASTEL.blue, PASTEL.green, PASTEL.brown, PASTEL.gray];

const Bar: React.FC<{ x: number; heightFrac: number; color: string; delay: number; label: string; crown?: boolean }> = ({
  x,
  heightFrac,
  color,
  delay,
  label,
  crown,
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const h = heightFrac * MAX_H * grow;
  return (
    <div style={{ position: "absolute", left: x, top: BASE_Y - h, width: BAR_W, height: h }}>
      {crown ? (
        <div style={{ position: "absolute", top: 564, width: "100%", textAlign: "center", fontSize: 88, opacity: grow }}>👑</div>
      ) : null}
      <div style={{ width: "100%", height: "100%", background: color, border: `5px solid ${INK}`, borderRadius: 14 }} />
      <div style={{ position: "absolute", top: "100%", marginTop: 14, width: "100%", textAlign: "center", fontSize: 30, fontWeight: fontWeights.bold, color: colors.text, opacity: grow }}>
        {label}
      </div>
    </div>
  );
};

/** Vertical axis (line + arrowhead + rotated label) — stands in for the
 * removed title: it's what tells you this chart is about "chances of
 * winning" without restating the narration on screen. */
const ChancesAxis: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topY = BASE_Y - MAX_H - 30;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: grow }}>
      <line x1={AXIS_X} y1={BASE_Y} x2={AXIS_X} y2={topY} stroke={INK} strokeWidth={5} />
      <polygon points={`${AXIS_X - 12},${topY + 18} ${AXIS_X + 12},${topY + 18} ${AXIS_X},${topY - 6}`} fill={INK} />
      <text
        x={AXIS_X - 26}
        y={(BASE_Y + topY) / 2}
        fill={colors.text}
        fontSize={34}
        fontWeight={fontWeights.bold}
        textAnchor="middle"
        transform={`rotate(-90 ${AXIS_X - 26} ${(BASE_Y + topY) / 2})`}
      >
        Шанси на перемогу
      </text>
    </svg>
  );
};

export const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [FLIGHT_START, FLIGHT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Chunk flies from atop the leader's base to atop the outsider's base —
  // constant size the whole way (no shrinking mid-flight): whatever left the
  // leader is exactly what lands on the outsider.
  const chunkX = interpolate(progress, [0, 1], [X[LEADER_I], X[OUTSIDER_I]]);
  const chunkH = CHUNK * MAX_H;
  const chunkBottomY =
    interpolate(progress, [0, 1], [BASE_Y - BASE_FRAC[LEADER_I] * MAX_H, BASE_Y - BASE_FRAC[OUTSIDER_I] * MAX_H]) -
    ARC * Math.sin(Math.PI * progress);
  // Pops in together with the leader bar so the leader reads as its FULL
  // height (base + chunk) before anything moves, then flies off during
  // [FLIGHT_START, FLIGHT_END] — it never just appears mid-flight.
  const chunkOpacity = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <ChancesAxis />

      {BASE_FRAC.map((frac, i) => (
        <Bar key={i} x={X[i]} heightFrac={frac} color={COLORS[i]} delay={4 + i * 6} label={`Гравець ${i + 1}`} crown={i === LEADER_I} />
      ))}

      {/* the transferred chunk — same yellow as the leader's own advantage */}
      <div
        style={{
          position: "absolute",
          left: chunkX,
          top: chunkBottomY - chunkH,
          width: BAR_W,
          height: chunkH,
          background: PASTEL.yellow,
          border: `5px solid ${INK}`,
          borderRadius: 14,
          opacity: chunkOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
