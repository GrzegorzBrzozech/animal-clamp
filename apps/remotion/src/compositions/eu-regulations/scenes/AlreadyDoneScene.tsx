import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeIn } from "~/lib/animations";
import { Stamp } from "~/components";
import { light } from "~/theme";
import { montserrat } from "~/lib/fonts";

/** "Це вже відбулось" — the first two rules are in force today. */
export const AlreadyDoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
        fontFamily: montserrat.fontFamily,
      }}
    >
      <Stamp color={light.success} rotate={-7} fontSize={92} delay={2}>
        Вже чинне
      </Stamp>

      <div
        style={{
          display: "flex",
          gap: 22,
          opacity: fadeIn(frame, 14, 14),
          fontSize: 36,
          fontWeight: 700,
          color: light.text,
        }}
      >
        {["🔌 Type-C", "🔧 Ecodesign"].map((t) => (
          <span
            key={t}
            style={{
              background: "#E8F7EE",
              border: `2px solid ${light.success}`,
              borderRadius: 16,
              padding: "12px 24px",
            }}
          >
            ✓ {t}
          </span>
        ))}
      </div>
    </div>
  );
};
