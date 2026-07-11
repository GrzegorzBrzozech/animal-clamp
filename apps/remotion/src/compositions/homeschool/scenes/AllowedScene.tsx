import React from 'react'
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { HousePencil, PaperBackground, PersonPencil, StampMark } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const AllowedScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const houseIn = spring({ fps, frame: frame - 6, config: { damping: 13, mass: 0.6 } })
  const kidIn = spring({ fps, frame: frame - 26, config: { damping: 12 } })
  const stampIn = spring({ fps, frame: frame - 90, config: { damping: 10, mass: 0.6 } })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* the home */}
      <div style={{
        position: 'absolute',
        left: 780,
        top: 560,
        transform: `translate(-50%,-50%) scale(${houseIn})`,
        opacity: houseIn,
      }}>
        <HousePencil size={330} heart/>
      </div>

      {/* the child learning at home */}
      <div style={{
        position: 'absolute',
        left: 1120,
        top: 570,
        transform: `translate(-50%,-50%) scale(${kidIn})`,
        opacity: kidIn,
      }}>
        <PersonPencil size={220} facing={-1} color={colors.success}/>
      </div>

      {/* "дозволено" stamp */}
      <div style={{
        position: 'absolute',
        left: 660,
        top: 470,
        transform: `translate(-50%,-50%) rotate(-8deg) scale(${stampIn})`,
        opacity: stampIn,
      }}>
        <StampMark size={200} color={colors.success} label="ОК"/>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={4} slide={0} maxWidth="90%">
          Діти, навчайтесь <span style={{ color: colors.success }}>вдома</span>
        </AnimatedText>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 190, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={40} slide={0} color={colors.textMuted}>
          «індивідуальна форма навчання»
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
