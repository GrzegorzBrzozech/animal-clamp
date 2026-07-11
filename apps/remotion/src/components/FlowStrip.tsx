import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { popIn, fadeIn } from "~/lib/animations";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

export type FlowStep = {
  emoji: string;
  /** Step label; use \n for line breaks. */
  label: string;
  /** Accent color for the active ring (defaults to EU blue). */
  color?: string;
};

type Props = {
  steps: FlowStep[];
  /** Index of the step currently emphasised (scales up + colored ring). -1 = none. */
  activeIndex?: number;
  /** Indices already in force — get a ✓ badge and a green tint. */
  done?: number[];
  /** Frame at which the whole strip starts appearing (stagger per step). */
  delay?: number;
  width?: number;
  /** Diameter of each emoji disc. */
  disc?: number;
};

/**
 * Horizontal "flow" of steps (emoji disc → arrow → emoji disc …), mirroring the
 * flat animated-chart look on a light background. One step can be `active`
 * (scaled + colored ring) and any number can be `done` (✓). Reusable for any
 * staged timeline / process. Drive `activeIndex`/`done` from the parent's frame.
 */
export const FlowStrip: React.FC<Props> = ({
  steps,
  activeIndex = -1,
  done = [],
  delay = 0,
  width = 1500,
  disc = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
        width,
        fontFamily: montserrat.fontFamily,
      }}
    >
      {steps.map((step, i) => {
        const stepDelay = delay + i * 6;
        const enter = popIn(frame, fps, stepDelay);
        const isActive = i === activeIndex;
        const isDone = done.includes(i);
        const accent = step.color ?? light.primary;
        const ring = isActive ? accent : isDone ? light.success : light.border;
        const focus = popIn(frame, fps, 0, { damping: 18, mass: 0.5 });
        const activeScale = isActive ? 1 + 0.12 * focus : 1;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                opacity: enter,
                transform: `scale(${enter * activeScale})`,
                width: disc + 40,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: disc,
                  height: disc,
                  borderRadius: "50%",
                  background: isDone ? "#E8F7EE" : light.bgAlt,
                  border: `${isActive ? 5 : 3}px solid ${ring}`,
                  boxShadow: isActive ? `0 0 36px ${accent}66` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: disc * 0.46,
                }}
              >
                <span>{step.emoji}</span>
                {isDone ? (
                  <div
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -6,
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: light.success,
                      color: "#fff",
                      fontSize: 28,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px #1db95455",
                    }}
                  >
                    ✓
                  </div>
                ) : null}
              </div>
              <span
                style={{
                  textAlign: "center",
                  fontSize: 26,
                  fontWeight: isActive ? 800 : 600,
                  lineHeight: 1.18,
                  color: isActive ? accent : isDone ? light.text : light.textMuted,
                  whiteSpace: "pre-line",
                }}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  marginTop: disc / 2 - 18,
                  fontSize: 40,
                  color: light.border,
                  opacity: fadeIn(frame, stepDelay + 3, 12),
                }}
              >
                →
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
