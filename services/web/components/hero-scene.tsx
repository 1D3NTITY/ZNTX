// Rendert keine eigene Matrix-Rain mehr (Bug gefunden 2026-07-22: zwei
// unabhängige Rain-Layer mit unterschiedlichem Tempo direkt übereinander,
// seit GlobalMatrixBackground vollflächig läuft — sah "doppelt"/unruhig
// aus). Der sitewide-Layer (global-matrix-background.tsx, fixed, hinter
// allem) scheint hier durch; dieser Wrapper liefert nur noch die
// Vignette-Maske, die ihn zu den Hero-Rändern hin ausblendet.
export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-matrix-mask absolute inset-0" />
    </div>
  );
}
