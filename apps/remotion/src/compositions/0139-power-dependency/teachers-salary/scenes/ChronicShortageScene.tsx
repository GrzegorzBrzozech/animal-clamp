import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground, PersonPencil, BuildingPencil, INK, PASTEL } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

const W = 1920
const H = 1080
const GROUND = 840
const DIVIDER = 860 // x where classroom ends / open space begins

// Three specialists walking away from classroom
const SPECS = [
  { id: 'math',   label: 'Математик',   icon: '📐', color: PASTEL.green,  startDelay: 40,  walkDelay: 100 },
  { id: 'it',     label: 'Програміст',  icon: '💻', color: PASTEL.blue,   startDelay: 60,  walkDelay: 120 },
  { id: 'lang',   label: 'Лінгвіст',   icon: '🔤', color: PASTEL.yellow, startDelay: 80,  walkDelay: 145 },
] as const

const CLASSROOM_AT = 0
const SPEC_APPEAR_AT = 50
const WALK_START = 90
const WALK_END = 260

export const ChronicShortageScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const classroomS = spring({ fps, frame: frame - CLASSROOM_AT, config: { damping: 16, mass: 1 }, from: 0, to: 1 })

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Left half: classroom background */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: DIVIDER,
        height: H,
        background: '#EDE7D055',
      }} />

      {/* Right half: open space / freedom */}
      <div style={{
        position: 'absolute',
        left: DIVIDER,
        top: 0,
        width: W - DIVIDER,
        height: H,
        background: '#D6EFD855',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: montserrat.fontFamily, fontSize: 44, fontWeight: 800, color: INK,
        opacity: interpolate(frame, [0, 22], [0, 1], clamp),
      }}>
        Хронічний дефіцит вчителів з потрібних предметів
      </div>

      {/* Ground */}
      <div style={{
        position: 'absolute', left: 0, top: GROUND, width: W, height: 3,
        background: `${INK}55`,
      }} />

      {/* School building (far left) */}
      <div style={{
        position: 'absolute',
        left: 30,
        top: GROUND - 600 * classroomS,
        opacity: classroomS,
        transform: `scaleY(${classroomS})`,
        transformOrigin: 'bottom center',
      }}>
        <BuildingPencil size={640} color="#BFC2BE" />
      </div>

      {/* Open space: grass strips */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: DIVIDER + 80 + i * 260,
          top: GROUND - 18,
          width: 180,
          height: 18,
          background: '#8FBC8F',
          borderRadius: '50% 50% 0 0',
          opacity: classroomS * 0.7,
        }} />
      ))}

      {/* Sun in open space */}
      <div style={{
        position: 'absolute',
        left: W - 200,
        top: 120,
        fontSize: 80,
        opacity: classroomS,
      }}>
        ☀️
      </div>

      {/* Three specialists walking out */}
      {SPECS.map((s, i) => {
        const specS = spring({ fps, frame: frame - SPEC_APPEAR_AT - s.startDelay, config: { damping: 14, mass: 0.85 }, from: 0, to: 1 })

        // Walk: starts just inside classroom door (x=680), walks to x=1500+
        const walkT = interpolate(frame, [WALK_START + s.walkDelay, WALK_END + s.walkDelay], [0, 1], clamp)
        const walkX = interpolate(walkT, [0, 1], [560 + i * 50, 1600 + i * 40])

        // Figures shrink as they walk away (perspective)
        const figSizeScale = interpolate(walkT, [0, 1], [1, 0.35])
        const figSize = Math.round(180 * figSizeScale)
        const figW = Math.round(figSize * (170 / 220))

        // Fade out at the horizon
        const horizonFade = interpolate(walkT, [0.8, 1], [1, 0.3], clamp)

        return (
          <div key={s.id}>
            {/* Figure */}
            <div style={{
              position: 'absolute',
              left: walkX - figW / 2,
              top: GROUND - figSize,
              opacity: specS * horizonFade,
              transform: `scale(${specS})`,
              transformOrigin: 'bottom center',
            }}>
              <PersonPencil size={figSize} color={s.color} facing={1} />
            </div>

            {/* Icon label above figure */}
            <div style={{
              position: 'absolute',
              left: walkX - 24,
              top: GROUND - figSize - 52 * figSizeScale,
              fontSize: Math.round(44 * figSizeScale),
              opacity: specS * horizonFade,
              pointerEvents: 'none',
            }}>
              {s.icon}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
