import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { DressPencil, PaperBackground, PASTEL, PersonPencil, ThoughtBubblePencil, WomanPencil } from '~/characters'
import { AnimatedText, PortraitPhoto } from '~/components'
import { fadeIn, popIn } from '~/lib/animations'
import { colors, fontWeights } from '../paper'

/**
 * 17–35 s · Гранична цінність (спостереження №1).
 * Menger on the left; on the right the same dress is worth "$$$" to her and "$"
 * to him — value sits in the buyer's eye, not in the object or the labour.
 */

const DRESS_AT = 92
const HER_BUBBLE_AT = 150
const HIS_BUBBLE_AT = 226

export const MengerValueScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const mengerS = popIn(frame, fps, 6, { damping: 15, mass: 0.9 })
  const peopleS = popIn(frame, fps, 46, { damping: 15, mass: 0.9 })
  const dressS = popIn(frame, fps, DRESS_AT, { damping: 13, mass: 0.7 })
  const herS = popIn(frame, fps, HER_BUBBLE_AT, { damping: 12, mass: 0.6 })
  const hisS = popIn(frame, fps, HIS_BUBBLE_AT, { damping: 12, mass: 0.6 })

  // Gentle breathing so the figures are not frozen for 18 seconds.
  const bob = Math.sin(frame * 0.07) * 5
  const bob2 = Math.sin(frame * 0.07 + 1.4) * 5

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* heading */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 44, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={54} weight={fontWeights.black} delay={2} align="center" maxWidth={1700}>
          <span style={{ color: colors.primary }}>Спостереження №1</span> — цінність суб&apos;єктивна
        </AnimatedText>
      </div>

      {/* Menger */}
      <div
        style={{
          position: 'absolute',
          left: 122,
          top: 196,
          transform: `scale(${interpolate(mengerS, [0, 1], [0.82, 1])})`,
          transformOrigin: 'center',
          opacity: mengerS,
        }}
      >
        <PortraitPhoto
          size={470}
          src="projects/marginal-utility/portraits/menger.jpg"
          label="Карл Менгер"
          objectPosition="50% 16%"
          crop={1.18}
        />
      </div>
      <div style={{ position: 'absolute', left: 90, top: 700, width: 420, opacity: fadeIn(frame, 60, 20) }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: fontWeights.medium,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Кожен цінує товар по-своєму — за потребою, яку той закриває.
        </div>
      </div>

      {/* she — values the dress highly */}
      <div
        style={{
          position: 'absolute',
          left: 730,
          top: 440,
          opacity: peopleS,
          transform: `translateY(${interpolate(peopleS, [0, 1], [40, 0]) + bob}px)`,
        }}
      >
        <WomanPencil size={372} facing={1} color={PASTEL.pink}/>
      </div>

      {/* the dress between them */}
      <div
        style={{
          position: 'absolute',
          left: 1142,
          top: 470,
          opacity: dressS,
          transform: `scale(${interpolate(dressS, [0, 1], [0.6, 1])})`,
          transformOrigin: 'center',
        }}
      >
        <DressPencil size={300}/>
      </div>

      {/* he — barely values it */}
      <div
        style={{
          position: 'absolute',
          left: 1470,
          top: 430,
          opacity: peopleS,
          transform: `translateY(${interpolate(peopleS, [0, 1], [40, 0]) + bob2}px)`,
        }}
      >
        <PersonPencil size={382} facing={-1} color={PASTEL.blue} tie/>
      </div>

      {/* her price bubble — high */}
      <div
        style={{
          position: 'absolute',
          left: 656,
          top: 236,
          opacity: herS,
          transform: `scale(${interpolate(herS, [0, 1], [0.5, 1])})`,
          transformOrigin: 'bottom right',
        }}
      >
        <ThoughtBubblePencil size={180} text="$$$" tailSide={1} color={PASTEL.pink} textColor={colors.success}/>
      </div>

      {/* his price bubble — low */}
      <div
        style={{
          position: 'absolute',
          left: 1620,
          top: 236,
          opacity: hisS,
          transform: `scale(${interpolate(hisS, [0, 1], [0.5, 1])})`,
          transformOrigin: 'bottom left',
        }}
      >
        <ThoughtBubblePencil size={180} text="$" tailSide={-1} color={PASTEL.blue} textColor={colors.textMuted}/>
      </div>

      {/* the payoff line */}
      <div style={{ position: 'absolute', left: 560, right: 40, top: 862, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText
          size={46}
          weight={fontWeights.black}
          delay={395}
          align="center"
          maxWidth={1280}
          style={{ lineHeight: 1.2 }}
        >
          Цінність товару — <span style={{ color: colors.primary }}>в очах споживача.</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
