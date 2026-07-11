import React from 'react'
import { AbsoluteFill } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

export const PrussiaScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: -1000, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={20} slide={0}>
          <span style={{ color: colors.primary }}>1763</span>
        </AnimatedText>
      </div>

      {/* Coat of arms — appears first */}
      <div style={{ position: 'absolute', left: 960, top: 50, transform: 'translateX(-50%)', zIndex: 1 }}>
        <PhotoPin
          src="projects/rothbard/prussia-coat-of-arms.webp"
          width={420}
          height={420}
          delay={0}
          rotate={2}
          zoom={0.03}
          caption="Королівство Пруссія"
          hold="pin"
          objectFit="contain"
        />
      </div>

      {/* War map — drops in after narration starts (~1.7s) */}
      <div style={{ position: 'absolute', left: 520, top: 290, transform: 'translateX(-50%)', zIndex: 3 }}>
        <PhotoPin
          src="projects/rothbard/00-10_seven-years-war-map.png"
          width={940}
          height={490}
          delay={80}
          rotate={-2.5}
          zoom={0.05}
          caption="Конфліктуючі стороні Семирічної війни (1756–1763)"
          date="1763"
          hold="pin"
        />
      </div>

      {/* Battle painting — drops in last (~2.7s), overlaps map */}
      <div style={{ position: 'absolute', left: 1400, top: 350, transform: 'translateX(-50%)', zIndex: 4 }}>
        <PhotoPin
          src="projects/rothbard/kunersdorf-battle.jpg"
          width={940}
          height={490}
          delay={100}
          rotate={3}
          zoom={0.04}
          caption="Битва при Кунерсдорфі, 1759"
          hold="tape"
        />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={140} slide={0} color={colors.textMuted}
                      maxWidth="80%">
          Нульова Світова Війна (WW0)
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
