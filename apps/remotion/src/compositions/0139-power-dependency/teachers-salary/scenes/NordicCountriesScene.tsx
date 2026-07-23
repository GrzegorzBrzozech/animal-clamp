import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, PaperBackground, PASTEL } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const GROUND = 900
const BAR_W = 104   // 80 × 1.3
const BAR_GAP = 21  // 16 × 1.3

const COUNTRIES = [
  { id: 'poland',      label: 'Польща',    teacherK: '$20k', engineerK: '$35k',  teacherH: 143, engineerH: 273, cx: 500 },
  {
    id: 'switzerland',
    label: 'Швейцарія',
    teacherK: '$85k',
    engineerK: '$125k',
    teacherH: 296, engineerH: 439, cx: 820,
  },
  { id: 'finland',     label: 'Фінляндія', teacherK: '$46k', engineerK: '$62k',  teacherH: 228, engineerH: 322, cx: 1200 },
  { id: 'sweden',      label: 'Швеція',    teacherK: '$48k', engineerK: '$64k',  teacherH: 234, engineerH: 328, cx: 1520 },
] as const

// Timing: bar groups appear sequentially
const CHART_AT = 0
const NORDIC_AT = 60

export const NordicCountriesScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 46, fontWeight: 800, color: INK,
        opacity: interpolate(frame, [0, 22], [0, 1], clamp),
      }}>
        Скандинавія - лідер всього світу<br/>
        за харощім життям, або типу того
      </div>

      {/* Ground line */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: 1920, height: 3,
        background: `${INK}55`,
        opacity: interpolate(frame, [5, 25], [0, 1], clamp),
      }}/>

      {COUNTRIES.map((c, ci) => {
        const isNordic = c.id === 'finland' || c.id === 'sweden'
        const startAt = isNordic ? NORDIC_AT + (ci - 2) * 30 : CHART_AT + ci * 30

        const groupS = spring({ fps, frame: frame - startAt, config: { damping: 18, mass: 1.1 }, from: 0, to: 1 })
        const tBarH = c.teacherH * groupS
        const eBarH = c.engineerH * groupS

        const tBarX = c.cx - BAR_W - BAR_GAP / 2
        const eBarX = c.cx + BAR_GAP / 2

        const labOp = interpolate(groupS, [0.6, 1], [0, 1], clamp)
        const salaryOp = interpolate(groupS, [0.85, 1], [0, 1], clamp)

        return (
          <div key={c.id}>
            {/* Nordic shaded background */}
            {isNordic && (
              <div style={{
                position: 'absolute',
                left: c.cx - 156,
                top: 100,
                width: 312,
                height: GROUND - 100,
                background: '#4E8A5A11',
                border: `2px dashed #4E8A5A55`,
                borderRadius: 16,
                opacity: interpolate(frame, [NORDIC_AT - 10, NORDIC_AT + 20], [0, 1], clamp),
              }}/>
            )}

            {/* Teacher bar */}
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

            {/* Engineer bar */}
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
              top: GROUND - tBarH + 12,
              width: BAR_W,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 18,
              fontWeight: 800,
              color: INK,
              opacity: salaryOp,
            }}>
              {c.teacherK}
            </div>
            <div style={{
              position: 'absolute',
              left: eBarX,
              top: GROUND - eBarH + 12,
              width: BAR_W,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 18,
              fontWeight: 800,
              color: INK,
              opacity: salaryOp,
            }}>
              {c.engineerK}
            </div>



            {/* Country label */}
            <div style={{
              position: 'absolute',
              left: c.cx - 120,
              top: GROUND + 18,
              width: 240,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 28,
              fontWeight: 800,
              color: isNordic ? '#4E8A5A' : INK,
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
        gap: 14,
        opacity: interpolate(frame, [10, 35], [0, 1], clamp),
      }}>
        {[
          { color: PASTEL.blue, label: 'Вчитель' },
          { color: PASTEL.green, label: 'Інженер' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 24, background: l.color, border: `2.5px solid ${INK}`, borderRadius: 4 }}/>
            <span
              style={{ fontFamily: montserrat.fontFamily, fontSize: 26, fontWeight: 700, color: INK }}>{l.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
