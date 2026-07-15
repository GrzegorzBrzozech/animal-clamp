import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BarrierPencil, OfficerPencil, PaperBackground, PersonPencil } from "~/characters";
import { INK, PencilDefs, Sketch } from "~/characters/svg/_pencil";
import { AnimatedText, PhotoPin } from "~/components";
import { colors, fontSizes, fontWeights } from "../paper";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "Перша світова змінила це" at 5.46 s = frame 163.
const SWITCH_AT = 163;
// Passport appears at frame 275 (~9.2 s into this scene).
const PASSPORT_AT = 250;

// Horizon y — ground starts here, sky above stays paper-cream.
const HORIZON_Y = 630;

// ── Flags ─────────────────────────────────────────────────────────────────────

const FrenchFlag: React.FC<{ w?: number; h?: number }> = ({ w = 140, h = 94 }) => (
  <svg viewBox="0 0 90 60" width={w} height={h} style={{ overflow: "visible" }}>
    <PencilDefs scale={2} />
    <rect x={0}  y={0} width={30} height={60} fill="#002395" />
    <rect x={30} y={0} width={30} height={60} fill="#EEEEEE" />
    <rect x={60} y={0} width={30} height={60} fill="#ED2939" />
    <Sketch width={2}><polygon points="0,0 90,0 90,60 0,60" /></Sketch>
  </svg>
);

const KaiserFlag: React.FC<{ w?: number; h?: number }> = ({ w = 140, h = 94 }) => (
  <svg viewBox="0 0 90 60" width={w} height={h} style={{ overflow: "visible" }}>
    <PencilDefs scale={2} />
    <rect x={0} y={0}  width={90} height={20} fill="#1A1A1A" />
    <rect x={0} y={20} width={90} height={20} fill="#E8E8E8" />
    <rect x={0} y={40} width={90} height={20} fill="#CC1020" />
    <Sketch width={2}><polygon points="0,0 90,0 90,60 0,60" /></Sketch>
  </svg>
);

