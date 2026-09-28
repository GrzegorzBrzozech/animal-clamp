import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { PaperBackground, PencilDefs, Sketch, Hatch, INK, PASTEL } from "~/characters";
import { PuppetActor, cavemanModel } from "~/characters";
import { Seagull } from "~/characters";
import { FRAME_DIG_END, FRAME_RAIN_END, FRAME_AUDIO_END, TOTAL_FRAMES } from "../plan";

const W = 1920;
const H = 1080;
const GROUND_Y = 680;

// Terracotta for all ground / earth fills
const TERRACOTTA = "#C87B52";

// Each trapezoid is exactly 1/4 screen width = 480px
const TRAP_HALF = 240;

// Sea (pit) — centred at x=860, grows DOWNWARD
const SEA_CX = 860;
const SEA_MAX_DEPTH = 250;
const SEA_NARROW = 0.54; // bottom shrinks: halfBottom = TRAP_HALF - depth * SEA_NARROW

// Mountain (kurgan) — centred at x=1460, grows UPWARD
const MT_CX = 1460;
const MT_MAX_H = 230;
const MT_NARROW = 0.9; // top shrinks: halfTop = TRAP_HALF - height * MT_NARROW

// Caveman stands left of the pit
const CAVE_X = 320;

// Rain drops (deterministic)
const N = 55;
const DROPS = Array.from({ length: N }, (_, i) => ({
  x:     random(`rx${i}`) * W,
  phase: random(`ry${i}`),
  speed: 1.3 + random(`rs${i}`) * 0.9,
  len:   22  + random(`rl${i}`) * 28,
  op:    0.4 + random(`ro${i}`) * 0.5,
}));

