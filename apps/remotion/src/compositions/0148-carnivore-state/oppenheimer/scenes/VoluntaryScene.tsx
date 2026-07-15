import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, PAPER, PASTEL, PaperBackground, Part, PencilDefs, PersonPencil, Sketch } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

const ChipsBag: React.FC<{ size?: number }> = ({ size = 100 }) => {
  const w = Math.round(size * 0.7)
  return (
    <svg width={w} height={size} viewBox="0 0 70 100" style={{ overflow: 'visible' }}>
      <PencilDefs scale={2.5} />
      <Part hatch={{ gap: 5, color: PASTEL.yellow, opacity: 0.9 }}>
        <polygon points="6,10 64,10 70,100 0,100" />
      </Part>
      <Part hatch={{ gap: 4, color: PASTEL.pink, opacity: 0.85 }}>
        <polygon points="4,35 66,35 67,62 3,62" />
      </Part>
      <Sketch width={3}>
        <polyline points="6,10 64,10" />
        <polyline points="10,17 60,17" />
        <polyline points="8,24 62,24" />
      </Sketch>
    </svg>
  )
}

// Person: size=480, viewBox 170×220
const PERSON_SIZE = 480
const PERSON_W = PERSON_SIZE * (170 / 220) // ≈ 185.5
const PERSON_X = 460
const PERSON_Y = 360

// "present" pose hand anchor in viewBox (140, 96) → absolute pixels
const HAND_X = PERSON_X + (140 / 170) * PERSON_W  // ≈ 613
const HAND_Y = PERSON_Y + (96 / 220) * PERSON_SIZE  // ≈ 465

const BAG_W = 70  // ChipsBag size=100 → w=70
const BAG_H = 100

const CHIPS_SHELF_X = 1090
const CHIPS_SHELF_Y = 405
const CHIPS_HAND_X = HAND_X - BAG_W / 2
const CHIPS_HAND_Y = HAND_Y - BAG_H * 0.75

export const VoluntaryScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const shelfIn   = spring({ fps, frame,          config: { damping: 13 } })
  const personIn  = spring({ fps, frame: frame - 8, config: { damping: 13 } })

  // chips: shelf → hand (28-52), hand → shelf (102-128)
  const toHand    = interpolate(frame, [28, 52],   [0, 1], clamp)
  const fromHand  = interpolate(frame, [102, 128], [0, 1], clamp)
  const chipsP    = fromHand > 0 ? 1 - fromHand : toHand  // 0=shelf, 1=hand

  const chipsX  = CHIPS_SHELF_X + (CHIPS_HAND_X - CHIPS_SHELF_X) * chipsP
  const chipsY  = CHIPS_SHELF_Y + (CHIPS_HAND_Y - CHIPS_SHELF_Y) * chipsP
  const chipsRot = chipsP * 25 - 5

  // speech bubble: pops in at 58, disappears at 130
  const bubbleIn  = spring({ fps, frame: frame - 58, config: { damping: 11, mass: 0.5 } })
  const bubbleOut = interpolate(frame, [128, 140], [1, 0], clamp)
  const bubbleS   = Math.min(bubbleIn, bubbleOut)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* shelf */}
      <div style={{
        position: 'absolute',
        left: 880,
        top: 425,
        transform: `scale(${shelfIn})`,
        transformOrigin: 'bottom center',
        opacity: shelfIn,
      }}>
        <svg width={620} height={300} style={{ overflow: 'visible' }}>
          <PencilDefs scale={3} />
          <Part hatch={{ gap: 10, color: PASTEL.gray, opacity: 0.35 }}>
            <polygon points="0,0 620,0 620,95 0,95" />
          </Part>
          <Part hatch={{ gap: 6, color: PASTEL.brown, opacity: 0.75 }}>
            <polygon points="0,95 620,95 612,125 8,125" />
          </Part>
          <Sketch width={7}>
            <line x1={30}  y1={125} x2={18}  y2={295} />
            <line x1={590} y1={125} x2={602} y2={295} />
          </Sketch>
          {/* other products to the right of the chips slot */}
          <Part hatch={{ gap: 6, color: PASTEL.blue, opacity: 0.85 }}>
            <polygon points="280,15 360,15 360,93 280,93" />
          </Part>
          <Sketch width={3}>
            <line x1={290} y1={30} x2={350} y2={30} />
            <line x1={290} y1={45} x2={350} y2={45} />
          </Sketch>
          <Part hatch={{ gap: 6, color: PASTEL.green, opacity: 0.85 }}>
            <polygon points="380,22 455,22 455,93 380,93" />
          </Part>
          <Part hatch={{ gap: 6, color: PASTEL.pink, opacity: 0.85 }}>
            <polygon points="475,10 545,10 545,93 475,93" />
          </Part>
        </svg>
      </div>

      {/* person */}
      <div style={{
        position: 'absolute',
        left: PERSON_X,
        top: PERSON_Y,
        transform: `scale(${personIn})`,
        transformOrigin: 'bottom center',
        opacity: personIn,
      }}>
        <PersonPencil size={PERSON_SIZE} facing={1} pose="present" />
      </div>

      {/* chips bag — animated between shelf and hand */}
      <div style={{
        position: 'absolute',
        left: chipsX,
        top: chipsY,
        transform: `rotate(${chipsRot}deg)`,
      }}>
        <ChipsBag size={100} />
      </div>

      {/* speech bubble */}
      {bubbleS > 0.02 && (
        <div style={{
          position: 'absolute',
          left: PERSON_X + PERSON_W - 10,
          top: PERSON_Y - 110,
          transform: `scale(${bubbleS})`,
          transformOrigin: 'bottom left',
        }}>
          <div style={{
            position: 'relative',
            background: PAPER,
            border: `5px solid ${INK}`,
            borderRadius: 22,
            padding: '18px 26px',
            boxShadow: `3px 3px 0 ${INK}`,
          }}>
            <div style={{
              fontSize: fontSizes.body,
              fontWeight: fontWeights.black,
              color: colors.text,
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
            }}>
              {'Йой, я жирний, %@*#&^$'}
            </div>
            {/* tail: points down-left toward character mouth */}
            <div style={{
              position: 'absolute',
              bottom: -32,
              left: 14,
              width: 0,
              height: 0,
              borderRight: '32px solid transparent',
              borderTop: `32px solid ${INK}`,
            }} />
            <div style={{
              position: 'absolute',
              bottom: -22,
              left: 20,
              width: 0,
              height: 0,
              borderRight: '24px solid transparent',
              borderTop: `24px solid ${PAPER}`,
            }} />
          </div>
        </div>
      )}

      {/* title */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="90%">
          Жерти чи <span style={{ color: colors.success }}>не жерти</span>
        </AnimatedText>
      </div>

      {/* subtitle */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={55} slide={0}
                      color={colors.textMuted} align="center">
          от в чому питання!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