const FlagPole: React.FC<{ flag: React.ReactNode; poleH?: number; flagW: number; flagH: number }> = ({
  flag, poleH = 220, flagW, flagH,
}) => (
  <div style={{ position: "relative", width: flagW + 14, height: flagH + poleH }}>
    <div style={{ position: "absolute", top: 0, left: 10 }}>{flag}</div>
    <svg width={14} height={flagH + poleH} style={{ position: "absolute", top: 0, left: 0 }}>
      <rect x={5} y={flagH - 6} width={5} height={poleH + 6} rx={2} fill={INK} opacity={0.7} />
    </svg>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const PrewarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 25], [0, 1], clamp);

  // Ground gradients: gentle pastels, green before switch → blue/red after.
  // Two stops each: bottom (foreground) and top (near horizon).
  const gLeftBot = interpolateColors(frame, [SWITCH_AT, SWITCH_AT + 35], ["#4A9E5C", "#3A7BA0"]);
  const gLeftTop = interpolateColors(frame, [SWITCH_AT, SWITCH_AT + 35], ["#A8D4B0", "#A8C8DC"]);
  const gRightBot = interpolateColors(frame, [SWITCH_AT, SWITCH_AT + 35], ["#4A9E5C", "#A04030"]);
  const gRightTop = interpolateColors(frame, [SWITCH_AT, SWITCH_AT + 35], ["#A8D4B0", "#D4A498"]);

  // Person (France side) fades out at SWITCH_AT.
  const personLeftOp = interpolate(frame, [SWITCH_AT - 4, SWITCH_AT + 12], [1, 0], clamp);
  // Officer fades in.
  const officerOp    = interpolate(frame, [SWITCH_AT, SWITCH_AT + 16], [0, 1], clamp);

  // Barrier.
  const closeSpring = spring({ fps, frame: frame - SWITCH_AT, config: { damping: 12, mass: 0.9 } });
  const boomAngle   = interpolate(closeSpring, [0, 1], [-80, 0]);
  const boomColor   = interpolateColors(
    frame, [SWITCH_AT, SWITCH_AT + 28], ["#2ECC71", "#E74C3C"],
  );

  // Flags spring in.
  const flagLeftIn  = spring({ fps, frame: frame - 8,  config: { damping: 14 } });
  const flagRightIn = spring({ fps, frame: frame - 16, config: { damping: 14 } });

  // (Passport animation handled by PhotoPin's built-in spring at delay=PASSPORT_AT)

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* ── Ground — from horizon downward, fades to transparent at bottom ── */}
      <div
        style={{
          position: "absolute",
          left: 0, top: HORIZON_Y, width: 960, bottom: 0,
          opacity: sceneIn,
          background: `linear-gradient(to bottom, ${gLeftBot} 0%, ${gLeftTop} 50%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 960, top: HORIZON_Y, right: 0, bottom: 0,
          opacity: sceneIn,
          background: `linear-gradient(to bottom, ${gRightBot} 0%, ${gRightTop} 50%, transparent 100%)`,
        }}
      />

      {/* Horizon line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: HORIZON_Y,
        height: 3, background: `${INK}44`, opacity: sceneIn,
      }} />
      {/* Border divider */}
      <div style={{
        position: "absolute", left: 957, top: HORIZON_Y, width: 3, bottom: 0,
        borderLeft: `3px dashed ${INK}77`, opacity: sceneIn,
      }} />

      {/* ── France flag + label ── */}
      <div style={{
        position: "absolute", left: 140, top: 340,
        opacity: sceneIn,
        transform: `scale(${flagLeftIn})`,
        transformOrigin: "bottom left",
      }}>
        <FlagPole flag={<FrenchFlag />} poleH={200} flagW={140} flagH={94} />
      </div>
      <div style={{
        position: "absolute", left: 55, top: 660,
        opacity: sceneIn * 0.85,
        fontFamily: "Montserrat, sans-serif",
        fontSize: 30, fontWeight: 900,
        color: "#002395", letterSpacing: 4, textTransform: "uppercase",
      }}>
        Франція
      </div>

      {/* ── Kaiserreich flag + label ── */}
      <div style={{
        position: "absolute", right: 100, top: 340,
        opacity: sceneIn,
        transform: `scale(${flagRightIn})`,
        transformOrigin: "bottom right",
      }}>
        <FlagPole flag={<KaiserFlag />} poleH={200} flagW={140} flagH={94} />
      </div>
      <div style={{
        position: "absolute", right: 130, top: 660,
        opacity: sceneIn * 0.85,
        fontFamily: "Montserrat, sans-serif",
        fontSize: 30, fontWeight: 900,
        color: "#4A3020", letterSpacing: 2,
        textTransform: "uppercase", textAlign: "right",
      }}>
        Кайзерівська<br />Німеччина
      </div>

      {/* ── France-side traveller ── */}
      <div style={{
        position: "absolute", left: 650, top: 518,
        opacity: Math.min(sceneIn, personLeftOp),
      }}>
        <PersonPencil size={210} facing={1} pose="stand" />
      </div>

      {/* ── Kaiserreich-side traveller ── */}
      <div style={{
        position: "absolute", left: 1115, top: 508,
        opacity: sceneIn,
      }}>
        <PersonPencil size={210} facing={-1} pose="stand" />
      </div>

      {/* ── Barrier ── */}
      <div style={{ position: "absolute", left: 890, top: 558, opacity: sceneIn }}>
        <BarrierPencil size={140} angle={boomAngle} color={boomColor} />
      </div>

      {/* ── Officer (replaces France person after switch) ── */}
      <div style={{ position: "absolute", left: 640, top: 518, opacity: officerOp }}>
        <OfficerPencil size={220} facing={1} pose="present" />
      </div>

      {/* ── Narration text ── */}
      <div style={{ position: "absolute", left: 80, top: 68, width: 680 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={8}
          align="left" maxWidth={660}>
          <span style={{ color: colors.success }}>до 1914:</span>
        </AnimatedText>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={30}
          align="left" maxWidth={660} color={colors.text}>
          Ой, та роби шо хочеш!
        </AnimatedText>
      </div>
      <div style={{ position: "absolute", right: 80, top: 68, width: 640 }}>
        <AnimatedText size={fontSizes.heading} weight={fontWeights.black} delay={8}
          align="left" maxWidth={660}>
          <span style={{ color: colors.danger }}>з 1914:</span>
        </AnimatedText>
        <AnimatedText size={fontSizes.body} weight={fontWeights.bold} delay={30}
          align="left" maxWidth={660} color={colors.text}>
          Оновіть дозвіл на життя!
        </AnimatedText>
      </div>

      {/* ── Emergency Passport — appears at frame 275, PhotoPin style ── */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 50,
        transform: "translateX(-50%)",
        zIndex: 100,
      }}>
        <PhotoPin
          src="projects/passport-ww1/emergency-passport-1914.png"
          width={650}
          height={900}
          delay={PASSPORT_AT}
          rotate={2}
          zoom={0.02}
          caption="Emergency Passport"
          date="Berlin, 1914"
          hold="tape"
          objectFit="cover"
        />
      </div>
    </AbsoluteFill>
  );
};
