export const metadata = { title: "Impressum — zntx" };

// Impressum wird bewusst extern gehostet (Generator-Anbieter, gleiches Profil wie
// foodapp/ravepuls: zentrix-solutions), nicht auf dieser Seite dupliziert — so bleibt es
// über einen Anbieter stets aktuell statt hier von Hand gepflegt zu werden (2026-07-20,
// analog /srv/ravepuls/services/web/app/impressum/page.tsx).
export default function ImpressumPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-24 text-sm leading-relaxed text-foreground-muted">
      <h1 className="text-2xl font-semibold text-foreground">Impressum</h1>
      <p className="mt-4">
        Das vollständige Impressum wird extern über einen Anbieter für
        Impressum-Erstellung gehostet und dort stets aktuell gehalten.
      </p>
      <a
        href="https://mein.online-impressum.de/zentrix-solutions/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded border border-accent-dim px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent hover:bg-accent/10"
      >
        Zum Impressum →
      </a>
    </article>
  );
}
