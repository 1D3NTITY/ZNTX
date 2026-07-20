import { BIO } from "@/lib/content";

export function AboutPanel() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-6xl px-6 py-24"
      aria-labelledby="about-heading"
    >
      <header className="mb-10 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// operator-profil"}
        </p>
        <h2 id="about-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">
          {BIO.heading}
        </h2>
      </header>

      <div className="flex max-w-2xl flex-col gap-4 rounded-md border border-border bg-surface p-6">
        <p className="text-base leading-relaxed text-foreground">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Brotjob{" "}
          </span>
          <br />
          {BIO.dayJob}
        </p>
        <p className="text-base leading-relaxed text-foreground">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Nebenbei{" "}
          </span>
          <br />
          {BIO.passion}
        </p>
        <p className="border-t border-border pt-4 text-sm leading-relaxed text-foreground-muted">
          {BIO.note}
        </p>
      </div>
    </section>
  );
}
