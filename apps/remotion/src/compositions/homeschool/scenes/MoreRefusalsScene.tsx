import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const Bar: React.FC<{ label: string; value: string; height: number; color: string; delay: number; x: number }> = ({
  label,
  value,
  height,
  color,
  delay,
  x,
}) => {
  const frame = useCurrentFrame()
  const grow = interpolate(frame, [delay, delay + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const h = height * grow
  return (
    <div style={{
      position: 'absolute',
      left: x,
      bottom: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: fontSizes.title, fontWeight: 900, color, opacity: grow, marginBottom: 8 }}>{value}</span>
      <div
        style={{
          width: 200,
          height: h,
          background: `${color}33`,
          border: `5px solid ${color}`,
          borderRadius: 12,
        }}
      />
      <span style={{
        fontSize: fontSizes.body,
        fontWeight: fontWeights.black,
        color: colors.text,
        marginTop: 14,
      }}>{label}</span>
    </div>
  )
}

export const MoreRefusalsScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBackground/>

      <Bar label="Відмови" value="дофіга" height={450} color={colors.danger} delay={18} x={540}/>
      <Bar label="Погодження" value="ніфіга" height={50} color={colors.success} delay={40} x={1080}/>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={4} slide={0} maxWidth="92%">
          Точна пропорція <span style={{ color: colors.danger }}>результатів</span> розгляду заяв
        </AnimatedText>
      </div>
    </AbsoluteFill>
  )
}
