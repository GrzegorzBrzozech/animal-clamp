import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fadeIn, popIn, slideIn } from "~/lib/animations";
import { light, radii } from "~/theme";
import { montserrat } from "~/lib/fonts";

type Props = {
  emoji: string;
  date: string;
  title: string;
  subtitle?: string;
  accent?: string;
  children?: React.ReactNode;
};

/**
 * Shared hero layout for a single regulation beat: a date pill, a big emoji
 * disc (echoing the flow-strip discs), a title and optional subtitle. Sits in
 * the upper stage; the persistent flow strip lives below it in the composition.
 */
export const RegHero: React.FC<Props> = ({
  emoji,
  date,
  title,
  subtitle,
  accent = light.primary,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const disc = popIn(frame, fps, 6);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <div
        style={{
          transform: `translateY(${slideIn(frame, 0, 18, 30)}px)`,
          opacity: fadeIn(frame, 0, 16),
          background: accent,
          color: "#fff",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "10px 28px",
          borderRadius: radii.pill,
        }}
      >
        {date}
      </div>

      <div
        style={{
          transform: `scale(${disc})`,
          width: 210,
          height: 210,
          borderRadius: "50%",
          background: light.bgAlt,
          border: `6px solid ${accent}`,
          boxShadow: `0 0 60px ${accent}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 104,
        }}
      >
        {emoji}
      </div>

      <div
        style={{
          opacity: fadeIn(frame, 14, 16),
          transform: `translateY(${slideIn(frame, 14, 16, 24)}px)`,
          fontSize: 64,
          fontWeight: 900,
          color: light.text,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            opacity: fadeIn(frame, 22, 16),
            fontSize: 36,
            fontWeight: 500,
            color: light.textMuted,
            textAlign: "center",
            maxWidth: 1100,
          }}
        >
          {subtitle}
        </div>
      ) : null}

      {children}
    </div>
  );
};
