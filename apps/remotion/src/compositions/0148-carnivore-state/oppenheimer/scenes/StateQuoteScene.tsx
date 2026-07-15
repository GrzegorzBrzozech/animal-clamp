import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { OfficerPencil, PaperBackground, PoliticianPencil } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export const StateQuoteScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const barIn        = interpolate(frame, [10, 35],   [0, 1], clamp)
  const politicianIn = spring({ fps, frame: frame - 62,  config: { damping: 13 } })
  const officerIn    = spring({ fps, frame: frame - 80, config: { damping: 13 } })

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Portrait */}
      <div style={{ position: 'absolute', left: 400, top: 170, transform: 'translateX(-50%)' }}>
        <PhotoPin
          src="projects/oppenheimer/00-00_franz-oppenheimer-portrait.jpg"
          width={600}
          height={720}
          delay={6}
          rotate={-3}
          caption="Франц Оппенгаймер"
        />
      </div>

      {/* Quote block */}
      <div style={{ position: 'absolute', left: 750, top: 240, width: 1100, display: 'flex', gap: 28 }}>
        <div style={{
          width: 10,
          background: colors.danger,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: 'top',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: 140,
            lineHeight: 0.6,
            color: colors.danger,
            fontWeight: 900,
            opacity: barIn,
            display: 'block',
          }}>"</span>

          <AnimatedText size={56} weight={fontWeights.black} delay={18} align="left" maxWidth={1000}
                        style={{ marginTop: -24 }}>
            Держава є{' '}
            <span style={{ color: colors.danger }}>організацією</span>
            {'\n'}політичних засобів
          </AnimatedText>

          <div style={{ height: 28 }} />
          <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={70} align="left" maxWidth={1000}
                        color={colors.textMuted}>
            — Франц Оппенгаймер, «Der Staat», 1908
          </AnimatedText>
        </div>
      </div>

      {/* Politician at lectern */}
      <div style={{
        position: 'absolute',
        left: 950,
        top: 650,
        transform: `scale(${politicianIn})`,
        transformOrigin: 'bottom center',
        opacity: politicianIn,
      }}>
        <PoliticianPencil size={250} facing={1} pose="stand" />
      </div>

      {/* Police officer with baton */}
      <div style={{
        position: 'absolute',
        left: 1340,
        top: 700,
        transform: `scale(${officerIn})`,
        transformOrigin: 'bottom center',
        opacity: officerIn,
      }}>
        <OfficerPencil size={250} facing={-1} pose="present" />
      </div>
    </AbsoluteFill>
  )
}
