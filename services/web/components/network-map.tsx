"use client";

import { useState } from "react";
import { PROJECTS, type ProjectNode } from "@/lib/content";
import { NetworkGraph } from "@/components/network-graph";
import { NodeDetailPanel } from "@/components/node-detail-panel";

export function NetworkMap() {
  const [selected, setSelected] = useState<ProjectNode | null>(null);

  return (
    <section id="network" className="mx-auto w-full max-w-6xl px-6 py-24">
      <header className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-4">
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

      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        Jeder Knoten ist ein Projekt, das gerade wirklich läuft — kein Mockup, keine
        Demo. Klick auf einen Knoten für Stack, Details und (wo öffentlich
        erreichbar) den Link zum Projekt.
      </p>

      <NetworkGraph projects={PROJECTS} onSelect={setSelected} />
      <NodeDetailPanel project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
