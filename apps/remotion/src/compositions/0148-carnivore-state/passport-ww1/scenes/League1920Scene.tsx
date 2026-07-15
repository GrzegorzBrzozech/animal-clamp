import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText, PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

const STAMP_WORDS = ['ТИМЧАСОВО']

const Stamp: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame()
  const s = interpolate(frame, [delay, delay + 8], [2.2, 1], clamp)
  const op = interpolate(frame, [delay, delay + 8], [0, 1], clamp)
  return (
    <div
      style={{
        position: 'absolute',
        right: 110,
        top: 545,
        transform: `rotate(-14deg) scale(${s})`,
        opacity: op * 0.72,
        border: `10px solid ${colors.danger}`,
        borderRadius: 12,
        padding: '14px 30px',
        pointerEvents: 'none',
      }}
    >
      {STAMP_WORDS.map((w) => (
        <div
          key={w}
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: colors.danger,
            letterSpacing: 8,
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          {w}
        </div>
      ))}
    </div>
  )
}

export const League1920Scene: React.FC = () => {
  const frame = useCurrentFrame()

  const barIn = interpolate(frame, [10, 30], [0, 1], clamp)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Historical photo — League of Nations commission 1919 */}
      <div style={{ position: 'absolute', left: 50, top: 300 }}>
        <PhotoPin
          src="projects/passport-ww1/00-24_league-of-nations-commission-1919.jpg"
          width={660}
          height={480}
          delay={4}
          rotate={-2}
          zoom={0.04}
          caption="Комісія Ліги Націй, 1919"
          hold="tape"
        />
      </div>

      {/* Rubber-stamp "ТИМЧАСОВИЙ ЗАХІД" */}
      <Stamp delay={130}/>

      {/* Vertical accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 770,
          top: 220,
          width: 8,
          height: 650,
          background: colors.secondary,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: 'top',
        }}
      />

      {/* Narration text */}
      <div style={{ position: 'absolute', left: 810, top: 240, width: 1020 }}>
        <AnimatedText
          size={fontSizes.heading}
          weight={fontWeights.black}
          delay={16}
          align="left"
          maxWidth={980}
        >
          Конференція{' '}
          <span style={{ color: colors.primary }}>Ліги Націй</span>
          {'\n'}1920 року:
        </AnimatedText>

        <div style={{ height: 40 }}/>

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={38}
          align="left"
          maxWidth={980}
          color={colors.text}
        >
          Швиденько наведемо порядок в країні! Введемо дозвільні папірці.
          Вони будуть тільки в правильних хлопів, а шпигунам - зась.
          Виключно щоб поганим хлопцям життя поскладнити.
        </AnimatedText>

        <div style={{ height: 60 }}/>

        <AnimatedText
          size={fontSizes.caption}
          weight={fontWeights.bold}
          delay={220}
          align="left"
          maxWidth={980}
          color={colors.textMuted}
          style={{ fontStyle: 'italic' }}
        >
          …а як все налагодиться – так все одразу скасуємо!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
