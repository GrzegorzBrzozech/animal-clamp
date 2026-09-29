import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, ReceiptCard } from "~/components";
import { colors } from "../paper";

/**
 * 36–44 s · Концепція 3 — Чиста маржа. Revision 3: dropped the restated
 * footnote ("усе, що реально залишається власнику магазину" — just repeats
 * the narration) and enlarged the receipt substantially; the final row now
 * reads as a total via the rule above it, no label needed.
 */
export const NetProfitScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />

    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
      <AnimatedText size={58} weight={900} delay={10} color={colors.text}>
        Чиста маржа (прибуток): <span style={{ color: colors.success }}>1–4%</span>
      </AnimatedText>
    </div>

    <div style={{ position: "absolute", left: "50%", top: 380, transform: "translateX(-50%)" }}>
      <ReceiptCard
        header="АТБ-МАРКЕТ"
        delay={10}
        width={780}
        rotate={0}
        rows={[
          { label: "Ціна на полиці", value: "137,00 грн", delay: 20 },
          { label: "Податки й витрати", value: "−135,00 грн", delay: 75, muted: true },
          { label: "Чистий прибуток", value: "≈2,00 грн", delay: 135, total: true, color: colors.success },
        ]}
      />
    </div>
  </AbsoluteFill>
);
