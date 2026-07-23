/**
 * Scene template: Multi-column staggered grid
 *
 * Layout: N колонок з'являються по черзі. Кожна — великий emoji + дві фігури
 * (EmotivePerson). Між колонками — тонкі вертикальні лінії. В кінці —
 * «ґрати» (BarsOverlay) падають зверху; обличчя сумніють.
 *
 * Замінити: CATEGORIES, APPEAR_FRAMES, SMILE_AT, BARS_AT, GROUND_Y, EMOJI_Y.
 *
 * Реальний приклад: victimless-crimes/scenes/MiniScenesScene.tsx
 */
import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { EmotivePerson, INK, PaperBackground } from '~/characters'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

// ── Config ────────────────────────────────────────────────────────────────────
// Один фрейм появи на колонку — розставити по таймінгу нарації
const APPEAR_FRAMES = [0, 45, 96, 150, 204] as const
const SMILE_AT = 239   // всі усміхаються
const BARS_AT  = 325   // ґрати падають + смуток

const CATEGORIES = [
  { emoji: '💊' },
  { emoji: '❤️' },
  { emoji: '🎰' },
  { emoji: '👷' },
  { emoji: '🎁' },
] as const

const COL_W    = 1920 / CATEGORIES.length
const FIG_SIZE = 250
const GROUND_Y = 780
const EMOJI_Y  = 400

// ── Bars overlay (drops from top) ─────────────────────────────────────────────
const BAR_COUNT = 9, BAR_W = 28
const FRAME_W = 1920, FRAME_H = 1080

const BarsOverlay: React.FC<{ barsProgress: number }> = ({ barsProgress }) => {
  const barsY = interpolate(barsProgress, [0, 1], [-FRAME_H, 0], clamp)
  const gap   = (FRAME_W - BAR_COUNT * BAR_W) / (BAR_COUNT + 1)
  const bars  = Array.from({ length: BAR_COUNT }, (_, i) => gap + i * (gap + BAR_W))
  return (
    <svg style={{ position: 'absolute', left: 0, top: barsY, width: FRAME_W, height: FRAME_H, pointerEvents: 'none' }}
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}>
      <rect x={0} y={0}           width={FRAME_W} height={48} fill={INK} />
      <rect x={0} y={FRAME_H-48} width={FRAME_W} height={48} fill={INK} />
      {bars.map((x, i) => <rect key={i} x={x} y={0} width={BAR_W} height={FRAME_H} fill={INK} />)}
    </svg>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────
const Column: React.FC<{
  emoji: string
  index: number
  appearAt: number
  happyProgress: number
  sadProgress: number
}> = ({ emoji, index, appearAt, happyProgress, sadProgress }) => {
  const frame    = useCurrentFrame()
  const { fps }  = useVideoConfig()
  const colX     = index * COL_W
  const centerX  = colX + COL_W / 2
  const popIn    = spring({ fps, frame: frame - appearAt, config: { damping: 14, mass: 0.6 }, from: 0, to: 1 })
  const fig1X    = centerX - FIG_SIZE * 0.75
  const fig2X    = centerX + FIG_SIZE * 0.05
  return (
    <>
      <div style={{
        position: 'absolute', left: centerX - 40, top: EMOJI_Y,
        fontSize: 110, lineHeight: 1,
        transform: `scale(${popIn})`, transformOrigin: 'bottom center', opacity: popIn,
      }}>{emoji}</div>

      <div style={{
        position: 'absolute', left: fig1X, top: GROUND_Y - FIG_SIZE,
        transform: `scale(${popIn})`, transformOrigin: 'bottom center', opacity: popIn,
      }}>
        <EmotivePerson size={FIG_SIZE} facing={1} pose="stand" happyProgress={happyProgress} sadProgress={sadProgress} />
      </div>

      <div style={{
        position: 'absolute', left: fig2X, top: GROUND_Y - FIG_SIZE,
        transform: `scale(${popIn})`, transformOrigin: 'bottom center', opacity: popIn,
      }}>
        <EmotivePerson size={FIG_SIZE} facing={-1} pose="stand" happyProgress={happyProgress} sadProgress={sadProgress} />
      </div>
    </>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────
export const MultiColumnScene: React.FC = () => {
  const frame = useCurrentFrame()
  const happyProgress = interpolate(frame, [SMILE_AT, SMILE_AT + 20], [0, 1], clamp)
  const barsProgress  = interpolate(frame, [BARS_AT, BARS_AT + 18], [0, 1], clamp)
  const sadProgress   = interpolate(frame, [BARS_AT + 14, BARS_AT + 34], [0, 1], clamp)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Vertical separator lines between columns */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          position: 'absolute', left: i * COL_W, top: 200,
          width: 2, height: 660, background: `${INK}28`,
        }} />
      ))}

      {CATEGORIES.map((cat, i) => (
        <Column
          key={cat.emoji}
          emoji={cat.emoji}
          index={i}
          appearAt={APPEAR_FRAMES[i]}
          happyProgress={happyProgress}
          sadProgress={sadProgress}
        />
      ))}

      <BarsOverlay barsProgress={barsProgress} />
    </AbsoluteFill>
  )
}
