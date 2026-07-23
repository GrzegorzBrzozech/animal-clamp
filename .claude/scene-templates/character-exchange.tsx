/**
 * Scene template: Character Exchange (bidirectional flying objects)
 *
 * Layout: дві фігури стоять один навпроти одного й одночасно обмінюються
 * двома предметами, що летять назустріч. Третя фігура (officer/spy) ховається
 * у тіньовому куті праворуч і реагує шоком у момент обміну.
 *
 * Замінити: FIG_SIZE, позиції, ObjA / ObjB компоненти, тексти.
 *
 * Реальний приклад: victimless-crimes/scenes/HandshakeScene.tsx
 */
import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, OfficerPencil, PaperBackground, PersonPencil } from '~/characters'
import { colors, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp)

// ── Layout ────────────────────────────────────────────────────────────────────
const FIG_SIZE = 570
const FIG_W    = Math.round(FIG_SIZE * (170 / 220))
const GROUND   = 900
const FIG_TOP  = GROUND - FIG_SIZE

const FIG1_LEFT = 380
const FIG2_LEFT = 760

// Hand positions for PersonPencil pose="present":
//   facing=1  → hand X = FIG_LEFT + Math.round((140 / 170) * FIG_W)
//   facing=-1 → hand X = FIG_LEFT + Math.round((30  / 170) * FIG_W)
//   HAND_Y    = FIG_TOP + Math.round((96 / 220) * FIG_SIZE)
const FIG1_HAND_X = FIG1_LEFT + Math.round((140 / 170) * FIG_W)
const FIG2_HAND_X = FIG2_LEFT + Math.round((30  / 170) * FIG_W)
const HAND_Y      = FIG_TOP  + Math.round((96  / 220) * FIG_SIZE)

const OFFICER_SIZE = 180
const OFFICER_LEFT = 1680

// ── Timing ────────────────────────────────────────────────────────────────────
const APPEAR_AT    = 0
const ITEM_APPEAR  = 18   // items appear at hands
const MOVE_START   = 82   // simultaneous exchange begins
const MOVE_END     = 148
const OFFICER_APPEAR = 48
const OFFICER_SHOCK  = 110

// ── Object A — flies left→right (e.g. papers / money) ────────────────────────
// Replace with your own SVG component; x/y position the center of the object.
const ObjA: React.FC<{ opacity: number; x?: number; y?: number }> = ({
  opacity, x = FIG1_HAND_X, y = HAND_Y,
}) => (
  <svg style={{ position: 'absolute', left: x - 48, top: y - 70, opacity, pointerEvents: 'none' }}
    viewBox="0 0 96 66" width={96} height={66}>
    {/* draw your object here */}
    <rect x={10} y={10} width={76} height={50} rx={4} fill="#F4E8C0" stroke={INK} strokeWidth={2.5} />
  </svg>
)

// ── Object B — flies right→left (e.g. package / goods) ───────────────────────
const PKG_W = 140, PKG_H = 118
const ObjB: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <svg style={{ position: 'absolute', left: x - PKG_W / 2, top: y - PKG_H, opacity, pointerEvents: 'none' }}
    viewBox="0 0 140 118" width={PKG_W} height={PKG_H}>
    {/* draw your object here */}
    <polygon points="8,24 132,24 132,114 8,114" fill="#D9C49A" stroke={INK} strokeWidth={2.5} />
  </svg>
)

