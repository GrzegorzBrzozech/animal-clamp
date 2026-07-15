import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { HousePencil, PagePencil, PaperBackground, PersonPencil, StampMark } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const FAIL_AT = 30
const REFUSE_AT = 78

export const FailRefuseScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const kidIn = spring({ fps, frame, config: { damping: 14 } })
  const failStamp = spring({ fps, frame: frame - FAIL_AT, config: { damping: 10, mass: 0.6 } })
  const schoolIn = spring({ fps, frame: frame - REFUSE_AT, config: { damping: 13 } })
  const cross = interpolate(frame, [REFUSE_AT + 14, REFUSE_AT + 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* the child + failed attestation sheet */}
      <div style={{
        position: 'absolute',
        left: 470,
        top: 600,
        transform: `translate(-50%,-50%) scale(${kidIn})`,
        opacity: kidIn,
      }}>
        <PersonPencil size={280} facing={1} color={colors.secondary}/>
      </div>
      <div style={{
        position: 'absolute',
        left: 720,
        top: 600,
        transform: `translate(-50%,-50%) rotate(-6deg) scale(${kidIn})`,
        opacity: kidIn,
      }}>
        <PagePencil size={220} lines={4}/>
      </div>
      <div style={{
        position: 'absolute',
        left: 730,
        top: 630,
        transform: `translate(-50%,-50%) rotate(10deg) scale(${failStamp})`,
        opacity: failStamp,
      }}>
        <StampMark size={150} color={colors.danger} label="2"/>
      </div>

      {/* the school refuses to continue */}
      <div style={{
        position: 'absolute',
        left: 1360,
        top: 600,
        transform: `translate(-50%,-50%) scale(${schoolIn})`,
        opacity: schoolIn,
      }}>
        <HousePencil size={340} heart/>
      </div>
      <svg viewBox="0 0 360 360" width={360} height={360}
           style={{ position: 'absolute', left: 1230, top: 490, overflow: 'visible', opacity: cross }}>
        <line x1={30} y1={30} x2={230} y2={230} stroke={colors.danger} strokeWidth={16} strokeLinecap="round"
              strokeDasharray={`${cross * 300} 400`}/>
        <line x1={230} y1={30} x2={30} y2={230} stroke={colors.danger} strokeWidth={16} strokeLinecap="round"
              strokeDasharray={`${Math.max(0, cross - 0.5) * 2 * 300} 400`}/>
      </svg>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={4} slide={0} maxWidth="94%">
          Не склав атестацію — <span style={{ color: colors.danger }}>дім заборонено!</span>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
