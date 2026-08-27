"use client";

import { motion, type Variants } from "motion/react";
import type { ProjectNode } from "@/lib/content";
import type { LiveStatus } from "@/lib/status";
import { formatLiveStatus } from "@/lib/labels";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// n8n-Projekt bekommt vorangestellt die frühere "Signature Moment"-Erzählung
// (Crash → Neuaufbau) — war ein separater Scroll-Break zwischen Hero und
// Projektliste, wird im Live-Ops-Leitstand (Konzept A, 2026-07-24) zum
// Einstieg der aufgeklappten Case-Study selbst statt eines eigenen Bruchs.
const SIGNATURE_LEAD: Record<
  string,
  { eyebrow: string; headline: string; body: string }
> = {
  "n8n-automation": {
    eyebrow: "Ausgangspunkt",
    headline:
      "Ein vollständiger Datenverlust. Anschließend bewusst sauberer neu aufgesetzt.",
    body: "Ein archiviertes n8n-Automatisierungsprojekt eskalierte so weit, dass der komplette Root-Server zurückgesetzt werden musste. Die Secrets-Hygiene, die isolierten Datenbank-Rollen und die eigenen Guardrail-Hooks, die jedes andere Projekt auf dieser Seite trägt, haben genau dort ihren Ursprung.",
  },
};

// Reine Inhalts-Komponente ohne eigenen Scroll-Wrapper/Header — wird von
// dashboard-row.tsx in eine aufgeklappte Zeile eingebettet (Header/Status/
// Datum übernimmt die Zeile selbst). War vorher eine eigene, per Scroll
// erreichte Section (`<CaseStudy>` in einer statischen Liste).
// Proof-Block: echte Live-Betriebsdaten statt Text-Behauptungen (Redesign "Live Infrastructure
// Atlas", 2026-08-23). `live` kommt server-seitig aus lib/status.ts, kann `null` sein (Fetch
// fehlgeschlagen/Timeout) — dann ehrlicher Fallback-Hinweis statt erfundener Daten, die
// statischen Projekt-Fakten (Kontext/Beitrag/etc.) darunter bleiben in jedem Fall verlässlich.
function ProofBlock({ live }: { live: LiveStatus | null }) {
  const formatted = formatLiveStatus(live);

  if (!formatted) {
    return (
      <p className="mb-6 font-mono text-xs text-foreground-muted">
        {"> Live-Status aktuell nicht abrufbar"}
      </p>
    );
  }

  const dotColor =
    live?.status === "operational"
      ? "var(--status-online)"
      : live?.status === "degraded"
        ? "var(--status-paper)"
        : "#f87171";

  return (
    <p className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs">
      <span className="badge text-foreground">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
        />
        <span className="uppercase tracking-widest">{formatted.label}</span>
      </span>
      {formatted.detail && (
        <span className="text-foreground-muted">{formatted.detail}</span>
      )}
    </p>
  );
}

export function ProjectCaseStudyBody({
  project,
  live = null,
}: {
  project: ProjectNode;
  live?: LiveStatus | null;
}) {
  const lead = SIGNATURE_LEAD[project.id];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div variants={item}>
        <ProofBlock live={live} />
      </motion.div>

      {lead && (
        <motion.div variants={item} className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {lead.eyebrow}
          </p>
          <p className="mt-2 font-serif text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            {lead.headline}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground-muted">
            {lead.body}
          </p>
        </motion.div>
      )}

      <motion.dl
        variants={item}
        className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-[140px_1fr]"
      >
        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Kontext
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{project.context}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Beitrag
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{project.contribution}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Herausforderung
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{project.challenge}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Stack
        </dt>
        <dd className="font-mono text-xs leading-relaxed text-foreground-muted">
          {project.stack.join(" · ")}
        </dd>
      </motion.dl>

      <motion.p
        variants={item}
        className="mt-6 border-l-2 border-accent pl-4 font-serif text-lg leading-snug text-foreground sm:text-xl"
      >
        {project.outcome}
      </motion.p>

      {project.note && (
        <motion.p
          variants={item}
          className="mt-5 border-l-2 border-accent-dim pl-4 text-sm italic leading-relaxed text-foreground-muted"
        >
          {project.note}
        </motion.p>
      )}

      {project.url && (
        <motion.a
          variants={item}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          {project.url.replace("https://", "")} →
        </motion.a>
      )}
    </motion.div>
  );
}
