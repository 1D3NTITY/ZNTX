import { CROSS_CUTTING_SKILLS } from "@/lib/content";
import { SectionNumber } from "@/components/section-number";

export function SkillsPanel() {
  return (
    <section
      id="capability"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="capability-heading"
    >
      <div className="relative overflow-hidden">
        <SectionNumber n="02" />
        <p className="font-mono text-xs uppercase tracking-widest text-accent">§02</p>
        <h2
          id="capability-heading"
          className="mt-1 font-serif text-3xl font-semibold sm:text-4xl"
        >
          Arbeitsweise
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
          Nicht pro Projekt einzeln erzählt, sondern das, was tatsächlich überall
          wiederkehrt — die eigentlichen Fähigkeiten stecken im Betrieb, nicht in einer
          einzelnen App.
        </p>
      </div>

      <dl className="mt-8 divide-y divide-border border-y border-border">
        {CROSS_CUTTING_SKILLS.map((group) => (
          <div
            key={group.category}
            className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6"
          >
            <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {group.category}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
