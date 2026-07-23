import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { colors, fontSizes, fontWeights } from "../paper";

const fade = (f: number, start: number, dur = 20) => {
  const t = (f - start) / dur;
  return Math.min(1, Math.max(0, t));
};

// Animated half-panel
const Panel: React.FC<{
  side: "left" | "right";
  accent: string;
  icon: string;
  title: string;
  items: string[];
  badge: string;
  at: number;
}> = ({ side, accent, icon, title, items, badge, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ fps, frame: frame - at, config: { damping: 14, mass: 0.7 } });
  const isLeft = side === "left";

  return (
    <div
      style={{
        position: "absolute",
        left: isLeft ? 60 : 990,
        top: 120,
        width: 860,
        height: 840,
        background: isLeft ? `${accent}18` : `${accent}18`,
        border: `6px solid ${accent}55`,
        borderRadius: 32,
        transform: `scale(${s}) translateX(${isLeft ? (1 - s) * -80 : (1 - s) * 80}px)`,
        opacity: s,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        paddingTop: 48,
        gap: 24,
        overflow: "hidden",
      }}
    >
      {/* top badge */}
      <div
        style={{
          background: accent,
          color: "#fff",
          fontSize: fontSizes.caption,
          fontWeight: fontWeights.black,
          letterSpacing: 3,
          padding: "10px 32px",
          borderRadius: 999,
          textTransform: "uppercase" as const,
        }}
      >
        {badge}
      </div>

      {/* icon */}
      <div style={{ fontSize: 100, lineHeight: 1 }}>{icon}</div>

      {/* title */}
      <div
        style={{
          fontSize: fontSizes.heading,
          fontWeight: fontWeights.black,
          color: accent,
          textAlign: "center",
          padding: "0 40px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {/* divider */}
      <div
        style={{
          width: 120,
          height: 4,
          background: `${accent}66`,
          borderRadius: 2,
        }}
      />

      {/* item list */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, padding: "0 48px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: fontSizes.body,
              fontWeight: fontWeights.bold,
              color: colors.text,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: accent,
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// Divider with VS
const Divider: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const op = fade(frame, at, 20);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 950,
          top: 120,
          width: 4,
          height: 840,
          background: `${colors.border}CC`,
          borderRadius: 2,
          opacity: op,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 920,
          top: 500,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: colors.bg,
          border: `3px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: fontSizes.caption,
          fontWeight: fontWeights.black,
          color: colors.textMuted,
          opacity: op,
        }}
      >
        VS
      </div>
    </>
  );
};

export const AuthorityVsPowerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOp = fade(frame, 5, 25);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOp,
          fontSize: fontSizes.caption,
          fontWeight: fontWeights.bold,
          color: colors.textMuted,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
        }}
      >
        Два типи впливу
      </div>

      <Panel
        side="left"
        accent={colors.success}
        icon="🤝"
        title="Авторитет"
        badge="добровільно"
        items={["лікар", "тренер", "керівник на роботі", "досвідчений друг", "майстер"]}
        at={12}
      />

      <Panel
        side="right"
        accent={colors.danger}
        icon="⚡"
        title="Влада"
        badge="примус"
        items={["бюрократ", "поліцейський", "політик", "податківець", "командир"]}
        at={50}
      />

      <Divider at={80} />
    </AbsoluteFill>
  );
};
