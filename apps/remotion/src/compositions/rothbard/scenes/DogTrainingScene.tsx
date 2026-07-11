import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { INK } from '~/characters/svg/_pencil'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const Card: React.FC<{ icon: string; top: string; bottom: string; color: string; at: number; x: number }> = ({
  icon,
  top,
  bottom,
  color,
  at,
  x,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 13, mass: 0.6 } })
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 380,
        transform: `translate(-50%,-50%) scale(${s})`,
        opacity: s,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        background: colors.surface,
        border: `5px solid ${color}`,
        borderRadius: 22,
        padding: '30px 40px',
        width: 460,
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 800, color: colors.textMuted }}>{top}</span>
      <span style={{ fontSize: 88 }}>{icon}</span>
      <span style={{ fontSize: fontSizes.body, fontWeight: 900, color, textAlign: 'center' }}>{bottom}</span>
    </div>
  )
}

export const DogTrainingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const arrow = interpolate(frame, [80, 105], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <Card icon="🐕" top="2026" bottom="дресування собак" color={colors.secondary} at={16} x={1360}/>
      <Card icon="🎖️" top="1763" bottom="підготовка до служби" color={colors.primary} at={97}
            x={560}/>

      {/* equals sign between them */}
      <div style={{
        position: 'absolute',
        left: 960,
        top: 380,
        transform: 'translate(-50%,-50%)',
        fontSize: 90,
        fontWeight: 900,
        color: INK,
        opacity: interpolate(frame, [64, 80], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        =
      </div>

      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 250,
        display: 'flex',
        justifyContent: 'center',
        opacity: arrow,
      }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={178} slide={0}>
          Дисципліну - <span style={{ color: colors.danger }}>людям</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
