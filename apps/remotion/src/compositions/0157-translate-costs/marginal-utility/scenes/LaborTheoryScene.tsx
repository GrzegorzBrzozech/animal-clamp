import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground, DiggerPencil, SandPitPencil, SandSprayPencil, SandPilePencil, SPRAY_LIFE } from "~/characters";
import { AnimatedText, Stamp, PortraitPhoto } from "~/components";
import { fadeIn, popIn } from "~/lib/animations";
import { ptMono } from "~/lib/fonts";
import { colors, fontSizes, fontWeights } from "../paper";

/**
 * 7–17 s · Проблема старої теорії.
 * Smith / Ricardo / Marx hang untouched on the left while their definition —
 * quoted on a pale index card on the right — gets stamped "СПРОСТОВАНО"; then a
 * worker digs a pit in the sand: effort spent as the alleged source of value.
 *
 * The stamp only ever lands on the CARD. Red ink over the black-and-white
 * photographs (as it used to) is unreadable.
 */

/**
 * Public-domain likenesses (Wikimedia Commons). `crop` frames the sitter's head
 * inside the frame's opening without touching the original file — Marx's is a
 * full seated studio photograph, so it needs the most pulling in.
 */
const PORTRAITS: { label: string; src: string; objectPosition: string; crop: number }[] = [
  {
    label: "Адам Сміт",
    src: "projects/marginal-utility/portraits/smith.jpg",
    objectPosition: "50% 12%",
    crop: 1.1,
  },
  {
    label: "Давід Рікардо",
    src: "projects/marginal-utility/portraits/ricardo.jpg",
    objectPosition: "48% 18%",
    crop: 1.3,
  },
  {
    label: "Карл Маркс",
    src: "projects/marginal-utility/portraits/marx.jpg",
    objectPosition: "57% 20%",
    crop: 1.55,
  },
];

const STAMP_AT = 350;
const DIG_AT = 168;

/** The definition card on the right. The stamp is centred on it, so both share this box. */
const CARD = { left: 1010, top: 200, width: 890 } as const;

