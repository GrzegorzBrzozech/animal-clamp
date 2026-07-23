import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { INK, PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp)

export const RothbardScene: React.FC = () => {
  const frame = useCurrentFrame()

  const quoteOp = fade(frame, 85, 45)
  const accentOp = fade(frame, 80, 25)
  const nameOp = fade(frame, 80, 25)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Vertical accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 798,
          top: 80,
          width: 5,
          height: 920,
          background: colors.danger,
          borderRadius: 3,
          opacity: accentOp,
        }}
      />

      {/* Left — portrait */}
      <div style={{ position: 'absolute', left: 80, top: 100 }}>
        <PhotoPin
          src="projects/victimless-crimes/CloseupRothbard.jpg"
          width={520}
          height={650}
          rotate={-2}
          delay={0}
          hold="pin"
          caption="Мюррей Ротбард"
          date="1926–1995"
        />
      </div>

      {/* Left — book cover */}
      <div style={{ position: 'absolute', left: 510, top: 620 }}>
        <PhotoPin
          src="projects/victimless-crimes/TheEthicsofLiberty.jpg"
          width={250}
          height={320}
          rotate={3}
          delay={15}
          hold="tape"
          caption="Етика свободи"
          date="1982"
        />
      </div>

      {/* Right — author name */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 840,
          opacity: nameOp,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: fontWeights.black,
            color: colors.text,
            letterSpacing: 1,
          }}
        >
          Мюррей Ротбард
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: fontWeights.semibold,
            color: colors.textMuted,
            marginTop: 4,
          }}
        >
          «Етика свободи», 1982
        </div>
      </div>

      {/* Decorative large quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 248,
          left: 826,
          fontSize: 220,
          fontWeight: fontWeights.black,
          color: `${INK}10`,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: accentOp,
        }}
      >
        "
      </div>
      {/* Decorative large quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 848,
          left: 826,
          fontSize: 220,
          fontWeight: fontWeights.black,
          color: `${INK}10`,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: accentOp,
        }}
      >
        "
      </div>
      {/* Quote text */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 840,
          width: 1060,
          opacity: quoteOp,
        }}
      >
        <div
          style={{
            fontSize: fontSizes.body,
            fontWeight: fontWeights.semibold,
            color: colors.text,
            lineHeight: 1.65,
          }}
        >
          Криміналізація добровільних дій між дорослими
          — це <span style={{ color: colors.danger, fontWeight: fontWeights.black }}>
не захист прав, а їх порушення</span>.
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: fontSizes.body,
            fontWeight: fontWeights.semibold,
            color: colors.text,
            lineHeight: 1.65,
            opacity: fade(frame, 55, 30),
          }}
        >
          Держава{' '}
          <span style={{ color: colors.danger, fontWeight: fontWeights.black }}>
            перетворює себе на постраждалого
          </span>{' '}
          там, де реального постраждалого немає.
        </div>
      </div>

    </AbsoluteFill>
  )
}
