import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeIn } from "~/lib/animations";
import { colors, fontSizes } from "~/theme";

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

export type ScenePlaceholderProps = {
  title: string;
  description: string;
  narration?: string;
  mode?: string;
  /** 1-based position in the plan. */
  index?: number;
  total?: number;
  startSec?: number;
  endSec?: number;
};

/**
 * Generic stand-in for a scene that has no component yet. Shows the plan text
 * (title / description / narration / timing) so the timeline stays complete and
 * communicates what the beat must contain. Driven entirely by props from the
 * plan — no per-scene work needed to fill a gap.
 */
export const ScenePlaceholder: React.FC<ScenePlaceholderProps> = ({
  title,
  description,
  narration,
  mode,
  index,
  total,
  startSec,
  endSec,
}) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, 0, 12);

  return (
    <AbsoluteFill style={{ background: colors.bg, alignItems: "center", justifyContent: "center", padding: 120 }}>
      <div
        style={{
          opacity: o,
          width: "100%",
          maxWidth: 1400,
          border: `3px dashed ${colors.border}`,
          borderRadius: 28,
          background: colors.bgAlt,
          padding: 64,
          color: colors.text,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28 }}>
          <span style={{ padding: "8px 18px", borderRadius: 999, background: colors.secondary, color: "#1a1407", fontSize: fontSizes.caption - 4, fontWeight: 900, letterSpacing: 1 }}>
            PLACEHOLDER
          </span>
          {mode ? (
            <span style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${colors.border}`, color: colors.textMuted, fontSize: fontSizes.caption - 6, fontWeight: 700 }}>
              {mode}
            </span>
          ) : null}
          {index && total ? (
            <span style={{ marginLeft: "auto", color: colors.textMuted, fontSize: fontSizes.caption - 4, fontWeight: 700 }}>
              сцена {index}/{total}
              {startSec != null && endSec != null ? `  ·  ${fmt(startSec)}–${fmt(endSec)}` : ""}
            </span>
          ) : null}
        </div>

        <div style={{ fontSize: fontSizes.heading, fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>{title}</div>

        <div style={{ fontSize: fontSizes.body - 4, color: colors.text, lineHeight: 1.35, marginBottom: 28 }}>{description}</div>

        {narration ? (
          <div style={{ borderLeft: `4px solid ${colors.primary}`, paddingLeft: 20, color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 1.4, fontStyle: "italic" }}>
            «{narration}»
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
