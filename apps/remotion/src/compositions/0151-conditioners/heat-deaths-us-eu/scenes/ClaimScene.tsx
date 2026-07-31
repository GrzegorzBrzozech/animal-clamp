import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const MEME_FRAME_1 = 52
const MEME_FRAME_2 = 110

export const ClaimScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Meme face slides in from bottom
  const memeS = spring({ fps, frame: frame - MEME_FRAME_1, config: { damping: 18, mass: 0.9 } })
  const memeS2 = spring({ fps, frame: frame - MEME_FRAME_2, config: { damping: 18, mass: 0.9 } })
  const memeY = interpolate(memeS, [0, 1], [260, 0])
  const memeY2 = interpolate(memeS2, [0, 1], [260, 0])

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Main provocative claim */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center' }}>
        <AnimatedText
          size={fontSizes.title}
          weight={fontWeights.black}
          delay={4}
          align="center"
          maxWidth="90%"
          style={{ margin: '0 auto', lineHeight: 1.1 }}
        >
          «У 10–12 разів —{' '}
          <span style={{ color: colors.danger }}>це брехня!</span>»
        </AnimatedText>
      </div>

      {/* Bottom explanation — between two faces */}
      <div
        style={{
          position: 'absolute',
          left: 580,
          right: 580,
          bottom: 260,
          textAlign: 'center',
        }}
      >
        <AnimatedText
          size={fontSizes.caption}
          weight={fontWeights.bold}
          delay={150}
          align="center"
          maxWidth="100%"
          color={colors.primary}
          style={{ margin: '0 auto' }}
        >
          Та цифри просто заплутали!
        </AnimatedText>
      </div>

      {/* Mother-of-god — slides up from bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          bottom: 100,
          width: 520,
          transform: `translateY(${memeY}px)`,
          opacity: memeS,
        }}
      >
        <Img
          src={staticFile('projects/heat-deaths-us-eu/mother-of-god.webp')}
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* Shy face — slides up from bottom-right, mirrored horizontally */}
      <div
        style={{
          position: 'absolute',
          right: 160,
          bottom: 100,
          width: 520,
          transform: `translateY(${memeY2}px) scaleX(-1)`,
          opacity: memeS2,
        }}
      >
        <Img
          src={staticFile('projects/heat-deaths-us-eu/shy.svg')}
          style={{ width: '100%', display: 'block' }}
        />
      </div>
    </AbsoluteFill>
  )
}
