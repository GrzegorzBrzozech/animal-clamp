import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PaperBackground, BookPencil } from "~/characters";
import { AnimatedText, Card } from "~/components";
import { colors, fontSizes, fontWeights, spacing } from "../paper";

const BOOK_COLORS = ["#3E6E9E", "#4E8A5A", "#B07E2B", "#BC5147"];
const SUBJECTS = ["астрономія", "робототехніка", "шахи"];

/** Підручники: a highlight ring slides across a row of books = free choice. */
const BooksControl: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  // Highlight hops 0→1→2→3 over time.
  const sel = interpolate(f, [15, 35, 55, 75], [0, 1, 2, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Card delay={delay} style={{ width: 560, alignItems: "flex-start", gap: spacing.sm }}>
      <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted }}>підручники — будь-які</span>
      <div style={{ position: "relative", display: "flex", gap: 16, paddingTop: 8 }}>
        <div
          style={{
            position: "absolute",
            top: 4,
            left: sel * 106,
            width: 100,
            height: 116,
            border: `5px solid ${colors.success}`,
            borderRadius: 16,
          }}
        />
        {BOOK_COLORS.map((c, i) => (
          <div key={i} style={{ width: 90 }}>
            <BookPencil size={108} color={c} spineLabel={false} />
          </div>
        ))}
      </div>
    </Card>
  );
};

/** Власні предмети: subject chips pop in behind a green "+". */
const SubjectsControl: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Card delay={delay} style={{ width: 560, alignItems: "flex-start", gap: spacing.sm }}>
      <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted }}>власні предмети — додати</span>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: colors.success }}>＋</div>
        {SUBJECTS.map((s, i) => {
          const d = delay + 20 + i * 16;
          const sp = spring({ fps, frame: frame - d, config: { damping: 12, mass: 0.5 } });
          return (
            <div
              key={s}
              style={{
                fontSize: fontSizes.caption,
                fontWeight: fontWeights.bold,
                color: colors.text,
                background: "#4E8A5A22",
                border: `3px solid ${colors.success}`,
                borderRadius: 999,
                padding: "8px 20px",
                transform: `scale(${sp})`,
                opacity: sp,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/** Розклад: schedule blocks shuffle positions = free rearrange. */
const ScheduleControl: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const swap = interpolate(f, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cols = [colors.primary, colors.secondary, colors.success, colors.danger];
  return (
    <Card delay={delay} style={{ width: 560, alignItems: "flex-start", gap: spacing.sm }}>
      <span style={{ fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: colors.textMuted }}>розклад — змінити</span>
      <div style={{ display: "flex", gap: 14 }}>
        {cols.map((c, i) => {
          // Blocks 0 and 3 swap horizontally when `swap` runs.
          const shift = i === 0 ? swap * (3 * 90) : i === 3 ? -swap * (3 * 90) : 0;
          return (
            <div
              key={i}
              style={{
                width: 76,
                height: 76,
                borderRadius: 12,
                background: `${c}33`,
                border: `4px solid ${c}`,
                transform: `translateX(${shift}px)`,
              }}
            />
          );
        })}
      </div>
    </Card>
  );
};

export const PrivateFreedomScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: spacing.xl, padding: spacing.lg }}>
      <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={0}>
        Приватні школи — <span style={{ color: colors.success }}>свобода вибору</span>
      </AnimatedText>
      <div style={{ display: "flex", gap: spacing.md, alignItems: "stretch" }}>
        <BooksControl delay={30} />
        <SubjectsControl delay={95} />
        <ScheduleControl delay={165} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
