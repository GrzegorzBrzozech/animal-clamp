import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { GrandThrone, INK, PaperBackground, PASTEL, PersonPencil, PoliticianPencil } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const W = 1920
const GROUND = 800

// Character sizes
const MINISTER_SIZE = 280
const TEACHER_SIZE = 240
const STUDENT_SIZE = 180

const THRONE_H = 180

// X positions (left to right): student, teacher, minister
const STUDENT_X = 220
const TEACHER_X = 860
const MINISTER_X = 1480

// Timing
const APPEAR_AT = 0
const TURN_AT = 60   // teacher turns to face minister
const MONEY_AT = 130  // money flies
const HAPPY_AT = 200  // teacher happy (jumps)
const SAD_AT = 280  // teacher turns back, both sad

const MONEY_X0 = MINISTER_X - 80
const MONEY_X1 = TEACHER_X + 80
const MONEY_Y = GROUND - MINISTER_SIZE * 0.7

// Simple coin stack SVG
const CoinStack: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <svg
    style={{ position: 'absolute', left: x - 36, top: y - 50, pointerEvents: 'none', opacity }}
    viewBox="0 0 72 60"
    width={72}
    height={60}
  >
    {[36, 24, 12].map((cy, i) => (
      <g key={i}>
        <ellipse cx={36} cy={cy + 6} rx={28} ry={8} fill={PASTEL.yellow} stroke={INK} strokeWidth={2.5}/>
        <ellipse cx={36} cy={cy} rx={28} ry={8} fill={PASTEL.yellow} stroke={INK} strokeWidth={2.5}/>
        <text x={36} y={cy + 5} textAnchor="middle" fontSize={10} fontWeight={900} fill="#7A6820">₴</text>
      </g>
    ))}
  </svg>
)

