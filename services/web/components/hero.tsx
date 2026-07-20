export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-6 pt-32 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        $ whoami
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Luis — betreibt echte Infrastruktur, nicht nur Prototypen.
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
        Zwei eigene Root-Server, sechs laufende Projekte, Docker/Caddy/Postgres im
        Dauerbetrieb. Diese Seite ist selbst Teil des Nachweises — scroll runter
        zur Netzwerkkarte.
      </p>
    </section>
  );
}