export const BlackSeaScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Sea trapezoid (pit) ────────────────────────────────────────────────────
  const seaDepth = interpolate(frame, [0, FRAME_DIG_END], [0, SEA_MAX_DEPTH], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const seaHalfT = TRAP_HALF;                                          // at ground level
  const seaHalfB = Math.max(28, TRAP_HALF - seaDepth * SEA_NARROW);   // at pit bottom
  const seaTop    = GROUND_Y;
  const seaBot    = GROUND_Y + seaDepth;

  const seaPoly = [
    [SEA_CX - seaHalfT, seaTop],
    [SEA_CX + seaHalfT, seaTop],
    [SEA_CX + seaHalfB, seaBot],
    [SEA_CX - seaHalfB, seaBot],
  ].map(p => p.join(",")).join(" ");

  // ── Mountain trapezoid (kurgan) ────────────────────────────────────────────
  const mtH = interpolate(frame, [0, FRAME_DIG_END], [0, MT_MAX_H], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const mtHalfB = TRAP_HALF;                                           // at ground level
  const mtHalfT = Math.max(26, TRAP_HALF - mtH * MT_NARROW);          // at peak
  const mtCrest = GROUND_Y - mtH;

  const mtPoly = [
    [MT_CX - mtHalfB, GROUND_Y],
    [MT_CX + mtHalfB, GROUND_Y],
    [MT_CX + mtHalfT, mtCrest],
    [MT_CX - mtHalfT, mtCrest],
  ].map(p => p.join(",")).join(" ");

  // ── Water rising in the pit ────────────────────────────────────────────────
  const waterLvl = interpolate(frame, [FRAME_DIG_END + 20, FRAME_RAIN_END + 15], [0, SEA_MAX_DEPTH], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Trapezoid slice of water (from pit bottom up by waterLvl)
  const wHalfAtSurf = seaHalfB + (seaHalfT - seaHalfB) * (waterLvl / Math.max(1, seaDepth));
  const wSurfaceY   = seaBot - waterLvl;
  const waveOff     = Math.sin((frame / 28) * Math.PI * 2) * 5;

  const waterPoly = [
    [SEA_CX - seaHalfB,   seaBot],
    [SEA_CX + seaHalfB,   seaBot],
    [SEA_CX + wHalfAtSurf, wSurfaceY + waveOff],
    [SEA_CX - wHalfAtSurf, wSurfaceY + waveOff],
  ].map(p => p.join(",")).join(" ");

  // ── Rain ──────────────────────────────────────────────────────────────────
  const rainIn  = interpolate(frame, [FRAME_DIG_END + 5,  FRAME_DIG_END + 40],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rainOut = interpolate(frame, [FRAME_RAIN_END + 20, FRAME_RAIN_END + 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rainA   = rainIn * rainOut;

  // ── Flag ──────────────────────────────────────────────────────────────────
  const flagP    = interpolate(frame, [FRAME_AUDIO_END + 35, FRAME_AUDIO_END + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const POLE_X   = MT_CX;
  const POLE_BOT = mtCrest + 4;   // sits on the crest; mtCrest is already at full height by this phase
  const POLE_TOP = POLE_BOT - 200 * flagP;
  const FLAG_W   = 130;
  const FLAG_H   = 86;

  // ── Seagull ───────────────────────────────────────────────────────────────
  const gS = FRAME_AUDIO_END + 25;
  const gE = TOTAL_FRAMES - 10;
  const gullX = interpolate(frame, [gS, gE], [W + 160, -160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gullY = GROUND_Y - 200 + Math.sin(((frame - gS) / 55) * Math.PI) * 30;

  // ── Caveman ───────────────────────────────────────────────────────────────
  // actionStartFrame/prevAction let PuppetActor reset each action's own clock
  // at the switch and cross-fade out of the previous pose, instead of jumping
  // straight into a random phase of the new loop (the cause of the ugly pop).
  const caveAction: string = frame < FRAME_DIG_END
    ? "dig"
    : frame < FRAME_AUDIO_END
    ? "scratch head"
    : "wave";
  const caveActionStartFrame = frame < FRAME_DIG_END
    ? 0
    : frame < FRAME_AUDIO_END
    ? FRAME_DIG_END
    : FRAME_AUDIO_END;
  const cavePrevAction = frame < FRAME_DIG_END
    ? undefined
    : frame < FRAME_AUDIO_END
    ? "dig"
    : "scratch head";
  const cavePrevActionStartFrame = frame < FRAME_DIG_END
    ? undefined
    : frame < FRAME_AUDIO_END
    ? 0
    : FRAME_DIG_END;

  // Puppet: viewBox -200 -40 400 560; feet at viewBox-y ≈ 388 out of 560 total
  const puppetH = 672;
  const puppetW = 480;
  const feetOffset = Math.round((388 / 560) * puppetH); // 466 px

  return (
    <AbsoluteFill>
      <PaperBackground />

      <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        <PencilDefs scale={2.5} />

        {/* Sky */}
        <Hatch color={PASTEL.blue} gap={14} angle={-35} opacity={0.38}>
          <rect x={0} y={0} width={W} height={GROUND_Y} />
        </Hatch>

        {/* Cloud darkening during rain */}
        {rainA > 0.01 && (
          <rect x={0} y={0} width={W} height={GROUND_Y * 0.6} fill={INK} opacity={rainA * 0.22} />
        )}

        {/* Ground strip */}
        <Hatch color={TERRACOTTA} gap={9} angle={-45} opacity={0.55}>
          <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} />
        </Hatch>
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke={INK} strokeWidth={3} />

        {/* ── Sea / pit trapezoid (grows DOWN) ── */}
        {seaDepth > 1 && (
          <>
            {/* Earth inside pit (fades out as water fills) */}
            <Hatch color={TERRACOTTA} gap={5} cross opacity={0.38 * (1 - waterLvl / Math.max(1, seaDepth))}>
              <polygon points={seaPoly} />
            </Hatch>
            <Sketch fill="none" width={3.5}>
              <polygon points={seaPoly} />
            </Sketch>
          </>
        )}

        {/* Water (rises from pit bottom) */}
        {waterLvl > 2 && (
          <>
            <Hatch color={PASTEL.blue} gap={5} angle={3} opacity={0.82}>
              <polygon points={waterPoly} />
            </Hatch>
            {/* Ripple on water surface */}
            <line
              x1={SEA_CX - wHalfAtSurf * 0.65} y1={wSurfaceY + waveOff}
              x2={SEA_CX + wHalfAtSurf * 0.65} y2={wSurfaceY + waveOff}
              stroke="#5B8FC9" strokeWidth={2.5} strokeDasharray="14,10" opacity={0.6}
            />
            <Sketch fill="none" stroke="#5B8FC9" width={2.5}>
              <polygon points={waterPoly} />
            </Sketch>
          </>
        )}

        {/* ── Mountain / kurgan trapezoid (grows UP) ── */}
        {mtH > 1 && (
          <>
            <Hatch color={TERRACOTTA} gap={7} angle={50} opacity={0.72}>
              <polygon points={mtPoly} />
            </Hatch>
            <Sketch fill="none" width={3.5}>
              <polygon points={mtPoly} />
            </Sketch>
            {/* Grass tufts on crest */}
            {mtH > 60 && ([-32, 4, 38] as number[]).map((ox) => (
              <g key={ox} opacity={Math.min((mtH - 60) / 60, 1)}>
                <line x1={MT_CX + ox}     y1={mtCrest + 2} x2={MT_CX + ox - 6} y2={mtCrest - 18} stroke={INK} strokeWidth={2} strokeLinecap="round" />
                <line x1={MT_CX + ox + 3} y1={mtCrest + 2} x2={MT_CX + ox + 9} y2={mtCrest - 16} stroke={INK} strokeWidth={2} strokeLinecap="round" />
              </g>
            ))}
          </>
        )}

        {/* ── Rain drops ── */}
        {rainA > 0.01 && DROPS.map((d, i) => {
          const t = (frame - FRAME_DIG_END) / 30;
          const y = ((t * d.speed + d.phase) % 1) * (GROUND_Y + 60) - 25;
          return (
            <line key={i}
              x1={d.x} y1={y} x2={d.x - 4} y2={y + d.len}
              stroke="#5B8FC9" strokeWidth={1.6} strokeLinecap="round"
              opacity={d.op * rainA}
            />
          );
        })}

        {/* ── Flag pole ── */}
        {flagP > 0 && (
          <line x1={POLE_X} y1={POLE_BOT} x2={POLE_X} y2={POLE_TOP}
            stroke={INK} strokeWidth={4.5} strokeLinecap="round"
          />
        )}

        {/* ── Ukrainian flag — hatched ── */}
        {flagP > 0.05 && (() => {
          const fW  = FLAG_W * Math.min(flagP * 1.4, 1);
          const fOp = Math.min(flagP * 1.8, 1);
          const fMid = POLE_TOP + FLAG_H / 2;
          return (
            <>
              {/* Blue stripe */}
              <Hatch color="#3E6E9E" gap={5} angle={-25} opacity={fOp}>
                <rect x={POLE_X} y={POLE_TOP} width={fW} height={FLAG_H / 2} />
              </Hatch>
              <Sketch fill="none" stroke="#3E6E9E" width={2.2}>
                <rect x={POLE_X} y={POLE_TOP} width={fW} height={FLAG_H / 2} />
              </Sketch>
              {/* Yellow stripe */}
              <Hatch color={PASTEL.yellow} gap={5} angle={-25} opacity={fOp}>
                <rect x={POLE_X} y={fMid} width={fW} height={FLAG_H / 2} />
              </Hatch>
              <Sketch fill="none" stroke="#B07E2B" width={2.2}>
                <rect x={POLE_X} y={fMid} width={fW} height={FLAG_H / 2} />
              </Sketch>
            </>
          );
        })()}
      </svg>

      {/* ── Seagull ── */}
      {frame >= gS && frame <= gE && (
        <Seagull x={gullX} y={gullY} scale={1.5} facing={-1} phase={0.18} />
      )}

      {/* ── Caveman puppet ── */}
      <PuppetActor
        model={cavemanModel}
        action={caveAction}
        actionStartFrame={caveActionStartFrame}
        prevAction={cavePrevAction}
        prevActionStartFrame={cavePrevActionStartFrame}
        wobble={false}
        style={{
          position: "absolute",
          left: CAVE_X - puppetW / 2,
          top:  GROUND_Y - feetOffset,
          width:  puppetW,
          height: puppetH,
        }}
      />
    </AbsoluteFill>
  );
};
