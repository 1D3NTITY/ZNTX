import { HERO, LINKS } from "@/lib/content";

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col justify-center gap-6 px-6 pt-28 pb-14 lg:px-10 lg:pt-40 lg:pb-20">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {HERO.kicker}
      </p>
      <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
        {HERO.headline}
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
        {HERO.subline}
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="#contact"
          className="rounded border border-accent-dim px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent/10"
        >
          Kontakt aufnehmen →
        </a>
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:border-accent hover:text-accent"
        >
          LinkedIn ↗
        </a>
      </div>
    </section>
  );
}
