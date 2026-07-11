import React from "react";
import { useCurrentFrame } from "remotion";
import { popIn } from "~/lib/animations";
import { useVideoConfig } from "remotion";
import { radii } from "~/theme";
import { usePalette } from "~/theme/palette";

type Props = {
  /** "full" = presenter fills frame; "pip" = small corner box over animation. */
  variant?: "full" | "pip";
  /** Line being spoken — shown as a hint inside the placeholder. */
  caption?: string;
  delay?: number;
};

/**
 * PLACEHOLDER for presenter footage. Replace with <OffthreadVideo> once the
 * camera recording exists. Marks clearly where the face goes so the model
 * reads correctly in Studio.
 */
export const TalkingHead: React.FC<Props> = ({ variant = "full", caption, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = usePalette();
  const scale = popIn(frame, fps, delay, { damping: 18 });

  const pip = variant === "pip";
  const box: React.CSSProperties = pip
    ? { position: "absolute", right: 60, bottom: 60, width: 420, height: 420 }
    : { width: 900, height: 620 };

  return (
    <div
      style={{
        ...box,
        transform: `scale(${scale})`,
        borderRadius: radii.lg,
        border: `3px dashed ${pal.primary}88`,
        background: `repeating-linear-gradient(45deg, ${pal.bgAlt}, ${pal.bgAlt} 18px, ${pal.surface} 18px, ${pal.surface} 36px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 30,
        boxShadow: pip ? "0 18px 50px #3a352e33" : "none",
      }}
    >
      <div style={{ fontSize: pip ? 80 : 130 }}>🎥</div>
      <div style={{ fontSize: pip ? 22 : 34, fontWeight: 800, color: pal.primary, letterSpacing: 2 }}>
        ОБЛИЧЧЯ ДОПОВІДАЧА
      </div>
      {caption && !pip ? (
        <div style={{ fontSize: 26, color: pal.textMuted, textAlign: "center", maxWidth: 760, fontStyle: "italic" }}>
          «{caption}»
        </div>
      ) : null}
    </div>
  );
};
