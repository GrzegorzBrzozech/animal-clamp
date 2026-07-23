import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, PaperBackground } from '~/characters'
import { montserrat } from '~/lib/fonts'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }

interface Ruler {
  name: string;
  country: string;
  age: number;
  avg: number;
  delta: number;
  photo: string;
  isStalin?: boolean;
}

const RULERS: Ruler[] = [
  {
    name: 'Єлизавета II',
    country: 'Британія, жінки',
    age: 96,
    avg: 83,
    delta: 13,
    photo: 'projects/politicians-longevity/elizabeth2.jpg',
  },
  {
    name: 'Цзян Цземінь',
    country: 'Китай, чоловіки',
    age: 96,
    avg: 75,
    delta: 21,
    photo: 'projects/politicians-longevity/jiang-zemin.jpg',
  },
  {
    name: 'Йосіп Броз Тіто',
    country: 'Югославія, чоловіки',
    age: 87,
    avg: 67,
    delta: 20,
    photo: 'projects/politicians-longevity/tito.jpg',
  },
  {
    name: 'Франсиско Франко',
    country: 'Іспанія, чоловіки',
    age: 82,
    avg: 70,
    delta: 12,
    photo: 'projects/politicians-longevity/franco.jpg',
  },
  {
    name: 'Іосіф Сталін',
    country: 'СРСР (1953), чоловіки',
    age: 74,
    avg: 58,
    delta: 16,
    photo: 'projects/politicians-longevity/stalin.jpg',
    isStalin: true,
  },
]

// Whisper-derived offsets from scene start (16.04s):
// Elizabeth 18.84→f84, Jiang 24.56→f256, Tito 28.88→f385, Franco 32.72→f500, Stalin 36.36→f610
const CARD_FRAMES = [84, 256, 385, 500, 610]

const PORTRAIT_SIZE = 140

interface RulerCardProps {
  ruler: Ruler;
  at: number;
}

const RulerCard: React.FC<RulerCardProps> = ({ ruler, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const appear = spring({ fps, frame: frame - at, config: { damping: 16, mass: 0.85 }, from: 0, to: 1 })
  const deltaAppear = spring({ fps, frame: frame - at - 18, config: { damping: 14 }, from: 0, to: 1 })

  const borderColor = ruler.isStalin ? '#BC5147' : `${INK}33`
  const ageColor = ruler.isStalin ? '#BC5147' : '#f59e0b'
  const ringColor = ruler.isStalin ? '#BC5147' : '#f59e0b'

  return (
    <div style={{
      transform: `scale(${appear}) translateY(${interpolate(appear, [0, 1], [40, 0], clamp)}px)`,
      opacity: appear,
      background: '#F5ECD4',
      border: `3px solid ${borderColor}`,
      borderRadius: 22,
      padding: '28px 24px 24px',
      width: 330,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      boxShadow: `0 4px 24px ${INK}18`,
    }}>

      {/* Portrait */}
      <div style={{
        width: PORTRAIT_SIZE,
        height: PORTRAIT_SIZE,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `4px solid ${ringColor}`,
        boxShadow: `0 2px 12px ${INK}28`,
        marginBottom: 12,
        flexShrink: 0,
      }}>
        <Img
          src={staticFile(ruler.photo)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* Name */}
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 22,
        fontWeight: 800,
        color: INK,
        textAlign: 'center',
        lineHeight: 1.2,
        marginBottom: 6,
      }}>
        {ruler.name}
      </div>

      {/* Age — big */}
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 92,
        fontWeight: 900,
        color: ageColor,
        lineHeight: 1,
      }}>
        {ruler.age}
      </div>
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 17,
        fontWeight: 600,
        color: '#6E685A',
        marginBottom: 8,
      }}>
        р. (вік смерті)
      </div>

      {/* Divider */}
      <div style={{ width: '80%', height: 2, background: `${INK}22`, margin: '6px 0 8px' }}/>

      {/* Country avg */}
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 15,
        color: '#6E685A',
        textAlign: 'center',
        lineHeight: 1.3,
        marginBottom: 2,
      }}>
        {ruler.country}
      </div>
      <div style={{
        fontFamily: montserrat.fontFamily,
        fontSize: 40,
        fontWeight: 700,
        color: '#60a5fa',
        lineHeight: 1,
        marginBottom: 8,
      }}>
        {ruler.avg} р.
      </div>

      {/* Delta */}
      <div style={{
        transform: `scale(${deltaAppear})`,
        opacity: deltaAppear,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: '#4E8A5A22',
        border: '2px solid #4E8A5A',
        borderRadius: 12,
        padding: '5px 14px',
      }}>
        <span style={{ fontSize: 28, color: '#4E8A5A' }}>↑</span>
        <span style={{
          fontFamily: montserrat.fontFamily,
          fontSize: 32,
          fontWeight: 900,
          color: '#4E8A5A',
        }}>
          +{ruler.delta} р.
        </span>
      </div>
    </div>
  )
}

export const RulersComparisonScene: React.FC = () => {

  return (
    <AbsoluteFill>
      <PaperBackground/>

      {/* Cards row */}
      <div style={{
        position: 'absolute',
        top: 50,
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
        padding: '0 48px',
      }}>
        {RULERS.map((ruler, i) => (
          <RulerCard key={ruler.name} ruler={ruler} at={CARD_FRAMES[i]}/>
        ))}
      </div>
    </AbsoluteFill>
  )
}
