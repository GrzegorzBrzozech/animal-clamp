/**
 * Scene template: Data visualization — 100-cell grid
 *
 * Layout: великий stat-number зліва (+ підпис + легенда),
 * сітка 10×10 кольорових клітинок справа (стагерована поява),
 * підпис джерела внизу.
 *
 * Замінити: CATEGORIES (label/count/color), великий відсоток, тексти.
 * Сума count у CATEGORIES має = 100 (або скоригуй ROWS×COLS).
 *
 * Реальний приклад: victimless-crimes/scenes/PrisonChartScene.tsx
 */
import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { INK, PaperBackground } from '~/characters'
import { colors, fontSizes, fontWeights } from '../paper'

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const }
const fade  = (f: number, s: number, d = 20) => interpolate(f, [s, s + d], [0, 1], clamp)

// ── Data ──────────────────────────────────────────────────────────────────────
type Category = { label: string; count: number; color: string }

const CATEGORIES: Category[] = [
  { label: 'Категорія A (42%)', count: 42, color: '#4E8A5A' },
  { label: 'Категорія B (22%)', count: 22, color: '#BC5147' },
  { label: 'Категорія C (14%)', count: 14, color: '#8B4A9E' },
  { label: 'Категорія D (5%)',  count:  5, color: '#B07E2B' },
  { label: 'Категорія E (5%)',  count:  5, color: '#3E6E9E' },
  { label: 'Категорія F (4%)',  count:  4, color: '#D68A4E' },
  { label: 'Категорія G (4%)',  count:  4, color: '#7B2020' },
  { label: 'Категорія H (2%)',  count:  2, color: '#9E7A2A' },
  { label: 'Інші',              count:  2, color: '#BFC2BE' },
]

// Build flat 100-cell color array ordered by category
const CELLS: string[] = []
for (const cat of CATEGORIES) {
  for (let i = 0; i < cat.count; i++) CELLS.push(cat.color)
}

// ── Grid layout ───────────────────────────────────────────────────────────────
const ROWS      = 10
const COLS      = 10
const CELL_W    = 65
const CELL_H    = 65
const CELL_GAP  = 10
const GRID_H    = ROWS * CELL_H + (ROWS - 1) * CELL_GAP
const GRID_LEFT = 940
const GRID_TOP  = (1080 - GRID_H) / 2 + 20

const ANIM_START    = 10
const ANIM_PER_CELL = 1.5

// ── Scene ─────────────────────────────────────────────────────────────────────
export const DataVizGridScene: React.FC = () => {
  const frame = useCurrentFrame()

  const titleOp  = fade(frame,  5, 20)
  const bigNumOp = fade(frame, 25, 30)
  const legendOp = fade(frame, 60, 30)
  const sourceOp = fade(frame, 80, 25)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Title */}
      <div style={{ position: 'absolute', top: 56, left: 150, opacity: titleOp }}>
        <span style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: colors.text }}>
          Назва{' '}
          <span style={{ color: colors.danger }}>підзаголовок</span>
        </span>
        <div style={{ fontSize: 28, fontWeight: fontWeights.semibold, color: colors.textMuted, marginTop: 6 }}>
          Пояснення · Джерело, рік
        </div>
      </div>

      {/* Big stat number */}
      <div style={{ position: 'absolute', top: 230, left: 150, opacity: bigNumOp }}>
        <div style={{ fontSize: 160, fontWeight: fontWeights.black, color: colors.success, lineHeight: 1 }}>
          42%
        </div>
        <div style={{ fontSize: 30, fontWeight: fontWeights.bold, color: colors.text, marginTop: 6 }}>
          відбувають за{' '}
          <span style={{ color: colors.success, fontWeight: fontWeights.black }}>категорію A</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: fontWeights.semibold, color: colors.textMuted, marginTop: 8 }}>
          Деталі / уточнення
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', top: 590, left: 150, opacity: legendOp,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {CATEGORIES.slice(0, 7).map((cat) => (
          <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 22, height: 22, background: cat.color, borderRadius: 4,
              border: `1.5px solid ${INK}44`, flexShrink: 0,
            }} />
            <span style={{ fontSize: 22, fontWeight: fontWeights.semibold, color: colors.text }}>
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Source */}
      <div style={{
        position: 'absolute', bottom: 44, left: 150,
        fontSize: 22, color: colors.textMuted, opacity: sourceOp,
      }}>
        Джерело: Назва джерела, рік
      </div>

      {/* 100-cell grid (right panel) */}
      <div style={{ position: 'absolute', left: GRID_LEFT, top: GRID_TOP }}>
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const cellIndex = row * COLS + col
            const cellAnim  = ANIM_START + cellIndex * ANIM_PER_CELL
            const cellOp    = interpolate(frame, [cellAnim, cellAnim + 12], [0, 1], clamp)
            return (
              <div key={`${row}-${col}`} style={{
                position:  'absolute',
                left:      col * (CELL_W + CELL_GAP),
                top:       row * (CELL_H + CELL_GAP),
                width:     CELL_W,
                height:    CELL_H,
                background: CELLS[cellIndex] ?? '#BFC2BE',
                border:    `2px solid ${INK}`,
                borderRadius: 4,
                opacity:   cellOp,
              }} />
            )
          }),
        )}
      </div>

      {/* Grid legend label */}
      <div style={{
        position: 'absolute', left: GRID_LEFT, top: GRID_TOP + GRID_H + 18,
        fontSize: 22, color: colors.textMuted, fontWeight: fontWeights.semibold,
        opacity: fade(frame, 55, 25),
      }}>
        1 клітинка = ~N одиниць
      </div>
    </AbsoluteFill>
  )
}
