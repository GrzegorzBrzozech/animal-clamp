import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { BuildingPencil, HousePencil, PagePencil, PaperBackground, StampMark } from '~/characters'
import { INK } from '~/characters/svg/_pencil'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const ITEMS = [
  { label: 'прикріпитися до школи', at: 40 },
  { label: 'погодження директора', at: 100 },
  { label: 'план навчання', at: 147 },
]

const Check: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - at, config: { damping: 13 } })
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      opacity: s,
      transform: `translateX(${(1 - s) * -30}px)`,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        border: `4px solid ${colors.primary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primary,
        fontSize: 30,
        fontWeight: 900,
      }}>
        ✓
      </div>
      <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text }}>{label}</span>
    </div>
  )
}

// Layout anchors (1920px canvas):
//   House center  480   →  arrow (580…860)  →   School center  960
//                                                    Page center  1350 + Stamp 1490

export const AttachScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const houseIn = spring({ fps, frame, config: { damping: 14 } })
  const schoolIn = spring({ fps, frame: frame - 14, config: { damping: 14 } })
  const arrow = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* дім  ──────────────────────────────── center 480 */}
      <div style={{
        position: 'absolute',
        left: 480,
        top: 400,
        transform: `translate(-50%,-50%) scale(${houseIn})`,
        opacity: houseIn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <HousePencil size={200}/>
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.success }}>дім</span>
      </div>

      {/* стрілка: від правого краю будинку (580) до лівого краю школи (865) */}
      <svg
        viewBox="0 0 260 60"
        width={280}
        height={65}
        style={{ position: 'absolute', left: 580, top: 372, overflow: 'visible', opacity: arrow }}
      >
        <line x1={0} y1={30} x2={220} y2={30} stroke={INK} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={`${arrow * 220} 400`}/>
        <polygon points="220,16 250,30 220,44" fill={INK} opacity={arrow > 0.9 ? 1 : 0}/>
      </svg>

      {/* державна школа  ───────────────────── center 960 */}
      <div style={{
        position: 'absolute',
        left: 960,
        top: 400,
        transform: `translate(-50%,-50%) scale(${schoolIn})`,
        opacity: schoolIn,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <BuildingPencil size={190}/>
        <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.black, color: colors.primary }}>державна школа</span>
      </div>

      {/* документ  ─────────────────────────── center 1350 */}
      <div style={{
        position: 'absolute',
        left: 1350,
        top: 400,
        transform: `translate(-50%,-50%) rotate(-5deg) scale(${schoolIn})`,
        opacity: schoolIn,
      }}>
        <PagePencil size={230} lines={5}/>
      </div>

      {/* печатка  ──────────────────────────── center 1490 */}
      <div style={{
        position: 'absolute',
        left: 1360,
        top: 450,
        transform: `translate(-50%,-50%) rotate(9deg) scale(${spring({
          fps,
          frame: frame - 120,
          config: { damping: 10 },
        })})`,
        opacity: interpolate(frame, [60, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <StampMark size={120} color={colors.primary} check/>
      </div>

      {/* чекліст під будинком, вирівняний з лівим краєм контенту */}
      <div style={{ position: 'absolute', left: 650, top: 700, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {ITEMS.map((it) => (
          <Check key={it.label} label={it.label} at={it.at}/>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="90%">
          Спочатку — <span style={{ color: colors.primary }}>бюрократія</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
