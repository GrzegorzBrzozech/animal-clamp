import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { BuildingPencil, INK, PaperBackground, PASTEL, PersonPencil } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const W = 1920
const GROUND = 860
const FIG_SIZE = 210
const FIG_W = Math.round(FIG_SIZE * (170 / 220))

// Timing
const BUILDINGS_AT = 0
const SCHOOL_AT = 40
const TEACHER_AT = 80
const WALK_RIGHT_END = 160  // teacher reaches companies
const PAUSE_AT = 200
const WALK_LEFT_START = 240
const WALK_LEFT_END = 340
const ENTER_AT = 380

export const VoluntaryTeachingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Buildings appear
  const bldS = spring({ fps, frame: frame - BUILDINGS_AT, config: { damping: 16, mass: 1 }, from: 0, to: 1 })
  const schoolS = spring({ fps, frame: frame - SCHOOL_AT, config: { damping: 14, mass: 0.9 }, from: 0, to: 1 })

  // Teacher position: starts at center (x=960), walks right, pauses, walks left to school
  const walkRight = interpolate(frame, [TEACHER_AT, WALK_RIGHT_END], [0, 1], clamp)
  const walkLeft = interpolate(frame, [WALK_LEFT_START, WALK_LEFT_END], [0, 1], clamp)
  const enterT = interpolate(frame, [ENTER_AT, ENTER_AT + 40], [0, 1], clamp)

  const teacherX = frame < WALK_LEFT_START
    ? interpolate(walkRight, [0, 1], [960, 1380])
    : interpolate(walkLeft, [0, 1], [1380, 340])

  const teacherOp = interpolate(frame, [TEACHER_AT, TEACHER_AT + 20], [0, 1], clamp) * (1 - enterT * 0.6)

  // Teacher faces right while walking right, faces left while walking left
  const teacherFacing: 1 | -1 = frame < WALK_LEFT_START ? 1 : -1

  // "?" bubble appears during pause (hesitation)
  const questionOp = interpolate(frame, [PAUSE_AT, PAUSE_AT + 20, WALK_LEFT_START - 10, WALK_LEFT_START], [0, 1, 1, 0], clamp)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 44, fontWeight: 800, color: INK,
        opacity: interpolate(frame, [0, 22], [0, 1], clamp),
      }}>
        Освітній доброволець
      </div>

      {/* Ground */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: W, height: 3,
        background: `${INK}55`,
        opacity: interpolate(frame, [5, 25], [0, 1], clamp),
      }}/>

      {/* Skyscrapers (right side) */}
      {[
        { x: 1100, w: 110, h: 340, color: PASTEL.gray },
        { x: 1260, w: 130, h: 420, color: '#BFC2BE' },
        { x: 1440, w: 100, h: 280, color: PASTEL.gray },
        { x: 1580, w: 120, h: 500, color: '#C8CCB8' },
        { x: 1730, w: 90, h: 360, color: PASTEL.gray },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: b.x,
          top: GROUND - b.h * bldS,
          width: b.w,
          height: b.h * bldS,
          background: b.color,
          border: `3px solid ${INK}`,
          borderRadius: '4px 4px 0 0',
          opacity: bldS,
        }}>
          {/* Windows */}
          {[0.2, 0.4, 0.6, 0.8].map(fy => (
            [0.25, 0.65].map(fx => (
              <div key={`${fy}-${fx}`} style={{
                position: 'absolute',
                left: `${fx * 100}%`,
                top: `${fy * 100}%`,
                width: 12,
                height: 14,
                background: PASTEL.yellow,
                border: `1.5px solid ${INK}`,
                transform: 'translate(-50%, -50%)',
              }}/>
            ))
          ))}
        </div>
      ))}

      {/* School building (left side) */}
      <div style={{
        position: 'absolute',
        left: 160,
        top: GROUND - 400 * schoolS,
        opacity: schoolS,
        transform: `scaleY(${schoolS})`,
        transformOrigin: 'bottom center',
      }}>
        <BuildingPencil size={440}/>
      </div>

      {/* Teacher figure */}
      <div style={{
        position: 'absolute',
        left: teacherX - FIG_W / 2,
        top: GROUND - FIG_SIZE,
        opacity: teacherOp,
        transform: `scaleX(${teacherFacing})`,
        transformOrigin: `${FIG_W / 2}px center`,
      }}>
        <PersonPencil size={FIG_SIZE} color={PASTEL.blue}/>
      </div>

      {/* Question mark above teacher during pause */}
      <div style={{
        position: 'absolute',
        left: teacherX - 24,
        top: GROUND - FIG_SIZE - 70,
        fontFamily: montserrat.fontFamily,
        fontSize: 64,
        fontWeight: 900,
        color: INK,
        opacity: questionOp,
      }}>
        ?
      </div>
    </AbsoluteFill>
  )
}
