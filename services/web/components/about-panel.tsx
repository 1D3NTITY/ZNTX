import { BIO } from "@/lib/content";

export function AboutPanel() {
  return (
    <section
      id="background"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="background-heading"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">§03</p>
      <h2
        id="background-heading"
        className="mt-1 font-serif text-3xl font-semibold sm:text-4xl"
      >
        {BIO.heading}
      </h2>

      <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-[140px_1fr]">
        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Brotjob
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{BIO.dayJob}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Werdegang
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{BIO.throughline}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Nebenbei
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{BIO.passion}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Perspektive
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{BIO.trajectory}</dd>
      </dl>

      <p className="mt-6 max-w-2xl border-l-2 border-accent-dim pl-4 text-sm italic leading-relaxed text-foreground-muted">
        {BIO.note}
      </p>
    </section>
  );
}
