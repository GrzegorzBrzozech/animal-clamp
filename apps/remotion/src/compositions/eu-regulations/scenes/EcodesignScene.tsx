import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn } from "~/lib/animations";
import { BigNumber } from "~/components";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";
import { RegHero } from "./_RegHero";

/** When the "5 років / 7 років" requirement sentence begins (≈17.6s − 13.7s). */
const DETAIL_AT = 112;

const Stat: React.FC<{ value: number; caption: string; delay: number }> = ({
  value,
  caption,
  delay,
}) => (
  <div
    style={{
      background: light.bgAlt,
      border: `2px solid ${light.border}`,
      borderRadius: 24,
      padding: "18px 40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 320,
    }}
  >
    <BigNumber value={value} delay={delay} countFrames={26} suffix=" р." color={light.primary} size={96} />
    <span style={{ fontSize: 30, fontWeight: 600, color: light.textMuted, marginTop: 4 }}>{caption}</span>
  </div>
);

export const EcodesignScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <RegHero
      emoji="🔧"
      date="Червень 2025"
      title="Ecodesign — ремонтопридатність"
      accent={light.primary}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          marginTop: 8,
          opacity: fadeIn(frame, DETAIL_AT - 4, 14),
          fontFamily: montserrat.fontFamily,
        }}
      >
        <Stat value={5} caption="оновлень ОС" delay={DETAIL_AT} />
        <Stat value={7} caption="доступних запчастин" delay={DETAIL_AT + 8} />
      </div>
    </RegHero>
  );
};
