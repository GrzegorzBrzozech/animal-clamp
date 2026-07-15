import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const Block: React.FC<{
  at: number; x: number; icon: string; label: string; sublabel: string; accent: string
}> = ({ at, x, icon, label, sublabel, accent }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 14, mass: 0.7 } })

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: 300,
      transform: `translate(-50%, 0) scale(${s})`,
      opacity: s,
      width: 680,
      background: '#F5EDD6',
      border: `8px solid ${accent}`,
      borderRadius: 28,
      padding: '40px 48px',
      boxShadow: '6px 8px 0px rgba(0,0,0,0.13)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 100, textAlign: 'center' }}>{icon}</div>
      <div style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: accent, textAlign: 'center' }}>
        {label}
      </div>
      <div style={{
        fontSize: fontSizes.body,
        fontWeight: fontWeights.bold,
        color: colors.textMuted,
        textAlign: 'center',
      }}>
        {sublabel}
      </div>
    </div>
  )
}

export const TwoMeansScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Book — behind both blocks (rendered first → blocks overlap it) */}
      <div style={{ position: 'absolute', left: 600, top: 50 }}>
        <PhotoPin
          src="projects/oppenheimer/Der_Staat_by_F._Oppenheimer.jpg"
          width={720}
          height={900}
          delay={2}
          zoom={0.02}
          rotate={-2}
          caption="Книга «Der Staat» (Держава), Ф. Оппенгаймер"
          date="1908"
          hold="pin"
          objectFit="contain"
        />
      </div>

      <Block
        at={20}
        x={480}
        icon="🪎"
        label="Економічний метод"
        sublabel="добровільна взаємодія"
        accent={colors.success}
      />
      <Block
        at={60}
        x={1440}
        icon="🏛️"
        label="Політичний метод"
        sublabel="примус"
        accent={colors.danger}
      />

    </AbsoluteFill>
  )
}
