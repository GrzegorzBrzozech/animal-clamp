import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { AnimatedText, ReceiptCard } from '~/components'
import { fadeIn, slideIn } from '~/lib/animations'
import { colors } from '../paper'

/**
 * 31.1–48 s · Собівартість вкладає лише матеріали й роботу виробничого
 * персоналу (враховано) — але не роботу політиків і чиновників, які
 * забезпечують ліквідність цих коштів (не враховано). Кадри-делеї на рядках
 * відповідають реальному ASR-таймінгу трьох речень (31.06 / 38.24 / 44.82s
 * від початку аудіо → локальні 0 / 215 / 413 кадрів цієї сцени).
 */
export const CostBreakdownScene: React.FC = () => {
  const frame = useCurrentFrame()
  const questionOp = fadeIn(frame, 413, 18)
  const questionX = slideIn(frame, 413, 18, -24)

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center' }}>
        <AnimatedText
          size={52}
          weight={900}
          delay={5}
          color="#FFFFFF"
          maxWidth="85%"
          style={{ textShadow: '0 2px 12px #00000090' }}
        >
          Що входить у собівартість
        </AnimatedText>
      </div>

      <div style={{ position: 'absolute', left: '50%', top: 330, transform: 'translateX(-50%)' }}>
        <ReceiptCard
          header="Рахунок на монету в 10-коп."
          delay={5}
          width={840}
          rotate={-0.5}
          rows={[
            { label: 'Матеріали', value: '✓ враховано', delay: 30, color: colors.success },
            { label: 'Робота персоналу', value: '✓ враховано', delay: 90, color: colors.success },
            { label: 'Бюрократія', value: 'не враховано', delay: 215, color: colors.danger },
          ]}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 130,
          display: 'flex',
          justifyContent: 'center',
          opacity: questionOp,
          transform: `translateX(${questionX}px)`,
        }}
      >
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: '#E8776A',
            textShadow: '0 2px 12px #00000090',
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          А може варто було б порахувати і це?..
        </div>
      </div>
    </AbsoluteFill>
  )
}
