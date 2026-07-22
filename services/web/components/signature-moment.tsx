"use client";

import { motion } from "motion/react";

// Einmaliger visueller Bruch zwischen Hero und Projektliste — bewusst
// außerhalb der Dossier-Spalte (kein Fließtext, keine Index-Leiste daneben),
// damit er sich wirklich als Moment anfühlt statt als weitere Section im
// gleichen Rhythmus. Erzählt die zentralste, menschlichste Geschichte der
// Seite (n8n-Crash → Neuaufsetzen → Ursprung der heutigen Disziplin) statt
// eine beliebige Zahl zu zeigen.
export function SignatureMoment() {
  return (
    <section
      aria-label="Ausgangspunkt"
      className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-24 lg:px-10 lg:py-32"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="font-mono text-xs uppercase tracking-widest text-accent"
      >
        Ausgangspunkt
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
        className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
      >
        Einmal alles verloren.
        <br />
        <span className="text-foreground-muted">Danach sauberer neu aufgesetzt.</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
        className="max-w-xl text-sm leading-relaxed text-foreground-muted"
      >
        Ein archiviertes n8n-Automatisierungsprojekt eskalierte so weit, dass der komplette
        Root-Server zurückgesetzt werden musste. Die Secrets-Hygiene, die isolierten
        Datenbank-Rollen und die eigenen Guardrail-Hooks, die jedes andere Projekt auf dieser
        Seite trägt, haben genau dort ihren Ursprung.
      </motion.p>
      <motion.a
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: 0.26 }}
        href="#project-n8n-automation"
        className="mt-2 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        Zur vollständigen Case-Study ↓
      </motion.a>
    </section>
  );
}
