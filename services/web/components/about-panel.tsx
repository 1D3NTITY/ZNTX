import { BIO, FPV_SHOWCASE } from "@/lib/content";

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-md border border-border bg-surface p-6">
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

        <div className="flex flex-col justify-between gap-4 rounded-md border border-dashed border-border p-6">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {FPV_SHOWCASE.heading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
              {FPV_SHOWCASE.note}
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            [ platzhalter ]
          </span>
        </div>
      </div>
    </section>
  );
}
