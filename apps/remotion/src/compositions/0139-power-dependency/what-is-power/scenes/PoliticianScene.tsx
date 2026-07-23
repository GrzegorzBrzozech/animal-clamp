import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import {
  EmotivePerson,
  Guillotine,
  INK,
  MilitaryPencil,
  OfficerPencil,
  PaperBackground,
  PoliticianPencil,
} from '~/characters'
import { colors, fontWeights } from '../paper'

const fade = (f: number, s: number, d = 20) =>
  interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

// Guillotine display size: 2× viewBox (160×340) = 320×680
const GUIL_H = 680
const GUIL_W = 320

// ── Military figure with spring appear ───────────────────────────────────────
const MilitaryAppear: React.FC<{ size: number; facing?: 1 | -1; at: number; left: number; top: number }> = ({
  size, facing = -1, at, left, top,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 14, mass: 0.9 }, from: 0, to: 1 })
  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      transform: `scale(${s})`,
      transformOrigin: 'bottom center',
      opacity: s,
    }}>
      <MilitaryPencil size={size} facing={facing} pose="stand"/>
    </div>
  )
}

// ── One crowd person:
//   appears sad, faces RIGHT (officers); turns LEFT (politician); becomes neutral
const CrowdPerson: React.FC<{
  left: number; top: number; size: number; delay: number; turnAt: number; neutralAt: number;
}> = ({ left, top, size, delay, turnAt, neutralAt }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const appear = spring({ fps, frame: frame - delay, config: { damping: 18 }, from: 0, to: 1 })
  const turnProgress = interpolate(frame, [turnAt, turnAt + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // sadness starts at 1 (sad), springs to 0 (neutral) at neutralAt
  const sadness = spring({ fps, frame: frame - neutralAt, config: { damping: 15 }, from: 1, to: 0 })

  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      transform: `scale(${appear})`,
      transformOrigin: 'bottom center',
      opacity: appear,
    }}>
      {/* Before turn: facing RIGHT toward officers */}
      <div style={{ position: 'absolute', opacity: 1 - turnProgress }}>
        <EmotivePerson size={size} facing={1} pose="stand" sadProgress={sadness}/>
      </div>
      {/* After turn: facing LEFT toward politician */}
      <div style={{ position: 'absolute', opacity: turnProgress }}>
        <EmotivePerson size={size} facing={-1} pose="stand" sadProgress={sadness}/>
      </div>
    </div>
  )
}

// ── Timing: crowd first → officers+guillotine → politician ───────────────────
// crowd: delays 4-22  (~0.1–0.7s)
// officers+guillotine: ~1.6s
// politician: ~2.9s → people turn + go neutral
const OFFICER_AT    = 48
const MILITARY_AT   = 63
const GUILLOTINE_AT = 63
const POLITICIAN_AT = 88

const FRONT_SIZE = 224
const BACK_SIZE = 192
const GROUND = 760
const FRONT_TOP = GROUND - FRONT_SIZE
const BACK_TOP = GROUND - BACK_SIZE - 12

const FRONT_ROW = [
  { left: 350, delay: 4,  turnAt: POLITICIAN_AT + 8,  neutralAt: POLITICIAN_AT + 12 },
  { left: 450, delay: 7,  turnAt: POLITICIAN_AT + 11, neutralAt: POLITICIAN_AT + 15 },
  { left: 550, delay: 10, turnAt: POLITICIAN_AT + 6,  neutralAt: POLITICIAN_AT + 10 },
  { left: 650, delay: 5,  turnAt: POLITICIAN_AT + 13, neutralAt: POLITICIAN_AT + 17 },
  { left: 750, delay: 9,  turnAt: POLITICIAN_AT + 15, neutralAt: POLITICIAN_AT + 19 },
  { left: 850, delay: 13, turnAt: POLITICIAN_AT + 5,  neutralAt: POLITICIAN_AT + 9  },
  { left: 950, delay: 6,  turnAt: POLITICIAN_AT + 17, neutralAt: POLITICIAN_AT + 21 },
]
const BACK_ROW = [
  { left: 400, delay: 15, turnAt: POLITICIAN_AT + 7,  neutralAt: POLITICIAN_AT + 11 },
  { left: 500, delay: 18, turnAt: POLITICIAN_AT + 10, neutralAt: POLITICIAN_AT + 14 },
  { left: 600, delay: 22, turnAt: POLITICIAN_AT + 4,  neutralAt: POLITICIAN_AT + 8  },
  { left: 700, delay: 16, turnAt: POLITICIAN_AT + 12, neutralAt: POLITICIAN_AT + 16 },
  { left: 800, delay: 20, turnAt: POLITICIAN_AT + 14, neutralAt: POLITICIAN_AT + 18 },
  { left: 900, delay: 12, turnAt: POLITICIAN_AT + 16, neutralAt: POLITICIAN_AT + 20 },
]

