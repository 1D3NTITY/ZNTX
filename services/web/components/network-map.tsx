import { PROJECTS } from "@/lib/content";
import { NodeCard } from "@/components/node-card";

export function NetworkMap() {
  return (
    <section id="network" className="mx-auto w-full max-w-6xl px-6 py-24">
      <header className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {"// netzwerkkarte"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
            Projekte im Betrieb
          </h2>
        </div>
        <p className="hidden font-mono text-xs text-foreground-muted sm:block">
          {PROJECTS.length} Knoten · 2 Server
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <NodeCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
