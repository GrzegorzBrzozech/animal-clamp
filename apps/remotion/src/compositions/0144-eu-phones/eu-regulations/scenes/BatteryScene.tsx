import React from "react";
import { light } from "~/theme";
import { RegHero } from "./_RegHero";

export const BatteryScene: React.FC = () => (
  <RegHero
    emoji="🔋"
    date="Лютий 2027"
    title="Замінна батарея"
    subtitle="Користувач має міняти акумулятор стандартними інструментами"
    accent={light.success}
  />
);
