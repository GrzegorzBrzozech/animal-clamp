import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, OfficerPencil, PaperBackground, PencilDefs, PersonPencil } from '~/characters'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp)

// ── Layout ────────────────────────────────────────────────────────────────────
const FIG_SIZE = 570
const FIG_W = Math.round(FIG_SIZE * (170 / 220)) // ≈440px
const GROUND = 900
const FIG_TOP = GROUND - FIG_SIZE // 330

const FIG1_LEFT = 380  // fig1 right edge ≈ 520
const FIG2_LEFT = 760 // fig2 right edge ≈ 1200

// Hand positions for pose="present":
// facing=1 → vbx=140/170; facing=-1 → vbx=30/170 (mirrored)
const FIG1_HAND_X = FIG1_LEFT + Math.round((140 / 170) * FIG_W) // ≈ 443
const FIG2_HAND_X = FIG2_LEFT + Math.round((30 / 170) * FIG_W)  // ≈ 838
const HAND_Y = FIG_TOP + Math.round((96 / 220) * FIG_SIZE)       // ≈ 579

const OFFICER_SIZE = 180
const OFFICER_LEFT = 1680

// ── Timing ────────────────────────────────────────────────────────────────────
const APPEAR_AT = 0
const PKG_APPEAR = 18       // package at fig2's hand
const PKG_MOVE_START = 82   // package flies toward fig1
const PKG_MOVE_END = 148
const OFFICER_APPEAR = 48
const OFFICER_SHOCK = 110   // officer shocked mid-transfer

// ── Papers (stack of banknotes / documents) ───────────────────────────────────
const Papers: React.FC<{ opacity: number; x?: number; y?: number }> = ({
  opacity,
  x = FIG1_HAND_X,
  y = HAND_Y,
}) => {
  const cx = x - 10
  const cy = y - 40
  return (
    <svg
      style={{ position: 'absolute', left: cx - 48, top: cy - 30, pointerEvents: 'none', opacity }}
      viewBox="0 0 96 66"
      width={96}
      height={66}
    >
      <PencilDefs scale={2}/>
      {/* three overlapping paper sheets */}
      <rect x={4} y={14} width={52} height={44} rx={3} fill="#F8F0D8" stroke={INK} strokeWidth={2}
            transform="rotate(-12 30 36)"/>
      <rect x={14} y={10} width={52} height={44} rx={3} fill="#F4E8C0" stroke={INK} strokeWidth={2}
            transform="rotate(-4 40 32)"/>
      <rect x={24} y={8} width={52} height={44} rx={3} fill="#EDE7D6" stroke={INK} strokeWidth={2.5}/>
      {/* lines on top paper */}
      <line x1={30} y1={20} x2={70} y2={20} stroke={INK} strokeWidth={1.5}/>
      <line x1={30} y1={28} x2={70} y2={28} stroke={INK} strokeWidth={1.5}/>
      <line x1={30} y1={36} x2={60} y2={36} stroke={INK} strokeWidth={1.5}/>
    </svg>
  )
}

// ── Package ───────────────────────────────────────────────────────────────────
const PKG_W = 140
const PKG_H = 118

const PackageSvg: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <svg
    style={{ position: 'absolute', left: x - PKG_W / 2, top: y - PKG_H, pointerEvents: 'none', opacity }}
    viewBox="0 0 140 118"
    width={PKG_W}
    height={PKG_H}
  >
    <PencilDefs scale={2.5}/>
    <polygon points="8,24 132,24 132,114 8,114" fill="#D9C49A" stroke={INK} strokeWidth={2.5}/>
    <polygon points="2,10 138,10 132,24 8,24" fill="#C8A85A" stroke={INK} strokeWidth={2.5}/>
    <line x1={8} y1={69} x2={132} y2={69} stroke={INK} strokeWidth={3}/>
    <line x1={70} y1={24} x2={70} y2={114} stroke={INK} strokeWidth={3}/>
    <path d="M 48,24 Q 70,8 92,24" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round"/>
  </svg>
)