// ── Scene ─────────────────────────────────────────────────────────────────────
export const CharacterExchangeScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const figSpring = spring({ fps, frame: frame - APPEAR_AT, config: { damping: 14, mass: 0.8 }, from: 0, to: 1 })

  // Object A: static at fig1 → fly to fig2 (arc DOWN to avoid collision with B)
  const aStaticOp   = interpolate(frame, [ITEM_APPEAR, ITEM_APPEAR+16, MOVE_START-4, MOVE_START], [0,1,1,0], clamp)
  const aMoveOp     = interpolate(frame, [MOVE_START, MOVE_START+8, MOVE_END, MOVE_END+8], [0,1,1,0], clamp)
  const aArrivedOp  = interpolate(frame, [MOVE_END, MOVE_END+14], [0, 1], clamp)

  // Object B: static at fig2 → fly to fig1 (arc UP)
  const bStaticOp   = interpolate(frame, [ITEM_APPEAR, ITEM_APPEAR+14, MOVE_START-4, MOVE_START], [0,1,1,0], clamp)
  const bMoveOp     = interpolate(frame, [MOVE_START, MOVE_START+8], [0, 1], clamp)

  const moveT = interpolate(frame, [MOVE_START, MOVE_END], [0, 1], clamp)
  const aX    = interpolate(moveT, [0, 1], [FIG1_HAND_X, FIG2_HAND_X])
  const aArcY = interpolate(moveT, [0, 0.5, 1], [0, +60, 0])  // arc down
  const bX    = interpolate(moveT, [0, 1], [FIG2_HAND_X, FIG1_HAND_X])
  const bArcY = interpolate(moveT, [0, 0.5, 1], [0, -80, 0])  // arc up

  // Officer shock
  const officerSpring = spring({ fps, frame: frame - OFFICER_APPEAR, config: { damping: 20, mass: 1.2 }, from: 0, to: 1 })
  const shockSpring   = spring({ fps, frame: frame - OFFICER_SHOCK,  config: { damping: 7,  mass: 0.5 }, from: 0, to: 1 })
  const jumpY         = interpolate(shockSpring, [0, 1], [0, -50])
  const shockOp       = fade(frame, OFFICER_SHOCK, 12)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Shadow overlay — officer hiding spot (right edge) */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: 400, height: '100%',
        background: 'linear-gradient(to right, transparent 0%, #00000045 60%, #00000066 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ground line */}
      <div style={{ position: 'absolute', left: 0, top: GROUND, width: 1920, height: 3,
        background: `${INK}44`, opacity: fade(frame, 8, 20) }} />

      {/* Figure 1 — left, facing right */}
      <div style={{ position: 'absolute', left: FIG1_LEFT, top: FIG_TOP,
        transform: `scale(${figSpring})`, transformOrigin: 'bottom center', opacity: figSpring }}>
        <PersonPencil size={FIG_SIZE} facing={1} pose="present" />
      </div>

      {/* Figure 2 — right, facing left */}
      <div style={{ position: 'absolute', left: FIG2_LEFT, top: FIG_TOP,
        transform: `scale(${figSpring})`, transformOrigin: 'bottom center', opacity: figSpring }}>
        <PersonPencil size={FIG_SIZE} facing={-1} pose="present" />
      </div>

      {/* Object A: static → flying → arrived */}
      <ObjA opacity={aStaticOp * figSpring} x={FIG1_HAND_X} y={HAND_Y} />
      <ObjA opacity={aMoveOp   * figSpring} x={aX}          y={HAND_Y + aArcY} />
      <ObjA opacity={aArrivedOp * figSpring} x={FIG2_HAND_X} y={HAND_Y} />

      {/* Object B: static → flying (no arrived needed unless you want it) */}
      <ObjB x={FIG2_HAND_X} y={HAND_Y} opacity={bStaticOp * figSpring} />
      <ObjB x={bX}          y={HAND_Y + bArcY} opacity={bMoveOp * figSpring} />

      {/* Officer — hidden in shadow, shocked mid-transfer */}
      <div style={{
        position: 'absolute', left: OFFICER_LEFT,
        top: GROUND - OFFICER_SIZE + Math.round(jumpY),  // ALWAYS: top = GROUND - SIZE
        opacity: officerSpring * 0.62,
        transform: `scale(${officerSpring})`, transformOrigin: 'bottom center',
      }}>
        <OfficerPencil size={OFFICER_SIZE} facing={-1} pose="stand" baton={false} />
        <div style={{
          position: 'absolute', top: -64, left: '50%', transform: 'translateX(-50%)',
          opacity: shockOp, fontSize: 64, fontWeight: fontWeights.black, color: colors.danger,
        }}>!</div>
      </div>
    </AbsoluteFill>
  )
}
