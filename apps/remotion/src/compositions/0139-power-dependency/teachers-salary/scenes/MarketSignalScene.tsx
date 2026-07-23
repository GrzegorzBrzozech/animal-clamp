import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, PaperBackground, PASTEL, PersonPencil } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const GROUND = 820
const FIG_SIZE = 540

const SKILLS = [
  'Сиджу смирно 45 хвилин',
  'В туалет не прошуся',
  'Пишу звіти',
  'Читаю',
  'Переказую',
] as const

const SKILL_AT = 120
const SKILL_STAGGER = 28
const PRICETAG_AT = SKILL_AT + SKILLS.length * SKILL_STAGGER + 40

export const MarketSignalScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const figS = spring({ fps, frame: frame - 0, config: { damping: 14, mass: 0.85 }, from: 0, to: 1 })
  const certS = spring({ fps, frame: frame - 60, config: { damping: 14, mass: 0.9 }, from: 0, to: 1 })
  const priceS = spring({ fps, frame: frame - PRICETAG_AT, config: { damping: 10, mass: 0.7 }, from: 0, to: 1.1 })
  const priceFinal = Math.min(priceS, 1)

  return (
    <AbsoluteFill>
      <PaperBackground/>


      {/* Ground */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: 1920, height: 3,
        background: `${INK}55`,
        opacity: interpolate(frame, [5, 25], [0, 1], clamp),
      }}/>

      {/* Teacher figure */}
      <div style={{
        position: 'absolute',
        left: 200,
        top: GROUND - FIG_SIZE,
        opacity: figS,
        transform: `scale(${figS})`,
        transformOrigin: 'bottom center',
      }}>
        <PersonPencil size={FIG_SIZE} color={PASTEL.blue}/>
      </div>


      {/* Certificate card */}
      <div style={{
        position: 'absolute',
        left: 600,
        top: 140,
        width: 900,
        background: '#F5ECD4',
        border: `4px solid ${INK}`,
        borderRadius: 20,
        padding: '36px 44px',
        opacity: certS,
        transform: `scale(${certS})`,
        transformOrigin: 'left center',
        boxShadow: `4px 6px 0 ${INK}33`,
      }}>
        {/* Certificate title */}
        <div style={{
          fontFamily: montserrat.fontFamily,
          fontSize: 32,
          fontWeight: 900,
          color: INK,
          marginBottom: 28,
          borderBottom: `3px solid ${INK}55`,
          paddingBottom: 14,
          textAlign: 'center',
        }}>
          ДИПЛОМ ДЕРЖАВНОГО ВЧИТЕЛЯ
        </div>

        {/* Skills list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SKILLS.map((skill, i) => {
            const skillOp = interpolate(
              frame,
              [SKILL_AT + i * SKILL_STAGGER, SKILL_AT + i * SKILL_STAGGER + 20],
              [0, 1],
              clamp,
            )
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: skillOp,
                transform: `translateX(${interpolate(skillOp, [0, 1], [-20, 0], clamp)}px)`,
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: `3px solid ${INK}`,
                  background: PASTEL.blue,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 16, color: INK, fontWeight: 900 }}>✓</span>
                </div>
                <span style={{
                  fontFamily: montserrat.fontFamily,
                  fontSize: 28,
                  fontWeight: 600,
                  color: INK,
                }}>
                  {skill}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price tag */}
      <div style={{
        position: 'absolute',
        right: 220,
        bottom: 280,
        opacity: priceFinal,
        transform: `scale(${priceS}) rotate(-12deg)`,
        transformOrigin: 'right bottom',
      }}>
        <div style={{
          background: PASTEL.yellow,
          border: `5px solid ${INK}`,
          borderRadius: 20,
          padding: '20px 36px',
          textAlign: 'center',
          boxShadow: `4px 6px 0 ${INK}55`,
          position: 'relative',
        }}>
          {/* Price tag hole */}
          <div style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 18,
            height: 18,
            border: `3px solid ${INK}`,
            borderRadius: '50%',
            background: '#F5ECD4',
          }}/>
          <div style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 156,
            fontWeight: 900,
            color: INK,
            marginTop: 12,
          }}>
            🤏
          </div>
          <div style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 34,
            fontWeight: 900,
            color: '#BC5147',
          }}>
            ЦІНА ТИЖНЯ!
          </div>
          <div style={{
            fontFamily: montserrat.fontFamily,
            fontSize: 22,
            fontWeight: 600,
            color: '#6E685A',
            marginTop: 4,
          }}>
            трошечки
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
