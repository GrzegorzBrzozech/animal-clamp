import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import {
  BeachPencil,
  CratePencil,
  HousePencil,
  INK,
  PaperBackground,
  PASTEL,
  PersonPencil,
  PriceTagPencil,
  RoadPencil,
  SandboxPencil,
  SandPilePencil,
} from '~/characters'
import { AnimatedText } from '~/components'
import { fadeIn, popIn } from '~/lib/animations'
import { colors, fontSizes, fontWeights } from '../paper'

/**
 * 35–45 s · Спостереження №2 — спадна гранична цінність.
 * Heap after heap of sand arrives; each one goes to a less urgent need, so the
 * price the buyer is still willing to pay for it drops.
 */

type Unit = {
  /** Unit number, printed on the heap's little pennant. */
  unit: string;
  price: string;
  need: string;
  /** Column centre on the 1920-wide canvas. */
  cx: number;
  /** Price-tag top — descends left→right, which IS the point of the scene. */
  tagTop: number;
  icon: React.ReactNode;
};

const ICON_BASELINE = 740

const UNITS: Unit[] = [
  {
    unit: '1',
    price: '$9',
    need: 'будинок',
    cx: 426,
    tagTop: 140,
    icon: <HousePencil size={140}/>,
  },
  {
    unit: '2',
    price: '$7',
    need: 'дорога',
    cx: 758,
    tagTop: 180,
    icon: <RoadPencil size={130}/>,
  },
  {
    unit: '3',
    price: '$4',
    need: 'пісочниця',
    cx: 1090,
    tagTop: 220,
    icon: <SandboxPencil size={130}/>,
  },
  {
    unit: '4',
    price: '$2',
    need: 'пляж',
    cx: 1422,
    tagTop: 260,
    icon: <BeachPencil size={125}/>,
  },
  {
    unit: '10',
    price: '$0.01',
    need: 'про запас',
    cx: 1754,
    tagTop: 300,
    icon: <CratePencil size={130}/>,
  },
]

const ICON_TOPS = [600, 610, 610, 615, 610]
// Real VO for this scene runs 18.68 s (560 frames) — the narration doesn't name
// each need, so the 5 heaps are spread evenly across it and wrapped up before
// "і так далі" (~frame 343), leaving the back half of the scene for the
// stopping-rule line that goes with the final, longest sentence.
const DELAY = (i: number) => 40 + i * 75

export const DiminishingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const revealed = UNITS.filter((_, i) => frame >= DELAY(i) + 8).length
  const connector = UNITS.slice(0, Math.max(0, revealed))
    .map((u) => `${u.cx},${u.tagTop + 34}`)
    .join(' ')

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* heading */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 32, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={50} weight={fontWeights.black} delay={0} align="center" maxWidth={1700}>
          <span style={{ color: colors.primary }}>Спостереження №2</span> — кожна наступна одиниця менш цінна
        </AnimatedText>
      </div>

      {/* the buyer, handing money over */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 365,
          opacity: fadeIn(frame, 4, 16),
        }}
      >
        <PersonPencil size={500} facing={1} pose="present" color={PASTEL.green}/>
      </div>

      {/* the falling price line through the tags */}
      {revealed >= 2 ? (
        <svg
          width={1920}
          height={1080}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <polyline
            points={connector}
            fill="none"
            stroke={colors.danger}
            strokeWidth={4}
            strokeDasharray="16 12"
            strokeLinecap="round"
            opacity={0.85}
          />
        </svg>
      ) : null}

      {UNITS.map((u, i) => {
        const d = DELAY(i)
        const s = popIn(frame, fps, d, { damping: 14, mass: 0.8 })
        const drop = interpolate(s, [0, 1], [-90, 0])
        const iconOp = fadeIn(frame, d + 14, 16)
        return (
          <React.Fragment key={u.unit}>
            {/* price tag */}
            <div
              style={{
                position: 'absolute',
                left: u.cx - 56,
                top: u.tagTop,
                opacity: s,
                transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
                transformOrigin: 'left center',
              }}
            >
              <PriceTagPencil size={62} text={u.price} color={i > 3 ? PASTEL.gray : PASTEL.yellow}/>
            </div>

            {/* the heap of sand itself, dropping in. A heap is wide and low
                (≈1.73 : 1), so it sits smaller than the old sack to keep a gap
                between the 332 px-apart columns. Bottom stays at y = 570. */}
            <div
              style={{
                position: 'absolute',
                left: u.cx - 147,
                top: 400,
                opacity: s,
                transform: `translateY(${drop}px)`,
              }}
            >
              <SandPilePencil size={170} label={u.unit}/>
            </div>

            {/* the need it goes to */}
            <div
              style={{
                position: 'absolute',
                left: u.cx - 160,
                top: ICON_TOPS[i],
                width: 320,
                height: ICON_BASELINE - ICON_TOPS[i],
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                opacity: iconOp,
              }}
            >
              {u.icon}
            </div>
            <div
              style={{
                position: 'absolute',
                left: u.cx - 160,
                top: 762,
                width: 320,
                textAlign: 'center',
                opacity: iconOp,
                fontSize: 30,
                fontWeight: fontWeights.bold,
                color: i > 3 ? colors.textMuted : INK,
              }}
            >
              {u.need}
            </div>
          </React.Fragment>
        )
      })}

      {/* the stopping rule */}
      <div style={{ position: 'absolute', left: 300, right: 40, top: 892, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={380}
          align="center"
          maxWidth={1500}
          style={{ lineHeight: 1.2 }}
        >
          Дім зведуть і за високу ціну.
        </AnimatedText>
      </div>
      <div style={{ position: 'absolute', left: 300, right: 40, top: 952, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={380}
          align="center"
          maxWidth={1500}
          style={{ lineHeight: 1.2 }}
        >
          <span style={{ color: colors.danger }}>А на пляж насиплять тільки коли буде дешево.</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
