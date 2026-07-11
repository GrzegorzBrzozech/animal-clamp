import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText, Card } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

const METHODS = [
  { icon: "🎨", label: "вальдорфський", delay: 30 },
  { icon: "🧩", label: "монтессорі", delay: 55 },
  { icon: "🙃", label: "щось екстравагантне", delay: 80, wacky: true },
];

export const AltMethodsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: spacing.xl }}>
        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={0}>
          Альтернативні підходи
        </AnimatedText>
        <div style={{ display: "flex", gap: spacing.lg, alignItems: "center" }}>
          {METHODS.map((m) => {
            const t = frame - m.delay;
            const wobble = m.wacky && t > 0 ? Math.sin(t * 0.18) * 7 : 0;
            const float = m.wacky && t > 0 ? Math.sin(t * 0.14) * 10 : 0;
            return (
              <Card key={m.label} delay={m.delay} style={{ width: 340, height: 300, justifyContent: "center", transform: `rotate(${wobble}deg) translateY(${float}px)` }}>
                <div style={{ fontSize: 120, transform: m.wacky ? "rotate(8deg)" : undefined }}>{m.icon}</div>
                <div style={{ fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: m.wacky ? colors.secondary : colors.text, textAlign: "center" }}>
                  {m.label}
                </div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
