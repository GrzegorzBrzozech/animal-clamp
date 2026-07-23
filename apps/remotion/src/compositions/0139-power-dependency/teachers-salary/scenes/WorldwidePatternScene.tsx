import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, PaperBackground, PASTEL, PersonPencil } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const GROUND = 900
const FIG_SIZE = 234

const COUNTRIES = [
  {
    id: 'poland',
    label: 'Польща',
    teacherK: '$20k',
    engineerK: '$35k',
    teacherH: 156,
    engineerH: 276,
    cx: 780,
  },
  {
    id: 'switzerland',
    label: 'Швейцарія',
    teacherK: '$85k',
    engineerK: '$125k',
    teacherH: 319,
    engineerH: 468,
    cx: 1400,
  },
] as const

const BAR_W = 117
const BAR_GAP = 26

const OBJECTOR_AT = 0
const CHART_AT = 80
const LABEL_AT = 160

export const WorldwidePatternScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const objS = spring({ fps, frame: frame - OBJECTOR_AT, config: { damping: 14, mass: 0.85 }, from: 0, to: 1 })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 60, fontWeight: 800, color: INK,
        opacity: interpolate(frame, [0, 20], [0, 1], clamp),
      }}>
        Схема підозріло повторювана... 🧐
      </div>

      {/* Objecting figure (left) */}
      <div style={{
        position: 'absolute',
        left: 160,
        top: GROUND - FIG_SIZE,
        opacity: objS,
        transform: `scale(${objS})`,
        transformOrigin: 'bottom center',
      }}>
        <PersonPencil size={FIG_SIZE} facing={1} pose="megaphone" color={PASTEL.pink}/>
      </div>

      {/* Speech bubble from objector */}
      <div style={{
        position: 'absolute',
        left: 358,
        top: GROUND - FIG_SIZE - 26,
        width: 416,
        background: '#F5ECD4',
        border: `3px solid ${INK}`,
        borderRadius: 20,
        padding: '18px 26px',
        fontFamily: montserrat.fontFamily,
        fontSize: 34,
        fontWeight: 700,
        color: INK,
        lineHeight: 1.3,
        opacity: interpolate(frame, [30, 55], [0, 1], clamp),
      }}>
        Але це ж тільки в Україні!
        <div style={{
          position: 'absolute',
          left: -18,
          top: 36,
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderRight: `18px solid ${INK}`,
        }}/>
      </div>

      {/* Ground line */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: 1920, height: 3,
        background: `${INK}55`,
        opacity: interpolate(frame, [5, 25], [0, 1], clamp),
      }}/>

      {/* Country groups */}
      {COUNTRIES.map((c, ci) => {
        const groupS = spring({
          fps,
          frame: frame - CHART_AT - ci * 50,
          config: { damping: 18, mass: 1.1 },
          from: 0,
          to: 1,
        })
        const labOp = interpolate(frame, [LABEL_AT + ci * 30, LABEL_AT + ci * 30 + 25], [0, 1], clamp)

        const tBarH = c.teacherH * groupS
        const eBarH = c.engineerH * groupS

        const tBarX = c.cx - BAR_W - BAR_GAP / 2
        const eBarX = c.cx + BAR_GAP / 2

        return (
          <div key={c.id}>
            {/* Teacher bar (blue) */}
            <div style={{
              position: 'absolute',
              left: tBarX,
              top: GROUND - tBarH,
              width: BAR_W,
              height: tBarH,
              background: PASTEL.blue,
              border: `3px solid ${INK}`,
              borderRadius: '8px 8px 0 0',
            }}/>

            {/* Engineer bar (green) */}
            <div style={{
              position: 'absolute',
              left: eBarX,
              top: GROUND - eBarH,
              width: BAR_W,
              height: eBarH,
              background: PASTEL.green,
              border: `3px solid ${INK}`,
              borderRadius: '8px 8px 0 0',
            }}/>

            {/* Salary labels inside bars */}
            <div style={{
              position: 'absolute',
              left: tBarX,
              top: GROUND - tBarH + 14,
              width: BAR_W,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 28,
              fontWeight: 800,
              color: INK,
              opacity: interpolate(groupS, [0.85, 1], [0, 1], clamp),
            }}>
              {c.teacherK}
            </div>
            <div style={{
              position: 'absolute',
              left: eBarX,
              top: GROUND - eBarH + 14,
              width: BAR_W,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 28,
              fontWeight: 800,
              color: INK,
              opacity: interpolate(groupS, [0.85, 1], [0, 1], clamp),
            }}>
              {c.engineerK}
            </div>

            {/* Country label */}
            <div style={{
              position: 'absolute',
              left: c.cx - 182,
              top: GROUND + 23,
              width: 364,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 44,
              fontWeight: 800,
              color: INK,
              opacity: labOp,
            }}>
              {c.label}
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        right: 60,
        top: 140,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        opacity: interpolate(frame, [CHART_AT, CHART_AT + 30], [0, 1], clamp),
      }}>
        {[
          { color: PASTEL.blue, label: 'Вчитель' },
          { color: PASTEL.green, label: 'Інженер' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 47, height: 31, background: l.color, border: `2.5px solid ${INK}`, borderRadius: 4 }}/>
            <span
              style={{ fontFamily: montserrat.fontFamily, fontSize: 34, fontWeight: 700, color: INK }}>{l.label}</span>
          </div>
        ))}
      </div>

    </AbsoluteFill>
  )
}
