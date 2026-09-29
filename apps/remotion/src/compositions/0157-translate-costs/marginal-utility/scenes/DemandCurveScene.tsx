import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { BeachPencil, HousePencil, PaperBackground, RoadPencil, SandboxPencil, SandPilePencil } from '~/characters'
import { AnimatedText, DemandCurveGraph, demandQtyX, type DemandStep } from '~/components'
import { fadeIn, popIn } from '~/lib/animations'
import { colors, fontWeights } from '../paper'

/**
 * 58.8–71.5 s · Вихід до попиту і пропозиції.
 * The projection line walks down the demand schedule; with every step the price
 * falls, one more heap of sand is bought, and one more (less urgent) need gets
 * covered.
 *
 * Real VO for this scene is only 12.7 s (381 frames) — much tighter than the
 * placeholder 23 s it was originally paced for — so every cue below is
 * compressed to fit: the curve draws during sentence 1, all four price steps
 * walk down during sentence 2, and the takeaway lands with sentence 3.
 */

const STEPS: DemandStep[] = [
  { price: 9, qty: 1, label: '1-ша порція → будинок' },
  { price: 7, qty: 2, label: '2-га порція → дорога' },
  { price: 4, qty: 3, label: '3-тя порція → пісочниця' },
  { price: 2, qty: 4, label: '4-та порція → пляж' },
  { price: 1, qty: 5, label: '5-та порція → про запас' },
]

const GRAPH_W = 1080
const GRAPH_H = 520
const GRAPH_LEFT = 90
const GRAPH_TOP = 180
const MAX_QTY = 5 * 1.15

/** The needs that light up on the right as the price keeps falling. */
const NEEDS: { node: React.ReactNode; label: string; cx: number; cy: number }[] = [
  { node: <HousePencil size={150}/>, label: 'будинок', cx: 1400, cy: 300 },
  { node: <RoadPencil size={140}/>, label: 'дорога', cx: 1730, cy: 300 },
  { node: <SandboxPencil size={140}/>, label: 'пісочниця', cx: 1400, cy: 610 },
  { node: <BeachPencil size={130}/>, label: 'пляж', cx: 1730, cy: 610 },
]

export const DemandCurveScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const curveDraw = interpolate(frame, [20, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // The projection line steps down the schedule, pausing on each step. Rescaled
  // to land all 4 transitions inside the 12.7 s (381-frame) scene.
  const active = interpolate(
    frame,
    [110, 141, 165, 196, 220, 251, 275, 306, 330],
    [0, 0, 1, 1, 2, 2, 3, 3, 4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const bought = Math.floor(active + 0.001) + 1

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* heading */}
      <div style={{ position: 'absolute', left: 60, top: 32, width: 1840 }}>
        <AnimatedText size={48} weight={fontWeights.black} delay={0} align="left" maxWidth="100%">
          <span style={{ color: colors.primary }}>Теорія попиту і пропозиції</span> – наслідок теорії граничної
          корисності
        </AnimatedText>
      </div>

      {/* the demand schedule */}
      <div style={{ position: 'absolute', left: GRAPH_LEFT, top: GRAPH_TOP, opacity: fadeIn(frame, 8, 18) }}>
        <DemandCurveGraph
          steps={STEPS}
          active={active}
          curveDraw={curveDraw}
          width={GRAPH_W}
          height={GRAPH_H}
          maxQty={MAX_QTY}
          maxPrice={10.5}
          priceAxisLabel="ціна"
          qtyAxisLabel="тонн піску"
        />
      </div>

      {/* the heaps actually bought, lined up under the x-axis. Columns are only
          ~153 px apart here, so the (wide, low) heap runs small — the numbered
          pennant is what separates one unit from the next. */}
      {STEPS.map((s, i) => {
        const shown = i < bought
        const sp = popIn(frame, fps, 110 + i * 55, { damping: 13, mass: 0.7 })
        const op = shown ? sp : 0
        const left = GRAPH_LEFT + demandQtyX(s.qty, GRAPH_W, MAX_QTY) - 83
        return (
          <div
            key={s.qty}
            style={{
              position: 'absolute',
              left,
              top: 720,
              opacity: op,
              transform: `translateY(${interpolate(op, [0, 1], [-40, 0])}px)`,
            }}
          >
            <SandPilePencil size={96} label={String(s.qty)}/>
          </div>
        )
      })}

      {/* header over the needs column */}
      <div
        style={{
          position: 'absolute',
          left: 1240,
          top: 150,
          width: 620,
          textAlign: 'center',
          fontSize: 34,
          fontWeight: fontWeights.black,
          color: colors.text,
          opacity: fadeIn(frame, 120, 20),
        }}
      >
        Закриті потреби:
      </div>

      {/* the needs, covered one after another */}
      {NEEDS.map((n, i) => {
        const op = fadeIn(frame, 120 + i * 55, 20)
        const shown = active >= i - 0.15 ? op : 0
        return (
          <React.Fragment key={n.label}>
            <div
              style={{
                position: 'absolute',
                left: n.cx - 150,
                top: n.cy - 90,
                width: 300,
                height: 180,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                opacity: shown,
              }}
            >
              {n.node}
            </div>
            <div
              style={{
                position: 'absolute',
                left: n.cx - 150,
                top: n.cy + 100,
                width: 300,
                textAlign: 'center',
                fontSize: 30,
                fontWeight: fontWeights.bold,
                color: colors.textMuted,
                opacity: shown,
              }}
            >
              {n.label}
            </div>
          </React.Fragment>
        )
      })}

      {/* the takeaway */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 900, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText
          size={42}
          weight={fontWeights.bold}
          delay={280}
          align="center"
          maxWidth={1700}
          style={{ lineHeight: 1.22 }}
        >
          Чим нижча ціна — тим менш значну потребу нею закривають.{' '}
          <span style={{ color: colors.primary }}>Тому й купують більше.</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