// ── Scene ─────────────────────────────────────────────────────────────────────
export const HandshakeScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Both figures appear simultaneously
  const figSpring = spring({ fps, frame: frame - APPEAR_AT, config: { damping: 14, mass: 0.8 }, from: 0, to: 1 })
  const groundOp = fade(frame, 8, 20)

  // Papers: static at fig1 hand, then fly to fig2 simultaneously with incoming package
  const papersStaticOp = interpolate(frame, [PKG_APPEAR, PKG_APPEAR + 16, PKG_MOVE_START - 4, PKG_MOVE_START], [0, 1, 1, 0], clamp)
  const papersMoveOp = interpolate(frame, [PKG_MOVE_START, PKG_MOVE_START + 8, PKG_MOVE_END, PKG_MOVE_END + 8], [0, 1, 1, 0], clamp)
  const papersArrivedOp = interpolate(frame, [PKG_MOVE_END, PKG_MOVE_END + 14], [0, 1], clamp)

  // Package: static at fig2, then flies to fig1
  const pkgStaticOp = interpolate(frame, [PKG_APPEAR, PKG_APPEAR + 14, PKG_MOVE_START - 4, PKG_MOVE_START], [0, 1, 1, 0], clamp)
  const moveT = interpolate(frame, [PKG_MOVE_START, PKG_MOVE_END], [0, 1], clamp)
  const pkgMoveOp = interpolate(frame, [PKG_MOVE_START, PKG_MOVE_START + 8], [0, 1], clamp)
  // Package: right → left
  const pkgX = interpolate(moveT, [0, 1], [FIG2_HAND_X, FIG1_HAND_X])
  const pkgArcY = interpolate(moveT, [0, 0.5, 1], [0, -80, 0])
  // Papers: left → right (opposite direction, arcs lower to avoid collision)
  const papersX = interpolate(moveT, [0, 1], [FIG1_HAND_X, FIG2_HAND_X])
  const papersArcY = interpolate(moveT, [0, 0.5, 1], [0, 60, 0])

  // Officer
  const officerSpring = spring({
    fps,
    frame: frame - OFFICER_APPEAR,
    config: { damping: 20, mass: 1.2 },
    from: 0,
    to: 1,
  })
  const shockSpring = spring({ fps, frame: frame - OFFICER_SHOCK, config: { damping: 7, mass: 0.5 }, from: 0, to: 1 })
  const jumpY = interpolate(shockSpring, [0, 1], [0, -50])
  const shockOp = fade(frame, OFFICER_SHOCK, 12)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Dark shadow covering right 400px — officer's hiding spot */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 400,
          height: '100%',
          background: 'linear-gradient(to right, transparent 0%, #00000045 60%, #00000066 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: fade(frame, 5, 22),
        }}
      >
        <span
          style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: colors.text, letterSpacing: 2 }}>
          Злочин <span style={{ color: colors.danger }}>без постраждалого</span>
        </span>
      </div>

      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: GROUND,
          width: 1920,
          height: 3,
          background: `${INK}44`,
          opacity: groundOp,
        }}
      />

      {/* Figure 1 — left, facing right, arm extended (holds papers) */}
      <div
        style={{
          position: 'absolute',
          left: FIG1_LEFT,
          top: FIG_TOP,
          transform: `scale(${figSpring})`,
          transformOrigin: 'bottom center',
          opacity: figSpring,
        }}
      >
        <PersonPencil size={FIG_SIZE} facing={1} pose="present"/>
      </div>

      {/* Figure 2 — right, facing left, arm extended (holds package) */}
      <div
        style={{
          position: 'absolute',
          left: FIG2_LEFT,
          top: FIG_TOP,
          transform: `scale(${figSpring})`,
          transformOrigin: 'bottom center',
          opacity: figSpring,
        }}
      >
        <PersonPencil size={FIG_SIZE} facing={-1} pose="present"/>
      </div>

      {/* Papers: static at fig1 before exchange */}
      <Papers opacity={papersStaticOp * figSpring} x={FIG1_HAND_X} y={HAND_Y}/>
      {/* Papers: flying left→right simultaneously with package right→left */}
      <Papers opacity={papersMoveOp * figSpring} x={papersX} y={HAND_Y + papersArcY}/>
      {/* Papers: arrived at fig2 after exchange */}
      <Papers opacity={papersArrivedOp * figSpring} x={FIG2_HAND_X} y={HAND_Y}/>

      {/* Package: static at fig2 */}
      <PackageSvg x={FIG2_HAND_X} y={HAND_Y} opacity={pkgStaticOp * figSpring}/>

      {/* Package: in flight toward fig1 */}
      <PackageSvg x={pkgX} y={HAND_Y + pkgArcY} opacity={pkgMoveOp * figSpring}/>

      {/* Officer — in shadow at bottom-right */}
      <div
        style={{
          position: 'absolute',
          left: OFFICER_LEFT,
          top: GROUND - OFFICER_SIZE + Math.round(jumpY),
          opacity: officerSpring * 0.62,
          transform: `scale(${officerSpring})`,
          transformOrigin: 'bottom center',
        }}
      >
        <OfficerPencil size={OFFICER_SIZE} facing={-1} pose="stand" baton={false}/>

        {/* Exclamation */}
        <div
          style={{
            position: 'absolute',
            top: -64,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: shockOp,
            fontSize: 64,
            fontWeight: fontWeights.black,
            color: colors.danger,
            textShadow: '0 2px 8px #00000044',
          }}
        >
          !
        </div>
      </div>
    </AbsoluteFill>
  )
}
