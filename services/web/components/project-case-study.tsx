"use client";

import { motion } from "motion/react";
import { PROJECTS, type ProjectNode } from "@/lib/content";

const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
};

const SERVER_LABEL: Record<ProjectNode["server"], string> = {
  "server-1": "Server 1",
  "server-2": "Server 2",
};

function CaseStudy({ project, index }: { project: ProjectNode; index: number }) {
  return (
    <motion.article
      id={`project-${project.id}`}
      className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {String(index + 1).padStart(2, "0")} — {project.name}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
          {STATUS_LABEL[project.status]} · {SERVER_LABEL[project.server]}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
        {project.role}
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-[140px_1fr]">
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
          Ergebnis
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{project.outcome}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Stack
        </dt>
        <dd className="font-mono text-xs leading-relaxed text-foreground-muted">
          {project.stack.join(" · ")}
        </dd>
      </dl>

      {project.note && (
        <p className="mt-5 border-l-2 border-accent-dim pl-4 text-sm italic leading-relaxed text-foreground-muted">
          {project.note}
        </p>
      )}

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          {project.url.replace("https://", "")} →
        </a>
      )}
    </motion.article>
  );
}

export function ProjectCaseStudies() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 py-16"
      aria-labelledby="projects-heading"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent">§01</p>
      <h2 id="projects-heading" className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
        Projekte
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        Sechs Systeme, die tatsächlich laufen — kein Mockup, keine Demo. Kontext, Beitrag,
        die eigentliche technische Herausforderung und was dabei herauskam.
      </p>

      <div>
        {PROJECTS.map((project, i) => (
          <CaseStudy key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
