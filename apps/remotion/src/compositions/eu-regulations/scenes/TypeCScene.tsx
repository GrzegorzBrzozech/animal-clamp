import React from "react";
import { light } from "~/theme";
import { RegHero } from "./_RegHero";

export const TypeCScene: React.FC = () => (
  <RegHero
    emoji="🔌"
    date="Грудень 2024"
    title="Єдиний стандарт — USB Type-C"
    subtitle="Один роз'єм підключення і зарядки для всіх смартфонів"
    accent={light.primary}
  />
);
