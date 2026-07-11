import React from "react";

type Props = {
  size?: number;
  fieldColor?: string;
  starColor?: string;
  /** Number of stars in the ring (the EU flag has 12). */
  count?: number;
  style?: React.CSSProperties;
};

/** Five-point star path centred at (cx,cy), pointing up. */
function starPath(cx: number, cy: number, outer: number): string {
  const inner = outer * 0.382;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (-90 + i * 36) * (Math.PI / 180);
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return `M${pts.join("L")}Z`;
}

/**
 * The European Union emblem: a ring of gold stars on a blue field.
 * Deterministic, pure SVG. Reusable as an EU marker anywhere.
 */
export const EUEmblem: React.FC<Props> = ({
  size = 300,
  fieldColor = "#003399",
  starColor = "#FFCC00",
  count = 12,
  style,
}) => {
  const c = size / 2;
  const ringR = size * 0.32;
  const starR = size * 0.052;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style}>
      <circle cx={c} cy={c} r={c} fill={fieldColor} />
      {Array.from({ length: count }).map((_, i) => {
        const a = (-90 + (i * 360) / count) * (Math.PI / 180);
        const sx = c + ringR * Math.cos(a);
        const sy = c + ringR * Math.sin(a);
        return <path key={i} d={starPath(sx, sy, starR)} fill={starColor} />;
      })}
    </svg>
  );
};
