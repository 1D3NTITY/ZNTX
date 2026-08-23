"use client";

import { useState } from "react";
import { PROJECTS, HERO, LINKS } from "@/lib/content";
import { formatProjectMeta, formatLiveStatus } from "@/lib/labels";
import { DashboardRow } from "@/components/dashboard-row";
import { ProjectCaseStudyBody } from "@/components/project-case-study";
import { OperatorProfileBody } from "@/components/operator-profile-body";
import { ContactForm } from "@/components/contact-form";
import type { LiveStatus } from "@/lib/status";

// Kompaktes Live-Status-Badge direkt auf der geschlossenen Karte (Redesign 2026-08-23 v2) —
// nur Punkt + Label, keine Deploy-/Sync-Details (die stehen im aufgeklappten Proof-Block,
// siehe project-case-study.tsx). Zeigt echte Daten schon vor dem Klick, statt sie zu verstecken.
function LiveBadge({ live }: { live: LiveStatus | null }) {
  const formatted = formatLiveStatus(live);
  if (!formatted) return null;
  const dotColor =
    live?.status === "operational"
      ? "var(--status-online)"
      : live?.status === "degraded"
        ? "var(--status-paper)"
        : "#f87171";
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-foreground-muted">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      {formatted.label}
    </span>
  );
}

// "Live Infrastructure Atlas" (Redesign 2026-08-23) — Projekte als responsives Karten-Grid
// (1 Spalte mobil, 2 Desktop) statt Linien-Liste; jede Karte zeigt echte Live-Betriebsdaten
// statt nur Text-Behauptungen. Vorversion nutzte eine Topologie-Linie durch eine Einspalten-
// Liste — Feedback nach Live-Check: zu viele parallele Akzent-Linien + der Grid-Hintergrund
// lasen sich als generische "AI-Slop"-Website-Bausteine (siehe Plan-Datei für Quellen). Karten-
// Grid + ein einzelner, projektfarbiger Rahmen im offenen Zustand ersetzen das. Akkordeon-
// Mechanik selbst (Öffnen/Schließen, Lenis-Resize, aria) bleibt unverändert.
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
    <div className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-0 lg:py-24">
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
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
          {HERO.kicker}
        </p>
        <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {HERO.headline}
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
            className="rounded bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Kontakt aufnehmen →
          </button>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>
      </header>

      <div id="systems" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <div key={project.id} id={`row-${project.id}`} className="contents">
            <DashboardRow
              dotColor={project.accentColor}
              title={project.name}
              meta={formatProjectMeta(project)}
              liveBadge={<LiveBadge live={statuses[project.id] ?? null} />}
              teaser={project.context}
              isOpen={openId === project.id}
              onToggle={() => toggle(project.id)}
              fullWidthWhenOpen
            >
              <ProjectCaseStudyBody project={project} live={statuses[project.id] ?? null} />
            </DashboardRow>
          </div>
        ))}
      </div>

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
