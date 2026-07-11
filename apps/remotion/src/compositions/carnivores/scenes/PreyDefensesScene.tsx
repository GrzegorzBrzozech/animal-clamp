import React from "react";
import { Background, Scene, AnimatedText, Card } from "~/components";
import { colors, fontSizes, spacing } from "../paper";

const DEFENSES = [
  { icon: "☠️", label: "отрута" },
  { icon: "🛡️", label: "панцир" },
  { icon: "🎭", label: "мімікрія" },
  { icon: "💨", label: "швидкість" },
];

export const PreyDefensesScene: React.FC = () => (
  <Background>
    <Scene gap={spacing.lg}>
      <AnimatedText size={fontSizes.title} delay={0}>Жертви захищаються</AnimatedText>
      <div style={{ display: "flex", gap: spacing.lg }}>
        {DEFENSES.map((d, i) => (
          <Card key={d.label} delay={20 + i * 12} style={{ width: 300 }}>
            <div style={{ fontSize: 100 }}>{d.icon}</div>
            <div style={{ fontSize: fontSizes.body, fontWeight: 700, color: colors.text }}>{d.label}</div>
          </Card>
        ))}
      </div>
    </Scene>
  </Background>
);
