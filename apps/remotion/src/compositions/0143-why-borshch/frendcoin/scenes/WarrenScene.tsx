import React from "react";
import { Background, Scene, AnimatedText, MediaImage } from "~/components";
import { colors, fontSizes, spacing } from "~/theme";

export const WarrenScene: React.FC = () => {
  return (
    <Background gradientTo={colors.bgAlt}>
      <Scene gap={spacing.lg} padding={spacing.lg}>
        <AnimatedText size={fontSizes.title} color={colors.primary} delay={0}>
          Джозая Уоррен · XIX ст.
        </AnimatedText>

        <div style={{ display: "flex", gap: spacing.lg, alignItems: "flex-start" }}>
          <MediaImage
            src="projects/frendcoin/warren-portrait.jpg"
            caption="анархіст Джозая Уоррен"
            delay={10}
            width={380}
            height={460}
          />
          <MediaImage
            src="projects/frendcoin/labor-note.png"
            caption="«Магазин часу»: чеки = години праці"
            delay={110}
            width={380}
            height={460}
            borderColor={colors.secondary}
          />
          <MediaImage
            src="projects/frendcoin/utopia.jpg"
            caption="колонії «Утопія» та «Сучасні часи»"
            delay={230}
            width={380}
            height={460}
          />
        </div>
      </Scene>
    </Background>
  );
};
