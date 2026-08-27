"use client";

import { useState } from "react";
import { PROJECTS, HERO, LINKS } from "@/lib/content";
import { DashboardRow } from "@/components/dashboard-row";
import { ServerRack } from "@/components/server-rack";
import { RackSlot } from "@/components/rack-slot";
import { OperatorProfileBody } from "@/components/operator-profile-body";
import { ContactForm } from "@/components/contact-form";
import type { LiveStatus } from "@/lib/status";

// Konzept F ("Zwei Racks", 2026-08-27) — ersetzt die vorherige Karten-Grid durch eine 1:1-Karte
// der echten Zwei-Server-Infrastruktur: zwei ServerRack-Komponenten, sortiert nach dem
// tatsächlichen server-Feld in content.ts. Grund für den erneuten Umbau: die vorherige
// Alumica-Template-Adaption (siehe Git-Log) führte zu einem generischen "sieht aus wie jedes
// andere Copy-Paste-Template"-Ergebnis — Luis' Entscheidung war, stattdessen ein Konzept aus
// dem eigenen Inhalt abzuleiten (siehe docs/plans/redesign-concepts-2026-08-27.md, Konzept F).
// Slots verlinken weiterhin auf die bestehenden Projekt-Seiten (app/projekte/[slug]/page.tsx),
// kein neues Panel-System — vermeidet das bekannte Reflow-Problem komplett. Operator-Profil/
// Kontakt sind keine "Projekte" und bleiben als Akkordeon-Zeilen (DashboardRow) unterhalb.
const SERVER_1_PROJECTS = PROJECTS.filter((p) => p.server === "server-1");
const SERVER_2_PROJECTS = PROJECTS.filter((p) => p.server === "server-2");
// Projekte ohne server-Feld (aktuell nur n8n-automation, historisch — verursachte den Server-
// Reset, gehört ehrlicherweise keinem der beiden aktiven Racks) landen in einer separaten,
// gedimmten Archiv-Ablage statt künstlich einem Server zugeordnet zu werden.
const ARCHIVED_PROJECTS = PROJECTS.filter((p) => !p.server);

export function OpsDashboard({
  statuses,
}: {
  statuses: Record<string, LiveStatus | null>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  function openContact() {
    setOpenId("contact");
    document.getElementById("row-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 lg:max-w-4xl lg:px-0 lg:py-24">
      <header className="mb-12">
        {/* Hero-Intro (Redesign 2026-08-23): "zntx" + Cursor, der kurz in zwei vertikale
            Linien auseinandergeht — Symbol für die 2 Server. Rein dekorativ (aria-hidden),
            Name/Headline darunter sind sofort im Markup, nicht durch die Animation gated.
            prefers-reduced-motion greift automatisch über die globale Media-Query
            (globals.css) — Elemente stehen dann sofort im Endzustand. */}
        <div aria-hidden="true" className="mb-4 flex items-center gap-3 font-mono text-sm text-foreground-muted">
          <span>zntx</span>
          <span className="relative inline-flex h-4 w-3 items-center justify-center">
            <span className="hero-cursor-split-left absolute h-4 w-px bg-accent" />
            <span className="hero-cursor-split-right absolute h-4 w-px bg-accent" />
          </span>
        </div>
        <p className="font-mono text-sm font-semibold text-foreground">{HERO.name}</p>
        <p className="glass mt-3 inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
          {HERO.kicker}
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="text-gradient-muted block">{HERO.headlineLead}</span>
          <span className="text-gradient-accent block">{HERO.headlineEmphasis}</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground-muted sm:text-base">
          {HERO.subline}
        </p>
        <p className="mt-2 max-w-xl font-mono text-xs uppercase tracking-widest text-foreground-muted">
          {HERO.roleTagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openContact}
            className="glass-pill flex items-center gap-2.5 py-2 pl-5 pr-2 font-mono text-xs font-semibold uppercase tracking-widest text-foreground transition-opacity duration-300 hover:opacity-90"
          >
            Kontakt aufnehmen
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-background"
            >
              →
            </span>
          </button>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
          >
            LinkedIn ↗
          </a>
        </div>
      </header>

      <div id="systems" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ServerRack label="Server 1" projects={SERVER_1_PROJECTS} statuses={statuses} />
        <ServerRack label="Server 2" projects={SERVER_2_PROJECTS} statuses={statuses} />
      </div>

      {ARCHIVED_PROJECTS.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Archiv — kein Server mehr zugeordnet
          </p>
          <div className="flex flex-col gap-2">
            {ARCHIVED_PROJECTS.map((project) => (
              <RackSlot key={project.id} project={project} dimmed />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <div id="row-operator">
          <DashboardRow
            title="Operator-Profil"
            teaser="Werdegang, Arbeitsweise, wofür die Skills geeignet sind"
            isOpen={openId === "operator"}
            onToggle={() => toggle("operator")}
          >
            <OperatorProfileBody />
          </DashboardRow>
        </div>

        <div id="row-contact">
          <DashboardRow
            title="Kontakt"
            teaser="Kurze Einordnung des Anliegens genügt — Rückmeldung erfolgt zeitnah."
            isOpen={openId === "contact"}
            onToggle={() => toggle("contact")}
          >
            {/* Terminal-Fenster-Chrome — aus contact-section.tsx übernommen. */}
            <div className="max-w-xl overflow-hidden rounded-md border border-border">
              <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-status-paper/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-status-online/60" />
                <span className="ml-2 font-mono text-[11px] text-foreground-muted">
                  kontakt.sh
                </span>
              </div>
              <div className="bg-surface p-6">
                <ContactForm />
              </div>
            </div>
          </DashboardRow>
        </div>
      </div>
    </div>
  );
}
