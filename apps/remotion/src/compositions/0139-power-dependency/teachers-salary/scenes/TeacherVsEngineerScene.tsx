import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground, PersonPencil, BookPencil, INK, PASTEL } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const W = 1920
const GROUND = 940
const FIG_SIZE = 300
const FIG_W = Math.round(FIG_SIZE * (170 / 220))
const BAR_W = 195

const PEOPLE = [
  { id: 'teacher', label: 'Вчитель', sub: '5 років навчання', salary: '15–18 тис. ₴', barH: 210, color: PASTEL.blue, hasDiploma: true, cx: 480 },
  { id: 'engineer', label: 'Інженер', sub: '5 років навчання', salary: '30–50 тис. ₴', barH: 442, color: PASTEL.green, hasDiploma: true, cx: 960 },
  { id: 'waiter', label: 'Офіціант', sub: 'без диплому', salary: '20–30 тис. ₴', barH: 315, color: PASTEL.yellow, hasDiploma: false, cx: 1440 },
] as const

const ARROW_AT = 290
const BOW_AT = 340

export const TeacherVsEngineerScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOp = interpolate(frame, [0, 22], [0, 1], clamp)
  const groundOp = interpolate(frame, [8, 28], [0, 1], clamp)
  const arrowS = spring({ fps, frame: frame - ARROW_AT, config: { damping: 14, mass: 0.8 }, from: 0, to: 1 })
  const bowT = interpolate(frame, [BOW_AT, BOW_AT + 40], [0, 1], clamp)

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 75, fontWeight: 800,
        color: INK, opacity: titleOp, letterSpacing: 1,
      }}>
        Зарплата в Україні (на місяць)
      </div>

      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: W, height: 3,
        background: `${INK}55`, opacity: groundOp,
      }} />

      {PEOPLE.map((p, i) => {
        const figS = spring({ fps, frame: frame - 10 - i * 22, config: { damping: 14, mass: 0.85 }, from: 0, to: 1 })
        const barS = spring({ fps, frame: frame - 80 - i * 16, config: { damping: 20, mass: 1.2 }, from: 0, to: 1 })
        const dipS = spring({ fps, frame: frame - 55 - i * 10, config: { damping: 13 }, from: 0, to: 1 })

        const barH = p.barH * barS
        const figTop = GROUND - barH - FIG_SIZE
        const bow = p.id === 'teacher' ? bowT * 30 : 0
        const yellowText = p.id === 'waiter' ? '#7A6820' : INK

        return (
          <div key={p.id}>
            {/* Bar */}
            <div style={{
              position: 'absolute',
              left: p.cx - BAR_W / 2,
              top: GROUND - barH,
              width: BAR_W,
              height: barH,
              background: p.color,
              border: `3px solid ${INK}`,
              borderRadius: '12px 12px 0 0',
            }} />

            {/* Diploma above head */}
            {p.hasDiploma && (
              <div style={{
                position: 'absolute',
                left: p.cx - 48,
                top: figTop - 105,
                opacity: dipS,
                transform: `scale(${dipS})`,
                transformOrigin: 'bottom center',
              }}>
                <BookPencil size={102} color={p.color} />
              </div>
            )}

            {/* Figure */}
            <div style={{
              position: 'absolute',
              left: p.cx - FIG_W / 2,
              top: figTop + bow,
              opacity: figS,
              transform: `scale(${figS})`,
              transformOrigin: 'bottom center',
            }}>
              <PersonPencil size={FIG_SIZE} color={p.color} />
            </div>

            {/* Name label */}
            <div style={{
              position: 'absolute',
              left: p.cx - 210,
              top: GROUND + 27,
              width: 420,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 48,
              fontWeight: 700,
              color: INK,
              opacity: figS,
            }}>
              {p.label}
            </div>

            {/* Sub label */}
            <div style={{
              position: 'absolute',
              left: p.cx - 210,
              top: GROUND + 93,
              width: 420,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 33,
              fontWeight: 500,
              color: '#6E685A',
              opacity: figS,
            }}>
              {p.sub}
            </div>

            {/* Salary inside bar */}
            <div style={{
              position: 'absolute',
              left: p.cx - BAR_W / 2,
              top: GROUND - barH + 16,
              width: BAR_W,
              textAlign: 'center',
              fontFamily: montserrat.fontFamily,
              fontSize: 34,
              fontWeight: 900,
              color: yellowText,
              opacity: interpolate(barS, [0.85, 1], [0, 1], clamp),
            }}>
              {p.salary}
            </div>
          </div>
        )
      })}

      {/* Arrow: waiter bar top → teacher bar top */}
      <svg
        style={{ position: 'absolute', left: 0, top: 0, width: W, height: 1080, opacity: arrowS, pointerEvents: 'none' }}
        viewBox={`0 0 ${W} 1080`}
      >
        <defs>
          <marker id="arrT" markerWidth="14" markerHeight="10" refX="14" refY="5" orient="auto">
            <polygon points="0 0, 14 5, 0 10" fill="#BC5147" />
          </marker>
        </defs>
        {/* Horizontal line at waiter bar top — only spans between the two bars */}
        <line
          x1={1342} y1={GROUND - 315}
          x2={676}   y2={GROUND - 315}
          stroke="#BC5147" strokeWidth={4} strokeDasharray="12 7"
          markerEnd="url(#arrT)"
        />
        {/* Vertical drop to teacher bar top */}
        <line
          x1={676} y1={GROUND - 315}
          x2={676} y2={GROUND - 210}
          stroke="#BC5147" strokeWidth={4}
        />
        {/* Text below the horizontal line */}
        <text x={1009} y={GROUND - 282}
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontWeight={900} fontSize={30} fill="#BC5147"
        >
          офіціант заробляє більше!
        </text>
      </svg>
    </AbsoluteFill>
  )
}
