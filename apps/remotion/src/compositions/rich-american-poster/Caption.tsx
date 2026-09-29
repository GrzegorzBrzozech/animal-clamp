import React from "react";
import { LowerThird } from "~/components";

/**
 * `LowerThird` defaults to a single `nowrap` line — tuned for the 1920-wide
 * horizontal videos it was promoted from. This composition is a 1080-wide
 * Shorts vertical, where the same caption length overflows the frame edges.
 * `Caption` is the vertical-safe preset: wraps, capped width, slightly
 * smaller type. Composition-local (not promoted to `~/components`) because
 * it's just a prop preset, not new behavior.
 */
export const Caption: React.FC<{ children: React.ReactNode; delay: number; exitAt?: number }> = ({
  children,
  delay,
  exitAt,
}) => (
  <LowerThird
    delay={delay}
    exitAt={exitAt}
    size={38}
    style={{ whiteSpace: "normal", maxWidth: 900, textAlign: "center", lineHeight: 1.3 }}
  >
    {children}
  </LowerThird>
);
