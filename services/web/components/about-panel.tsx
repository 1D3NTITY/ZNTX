"use client";

import { motion } from "motion/react";
import { BIO } from "@/lib/content";
import { SectionNumber } from "@/components/section-number";

// Eigene Komposition statt dl-Duplikat der Projekte/Arbeitsweise-Struktur:
// Werdegang als große Pull-Quote, Brotjob/Nebenbei/Perspektive als kompakter
// Profil-Streifen statt Label/Value-Tabelle.
export function AboutPanel() {
  return (
    <section
      id="background"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="background-heading"
    >
      <div className="relative overflow-hidden">
        <SectionNumber n="03" />
        <p className="font-mono text-xs uppercase tracking-widest text-accent">§03</p>
        <h2
          id="background-heading"
          className="mt-1 font-serif text-3xl font-semibold sm:text-4xl"
        >
          {BIO.heading}
        </h2>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-8 max-w-2xl border-l-2 border-accent pl-5 font-serif text-xl leading-snug text-foreground sm:text-2xl"
      >
        {BIO.throughline}
      </motion.blockquote>

      <div className="mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:gap-10">
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Beruflich
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{BIO.dayJob}</p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Nebentätigkeit
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{BIO.passion}</p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Perspektive
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{BIO.trajectory}</p>
        </div>
      </div>

      <p className="mt-8 max-w-2xl border-l-2 border-accent-dim pl-4 text-sm italic leading-relaxed text-foreground-muted">
        {BIO.note}
      </p>
    </section>
  );
}
