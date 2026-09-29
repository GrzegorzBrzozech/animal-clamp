import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PaperBackground, JarPencil } from "~/characters";
import { ReceiptCard } from "~/components";
import { fadeIn } from "~/lib/animations";
import { colors, fontWeights } from "../paper";

/**
 * 79–92 s · Висновок. Revision 3: replaced the small looped video + two
 * blocks of restated narration text with the two things actually asked for:
 * the FULL waterfall receipt (postачальник → націнка → податки/опекс → the
 * total, after a rule, no video needed to say it), and a plain visual
 * equation — jar × volume = the real 2025 number already cited at
 * `taxesList` — instead of another paragraph of prose.
 */
export const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eqOp = [fadeIn(frame, 210, 16), fadeIn(frame, 230, 16), fadeIn(frame, 250, 16), fadeIn(frame, 270, 16)];
  const sumS = spring({ fps, frame: frame - 290, config: { damping: 12, mass: 0.75 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 90, top: 200 }}>
        <ReceiptCard
          header="АТБ-МАРКЕТ"
          delay={10}
          width={760}
          rotate={-1}
          rows={[
            { label: "Ціна постачальника", value: "100,00 грн", delay: 20, muted: true },
            { label: "Торгова націнка", value: "37,00 грн", delay: 45, color: colors.secondary },
            { label: "Податки", value: "−25,00 грн", delay: 90, indent: true, muted: true },
            { label: "Операційні витрати", value: "−10,00 грн", delay: 115, indent: true, muted: true },
            { label: "Чистий прибуток", value: "2,00 грн", delay: 160, total: true, color: colors.success },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 1070, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: eqOp[0] }}>
          <JarPencil size={110} />
          <span style={{ fontSize: 64, fontWeight: fontWeights.black, color: colors.success }}>2 грн</span>
        </div>

        <span style={{ fontSize: 56, fontWeight: fontWeights.bold, color: colors.textMuted, opacity: eqOp[1] }}>×</span>

        <span style={{ fontSize: 48, fontWeight: fontWeights.bold, color: colors.text, opacity: eqOp[2] }}>мільйони банок щодня</span>

        <span style={{ fontSize: 56, fontWeight: fontWeights.bold, color: colors.textMuted, opacity: eqOp[3] }}>=</span>

        <div style={{ opacity: sumS, transform: `scale(${sumS})`, textAlign: "center" }}>
          <div style={{ fontSize: 96, fontWeight: fontWeights.black, color: colors.success, lineHeight: 1 }}>3,43 млрд грн</div>
          <div style={{ fontSize: 26, color: colors.textMuted, marginTop: 8 }}>чистий прибуток АТБ за 2025 рік</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
