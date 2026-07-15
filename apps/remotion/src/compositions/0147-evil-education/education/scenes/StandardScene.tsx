import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground, StampMark } from '~/characters'
import { colors, fontSizes, fontWeights, spacing } from '../paper'

export const StandardScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const box = spring({ fps, frame, config: { damping: 14, mass: 0.8 } })
  const sealScale = frame < 70 ? 2.4 : interpolate(spring({
    fps,
    frame: frame - 70,
    config: { damping: 9 },
  }), [0, 1], [2.4, 1])
  const sealShown = frame >= 70

  return (
    <AbsoluteFill>
      <PaperBackground/>
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
      }}>
        <div
          style={{
            position: 'relative',
            width: 980,
            padding: `${spacing.xl}px ${spacing.lg}px`,
            background: colors.surface,
            border: `6px solid ${colors.text}`,
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
            transform: `scale(${box})`,
            opacity: box,
            boxShadow: '0 16px 0 #00000012',
          }}
        >
          <span style={{
            fontSize: fontSizes.caption,
            fontWeight: fontWeights.black,
            letterSpacing: 3,
            color: colors.textMuted,
          }}>
            🔒 ДЕРЖАВНИЙ СТАНДАРТ ОСВІТИ
          </span>
          <span style={{ fontSize: 110, fontWeight: fontWeights.black, color: colors.primary, lineHeight: 1 }}>
            КОМПЕТЕНТНІСТЬ
          </span>
          <span style={{
            fontSize: fontSizes.body,
            fontWeight: fontWeights.bold,
            color: colors.text,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            результати навчання
          </span>

          {/* wax seal in the corner */}
          {sealShown ? (
            <div style={{ position: 'absolute', right: 50, bottom: 10, transform: `scale(${sealScale})` }}>
              <StampMark size={180} color={colors.danger} label="ОБОВ'ЯЗКОВО"/>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
