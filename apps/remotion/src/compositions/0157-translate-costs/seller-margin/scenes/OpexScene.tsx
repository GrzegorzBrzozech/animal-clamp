import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBackground } from "~/characters";
import { PhotoPin } from "~/components";
import { MEDIA } from "../plan";

/**
 * 67–79 s · Решта — операційні витрати. Revision 5:
 *   - Dropped `sourceDurationInFrames` (which made `PhotoPin` wrap the video
 *     in `<Loop>`) on the two video panels. `<Loop>` remounts its child every
 *     cycle — over a ~12s scene that's ~4 remounts per 3s clip, and two
 *     videos doing that concurrently is what crashed live playback
 *     ("Response stream reader stopped..." — an aborted video fetch mid-
 *     remount). They now just play once and hold their last frame, which
 *     reads fine sitting next to otherwise-still photos in a collage.
 *   - Every panel is the SAME frame treatment now (`hold="tape"` for all —
 *     the alternating tape/pin read as "some panels less finished").
 *   - Reveal delays are spread across the whole scene, matching roughly
 *     where each category is actually said in the sentence (estimated
 *     proportionally by word position — no word-level ASR timestamps
 *     exist, only segment-level), instead of all 5 popping in within the
 *     same half-second.
 */
type Panel = { src: string; kind?: "photo" | "video"; label: string; x: number; y: number; w: number; h: number; rotate: number; delay: number };

const PANELS: Panel[] = [
  { src: MEDIA.warehouse, label: "Логістика та склади", x: 30, y: 40, w: 560, h: 400, rotate: -2, delay: 0 },
  { src: MEDIA.cashier, kind: "video", label: "Зарплати касирам", x: 690, y: 20, w: 560, h: 400, rotate: 1.5, delay: 145 },
  { src: MEDIA.securityGate, label: "Охорона від крадіжок", x: 1350, y: 40, w: 540, h: 400, rotate: -1.5, delay: 181 },
  { src: MEDIA.refrigeration, kind: "video", label: "Комунальні послуги", x: 380, y: 580, w: 560, h: 380, rotate: 2, delay: 236 },
  { src: MEDIA.spoiledProduct, label: "Списання зіпсованого товару", x: 1020, y: 580, w: 560, h: 380, rotate: -2, delay: 272 },
];

export const OpexScene: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    {PANELS.map((p) => (
      <div key={p.label} style={{ position: "absolute", left: p.x, top: p.y }}>
        <PhotoPin src={p.src} kind={p.kind} width={p.w} height={p.h} delay={p.delay} rotate={p.rotate} hold="tape" caption={p.label} />
      </div>
    ))}
  </AbsoluteFill>
);
