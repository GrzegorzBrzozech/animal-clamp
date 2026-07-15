import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const ThesisScene: React.FC = () => {
  const frame = useCurrentFrame()
  const strike = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Rothbard portrait — upper-left, slightly smaller to make room for book */}
      <div style={{ position: 'absolute', left: 300, top: 180, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/00-00_rothbard-portrait.jpg" width={310} height={390} delay={110} rotate={-4}
                  caption="Мюррей Ротбард" date="1926–1995"/>
      </div>

      {/* Book cover — slides in slightly after portrait */}
      <div style={{ position: 'absolute', left: 630, top: 300, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/book-cover.jpg" width={340} height={440} delay={160} rotate={3} hold="pin"/>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 850, width: 1000 }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={160} align="left" maxWidth={960}
                      color={colors.textMuted}>
          «Освіта: вільна і обов'язкова»
        </AnimatedText>
      </div>

      <div style={{ height: 40 }}/>
      <div style={{ position: 'absolute', left: 940, top: 300, width: 1000 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={0} align="left" maxWidth={960}>
          Державна освіта - обовʼязкова!
        </AnimatedText>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 20 }}>
          <div style={{
            position: 'relative',
            opacity: interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            <span style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: colors.textMuted }}>📚 дамо знання 🧠</span>
            <div style={{
              position: 'absolute',
              left: -6,
              right: -6,
              top: '52%',
              height: 7,
              background: colors.danger,
              borderRadius: 4,
              transform: `scaleX(${strike})`,
              transformOrigin: 'left',
            }}/>
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <AnimatedText size={110} weight={900} delay={80} align="left" color={colors.danger}>
            КОНТРОЛЬ
          </AnimatedText>
        </div>
      </div>
    </AbsoluteFill>
  )
}