// ── Scene ─────────────────────────────────────────────────────────────────────
export const PoliticianScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const guilS = spring({ fps, frame: frame - GUILLOTINE_AT, config: { damping: 13, mass: 0.95 }, from: 0, to: 1 })
  const polOp = fade(frame, POLITICIAN_AT, 22)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Politician */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: GROUND - 470,
          transform: `scale(${polOp})`,
          transformOrigin: 'bottom center',
          opacity: polOp,
        }}
      >
        <PoliticianPencil size={470} facing={1} pose="megaphone" tribune={false}/>
      </div>

      {/* Back row */}
      {BACK_ROW.map((p, i) => (
        <CrowdPerson key={`b${i}`} left={p.left} top={BACK_TOP} size={BACK_SIZE} delay={p.delay} turnAt={p.turnAt}
                     neutralAt={p.neutralAt}/>
      ))}

      {/* Front row */}
      {FRONT_ROW.map((p, i) => (
        <CrowdPerson key={`f${i}`} left={p.left} top={FRONT_TOP} size={FRONT_SIZE} delay={p.delay} turnAt={p.turnAt}
                     neutralAt={p.neutralAt}/>
      ))}

      {/* Ground line + earth hatching */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="earthHatchPol" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={INK} strokeWidth="1.8" />
          </pattern>
          <linearGradient id="earthFadePol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="earthMaskPol">
            <rect x="0" y={GROUND} width="1920" height={1080 - GROUND} fill="url(#earthFadePol)" />
          </mask>
        </defs>
        <line x1={50} y1={GROUND} x2={1860} y2={GROUND} stroke={`${INK}55`} strokeWidth={3} opacity={fade(frame, 18, 20)} />
        <rect
          x="0" y={GROUND} width="1920" height={1080 - GROUND}
          fill="url(#earthHatchPol)"
          fillOpacity={0.28}
          mask="url(#earthMaskPol)"
          opacity={fade(frame, 18, 20)}
        />
      </svg>

      {/* Officer — appears first on right */}
      <div
        style={{
          position: 'absolute',
          left: 1100,
          top: GROUND - 350,
          transform: `scale(${fade(frame, OFFICER_AT, 22)})`,
          transformOrigin: 'bottom center',
          opacity: fade(frame, OFFICER_AT, 22),
        }}
      >
        <OfficerPencil size={350} facing={-1} pose="present"/>
      </div>
      <div style={{
        position: 'absolute',
        left: 983,
        width: 160,
        top: GROUND - 204,
        opacity: fade(frame, OFFICER_AT + 18, 15),
        fontSize: 20,
        fontWeight: fontWeights.bold,
        color: colors.textMuted,
        textAlign: 'center' as const,
      }}>
      </div>

      {/* Military */}
      <MilitaryAppear size={350} facing={-1} at={MILITARY_AT} left={1270} top={GROUND - 350}/>
      <div style={{
        position: 'absolute',
        left: 1238,
        width: 160,
        top: GROUND - 204,
        opacity: fade(frame, MILITARY_AT + 18, 15),
        fontSize: 20,
        fontWeight: fontWeights.bold,
        color: colors.textMuted,
        textAlign: 'center' as const,
      }}>
      </div>

      {/* Guillotine — shared library component, springs in from bottom */}
      <div style={{
        position: 'absolute',
        right: 50,
        top: GROUND - GUIL_H + 55,
        transform: `scaleY(${guilS})`,
        transformOrigin: 'bottom center',
        opacity: guilS,
      }}>
        <Guillotine style={{ position: 'static', width: GUIL_W, height: GUIL_H }} />
      </div>
      <div style={{
        position: 'absolute',
        right: 76,
        top: GROUND,
        opacity: fade(frame, GUILLOTINE_AT + 20, 15),
        fontSize: 20,
        fontWeight: fontWeights.bold,
        color: colors.danger,
        textAlign: 'center' as const,
      }}>
      </div>

    </AbsoluteFill>
  )
}
