import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const ELEMENTS = [
  { icon: '⏱️', label: 'пунктуальність', at: 135 },
  { icon: '✋', label: 'чекання дозволів', at: 164 },
  { icon: '🎯', label: 'автоматичне виконання команд', at: 255 },
]

const Element: React.FC<{ icon: string; label: string; at: number }> = ({ icon, label, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 13, mass: 0.6 } })
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity: s,
        transform: `translateX(${(1 - s) * -30}px)`,
        background: colors.surface,
        border: `4px solid ${colors.secondary}`,
        borderRadius: 16,
        padding: '16px 26px',
      }}
    >
      <span style={{ fontSize: 48 }}>{icon}</span>
      <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.text }}>{label}</span>
    </div>
  )
}

export const NewSchoolScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: 410, top: 220, transform: 'translateX(-50%)' }}>
        <PhotoPin src="projects/rothbard/00-30_prussian-drill-gerlach.jpg" width={720} height={620} delay={6}
                  rotate={-3} caption="Муштра рекрутів"/>
      </div>

      <div style={{ position: 'absolute', left: 820, top: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {ELEMENTS.map((e) => (
          <Element key={e.label} {...e} />
        ))}
      </div>

      <div style={{ position: 'absolute', left: 300, right: 0, top: 280, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={100} slide={0} maxWidth="94%">
          Учбовий розклад:
        </AnimatedText>
      </div>

      <div style={{ position: 'absolute', left: 950, top: 850, width: 1000 }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={265} align="left" maxWidth={960}
                      color={colors.textMuted}>
          «Мовчать! Не розмішлять!»
        </AnimatedText>
      </div>
    </AbsoluteFill>

  )
}
