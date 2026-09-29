import React from 'react'
import { AbsoluteFill } from 'remotion'
import { Stamp } from '~/components'
import { colors } from '../paper'

/**
 * 0–14.8 s · НБУ ніколи не розголошує собівартість монет та банкнот — це
 * державна й комерційна таємниця Банкнотно-монетного двору. Фон — реальні
 * кадри карбувального верстата (див. `plan.ts` MEDIA), тому тут лише текст +
 * штамп «ТАЄМНИЦЯ», що лягає слемом рівно тоді, коли диктор називає її
 * таємницею (7.3s → кадр 219).
 */
export const SecrecyScene: React.FC = () => {
  return (
    <AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 460,
          transform: 'translateX(-50%)',
        }}
      >
        <Stamp delay={219} color={colors.border} rotate={-9} fontSize={182} sub="* а нащо вам це знати, хлопи?">
          Таємниця
        </Stamp>
      </div>

    </AbsoluteFill>
  )
}