export const MinisterClientScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const allS = spring({ fps, frame: frame - APPEAR_AT, config: { damping: 14, mass: 0.9 }, from: 0, to: 1 })

  // Teacher facing: starts facing left (toward student), turns to face minister (right) at TURN_AT
  const turnT = interpolate(frame, [TURN_AT, TURN_AT + 20], [0, 1], clamp)
  const turnBackT = interpolate(frame, [SAD_AT, SAD_AT + 20], [0, 1], clamp)
  // 0 = faces student (left), 1 = faces minister (right)
  const facingMinister = turnT * (1 - turnBackT)
  const teacherFacing: 1 | -1 = facingMinister > 0.5 ? 1 : -1

  // Money animation
  const moneyMoveT = interpolate(frame, [MONEY_AT, MONEY_AT + 50], [0, 1], clamp)
  const moneyX = interpolate(moneyMoveT, [0, 1], [MONEY_X0, MONEY_X1])
  const moneyArcY = interpolate(moneyMoveT, [0, 0.5, 1], [0, -60, 0])
  const moneyOp = interpolate(
    frame,
    [MONEY_AT - 5, MONEY_AT + 8, MONEY_AT + 52, MONEY_AT + 65],
    [0, 1, 1, 0],
    clamp,
  )

  // Teacher happy: jumps up
  const jumpH = spring({ fps, frame: frame - HAPPY_AT, config: { damping: 8, mass: 0.5 }, from: 0, to: 1 })
  const jumpOff = interpolate(jumpH * (1 - interpolate(frame, [SAD_AT, SAD_AT + 30], [0, 1], clamp)), [0, 1], [0, -40])

  // Sad: both teacher and student droop
  const sadT = interpolate(frame, [SAD_AT + 30, SAD_AT + 60], [0, 1], clamp)
  const droop = sadT * 14

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 46, fontWeight: 800, color: INK,
        opacity: interpolate(frame, [0, 22], [0, 1], clamp),
      }}>
        Хто за послугу платить - той і є клієнтом<br/>
        Решта - глядачі
      </div>

      {/* Ground */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: W, height: 3,
        background: `${INK}55`,
      }}/>

      {/* Student (left) */}
      <div style={{
        position: 'absolute',
        left: STUDENT_X - Math.round(STUDENT_SIZE * (170 / 220)) / 2,
        top: GROUND - STUDENT_SIZE + droop,
        opacity: allS,
        transform: `scale(${allS})`,
        transformOrigin: 'bottom center',
      }}>
        <PersonPencil size={STUDENT_SIZE} color={PASTEL.blue} facing={1}/>
      </div>
      <div style={{
        position: 'absolute',
        left: STUDENT_X - 100,
        top: GROUND + 68,
        width: 200,
        textAlign: 'center',
        fontFamily: montserrat.fontFamily,
        fontSize: 40,
        fontWeight: 700,
        color: sadT > 0.5 ? '#BC5147' : INK,
        opacity: allS,
      }}>
        Учень
      </div>

      {/* Sad "X" over student */}
      <div style={{
        position: 'absolute',
        left: STUDENT_X - 30,
        top: GROUND - STUDENT_SIZE - 60,
        fontFamily: montserrat.fontFamily,
        fontSize: 60,
        color: '#BC5147',
        fontWeight: 900,
        opacity: sadT,
      }}>
        😔
      </div>

      {/* Teacher (center) */}
      <div style={{
        position: 'absolute',
        left: TEACHER_X - Math.round(TEACHER_SIZE * (170 / 220)) / 2,
        top: GROUND - TEACHER_SIZE + jumpOff,
        opacity: allS,
        transform: `scale(${allS}) scaleX(${teacherFacing})`,
        transformOrigin: `${Math.round(TEACHER_SIZE * (170 / 220)) / 2}px bottom`,
      }}>
        <PersonPencil size={TEACHER_SIZE} color={PASTEL.green}/>
      </div>
      <div style={{
        position: 'absolute',
        left: TEACHER_X - 100,
        top: GROUND + 68,
        width: 200,
        textAlign: 'center',
        fontFamily: montserrat.fontFamily,
        fontSize: 40,
        fontWeight: 700,
        color: INK,
        opacity: allS,
      }}>
        Вчитель
      </div>

      {/* Money annotation when teacher is happy */}
      <div style={{
        position: 'absolute',
        left: TEACHER_X - 60,
        top: GROUND - TEACHER_SIZE - 70,
        fontFamily: montserrat.fontFamily,
        fontSize: 52,
        opacity: interpolate(frame, [HAPPY_AT + 20, HAPPY_AT + 40, SAD_AT - 10, SAD_AT], [0, 1, 1, 0], clamp),
      }}>
        😊
      </div>

      {/* Throne + minister (right) */}
      <GrandThrone
        opacity={allS}
        style={{
          position: 'absolute',
          left: MINISTER_X - 160,
          top: GROUND - 400,
          width: 320,
          height: 440,
          transform: `scale(${allS})`,
          transformOrigin: 'bottom center',
        }}
      />
      <div style={{
        position: 'absolute',
        left: MINISTER_X - Math.round(MINISTER_SIZE * (170 / 220)) / 2 + 20,
        top: GROUND - MINISTER_SIZE - THRONE_H * 0.35,
        opacity: allS,
        transform: `scale(${allS})`,
        transformOrigin: 'bottom center',
      }}>
        <PoliticianPencil size={MINISTER_SIZE} facing={-1} tribune={false}/>
      </div>
      <div style={{
        position: 'absolute',
        left: MINISTER_X - 100,
        top: GROUND + 68,
        width: 200,
        textAlign: 'center',
        fontFamily: montserrat.fontFamily,
        fontSize: 40,
        fontWeight: 700,
        color: INK,
        opacity: allS,
      }}>
        Міністр
      </div>

      {/* Flying coins */}
      <CoinStack x={moneyX} y={MONEY_Y + moneyArcY} opacity={moneyOp}/>
    </AbsoluteFill>
  )
}
