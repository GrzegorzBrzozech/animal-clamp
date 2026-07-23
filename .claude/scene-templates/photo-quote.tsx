/**
 * Scene template: Photo + Quote
 *
 * Layout: фото автора зліва (+ книга-inset) + вертикальна риска + цитата справа.
 * Використовується для: мислитель / автор / книга / цитата.
 *
 * Замінити: <id>, Photo.jpg, Book.jpg, тексти, кольори.
 */
import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { INK, PaperBackground } from '~/characters'
import { PhotoPin } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const fade = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp)

export const PhotoQuoteScene: React.FC = () => {
  const frame = useCurrentFrame()
  const accentOp = fade(frame, 10, 25)
  const nameOp   = fade(frame, 10, 25)
  const quoteOp  = fade(frame, 30, 45)
  const quote2Op = fade(frame, 55, 30)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Vertical accent bar */}
      <div style={{
        position: 'absolute', left: 798, top: 80, width: 5, height: 920,
        background: colors.danger, borderRadius: 3, opacity: accentOp,
      }} />

      {/* Left — portrait */}
      <div style={{ position: 'absolute', left: 80, top: 100 }}>
        <PhotoPin
          src="projects/<id>/Photo.jpg"
          width={520} height={650}
          rotate={-2} delay={0} hold="pin"
          caption="Ім'я" date="рр–рр"
        />
      </div>

      {/* Left — book inset (опційно: прибрати якщо книги немає) */}
      <div style={{ position: 'absolute', left: 510, top: 620 }}>
        <PhotoPin
          src="projects/<id>/Book.jpg"
          width={250} height={320}
          rotate={3} delay={15} hold="tape"
          caption="Назва книги" date="рік"
        />
      </div>

      {/* Right — author name + source */}
      <div style={{ position: 'absolute', top: 150, left: 840, opacity: nameOp }}>
        <div style={{ fontSize: 38, fontWeight: fontWeights.black, color: colors.text }}>
          Ім'я Прізвище
        </div>
        <div style={{ fontSize: 28, fontWeight: fontWeights.semibold, color: colors.textMuted, marginTop: 4 }}>
          «Назва книги», рік
        </div>
      </div>

      {/* Decorative opening quote mark */}
      <div style={{
        position: 'absolute', top: 248, left: 826, fontSize: 220,
        fontWeight: fontWeights.black, color: `${INK}10`, lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', opacity: accentOp,
      }}>"</div>

      {/* Decorative closing quote mark */}
      <div style={{
        position: 'absolute', top: 848, left: 826, fontSize: 220,
        fontWeight: fontWeights.black, color: `${INK}10`, lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', opacity: accentOp,
      }}>"</div>

      {/* Quote text */}
      <div style={{ position: 'absolute', top: 400, left: 840, width: 1060, opacity: quoteOp }}>
        <div style={{
          fontSize: fontSizes.body, fontWeight: fontWeights.semibold,
          color: colors.text, lineHeight: 1.65,
        }}>
          Перший абзац цитати —{' '}
          <span style={{ color: colors.danger, fontWeight: fontWeights.black }}>ключова думка</span>.
        </div>
        <div style={{
          marginTop: 36, fontSize: fontSizes.body, fontWeight: fontWeights.semibold,
          color: colors.text, lineHeight: 1.65, opacity: quote2Op,
        }}>
          Другий абзац цитати.
        </div>
      </div>
    </AbsoluteFill>
  )
}
