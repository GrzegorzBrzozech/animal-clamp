import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

// ── Wavy S-curve trails — all depart from sign arrow tip (x≈860) ─────────────
const P_PROD = 'M 860 472 C 1060 472 1165 182 1385 308 C 1605 434 1755 242 1875 268'
const P_EXCH = 'M 860 477 C 1060 448 1165 460 1385 505 C 1605 550 1755 490 1875 505'
const P_COER = 'M 860 483 C 1060 608 1190 830 1390 812 C 1590 794 1762 842 1875 848'

const fade = (frame: number, start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

const clipW = (frame: number, start: number, dur = 84) =>
  interpolate(frame, [start, start + dur], [0, 1920], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

// ── Arrow-shaped directional sign on a post ───────────────────────────────────
const Signpost: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - 100, config: { damping: 13, mass: 0.8 } })

  const SIGN_W = 270
  const SIGN_H = 65
  const RECT_W = Math.round(SIGN_W * 0.78) // 210px rectangular body; post centered here
  const POST_H = 158

  return (
    <div style={{
      position: 'absolute',
      left: 620,
      top: 440,
      width: SIGN_W,
      height: SIGN_H + POST_H,
      transformOrigin: 'bottom center',
      transform: `scale(${s})`,
      opacity: s,
    }}>
      {/* arrow sign */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: SIGN_W, height: SIGN_H,
        background: 'linear-gradient(175deg, #D4B878 0%, #B89048 100%)',
        border: '4px solid #7A5F38',
        boxShadow: '4px 5px 0px rgba(0,0,0,0.22)',
        display: 'flex', alignItems: 'center', paddingLeft: 20,
        clipPath: 'polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%)',
      }}>
        <span style={{
          fontSize: 28, fontWeight: fontWeights.black,
          color: '#2A1A06', letterSpacing: 1.5, whiteSpace: 'nowrap',
        }}>Багатство</span>
      </div>

      {/* post — under rectangular body, not under arrow tip */}
      <div style={{
        position: 'absolute', top: SIGN_H - 4, left: RECT_W / 2 - 9,
        width: 18, height: POST_H,
        background: 'linear-gradient(90deg, #8B6D45 0%, #A8855A 50%, #7A5F38 100%)',
        borderRadius: '3px 3px 5px 5px', boxShadow: '2px 3px 0px rgba(0,0,0,0.18)',
      }}/>

      <div style={{
        position: 'absolute', bottom: -6, left: RECT_W / 2 - 27,
        width: 54, height: 10,
        background: 'rgba(0,0,0,0.13)', borderRadius: '50%', filter: 'blur(3px)',
      }}/>
    </div>
  )
}

// ── Small trail label ─────────────────────────────────────────────────────────
const TrailLabel: React.FC<{
  at: number; x: number; y: number; text: string; accent: string
}> = ({ at, x, y, text, accent }) => {
  const frame = useCurrentFrame()
  const op = fade(frame, at, 16)
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      opacity: op, pointerEvents: 'none',
      fontSize: fontSizes.caption, fontWeight: fontWeights.black,
      color: accent, whiteSpace: 'nowrap',
      background: '#FFFAEE', padding: '4px 11px',
      borderRadius: 7, border: `1.5px solid ${accent}55`,
    }}>
      {text}
    </div>
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────
export const OppIntroScene: React.FC = () => {
  const frame = useCurrentFrame()

  const zoneBgOp = fade(frame, 200, 28)
  const cw1 = clipW(frame, 110)
  const cw2 = clipW(frame, 128)
  const cw3 = clipW(frame, 146)
  // zone phrase labels appear later — synced with narration words
  const greenTxtOp = fade(frame, 200)
  const redTxtOp = fade(frame, 210)

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* ── Zone backgrounds (appear early as context) ───────────────────── */}
      <div style={{
        position: 'absolute', left: 958, top: 98, width: 930, height: 608,
        opacity: zoneBgOp,
        background: `${colors.success}14`,
        border: `2px solid ${colors.success}2E`,
        borderRadius: 28,
      }}/>
      <div style={{
        position: 'absolute', left: 958, top: 726, width: 930, height: 298,
        opacity: zoneBgOp,
        background: `${colors.danger}14`,
        border: `2px solid ${colors.danger}2E`,
        borderRadius: 28,
      }}/>

      {/* ── Zone phrase labels — appear with narration ───────────────────── */}
      <div style={{
        position: 'absolute', left: 1580, top: 118,
        opacity: greenTxtOp,
        fontSize: fontSizes.body, fontWeight: fontWeights.bold,
        color: colors.success, fontStyle: 'italic',
      }}>
        ☮️ мир
      </div>
      <div style={{
        position: 'absolute', left: 1580, top: 940,
        opacity: redTxtOp,
        fontSize: fontSizes.body, fontWeight: fontWeights.bold,
        color: colors.danger, fontStyle: 'italic',
      }}>
        ⚔️ конфлікт
      </div>

      {/* ── SVG trails ───────────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id="oi-c1">
            <rect x="0" y="0" width={cw1} height="1080"/>
          </clipPath>
          <clipPath id="oi-c2">
            <rect x="0" y="0" width={cw2} height="1080"/>
          </clipPath>
          <clipPath id="oi-c3">
            <rect x="0" y="0" width={cw3} height="1080"/>
          </clipPath>
        </defs>

        <path d={P_PROD} fill="none" stroke={colors.success} strokeWidth={22} opacity={0.14} clipPath="url(#oi-c1)"/>
        <path d={P_EXCH} fill="none" stroke={colors.success} strokeWidth={22} opacity={0.14} clipPath="url(#oi-c2)"/>
        <path d={P_COER} fill="none" stroke={colors.danger} strokeWidth={22} opacity={0.14} clipPath="url(#oi-c3)"/>

        <path d={P_PROD} fill="none" stroke={colors.success} strokeWidth={11}
              strokeDasharray="3 14" strokeLinecap="round" opacity={0.80} clipPath="url(#oi-c1)"/>
        <path d={P_EXCH} fill="none" stroke={colors.success} strokeWidth={11}
              strokeDasharray="3 14" strokeLinecap="round" opacity={0.80} clipPath="url(#oi-c2)"/>
        <path d={P_COER} fill="none" stroke={colors.danger} strokeWidth={11}
              strokeDasharray="3 14" strokeLinecap="round" opacity={0.80} clipPath="url(#oi-c3)"/>
      </svg>

      {/* ── Trail labels — appear ~70% through each trail draw ────────────── */}
      <TrailLabel at={175} x={1365} y={238} text="Зробив сам" accent={colors.success}/>
      <TrailLabel at={190} x={1365} y={548} text="Обмінявся" accent={colors.success}/>
      <TrailLabel at={210} x={1365} y={870} text="Відібрав" accent={colors.danger}/>

      {/* ── Oppenheimer portrait — 60% larger ───────────────────────────── */}
      <div style={{ position: 'absolute', left: 50, top: 180 }}>
        <PhotoPin
          src="projects/oppenheimer/00-00_franz-oppenheimer-portrait.jpg"
          width={528}
          height={672}
          delay={5}
          rotate={-2}
          caption="Франц Оппенгаймер"
          date="1864–1943"
        />
      </div>

      {/* ── Arrow signpost ───────────────────────────────────────────────── */}
      <Signpost/>
    </AbsoluteFill>
  )
}
