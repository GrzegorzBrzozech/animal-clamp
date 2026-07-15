import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { BuildingPencil, HeadPencil, PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const COLS = 7
const ROWS = 2
const TOTAL = COLS * ROWS

export const SovietScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const instIn = spring({ fps, frame: frame - 10, config: { damping: 13 } })
  const rays = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* the single institution up top */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 320,
        transform: `translate(-50%,-50%) scale(${instIn})`,
        opacity: instIn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <BuildingPencil size={200} color="#D3A6A0"/>
      </div>

      {/* rays of control fanning down to identical heads */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%"
           style={{ position: 'absolute', inset: 0, opacity: rays * 0.7 }}>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          const tx = 360 + col * 200
          const ty = 640 + row * 190
          return <line key={i} x1={960} y1={360} x2={tx} y2={ty} stroke={colors.danger} strokeWidth={2.5}
                       strokeDasharray="6 8"/>
        })}
      </svg>

      {/* the uniform masses */}
      {Array.from({ length: TOTAL }).map((_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const s = spring({ fps, frame: frame - (30 + i * 6), config: { damping: 13, mass: 0.5 } })
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 360 + col * 200,
              top: 640 + row * 190,
              transform: `translate(-50%,-50%) scale(${s})`,
              opacity: s,
            }}
          >
            <HeadPencil size={140} color="#BFC2BE"/>
          </div>
        )
      })}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="94%">
          Міністерство освіти (і <span style={{ color: colors.danger }}>партія.com</span>, звісно)
        </AnimatedText>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={150} slide={0} color={colors.textMuted}
                      maxWidth="86%">
          Ану, подумай щось на державному!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
