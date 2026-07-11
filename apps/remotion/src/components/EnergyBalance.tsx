import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fadeIn } from "~/lib/animations";
import { radii } from "~/theme";
import { usePalette } from "~/theme/palette";

type Props = {
  delay?: number;
};

/**
 * Bioenergetics: energy gained from prey (inflow) vs. spent hunting (outflow).
 * Inflow towers over outflow → green surplus that guarantees survival.
 */
export const EnergyBalance: React.FC<Props> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const pal = usePalette();
  const inflow = interpolate(frame, [delay, delay + 30], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outflow = interpolate(frame, [delay + 14, delay + 40], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const surplusOpacity = fadeIn(frame, delay + 45, 18);

  const Bar = ({ h, color, label, value }: { h: number; color: string; label: string; value: string }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, justifyContent: "flex-end" }}>
      <span style={{ fontSize: 40, fontWeight: 800, color }}>{value}</span>
      <div style={{ width: 150, height: h, background: color, borderRadius: radii.md, boxShadow: `0 0 30px ${color}66` }} />
      <span style={{ fontSize: 30, color: pal.text, width: 220, textAlign: "center" }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 90, height: 460 }}>
      <Bar h={inflow} color={pal.success} label="калорії від жертви" value="+" />
      <Bar h={outflow} color={pal.danger} label="зусилля на полювання" value="−" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, justifyContent: "flex-end", opacity: surplusOpacity }}>
        <span style={{ fontSize: 40, fontWeight: 800, color: pal.secondary }}>=</span>
        <div style={{ width: 150, height: inflow - outflow, background: pal.secondary, borderRadius: radii.md, boxShadow: `0 0 40px ${pal.secondary}` }} />
        <span style={{ fontSize: 30, color: pal.secondary, fontWeight: 700, width: 220, textAlign: "center" }}>енергетичний надлишок</span>
      </div>
    </div>
  );
};
