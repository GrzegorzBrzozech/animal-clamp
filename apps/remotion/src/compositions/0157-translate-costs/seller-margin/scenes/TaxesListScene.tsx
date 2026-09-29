import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { fadeIn, slideIn, stagger } from '~/lib/animations'
import { MEDIA } from '../plan'
import { colors, fontWeights } from '../paper'

const TAXES = ['Податок на прибуток', 'Податки на зарплату', 'ПДВ', 'Місцеві податки', 'Акцизи', 'Інше']

/**
 * 52–67 s · Перелік податків → реальні цифри 2025. Revision 4: the
 * `taxesSource` screenshot is GONE — no more tiny/unreadable documents in
 * this scene at all. ALL text (list + both figures) lives in the left
 * column; the right column is a single large `tax-office-2.webp` photo,
 * framed to its own aspect so it isn't cropped in half.
 */
export const TaxesListScene: React.FC = () => {
  const frame = useCurrentFrame()
  const numOp = fadeIn(frame, 220, 16)
  const numY = slideIn(frame, 220, 16, 30)
  const profitOp = fadeIn(frame, 300, 16)
  const profitY = slideIn(frame, 300, 16, 30)

  return (
    <AbsoluteFill>
      <PaperBackground/>
      <PaperBackground/>

      <div style={{ position: 'absolute', left: 150, top: 80, width: 760 }}>
        <div style={{ fontSize: 38, fontWeight: fontWeights.black, color: colors.text, marginBottom: 20 }}>Податки:
        </div>
        {TAXES.map((tax, i) => {
          const delay = stagger(i, 22, 10)
          const op = fadeIn(frame, delay, 14)
          const y = slideIn(frame, delay, 14, 26)
          return (
            <div key={tax} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: op,
              transform: `translateY(${y}px)`,
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 26, color: colors.secondary }}>▪</span>
              <span style={{ fontSize: 32, fontWeight: fontWeights.bold, color: colors.text }}>{tax}</span>
            </div>
          )
        })}

        <div style={{ marginTop: 30, opacity: numOp, transform: `translateY(${numY}px)` }}>
          <div style={{ fontSize: 26, color: colors.textMuted }}>сплачено до бюджетів (2025)</div>
          <div style={{ fontSize: 92, fontWeight: fontWeights.black, color: colors.danger, lineHeight: 1 }}>37,88 млрд
            грн
          </div>
        </div>

        <div style={{ marginTop: 26, opacity: profitOp, transform: `translateY(${profitY}px)` }}>
          <div style={{ fontSize: 26, color: colors.textMuted }}>а чистий прибуток компанії</div>
          <div style={{ fontSize: 92, fontWeight: fontWeights.black, color: colors.success, lineHeight: 1 }}>3,43 млрд
            грн
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 160, top: 55 }}>
        <PhotoPin src={MEDIA.taxOffice} width={700} height={930} delay={15} rotate={-1.5} objectFit="cover"/>
      </div>
    </AbsoluteFill>
  )
}
