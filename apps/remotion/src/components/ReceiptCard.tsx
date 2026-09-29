import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { ptMono, montserrat } from "~/lib/fonts";
import { fadeIn, fadeOut } from "~/lib/animations";
import { INK } from "~/characters/svg/_pencil";

export type ReceiptRow = {
  label: string;
  value: string;
  /** Frame at which this row fades in. Omit to show it from the card's own entrance. */
  delay?: number;
  bold?: boolean;
  muted?: boolean;
  color?: string;
  /** A sub-component of the row above it (e.g. what a markup splits into) — smaller, indented. */
  indent?: boolean;
  /**
   * The bottom line of the calculation: a rule appears above it and it renders
   * bigger/bold automatically — reads as "the total" without ever having to
   * print a "разом"/"загалом" label.
   */
  total?: boolean;
};

export type ReceiptCrossfade = {
  /** Frame at which `from` fades out and `to` fades in. */
  at: number;
  from: React.ReactNode;
  to: React.ReactNode;
  duration?: number;
};

type Props = {
  header?: string;
  rows: ReceiptRow[];
  /** A line at the bottom that swaps its reading without changing the number above it. */
  crossfade?: ReceiptCrossfade;
  footnote?: string;
  delay?: number;
  width?: number;
  rotate?: number;
  style?: React.CSSProperties;
};

/**
 * A hand-mocked till receipt, drawn in the same paper-mat treatment as
 * `PhotoPin` (cream card, ink border) — the shared "calculation on paper"
 * primitive for economics explainers. Rows can progressively reveal (pass
 * `delay` per row) so the calc builds in step with the narration, and a
 * single line can crossfade its wording without touching the number above it
 * (same figure, reframed — e.g. "36–39% від закупівлі" → "26–28% від виручки").
 */
export const ReceiptCard: React.FC<Props> = ({ header, rows, crossfade, footnote, delay = 0, width = 640, rotate = -1.5, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - delay, config: { damping: 14, mass: 0.8 } });

  return (
    <div
      style={{
        width,
        opacity: s,
        transform: `rotate(${rotate}deg) scale(${s})`,
        transformOrigin: "top center",
        background: "#FBF7EC",
        border: `2px solid ${INK}`,
        borderRadius: 6,
        padding: "36px 44px",
        boxShadow: "0 20px 50px #00000040",
        fontFamily: ptMono.fontFamily,
        color: INK,
        ...style,
      }}
    >
      {header ? (
        <div
          style={{
            textAlign: "center",
            fontFamily: montserrat.fontFamily,
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 1.5,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          {header}
        </div>
      ) : null}
      <Divider />

      {rows.map((row, i) => (
        <React.Fragment key={i}>
          {row.total ? <Divider strong /> : null}
          <ReceiptLine row={row} />
        </React.Fragment>
      ))}

      {crossfade ? (
        <>
          <Divider dashed />
          <CrossfadeLine {...crossfade} />
        </>
      ) : null}

      {footnote ? (
        <>
          <Divider />
          <div style={{ textAlign: "center", fontSize: 20, color: `${INK}99`, marginTop: 4 }}>{footnote}</div>
        </>
      ) : null}
    </div>
  );
};

const ReceiptLine: React.FC<{ row: ReceiptRow }> = ({ row }) => {
  const frame = useCurrentFrame();
  const opacity = row.delay != null ? fadeIn(frame, row.delay, 14) : 1;
  const y = row.delay != null ? (1 - opacity) * 14 : 0;
  const size = row.total ? 38 : row.bold ? 34 : row.indent ? 26 : 30;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 24,
        fontSize: size,
        fontWeight: row.total || row.bold ? 800 : 400,
        color: row.color ?? (row.muted ? `${INK}88` : INK),
        opacity,
        transform: `translateY(${y}px)`,
        marginBottom: row.indent ? 4 : 10,
        marginLeft: row.indent ? 28 : 0,
        whiteSpace: "nowrap",
      }}
    >
      <span>{row.indent ? "– " : ""}{row.label}</span>
      <span>{row.value}</span>
    </div>
  );
};

/**
 * Sequential swap, NOT a true crossfade — two semi-transparent text layers
 * overlapping mid-fade is unreadable (unlike images, text has no "average" of
 * two strings). The old line fully disappears before the new one appears.
 */
const CrossfadeLine: React.FC<ReceiptCrossfade> = ({ at, from, to, duration = 14 }) => {
  const frame = useCurrentFrame();
  const gap = 6;
  const oldOp = fadeOut(frame, at, duration);
  const newOp = fadeIn(frame, at + duration + gap, duration);
  return (
    <div style={{ position: "relative", height: 34, marginTop: 6, whiteSpace: "nowrap" }}>
      <div style={{ position: "absolute", inset: 0, textAlign: "center", fontSize: 24, opacity: oldOp }}>{from}</div>
      <div style={{ position: "absolute", inset: 0, textAlign: "center", fontSize: 24, opacity: newOp }}>{to}</div>
    </div>
  );
};

const Divider: React.FC<{ dashed?: boolean; strong?: boolean }> = ({ dashed, strong }) => (
  <div
    style={{
      borderTop: `${strong ? 3 : 2}px ${dashed ? "dashed" : "solid"} ${strong ? INK : `${INK}33`}`,
      margin: strong ? "14px 0 10px" : "12px 0",
    }}
  />
);
