import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const YEARS = [
  { year: "завжди", label: "паспорти - зазвичай не потрібні" },
  { year: "1914", label: "паспорт - інструмент боротьби з ворогом!" },
  { year: "сьогодні", label: "жити без паспорта – заборонено" },
];

const Timeline: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [at, at + 45], [0, 950], clamp);
  return (
    <div style={{ position: "absolute", left: 930, top: 720, width: 920 }}>
      <div style={{ height: 6, width: lineW, background: colors.secondary, borderRadius: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        {YEARS.map((y, i) => {
          const dotOp = interpolate(frame, [at + i * 15, at + i * 15 + 12], [0, 1], clamp);
          return (
            <div
              key={y.year}
              style={{
                opacity: dotOp,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                width: 170,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: i === 2 ? colors.danger : colors.secondary,
                  border: "3px solid #3C3630",
                }}
              />
              <div style={{ fontSize: 26, fontWeight: 900, color: i === 2 ? colors.danger : colors.text }}>
                {y.year}
              </div>
              <div style={{ fontSize: 22, color: colors.textMuted, textAlign: "center", lineHeight: 1.3 }}>
                {y.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TemporaryScene: React.FC = () => {
  const frame = useCurrentFrame();

  const barIn   = interpolate(frame, [8, 28], [0, 1], clamp);
  const photoOp = interpolate(frame, [4, 22], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* German passport evolution 1871–2018 */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 250,
          width: 840,
          height: 600,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "6px 8px 0 #00000033",
          opacity: photoOp,
        }}
      >
        <Img
          src={staticFile("projects/passport-ww1/german-passport-types.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8px 14px",
            background: "#00000099",
            color: "#fff",
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          Паспорти Німеччини: 1871–2018
        </div>
      </div>

      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          left: 890,
          top: 100,
          width: 8,
          height: 800,
          background: colors.danger,
          borderRadius: 6,
          transform: `scaleY(${barIn})`,
          transformOrigin: "top",
        }}
      />

      {/* Narration */}
      <div style={{ position: "absolute", left: 940, top: 120, width: 1010 }}>
        <AnimatedText size={72} weight={fontWeights.black} delay={10} align="left" maxWidth={980}>
          Тепер це
        </AnimatedText>
        <AnimatedText size={72} weight={fontWeights.black} delay={10} align="left" maxWidth={980} color={colors.danger}>
         назавжди
        </AnimatedText>

        <div style={{ height: 44 }} />

        <AnimatedText
          size={fontSizes.body}
          weight={fontWeights.bold}
          delay={55}
          align="left"
          maxWidth={940}
          color={colors.text}
        >
          А хто ж вам паспорт буде видавати, якщо держави не буде?!{" "}
          <span style={{ color: colors.primary, fontWeight: fontWeights.black }}>
            Як це, паспорт не треба?!
          </span>{" "}
          Що ж ти за людина така – без папірця спеціального!
        </AnimatedText>
      </div>

      <Timeline at={120} />
    </AbsoluteFill>
  );
};
