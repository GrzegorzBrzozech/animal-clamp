import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground } from "~/characters";
import { AnimatedText } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

type Group = { count: number; label: string; color: string };
const GROUPS: Group[] = [
  { count: 4, label: "початкова", color: colors.success },
  { count: 5, label: "базова середня", color: colors.primary },
  { count: 3, label: "профільна", color: colors.secondary },
];

// Cumulative index where each group starts, for stagger.
const OFFSET = [0, 4, 9];

export const StructureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <PaperBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: spacing.lg }}>
        <div style={{ display: "flex", gap: spacing.lg, alignItems: "flex-end" }}>
          {GROUPS.map((g, gi) => (
            <div key={g.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {Array.from({ length: g.count }).map((_, i) => {
                  const delay = 10 + (OFFSET[gi] + i) * 9;
                  const s = spring({ fps, frame: frame - delay, config: { damping: 13, mass: 0.5 } });
                  return (
                    <div
                      key={i}
                      style={{
                        width: 74,
                        height: 96,
                        borderRadius: 12,
                        border: `4px solid ${g.color}`,
                        background: `${g.color}22`,
                        transform: `scale(${s}) translateY(${(1 - s) * -40}px)`,
                        opacity: s,
                      }}
                    />
                  );
                })}
              </div>
              <div
                style={{
                  opacity: interpolate(frame, [30 + gi * 14, 48 + gi * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 64, fontWeight: fontWeights.black, color: g.color, lineHeight: 1 }}>{g.count}</span>
                <span style={{ fontSize: fontSizes.caption, color: colors.textMuted, fontWeight: fontWeights.bold }}>{g.label}</span>
              </div>
            </div>
          ))}
        </div>

        <AnimatedText size={fontSizes.title} weight={fontWeights.black} delay={110} slide={0} style={{ marginTop: spacing.md }}>
          4 + 5 + 3 = <span style={{ color: colors.text }}>12 років</span>
        </AnimatedText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
