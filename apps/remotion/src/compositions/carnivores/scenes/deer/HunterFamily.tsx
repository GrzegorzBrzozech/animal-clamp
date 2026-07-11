import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { HominidPencil, DeerPencil, Grass } from "~/characters";
import { fadeIn } from "~/lib/animations";
import { colors } from "../../paper";

const GROUND = 660;
const REST = [330, 250, 440];

/** Hunters: walk in, take the deer down, then relax for "months". */
export const HunterFamily: React.FC = () => {
  const frame = useCurrentFrame();
  const down = frame >= 68;

  const phase = (): "walk" | "cheer" | "rest" =>
    frame < 70 ? "walk" : frame < 100 ? "cheer" : "rest";
  const xOf = (i: number) => interpolate(frame, [0, 70], [-80 - i * 90, REST[i]], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sun arcs across the sky — each pass marks a passing month of leisure.
  const sp = (frame % 100) / 100;
  const sunX = 60 + sp * 760;
  const sunY = 150 - Math.sin(sp * Math.PI) * 100;
  const month = Math.min(3, Math.floor(frame / 100) + 1);

  return (
    <AbsoluteFill>
      {/* sky sun */}
      <div style={{ position: "absolute", left: sunX, top: sunY, transform: "translate(-50%,-50%)", fontSize: 56 }}>☀️</div>
      {/* ground */}
      <div style={{ position: "absolute", left: 0, top: GROUND, width: "100%", height: 200, background: colors.bgAlt }} />
      <Grass width={880} y={GROUND} />

      <DeerPencil x={580} y={GROUND + 6} scale={1.05} color={colors.danger} state={down ? "down" : "stand"} />
      {[0, 1, 2].map((i) => (
        <HominidPencil key={i} x={xOf(i)} y={GROUND + 4} scale={0.7} color={colors.danger} facing={1} spear phase={i * 1.3} hold={phase() === "rest" ? "🍖" : undefined} />
      ))}

      {frame >= 100 ? (
        <div style={{ position: "absolute", left: 24, top: 100, fontSize: 30, fontWeight: 800, color: colors.secondary, opacity: fadeIn(frame, 100, 16) }}>
          🌙 Місяць {month} / 3 — спокій
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, bottom: 24, width: "100%", textAlign: "center", fontSize: 34, fontWeight: 800, color: colors.text, opacity: fadeIn(frame, 110, 20) }}>
        1 здобич → 3 місяці ситості
      </div>
    </AbsoluteFill>
  );
};
