import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { INK } from '~/characters/svg/_pencil'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const NapoleonFichteScene: React.FC = () => {
  const frame = useCurrentFrame()
  const arrow = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: 500, top: 150, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/00-42_napoleon-enters-berlin-1806.jpg" width={760} height={530} delay={6}
                  rotate={-2} caption="Наполеон входить у Берлін" date="1806"/>
      </div>

      {/* +40 years arrow */}
      <svg viewBox="0 0 240 80" width={240} height={80}
           style={{ position: 'absolute', left: 950, top: 380, overflow: 'visible', opacity: arrow }}>
        <line x1={0} y1={40} x2={200} y2={40} stroke={INK} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={`${arrow * 200} 400`}/>
        <polygon points="200,24 236,40 200,56" fill={INK} opacity={arrow > 0.9 ? 1 : 0}/>
        <text x={100} y={20} textAnchor="middle" fontSize={26} fontWeight={900} fill={colors.danger}
              fontFamily="Montserrat, sans-serif">+40 років
        </text>
      </svg>

      <div style={{ position: 'absolute', left: 1520, top: 150, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/00-42_fichte-portrait.png" width={480} height={570} delay={80} rotate={4}
                  caption="Й. Ґ. Фіхте"/>
      </div>

      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 70,
        display: 'flex',
        justifyContent: 'center',
        opacity: arrow,
      }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={90} slide={0} maxWidth="88%">
          Фіхте напружено подумав, і <span style={{ color: colors.danger }}>вигадав</span>...
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
