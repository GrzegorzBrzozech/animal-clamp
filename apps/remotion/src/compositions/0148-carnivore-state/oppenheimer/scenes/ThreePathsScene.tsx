import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const PATHS = [
  { icon: '🔨', label: 'Зробити\nсамому', at: 0, color: colors.success },
  { icon: '🤝', label: 'Виміняти\nв інших', at: 40, color: colors.primary },
  { icon: '⚔️', label: 'Забрати\nсилою', at: 80, color: colors.danger },
]

const XS = [380, 960, 1540]

const PathCard: React.FC<{ icon: string; label: string; at: number; x: number; accent: string }> = ({
  icon, label, at, x, accent,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 12, mass: 0.6 } })

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: 520,
      transform: `translate(-50%, -50%) scale(${s})`,
      opacity: s,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      background: '#F5EDD6',
      border: `6px solid ${accent}`,
      borderRadius: 24,
      padding: '32px 40px',
      width: 300,
      boxShadow: '4px 6px 0px rgba(0,0,0,0.12)',
    }}>
      <span style={{ fontSize: 90 }}>{icon}</span>
      <span style={{
        fontSize: fontSizes.body,
        fontWeight: fontWeights.black,
        color: accent,
        textAlign: 'center',
        whiteSpace: 'pre-line',
        lineHeight: 1.3,
      }}>{label}</span>
    </div>
  )
}

export const ThreePathsScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} align="center">
          3 способи <span style={{ color: colors.primary }}>забезпечити</span> себе
        </AnimatedText>
      </div>

      {PATHS.map((p, i) => (
        <PathCard key={p.label} icon={p.icon} label={p.label} at={p.at} x={XS[i]} accent={p.color} />
      ))}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.caption} weight={fontWeights.bold} delay={120} slide={0} color={colors.textMuted}>
          Енергія не виникає з нічого і не зникає в нікуди, а може лише перетворюватись з однієї форми в іншу...
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
