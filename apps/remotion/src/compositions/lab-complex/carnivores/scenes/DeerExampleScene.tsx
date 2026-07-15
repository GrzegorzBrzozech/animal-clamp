import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Background } from "~/components";
import { HominidPencil, DeerPencil, Plant, Grass } from "~/characters";
import { colors, fontSizes } from "../paper";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GROUND = 824;

// ── rules (from the plan) ────────────────────────────────────────────────────
const PERSONS = 3;
const MOVE_DAY = 3000 * PERSONS; // 9000 kcal/day moving (whole group)
const REST_DAY = 1500 * PERSONS; // 4500 kcal/day resting
const MOVE_H = MOVE_DAY / 24;
const REST_H = REST_DAY / 24;
const RESERVE = MOVE_DAY; // a 1-active-day reserve (9000) → stop moving
const DEER = 400000; // kcal from one deer
const PLANT = 100; // kcal per gathered plant
const VEGAN_GATHER_H = 600; // kcal/h gathered while foraging (~6 plants/h)
const KILL_HOUR = 8; // hunters catch the deer after ~8 h of chase
const SIM_HOURS = 92 * 24; // the scene spans ~3 months (the deer lasts that long)
// Non-linear clock: the first day plays slowly (the hunt + kill are watchable),
// then time accelerates so the full ~3 months of leisure fit. p>1 = slow start.
const TIME_P = 2.2;

const HUNTER_REST = [360, 488, 600];
const VEGAN_REST = [1200, 1340, 1470];
const VEGAN_PLANTS = [1060, 1210, 1360, 1520, 1680, 1840];

/**
 * Step the energy bank hour-by-hour. Income goes into the bank (deer / plants);
 * consumption drains it gradually (more while moving). A family that has banked
 * a full active day (RESERVE) stops moving to rest; once the bank hits 0 it
 * moves again. The bank never goes negative.
 */
function simulate(kind: "hunter" | "vegan", H: number) {
  const dt = 1;
  let bank = kind === "hunter" ? RESERVE : 0; // hunters set out with a day's energy
  let moving = true;
  for (let t = 0; t < H - 1e-9; t += dt) {
    const step = Math.min(dt, H - t);
    if (kind === "hunter") {
      if (t < KILL_HOUR && t + step >= KILL_HOUR) bank += DEER; // the kill
    } else if (moving) {
      bank += VEGAN_GATHER_H * step; // gather only while foraging
    }
    bank -= (moving ? MOVE_H : REST_H) * step;
    if (bank < 0) bank = 0;
    if (moving && bank >= RESERVE) moving = false;
    else if (!moving && bank <= 0) moving = true;
  }
  return { bank, moving };
}

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ккал";

const Panel: React.FC<{ side: "left" | "right"; title: string; titleColor: string; state: string; bank: number; sub: string }> = ({ side, title, titleColor, state, bank, sub }) => (
  <div style={{ position: "absolute", top: 132, [side]: 64, width: 560, textAlign: side === "left" ? "left" : "right" }}>
    <div style={{ fontSize: fontSizes.caption, fontWeight: 800, color: titleColor }}>
      {title} · {state}
    </div>
    <div style={{ fontSize: fontSizes.title - 14, fontWeight: 900, color: bank > 0 ? colors.success : colors.danger, lineHeight: 1.05 }}>{fmt(bank)}</div>
    <div style={{ fontSize: fontSizes.caption - 6, color: colors.textMuted, marginTop: 6 }}>{sub}</div>
  </div>
);

