"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectNode } from "@/lib/content";

const STATUS_LABEL: Record<ProjectNode["status"], string> = {
  live: "LIVE",
  "paper-trading": "PAPER-TRADING",
  internal: "INTERNAL",
};

export function NodeDetailPanel({
  project,
  onClose,
}: {
  project: ProjectNode | null;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Schließen"
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="node-detail-heading"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col gap-5 overflow-y-auto rounded-md border border-border bg-surface p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  {project.role}
                </p>
                <h3
                  id="node-detail-heading"
                  className="mt-1 text-2xl font-semibold text-foreground"
                >
                  {project.name}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded border border-border px-2 py-1 font-mono text-xs text-foreground-muted hover:border-accent hover:text-accent"
              >
                ESC ×
              </button>
            </div>

            <span className="w-fit rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
              {STATUS_LABEL[project.status]}
            </span>

            {/* Kein echtes Bildmaterial — bewusst kein Fake-Screenshot, stattdessen
                ehrlicher Terminal-Platzhalter mit Kern-Info auf einen Blick. */}
            <div className="flex h-28 flex-col items-center justify-center gap-1 rounded border border-dashed border-border font-mono text-[11px] text-foreground-muted">
              <span>{"[ visual folgt ]"}</span>
              <span className="text-foreground-muted/60">{project.stack[0]} → {project.role}</span>
            </div>

            <p className="text-sm leading-relaxed text-foreground">
              {project.description}
            </p>

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

            <ul className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm text-foreground-muted">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">
                    &gt;
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded border border-accent-dim px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent hover:bg-accent/10"
              >
                {project.url.replace("https://", "")} →
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
