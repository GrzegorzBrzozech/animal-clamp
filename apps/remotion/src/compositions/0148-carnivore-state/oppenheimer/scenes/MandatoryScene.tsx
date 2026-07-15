import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { BuildingPencil, INK, PaperBackground, Part, PASTEL, PencilDefs, Sketch } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

// ── Inline icons ──────────────────────────────────────────────────────────────

const RoadPencil: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
    <PencilDefs scale={2.8}/>
    {/* road surface (perspective trapezoid) */}
    <Part hatch={{ gap: 8, color: PASTEL.gray, opacity: 0.55 }}>
      <polygon points="24,6 56,6 74,74 6,74"/>
    </Part>
    {/* center dashes */}
    <Sketch width={3}>
      <line x1={40} y1={16} x2={40} y2={30}/>
      <line x1={40} y1={40} x2={40} y2={54}/>
      <line x1={40} y1={62} x2={40} y2={70}/>
    </Sketch>
  </svg>
)

const BallotPencil: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
    <PencilDefs scale={2.8}/>
    {/* ballot card going into slot */}
    <Part hatch={{ gap: 5, color: PASTEL.blue, opacity: 0.85 }}>
      <polygon points="30,4 50,4 50,28 30,28"/>
    </Part>
    <Sketch width={2.5}>
      <line x1={34} y1={13} x2={46} y2={13}/>
      <line x1={34} y1={20} x2={43} y2={20}/>
    </Sketch>
    {/* ballot box */}
    <Part hatch={{ gap: 7, color: PASTEL.yellow, opacity: 0.7 }}>
      <polygon points="8,30 72,30 72,76 8,76"/>
    </Part>
    {/* slot on top */}
    <Part hatch={{ gap: 3, cross: true, color: INK, opacity: 0.4 }}>
      <polygon points="28,27 52,27 52,34 28,34"/>
    </Part>
  </svg>
)

const XMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
    <PencilDefs scale={2.5}/>
    <Sketch width={7} stroke={colors.danger}>
      <line x1={8} y1={8} x2={52} y2={52}/>
      <line x1={52} y1={8} x2={8} y2={52}/>
    </Sketch>
  </svg>
)

// ── Row ───────────────────────────────────────────────────────────────────────

type Good = { Icon: React.FC<{ size: number }>; label: string; at: number }

const GOODS: Good[] = [
  { Icon: RoadPencil, label: 'Автотраси', at: 30 },
  { Icon: BuildingPencil, label: 'Безоплатна освіта', at: 60 },
  { Icon: BallotPencil, label: 'Вибори', at: 90 },
]

const GoodRow: React.FC<Good> = ({ Icon, label, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const rowS = spring({ fps, frame: frame - at, config: { damping: 14, mass: 0.6 } })
  const xS = spring({ fps, frame: frame - at - 15, config: { damping: 14, mass: 0.6 } })

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      transform: `translateX(${(1 - rowS) * -100}px)`,
      opacity: rowS,
    }}>
      <div style={{ flexShrink: 0 }}>
        <Icon size={190}/>
      </div>
      <span style={{
        flex: 1,
        fontSize: fontSizes.heading,
        fontWeight: fontWeights.bold,
        color: colors.text,
      }}>
        {label}
      </span>
      <div style={{ flexShrink: 0, transform: `scale(${xS})` }}>
        <XMark size={110}/>
      </div>
    </div>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────

export const MandatoryScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground/>

    <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center' }}>
      <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} align="center">
        Так <span style={{ color: colors.danger }}>ти</span> ж сам цього хочеш!..
      </AnimatedText>
    </div>

    <div style={{
      position: 'absolute',
      left: 240,
      top: 210,
      width: 1440,
      display: 'flex',
      flexDirection: 'column',
      gap: 60,
    }}>
      {GOODS.map((g) => <GoodRow key={g.label} {...g} />)}
    </div>
  </AbsoluteFill>
)
