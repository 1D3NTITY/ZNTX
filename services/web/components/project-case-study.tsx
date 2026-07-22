"use client";

import { useRef, type PointerEvent } from "react";
import { motion, type Variants } from "motion/react";
import { PROJECTS, type ProjectNode } from "@/lib/content";
import { SectionNumber } from "@/components/section-number";

const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
  archived: "ARCHIVIERT",
};

const SERVER_LABEL: Record<"server-1" | "server-2", string> = {
  "server-1": "Server 1",
  "server-2": "Server 2",
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function CaseStudy({ project, index }: { project: ProjectNode; index: number }) {
  const ref = useRef<HTMLElement>(null);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current!.style.setProperty("--x", `${x}%`);
    ref.current!.style.setProperty("--y", `${y}%`);
  }

  return (
    <motion.article
      ref={ref}
      id={`project-${project.id}`}
      onPointerMove={onPointerMove}
      className="spotlight scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
    >
      <motion.p
        variants={item}
        className="font-mono text-xs uppercase tracking-widest text-accent"
      >
        {project.role}
      </motion.p>

      <motion.div
        variants={item}
        className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
      >
        <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {String(index + 1).padStart(2, "0")} — {project.name}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
          {STATUS_LABEL[project.status]}
          {project.server ? ` · ${SERVER_LABEL[project.server]}` : ""}
          {project.since ? ` · ${project.status === "archived" ? "" : "seit "}${project.since}` : ""}
        </span>
      </motion.div>

      <motion.dl
        variants={item}
        className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-[140px_1fr]"
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
          Ergebnis
        </dt>
        <dd className="text-sm leading-relaxed text-foreground">{project.outcome}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Stack
        </dt>
        <dd className="font-mono text-xs leading-relaxed text-foreground-muted">
          {project.stack.join(" · ")}
        </dd>
      </motion.dl>

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
      <div className="relative overflow-hidden">
        <SectionNumber n="01" />
        <p className="font-mono text-xs uppercase tracking-widest text-accent">§01</p>
        <h2 id="projects-heading" className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
          Projekte
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
          Kein Mockup, keine Demo — echte Systeme, inklusive eines archivierten, an dem sich
          einiges lernen ließ. Kontext, Beitrag, die eigentliche technische Herausforderung
          und was dabei herauskam.
        </p>
      </div>

      <div>
        {PROJECTS.map((project, i) => (
          <CaseStudy key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
