"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectNode } from "@/lib/content";

const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
};

const STATUS_COLOR: Record<ProjectNode["status"], string> = {
  live: "bg-status-online",
  "paper-trading": "bg-status-paper",
  internal: "bg-foreground-muted",
};

export function NodeCard({ project }: { project: ProjectNode }) {
  const [scanned, setScanned] = useState(false);

  return (
    <motion.article
      layout
      tabIndex={0}
      role="button"
      aria-expanded={scanned}
      onHoverStart={() => setScanned(true)}
      onHoverEnd={() => setScanned(false)}
      onFocus={() => setScanned(true)}
      onBlur={() => setScanned(false)}
      onClick={() => setScanned((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setScanned((v) => !v);
        }
      }}
      className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-md border border-border bg-surface p-5 outline-none transition-colors focus-visible:border-accent hover:border-accent-dim"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px bg-accent/80 shadow-[0_0_8px_theme(colors.accent)]"
        initial={false}
        animate={
          scanned
            ? { top: "100%", opacity: [0, 1, 1, 0] }
            : { top: "0%", opacity: 0 }
        }
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            {project.role}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            {project.name}
          </h3>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[project.status]}`}
            aria-hidden
          />
          {STATUS_LABEL[project.status]}
        </span>
      </header>

      <p className="text-sm leading-relaxed text-foreground-muted">
        {project.tagline}
      </p>

      <AnimatePresence initial={false}>
        {scanned && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-foreground-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm text-foreground-muted">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-accent" aria-hidden>
                    &gt;
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {!scanned && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          {"[ scan für details ]"}
        </span>
      )}
    </motion.article>
  );
}
