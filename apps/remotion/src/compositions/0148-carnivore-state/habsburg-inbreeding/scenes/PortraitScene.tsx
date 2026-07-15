import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const fade = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

// 4 ancestor portraits — appear from scene start, staggered
const ANCESTORS = [
  {
    src: 'projects/habsburg-inbreeding/karl_v_titian.jpg',
    caption: 'Карл V',
    date: '~1548',
    delay: 3,
    rotate: -1.5,
    left: 80,
    top: 50,
  },
  {
    src: 'projects/habsburg-inbreeding/felipe_ii_mor.jpg',
    caption: 'Феліпе ІІ',
    date: '~1550',
    delay: 15,
    rotate: 2.0,
    left: 450,
    top: 70,
  },
  {
    src: 'projects/habsburg-inbreeding/felipe_iii_polanco.jpg',
    caption: 'Феліпе ІІІ',
    date: '~1617',
    delay: 27,
    rotate: 1.5,
    left: 95,
    top: 570,
  },
  {
    src: 'projects/habsburg-inbreeding/felipe_iv_velazquez.jpg',
    caption: 'Феліпе IV',
    date: '1623',
    delay: 39,
    rotate: -2.5,
    left: 460,
    top: 590,
  },
] as const

// Carlos II native ratio: 1625×2362
const CARLOS_H = 610
const CARLOS_W = Math.round(CARLOS_H * 1625 / 2362) // ≈ 440

export const PortraitScene: React.FC = () => {
  const frame = useCurrentFrame()

  const textOp = fade(frame, 0, 20)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Scene title */}
      <div style={{
        position: 'absolute',
        left: 960,
        top: 18,
        fontSize: fontSizes.title,
        fontWeight: fontWeights.black,
        color: colors.text,
        opacity: fade(frame, 0, 25),
        letterSpacing: -1,
      }}>
        <span style={{ color: colors.primary }}>Габсбурги</span>
      </div>

      {/* Dynasty description — appears below title, fades out before Carlos II */}
      <div style={{
        position: 'absolute',
        left: 960,
        top: 130,
        width: 850,
        opacity: textOp,
        fontSize: 26,
        lineHeight: 1.55,
        color: colors.textMuted,
      }}>
        це один із наймогутніших і найвпливовіших монарших родів в історії Європи.
        Протягом століть представники цієї династії керували Священною Римською
        імперією, Австрійською імперією (пізніше Австро-Угорщиною), Іспанією, Чехією,
        Угорщиною та іншими європейськими землями.
      </div>

      {/* Ancestor portraits — visible from scene start */}
      {ANCESTORS.map(({ src, caption, date, delay, rotate, left, top }) => (
        <div key={src} style={{ position: 'absolute', left, top }}>
          <PhotoPin
            src={src}
            width={300}
            height={380}
            delay={delay}
            rotate={rotate}
            hold="tape"
            objectFit="cover"
            caption={caption}
            date={date}
          />
        </div>
      ))}

      {/* Carlos II — appears when narration reaches sentence 2 */}
      <div style={{ position: 'absolute', left: 1160, top: 360 }}>
        <PhotoPin
          src="projects/habsburg-inbreeding/05-56_carlos_II_habsburgo_portrait.jpg"
          width={CARLOS_W}
          height={CARLOS_H}
          delay={198}
          rotate={-1.5}
          hold="pin"
          objectFit="cover"
          caption="Карл ІІ Іспанський"
          date="~1685"
        />
      </div>

    </AbsoluteFill>
  )
}
