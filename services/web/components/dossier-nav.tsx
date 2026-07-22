"use client";

import { PROJECTS } from "@/lib/content";
import { NetworkGraph } from "@/components/network-graph";

export const SECTIONS = [
  { id: "projects", label: "§01 Projekte" },
  { id: "capability", label: "§02 Arbeitsweise" },
  { id: "background", label: "§03 Hintergrund" },
  { id: "contact", label: "§04 Kontakt" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLinks() {
  return (
    <nav className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="text-foreground-muted hover:text-accent">
          {s.label}
        </a>
      ))}
    </nav>
  );
}

// Desktop: sticky Index-Leiste mit Sprungmarken + kompakter Netzwerkkarte als
// Übersichts-Widget. Klick auf einen Knoten scrollt zur vollen Case-Study statt
// ein Modal zu öffnen — die Karte ist Navigation, nicht mehr Hauptinhalt.
export function IndexRail() {
  return (
    <aside className="hidden shrink-0 lg:sticky lg:top-16 lg:block lg:h-fit lg:w-[270px] lg:self-start">
      <div className="border-l border-border pl-5">
        <NavLinks />
        <div className="mt-10">
          <NetworkGraph
            projects={PROJECTS}
            onSelect={(project) => scrollToSection(`project-${project.id}`)}
            compact
          />
          <p className="mt-3 text-center font-mono text-[9px] uppercase leading-relaxed tracking-widest text-foreground-muted">
            Knoten anklicken →<br />springt zur Case-Study
          </p>
        </div>
      </div>
    </aside>
  );
}

// Mobile: kein Graph (zu eng), stattdessen schlanke horizontale Sprungleiste —
// bewusst andere Komposition als Desktop, nicht nur gestapelt.
export function MobileNav() {
  return (
    <nav className="sticky top-0 z-30 flex gap-4 overflow-x-auto border-b border-border bg-background/95 px-6 py-3 font-mono text-[11px] uppercase tracking-widest backdrop-blur-sm lg:hidden">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="whitespace-nowrap text-foreground-muted hover:text-accent"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
