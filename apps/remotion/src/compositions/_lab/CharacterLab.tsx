import React from "react";
import { AbsoluteFill } from "remotion";
import { HOMINID_VERSIONS } from "~/characters/svg/hominid-pencil";
import type { HominidPencilProps } from "~/characters/svg/hominid-pencil";
import { PaperBackground, INK } from "~/characters/svg/_pencil";

type Version = { label: string; Comp: React.FC<HominidPencilProps> };

/**
 * Hominid version comparison — every preserved attempt side by side, so the best
 * one can be chosen. New attempts get added here (and as hominid/vN.tsx); none
 * are deleted.
 */
export const CharacterLab: React.FC = () => {
  const n = HOMINID_VERSIONS.length;
  const gap = 1920 / (n + 1);
  return (
    <AbsoluteFill>
      <PaperBackground />
      {HOMINID_VERSIONS.map(({ label, Comp }: Version, i: number) => (
        <React.Fragment key={label}>
          <Comp x={gap * (i + 1)} y={860} scale={2.3} phase={i} />
          <div
            style={{
              position: "absolute",
              left: gap * (i + 1),
              top: 900,
              transform: "translateX(-50%)",
              color: INK,
              fontFamily: "Montserrat, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
