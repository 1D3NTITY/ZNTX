// Rein dekorativ, aria-hidden — Text im Hero bleibt semantisch unabhängig davon.
export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-grid absolute inset-0" />
      <div className="hero-scanline absolute inset-x-0 top-0 h-32" />
    </div>
  );
}