export const DeerExampleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();

  const H = SIM_HOURS * Math.pow(frame / Math.max(1, D - 1), TIME_P);
  const hunter = simulate("hunter", H);
  const vegan = simulate("vegan", H);
  const killed = H >= KILL_HOUR;
  const day = Math.floor(H / 24);
  const killFrame = Math.round((D - 1) * Math.pow(KILL_HOUR / SIM_HOURS, 1 / TIME_P));
  const satietyDays = Math.floor(hunter.bank / REST_DAY);

  // "+100" pops while vegans actually forage (illustrative — too many to show 1:1)
  const veganFloats = vegan.moving ? [0, 1, 2, 3].map((k) => Math.floor(frame / 14) * 14 - k * 14).filter((pf) => pf >= 0 && frame - pf <= 28) : [];

  return (
    <Background gradientTo={colors.bgAlt}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 26 }}>
        <div style={{ fontSize: fontSizes.heading - 8, fontWeight: 900, color: colors.text, textShadow: "0 2px 10px #3a352e22" }}>
          День {day} · ≈ {(day / 30).toFixed(1)} міс
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 0, top: GROUND, width: "100%", height: 1080 - GROUND, background: colors.bgAlt }} />
      <Grass width={1920} y={GROUND} />

      {/* ── LEFT: hunters ── */}
      <DeerPencil x={660} y={GROUND} scale={1.05} color={colors.danger} state={killed ? "down" : "stand"} />
      {HUNTER_REST.map((rx, i) => {
        const x = interpolate(H, [0, KILL_HOUR], [-140 - i * 90, rx], clamp);
        return <HominidPencil key={i} x={x} y={GROUND} scale={0.72} color={colors.danger} facing={1} spear phase={i * 1.3} hold={!hunter.moving && killed ? "🍖" : undefined} />;
      })}
      {frame >= killFrame && frame <= killFrame + 40 ? (
        <div
          style={{
            position: "absolute",
            left: 660,
            top: GROUND - 300 - interpolate(frame, [killFrame, killFrame + 36], [0, 60], clamp),
            transform: "translateX(-50%)",
            fontSize: 44,
            fontWeight: 900,
            color: colors.secondary,
            opacity: interpolate(frame, [killFrame, killFrame + 8, killFrame + 30, killFrame + 46], [0, 1, 1, 0], clamp),
            textShadow: "0 2px 10px #3a352e22",
          }}
        >
          🍖 +400 000 ккал
        </div>
      ) : null}

      {/* ── RIGHT: vegans ── */}
      {VEGAN_PLANTS.map((px, i) => (
        <Plant key={i} x={px} y={GROUND} phase={i} gone={vegan.moving && (frame + i * 17) % 80 < 24} />
      ))}
      {[0, 1, 2].map((i) => {
        const t = frame * 0.05 + i * 2.1;
        const movingX = 1030 + (Math.sin(t) * 0.5 + 0.5) * 780;
        const x = vegan.moving ? movingX : VEGAN_REST[i];
        const facing: 1 | -1 = vegan.moving ? (Math.cos(t) >= 0 ? 1 : -1) : 1;
        return <HominidPencil key={i} x={x} y={GROUND} scale={0.72} color={colors.success} facing={facing} spear={false} action="eat" phase={i * 1.7} hold={vegan.moving ? "🌿" : undefined} />;
      })}
      {veganFloats.map((pf) => {
        const age = frame - pf;
        const hi = Math.floor(pf / 14) % 3;
        const t = pf * 0.05 + hi * 2.1;
        const hx = 1030 + (Math.sin(t) * 0.5 + 0.5) * 780;
        return (
          <div key={pf} style={{ position: "absolute", left: hx, top: GROUND - 170 - age * 3, transform: "translateX(-50%)", fontSize: 28, fontWeight: 900, color: colors.success, opacity: Math.max(0, 1 - age / 28), textShadow: "0 2px 8px #3a352e22" }}>
            +{PLANT}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: "50%", top: 120, bottom: 40, width: 2, background: colors.border, transform: "translateX(-50%)" }} />

      <Panel side="left" title="🥩 Хижаки" titleColor={colors.danger} state={hunter.moving ? "🏃 полюють" : "😴 відпочивають"} bank={hunter.bank} sub={killed ? `≈ ${satietyDays} дн. ситості з оленя` : "переслідують оленя…"} />
      <Panel side="right" title="🌿 Вегани" titleColor={colors.success} state={vegan.moving ? "🏃 збирають" : "😴 відпочивають"} bank={vegan.bank} sub="запас ніколи не більший за 1 день" />
    </Background>
  );
};
