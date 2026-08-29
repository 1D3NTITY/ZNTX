"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { PROJECTS, HERO, LINKS } from "@/lib/content";
import { DashboardRow } from "@/components/dashboard-row";
import { ServerRack } from "@/components/server-rack";
import { RackSlot } from "@/components/rack-slot";
import { OperatorProfileBody } from "@/components/operator-profile-body";
import { ContactForm } from "@/components/contact-form";
import type { LiveStatus } from "@/lib/status";

// Eintritts-Animation beim Laden (2026-08-29) — Headline baut sich wortweise auf, danach
// Subline/Buttons/Racks gestaffelt. Eigene, seriöse Motion-Technik statt der abgelehnten
// Video-/Mockup-Bild-Elemente aus den zuletzt geteilten Template-Prompts — nutzt die bereits
// im Projekt etablierte motion/react-Variants-Pattern (siehe operator-profile-body.tsx,
// project-case-study.tsx), kein neues Animations-System.
//
// Bug gefunden (Playwright-Verifikation mit reducedMotion:"reduce"): `initial={reducedMotion
// ? false : "hidden"}` verursacht einen echten Hydration-Mismatch. useReducedMotion() liest
// clientseitig synchron aus matchMedia() bereits im allerersten Render (kein Effect-Delay wie
// sonst bei window-abhängigen Hooks) — SSR kennt die Client-Präferenz aber grundsätzlich nicht
// und rendert deterministisch mit reducedMotion=null. Für Besucher mit aktiviertem Reduced-
// Motion widersprechen sich Server- und Client-Erststand dadurch sofort. Fix: `initial` hängt
// NIE von reducedMotion ab (immer "hidden", auf Server und Client identisch) — reducedMotion
// beeinflusst stattdessen nur die Transition-Dauer (wird erst nach dem Mount ausgewertet, kein
// Teil des Hydration-Vergleichs, daher unkritisch).
const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};
const wordItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function AnimatedWords({
  text,
  delay = 0,
  reducedMotion,
}: {
  text: string;
  delay?: number;
  reducedMotion: boolean | null;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={wordContainer}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: reducedMotion ? 0 : delay, staggerChildren: reducedMotion ? 0 : undefined }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          transition={reducedMotion ? { duration: 0 } : undefined}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

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
// Echte, aus PROJECTS berechnete Kennzahl (Lovable-Vergleichsentwurf, 2026-08-29, hatte eine
// Kennzahlen-Leiste — Idee übernommen, Wert aber selbst neu/ehrlich definiert statt geraten).
// zntx selbst zählt hier bewusst nicht mit — gleiche Konvention wie bei HERO.headlineEmphasis
// ("acht Systeme" = PROJECTS.length minus das Meta-Projekt zntx), sonst widersprächen sich
// Kennzahlen-Leiste und Headline (Bug gefunden bei der Verifikation: zeigte zunächst "7 von 9").
// "im Betrieb" = alles außer explizit archiviert, nicht nur status "live".
const REAL_SYSTEMS = PROJECTS.filter((p) => p.id !== "zntx");
const SYSTEMS_IN_OPERATION = REAL_SYSTEMS.filter((p) => p.status !== "archived").length;

const SERVER_DESCRIPTIONS: Record<"server-1" | "server-2", string> = {
  "server-1": "Web-Apps, Datenbanken, Matrix-Homeserver, dieses Portfolio selbst.",
  "server-2": "Gameserver und automatisierte Trading-/Community-Workloads.",
};

export function OpsDashboard({
  statuses,
}: {
  statuses: Record<string, LiveStatus | null>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

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
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reducedMotion ? 0 : 0.12 }}
        >
          <motion.p
            variants={heroItem}
            transition={reducedMotion ? { duration: 0 } : undefined}
            className="glass mt-3 inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent"
          >
            {HERO.kicker}
          </motion.p>
          <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="text-gradient-muted block">
              <AnimatedWords text={HERO.headlineLead} delay={0.15} reducedMotion={reducedMotion} />
            </span>
            <span className="text-gradient-accent block">
              <AnimatedWords text={HERO.headlineEmphasis} delay={0.3} reducedMotion={reducedMotion} />
            </span>
          </h1>
          <motion.p
            variants={heroItem}
            transition={reducedMotion ? { duration: 0 } : undefined}
            className="mt-3 max-w-xl text-sm leading-relaxed text-foreground-muted sm:text-base"
          >
            {HERO.subline}
          </motion.p>
          <motion.p
            variants={heroItem}
            transition={reducedMotion ? { duration: 0 } : undefined}
            className="mt-2 max-w-xl font-mono text-xs uppercase tracking-widest text-foreground-muted"
          >
            {HERO.roleTagline}
          </motion.p>
          <motion.div
            variants={heroItem}
            transition={reducedMotion ? { duration: 0 } : undefined}
            className="mt-6 flex flex-wrap gap-3"
          >
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
          </motion.div>
          {/* Kennzahlen-Leiste (Idee aus einem Lovable-Vergleichsentwurf, 2026-08-29) — echte,
              aus content.ts berechnete/statische Werte, kein erfundenes Marketing-KPI. */}
          <motion.div
            variants={heroItem}
            transition={reducedMotion ? { duration: 0 } : undefined}
            className="mt-8 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-3"
          >
            <div className="bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
                Maschinen
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">2 physische Root-Server</p>
            </div>
            <div className="bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
                Systeme im Betrieb
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {SYSTEMS_IN_OPERATION} von {REAL_SYSTEMS.length}
              </p>
            </div>
            <div className="bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
                Verantwortung
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">Alleinbetrieb</p>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Status-Legende (Idee aus einem Lovable-Vergleichsentwurf, 2026-08-29) — erklärt die
          LED-Zustände statt sie vorauszusetzen. */}
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-foreground-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--status-online)" }} />
          operational — läuft, Live-Daten vorhanden
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--status-paper)" }} />
          degraded — eingeschränkt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border border-foreground-muted" />
          keine Live-Daten — kein öffentlicher Status
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted opacity-40" />
          archiviert — bewusst abgeschaltet
        </span>
      </div>

      <motion.div
        id="systems"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: "easeOut", delay: 0.55 }
        }
      >
        <ServerRack
          label="Server 1"
          description={SERVER_DESCRIPTIONS["server-1"]}
          projects={SERVER_1_PROJECTS}
          statuses={statuses}
        />
        <ServerRack
          label="Server 2"
          description={SERVER_DESCRIPTIONS["server-2"]}
          projects={SERVER_2_PROJECTS}
          statuses={statuses}
        />
      </motion.div>

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
