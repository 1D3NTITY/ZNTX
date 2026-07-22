import { MatrixRain } from "@/components/matrix-rain";

// Prominente Variante im Hero (globale Variante: global-matrix-background.tsx).
export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <MatrixRain columnCount={16} baseOpacity={0.3} />
      <div className="hero-matrix-mask absolute inset-0" />
    </div>
  );
}
