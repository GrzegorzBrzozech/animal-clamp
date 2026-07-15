import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const iconScale = spring({ fps, frame: frame - 10, config: { damping: 10, mass: 0.5 } })
  const glow = interpolate(frame, [20, 50, 80], [0, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 40,
      }}>
        <div style={{
          transform: `scale(${iconScale})`,
          fontSize: 160,
          filter: `drop-shadow(0 0 ${glow * 32}px ${colors.secondary})`,
        }}>
          💡
        </div>

        <AnimatedText
          size={fontSizes.heading}
          weight={fontWeights.black}
          delay={25}
          slide={0}
          align="center"
          maxWidth={1200}
        >
          Раптом чогось <span style={{ color: colors.secondary }}>схотілося</span>
        </AnimatedText>

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={50}
          slide={0}
          align="center"
          color={colors.textMuted}
        >
          і навіть знаєш чого саме
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
