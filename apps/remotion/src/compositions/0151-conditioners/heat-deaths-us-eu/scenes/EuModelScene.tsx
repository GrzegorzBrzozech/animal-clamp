import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";
import { IMG } from "../plan";

// This-figure...png 850×622 → w=860 h=629
const GRAPH_W = 860;
const GRAPH_H = Math.round(GRAPH_W * 622 / 850); // 629

type RowProps = { label: string; value: string; color: string; bar: number; delay: number };

const TempRow: React.FC<RowProps> = ({ label, value, color, bar, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 18, mass: 0.6 } });
  const w = interpolate(frame, [delay + 4, delay + 28], [0, bar], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: s }}>
      <span style={{ fontSize: fontSizes.body, fontWeight: fontWeights.black, color, width: 100, textAlign: "right" }}>{label}</span>
      <div style={{ position: "relative", width: 420, height: 72 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", width: `${w * 100}%`,
          background: `${color}22`, border: `3px solid ${color}`, borderRadius: 12,
          display: "flex", alignItems: "center", paddingLeft: 18, minWidth: 90,
        }}>
          <span style={{ fontSize: 48, fontWeight: fontWeights.black, color }}>{value}</span>
        </div>
      </div>
    </div>
  );
};

export const EuModelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diffS = spring({ fps, frame: frame - 230, config: { damping: 13, mass: 1.0 } });
  const memeS = spring({ fps, frame: frame - 270, config: { damping: 14, mass: 0.8 } });

  return (
    <AbsoluteFill>
      <PaperBackground />

      <div style={{ position: "absolute", left: 940, top: 60, width: 5, height: 960, background: colors.border, borderRadius: 3 }} />

      {/* EU model graph — 850×622 → w=680 h=498 */}
      <div style={{ position: "absolute", left: 50, top: 180 }}>
        <PhotoPin
          src={IMG.euModel}
          width={GRAPH_W}
          height={GRAPH_H}
          delay={5}
          rotate={1.5}
          caption="Температура → смертність (ЄС)"
          hold="pin"
        />
      </div>

      {/* RIGHT: bar chart with key numbers */}
      <div style={{ position: "absolute", left: 990, top: 140, display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginBottom: 8 }}>
          Смертей на добу при температурі:
        </div>
        <TempRow label="22°C" value="100" color={colors.success} bar={100 / 130} delay={40} />
        <TempRow label="35°C" value="130" color={colors.danger} bar={1} delay={110} />
      </div>

      {/* Key insight: +30 = спека */}
      <div
        style={{
          position: "absolute",
          left: 990,
          bottom: 300,
          opacity: diffS,
          transform: `scale(${interpolate(diffS, [0, 1], [0.92, 1])})`,
          transformOrigin: "left bottom",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 160, fontWeight: fontWeights.black, color: colors.danger, lineHeight: 1 }}>+30</span>
          <div>
            <div style={{ fontSize: fontSizes.heading, fontWeight: fontWeights.black, color: colors.danger }}>= спека</div>
            <div style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted, marginTop: 8 }}>
              різниця відноситься на рахунок жари
            </div>
          </div>
        </div>
      </div>

      {/* Mother of God meme — looks at +30 from the right */}
      <Img
        src={staticFile(IMG.motherOfGod)}
        style={{
          position: "absolute",
          right: 40,
          bottom: 60,
          width: 260,
          height: "auto",
          opacity: memeS,
          transform: `translateY(${interpolate(memeS, [0, 1], [40, 0])}px) scaleX(-1)`,
        }}
      />
    </AbsoluteFill>
  );
};
