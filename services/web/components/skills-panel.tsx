import { CROSS_CUTTING_SKILLS } from "@/lib/content";

export function SkillsPanel() {
  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-6xl px-6 py-24"
      aria-labelledby="skills-heading"
    >
      <header className="mb-10 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// systemstatus"}
        </p>
        <h2 id="skills-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">
          Quer über alle Projekte
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CROSS_CUTTING_SKILLS.map((group) => (
          <div
            key={group.category}
            className="rounded-md border border-border bg-surface p-5"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {group.category}
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground">
              {group.items.map((item) => (
                <li key={item} className="flex gap-2 leading-relaxed">
                  <span className="text-accent" aria-hidden>
                    &gt;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
