import React from "react";
import { light } from "~/theme";
import { RegHero } from "./_RegHero";

export const RightToRepairScene: React.FC = () => (
  <RegHero
    emoji="⚖️"
    date="Липень 2026"
    title="Директива про право на ремонт"
    subtitle="Виробник зобов'язаний полагодити — або дати це зробити іншим"
    accent={light.secondary}
  />
);
