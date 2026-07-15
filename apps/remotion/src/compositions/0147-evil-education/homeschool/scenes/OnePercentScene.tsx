import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const COLS = 20
const ROWS = 5
const TOTAL = COLS * ROWS // 100 families

export const OnePercentScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const numIn = spring({ fps, frame: frame - 40, config: { damping: 12, mass: 0.6 } })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="92%">
          Хто обирає цей шлях?
        </AnimatedText>
      </div>

      {/* 100 families — one of them highlighted */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 350,
          transform: 'translateX(-50%)',
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 60px)`,
          gap: 8,
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => {
          const isChosen = i === 42
          const on = interpolate(frame, [10 + (i % COLS) * 1.5, 24 + (i % COLS) * 1.5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const pop = isChosen ? spring({ fps, frame: frame - 70, config: { damping: 9 } }) : 1
          return (
            <span
              key={i}
              style={{
                fontSize: 44,
                opacity: isChosen ? on : on * 0.28,
                filter: isChosen ? 'none' : 'grayscale(1)',
                transform: `scale(${isChosen ? 1 + pop * 0.25 : 1})`,
              }}
            >
              🏠
            </span>
          )
        })}
      </div>

      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 90,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: 24,
        opacity: numIn,
      }}>
        <span style={{
          fontSize: 150,
          fontWeight: 900,
          color: colors.danger,
          transform: `scale(${numIn})`,
        }}>&lt;&nbsp;1%</span>
        <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.textMuted }}>
          сімей в Україні
        </span>
      </div>
    </AbsoluteFill>
  )
}
