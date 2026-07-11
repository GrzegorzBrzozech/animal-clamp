import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const FichteQuoteScene: React.FC = () => {
  const frame = useCurrentFrame()
  const barIn = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: 320, top: 260, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/00-42_fichte-portrait.png" width={420} height={520} delay={6} rotate={-4}
                  caption="Й. Ґ. Фіхте"/>
      </div>

      {/* quote block */}
      <div style={{ position: 'absolute', left: 640, top: 290, width: 1160, display: 'flex', gap: 26 }}>
        <div style={{
          width: 10,
          background: colors.danger,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: 'top',
        }}/>
        <div style={{ flex: 1 }}>
          <span
            style={{ fontSize: 160, lineHeight: 0.6, color: colors.danger, fontWeight: 900, opacity: barIn }}>“</span>
          <AnimatedText size={54} weight={fontWeights.black} delay={22} align="left" maxWidth={1080}
                        style={{ marginTop: -30 }}>
            Нова освіта повинна повністю{'\n'}
            <span style={{ color: colors.danger }}>знищити свободу волі</span> в учня.
          </AnimatedText>
          <div style={{ height: 26 }}/>
          <AnimatedText size={40} weight={fontWeights.bold} delay={90} align="left" maxWidth={1080} color={colors.text}>
            Школи повинні формувати особистість так, щоб людина не могла бажати нічого іншого,{'\n'}крім того, чого ви
            від неї бажаєте.
          </AnimatedText>
          <div style={{ height: 24 }}/>
          <AnimatedText size={fontSizes.body} weight={fontWeights.black} delay={310} align="left"
                        color={colors.textMuted}>
            — «Промови до німецької нації», 1808
          </AnimatedText>
        </div>
      </div>
    </AbsoluteFill>
  )
}
