import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { INK } from '~/characters/svg/_pencil'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const NODES = [
  { label: 'Прусія', icon: '🏰', at: 120 },
  { label: 'Європа', icon: '🗺️', at: 170 },
  { label: 'США', icon: '🗽', at: 220 },
  { label: 'світ', icon: '🌍', at: 270 },
]

const XS = [340, 780, 1200, 1620]

const Node: React.FC<{ label: string; icon: string; at: number; x: number; highlight: boolean }> = ({
  label,
  icon,
  at,
  x,
  highlight,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 12, mass: 0.6 } })
  const color = highlight ? colors.danger : colors.primary
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 600,
        transform: `translate(-50%,-50%) scale(${s})`,
        opacity: s,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        background: colors.surface,
        border: `5px solid ${color}`,
        borderRadius: 20,
        padding: '22px 24px',
        width: 240,
      }}
    >
      <span style={{ fontSize: 70 }}>{icon}</span>
      <span style={{ fontSize: fontSizes.body, fontWeight: 900, color }}>{label}</span>
    </div>
  )
}

export const SpreadScene: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* connecting arrows */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {XS.slice(0, -1).map((x, i) => {
          const a = interpolate(frame, [NODES[i + 1].at - 18, NODES[i + 1].at], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const x0 = x + 130
          const x1 = XS[i + 1] - 130
          return (
            <g key={i}>
              <line x1={x0} y1={600} x2={x1} y2={600} stroke={INK} strokeWidth={6} strokeLinecap="round"
                    strokeDasharray={`${a * (x1 - x0)} 400`}/>
              {a > 0.9 ? <polygon points={`${x1 - 16},584 ${x1 + 6},600 ${x1 - 16},616`} fill={INK}/> : null}
            </g>
          )
        })}
      </svg>

      {NODES.map((n, i) => (
        <Node key={n.label} {...n} x={XS[i]} highlight={i === NODES.length - 1}/>
      ))}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="92%">
          Дай королю <span style={{ color: colors.danger }}>Herr скляний</span>... <br/> він і сам зганьбиться, і світ замарає
        </AnimatedText>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 200, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={190} slide={0} color={colors.textMuted}>
          маршрут державної освіти
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