export const LaborTheoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The digger cycle: a slow lift, a fast strike.
  const digPhase = Math.max(0, frame - DIG_AT) * 0.16;
  const swing = 0.5 - 0.5 * Math.cos(digPhase);
  const digOp = fadeIn(frame, DIG_AT, 20);
  const digRise = interpolate(frame, [DIG_AT, DIG_AT + 24], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The "labour = value" claim, made literal: every strike's thrown sand settles
  // into a growing spoil pile beside the pit, with a $ sign for every unit of
  // effort spent — more strikes, bigger pile, more $. Uses the SAME cycle math
  // as `SandSprayPencil` (strike lands at `cyclePhase = π + 2πk`) so the pile's
  // growth finishes exactly when that strike's grains land.
  const sinceFirstStrike = digPhase - Math.PI;
  const strikeCycle = sinceFirstStrike < 0 ? 0 : Math.floor(sinceFirstStrike / (2 * Math.PI));
  const cycleT = sinceFirstStrike < 0 ? 0 : sinceFirstStrike - strikeCycle * 2 * Math.PI;
  const settleProgress = sinceFirstStrike < 0 ? 0 : Math.min(1, cycleT / SPRAY_LIFE);
  const pileLevel = sinceFirstStrike < 0 ? 0 : strikeCycle + settleProgress;
  const pileOpacity = digOp * Math.min(1, pileLevel * 4);
  const pileSize = 50 + Math.min(pileLevel, 8) * 24;
  const dollarCount = Math.min(6, Math.round(pileLevel));

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* the classical trio */}
      {PORTRAITS.map((p, i) => {
        const s = popIn(frame, fps, 6 + i * 16, { damping: 14, mass: 0.8 });
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: 110 + i * 300,
              top: 90,
              transform: `scale(${interpolate(s, [0, 1], [0.78, 1])}) rotate(${i === 1 ? 0 : i === 0 ? -2 : 2}deg)`,
              transformOrigin: "center",
              opacity: s,
            }}
          >
            <PortraitPhoto
              size={380}
              src={p.src}
              label={p.label}
              objectPosition={p.objectPosition}
              crop={p.crop}
            />
          </div>
        );
      })}

      {/* The claim itself, set as an official textbook definition on a pale
          index card — the stamp lands on THIS, never on the (dark) photographs,
          where red ink on a black-and-white plate is unreadable. */}
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          background: "#FBF7EA",
          border: `3px solid ${colors.border}`,
          borderRadius: 10,
          padding: "30px 40px 34px",
          boxSizing: "border-box",
          boxShadow: "6px 8px 0 rgba(58,53,46,0.13)",
          transform: "rotate(-0.7deg)",
          opacity: fadeIn(frame, 20, 20),
        }}
      >
        <AnimatedText
          size={fontSizes.caption}
          weight={fontWeights.black}
          delay={24}
          align="left"
          maxWidth="100%"
          color={colors.textMuted}
          style={{ letterSpacing: 2, textTransform: "uppercase" }}
        >
          Трудова теорія вартості:
        </AnimatedText>
        <div
          style={{
            height: 3,
            background: colors.border,
            margin: "18px 0 26px",
          }}
        />
        <AnimatedText
          size={68}
          weight={fontWeights.regular}
          delay={40}
          slide={20}
          align="left"
          maxWidth="100%"
          style={{ fontFamily: ptMono.fontFamily, lineHeight: 1.3 }}
        >
          «Вартість товару формується на основі кількості праці, що витрачено на його
          виробництво»
        </AnimatedText>
      </div>

      {/* The verdict, slammed across the quoted definition. Sat on the card's
          second-to-last (shortest) line so it lands inside the text block while
          burying the least meaningful words. */}
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: 476,
          width: CARD.width,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp delay={STAMP_AT} color={colors.danger} fontSize={95} rotate={-36}>
          Спростовано
        </Stamp>
      </div>

      {/* the pit and the man digging it.
          Pit ground line sits at 760 + 96/150*240 = 914; the digger's feet are
          anchored there (top = 914 − 420). */}
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 760,
          opacity: digOp,
          transform: `translateY(${digRise}px)`,
        }}
      >
        <SandPitPencil size={240} />
      </div>
      {/* left = 330 puts the blade (hand x + a touch of tilt) at x ≈ 616 on the
          down-stroke — inside the pit's mouth (559…726) rather than on its rim. */}
      <div
        style={{
          position: "absolute",
          left: 330,
          top: 494,
          opacity: digOp,
          transform: `translateY(${digRise}px)`,
        }}
      >
        <DiggerPencil size={420} swing={swing} />
      </div>
      {/* sand kicked out of the pit on every strike. Driven by the SAME
          `digPhase` as the shovel, so the burst lands with the blade. The
          component's bottom-centre is the throw point: blade x ≈ 616,
          pit rim y ≈ 916 (see the pit geometry above). */}
      <div
        style={{
          position: "absolute",
          left: 426,
          top: 766,
          opacity: digOp,
          transform: `translateY(${digRise}px)`,
        }}
      >
        <SandSprayPencil size={170} cyclePhase={digPhase} />
      </div>

      {/* the spoil pile beside the pit — every strike's thrown sand settles
          here, growing the heap. Anchored bottom-centre at the pit's rim
          (x≈900, just past its right edge at 828), so it reads as dirt piling
          up next to the hole rather than inside it. */}
      <div
        style={{
          position: "absolute",
          left: 900,
          top: 914,
          opacity: pileOpacity,
          transform: `translate(-50%, -100%) translateY(${digRise}px)`,
        }}
      >
        <SandPilePencil size={pileSize} />
      </div>
      {dollarCount > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 914 - pileSize - 48,
            transform: `translateX(-50%) translateY(${digRise}px)`,
            opacity: pileOpacity,
            fontSize: 30 + dollarCount * 4,
            fontWeight: fontWeights.black,
            color: colors.success,
            whiteSpace: "nowrap",
          }}
        >
          {"$".repeat(dollarCount)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
