import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { INK } from '~/characters/svg/_pencil'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const STEPS = [
  { label: 'звіти', icon: '📄', color: colors.primary },
  { label: 'іспити', icon: '✍️', color: colors.secondary },
  { label: 'атестації', icon: '📋', color: colors.danger },
]

/** A recurring-cycle badge that pops in around the circle. */
const Node: React.FC<{ step: (typeof STEPS)[number]; angle: number; at: number; R: number }> = ({
  step,
  angle,
  at,
  R,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 12, mass: 0.6 } })
  const cx = 960 + Math.cos(angle) * R
  const cy = 560 + Math.sin(angle) * R
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        transform: `translate(-50%,-50%) scale(${s})`,
        opacity: s,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: colors.surface,
        border: `5px solid ${step.color}`,
        borderRadius: 20,
        padding: '18px 28px',
        minWidth: 190,
      }}
    >
      <span style={{ fontSize: 54 }}>{step.icon}</span>
      <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color: colors.text }}>{step.label}</span>
    </div>
  )
}

export const NotEndScene: React.FC = () => {
  const frame = useCurrentFrame()
  const R = 250
  // three circular arrows connecting the nodes (the never-ending loop)
  const arcOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const spin = frame * 0.9

  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* circular loop arrows */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%"
           style={{ position: 'absolute', inset: 0, opacity: arcOpacity }}>
        <g transform={`rotate(${spin} 960 560)`}>
          {[0, 1, 2].map((i) => {
            const a0 = angles[i] + 0.5
            const a1 = angles[(i + 1) % 3] - 0.5
            const x0 = 960 + Math.cos(a0) * R
            const y0 = 560 + Math.sin(a0) * R
            const x1 = 960 + Math.cos(a1 + (i === 2 ? Math.PI * 2 : 0)) * R
            const y1 = 560 + Math.sin(a1 + (i === 2 ? Math.PI * 2 : 0)) * R
            return (
              <path
                key={i}
                d={`M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}`}
                fill="none"
                stroke={INK}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.5}
              />
            )
          })}
        </g>
      </svg>

      {STEPS.map((step, i) => (
        <Node key={step.label} step={step} angle={angles[i]} at={20 + i * 26} R={R}/>
      ))}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={4} slide={0} maxWidth="92%">
          І це <span style={{ color: colors.danger }}>не кінець</span>
        </AnimatedText>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 100, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={130} slide={0} color={colors.textMuted}>
          🧸 покажи на ведмедику, чому тебе навчили вдома?!
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
