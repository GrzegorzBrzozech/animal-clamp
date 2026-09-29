import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { PriceTagPencil } from "~/characters";
import { AnimatedText } from "~/components";
import { fadeIn, slideIn } from "~/lib/animations";
import { colors, fontWeights } from "../paper";

/**
 * 14.8–31.1 s · «Проте відомо декілька речей»: (1) 2026-го карбують монету
 * номіналом 10 коп. (2) собівартість такої монети — у 5 разів вища за
 * номінал. Кадри-делеї відповідають реальному ASR-таймінгу (17.2s / 22.58s
 * від початку аудіо → локальні 71 / 233 кадри цієї сцени). Фон — реальне
 * відео верстата, тому кожен факт лежить у темній картці для читабельності
 * (сам номінал монети вже видно на кадрі — тут лише цифри, яких на екрані
 * нема).
 */
export const FactsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const row1Op = fadeIn(frame, 71, 16);
  const row1X = slideIn(frame, 71, 16, -30);
  const row2Op = fadeIn(frame, 233, 16);
  const row2X = slideIn(frame, 233, 16, -30);
  const times5 = spring({ fps, frame: frame - 260, config: { damping: 11, mass: 0.7 } });

  const card: React.CSSProperties = {
    background: "#000000b3",
    borderRadius: 20,
    padding: "28px 44px",
    boxShadow: "0 20px 50px #00000060",
  };

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <AnimatedText size={54} weight={900} delay={5} color="#FFFFFF" style={{ textShadow: "0 2px 12px #00000090" }}>
          Що відомо
        </AnimatedText>
      </div>

      {/* Fact 1: coin still minted in 2026 */}
      <div
        style={{
          position: "absolute",
          left: 180,
          top: 340,
          maxWidth: 1000,
          opacity: row1Op,
          transform: `translateX(${row1X}px)`,
          ...card,
        }}
      >
        <div style={{ fontSize: 42, fontWeight: fontWeights.bold, color: "#FFFFFF", lineHeight: 1.3 }}>
          У 2026 році Нацбанк все ще карбує монету номіналом <span style={{ color: colors.secondary }}>10 копійок</span>.
        </div>
      </div>

      {/* Fact 2: cost is 5x the face value */}
      <div
        style={{
          position: "absolute",
          left: 180,
          top: 660,
          display: "flex",
          alignItems: "center",
          gap: 40,
          opacity: row2Op,
          transform: `translateX(${row2X}px)`,
          ...card,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <PriceTagPencil size={140} text="10к" color={colors.secondary} />
          <div
            style={{
              fontSize: 64,
              fontWeight: fontWeights.black,
              color: colors.danger,
              opacity: times5,
              transform: `scale(${times5})`,
            }}
          >
            ×5
          </div>
          <PriceTagPencil size={140} text="50к" color={colors.danger} />
        </div>
        <div style={{ maxWidth: 760, fontSize: 42, fontWeight: fontWeights.bold, color: "#FFFFFF", lineHeight: 1.3 }}>
          Собівартість випуску такої монети — у <span style={{ color: colors.danger }}>5 разів вища</span> за номінал.
        </div>
      </div>
    </AbsoluteFill>
  );
};
