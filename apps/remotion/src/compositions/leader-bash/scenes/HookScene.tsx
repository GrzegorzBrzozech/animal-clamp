import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { PaperBackground } from '~/characters'
import { AnimatedText } from '~/components'
import { colors, fontSizes, fontWeights } from '../paper'

/**
 * 0–2.98s · Гачок. Реального відео/фото на цю фразу немає (ще нема що
 * показувати — термін щойно називається) — чиста paper title card, як
 * `hook` у seller-margin, тільки текстова замість цифри.
 *
 * Під час слів "антилідерської коаліції" (word-timing: 1.72–2.88s → кадри
 * ~52–86 у цій сцені) — крихітна емодзі-вставка: 👑 з'являється, ⚔️ дуже
 * швидко залітає й "б'є" по короні, вона падає й зникає. Емодзі замість
 * намальованих об'єктів — навмисно (запит користувача), для секундної
 * репліки не варто малювати окрему пенсіл-сцену.
 */
const CROWN_APPEAR = 48
const SWORD_START = 52
const STRIKE = 70 // right as "коаліції" starts — "coalition strikes the leader down"
const FALL_END = 88 // scene ends at 89 — the fall finishes right at the cut

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame()

  const crownPop = interpolate(frame, [CROWN_APPEAR, CROWN_APPEAR + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2)),
  })
  const crownFallY = interpolate(frame, [STRIKE, FALL_END], [0, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const crownFallRotate = interpolate(frame, [STRIKE, FALL_END], [0, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const crownOpacity = interpolate(frame, [FALL_END - 8, FALL_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Sword swings in fast from the upper right and stops right at STRIKE.
  const swordProgress = interpolate(frame, [SWORD_START, STRIKE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const swordOffset = (1 - swordProgress) * 260
  const swordRotate = -70 + swordProgress * 55
  const swordOpacity = interpolate(frame, [SWORD_START, SWORD_START + 3, STRIKE + 5, STRIKE + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      <PaperBackground/>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 28 }}>
        <AnimatedText size={fontSizes.hero * 0.9} weight={fontWeights.black} color={colors.primary} delay={2}
                      duration={18}>
          Leader Bash
        </AnimatedText>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.semibold} color={colors.text} delay={16}
                      duration={18} maxWidth="80%">
          стратегія антилідерської коаліції
        </AnimatedText>
      </AbsoluteFill>

      {/* crown + sword vignette, timed to "антилідерської коаліції" */}
      <div style={{ position: 'absolute', left: '50%', top: 200, width: 0, height: 0 }}>
        <div
          style={{
            position: 'absolute',
            fontSize: 300,
            transform: `translate(-50%, -50%) translateY(${crownFallY}px) rotate(${crownFallRotate}deg) scale(${crownPop})`,
            opacity: crownOpacity * crownPop,
          }}
        >
          👑
        </div>
        <div
          style={{
            position: 'absolute',
            fontSize: 290,
            transform: `translate(calc(-50% + ${swordOffset}px), -50%) rotate(${swordRotate}deg)`,
            opacity: swordOpacity,
          }}
        >
          🗡️
        </div>
      </div>
    </AbsoluteFill>
  )
}
