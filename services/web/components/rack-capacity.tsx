"use client";

import { motion } from "motion/react";
import { CROSS_CUTTING_SKILLS } from "@/lib/content";

// Ersetzt die reine Skills-Liste: aggregierte "Betriebsparameter" über alle
// Einheiten hinweg, als technisches Spec-Sheet — bewusst KEINE Fake-Prozent-
// Balken (es gibt keine echte Messgröße für "Skill-Level").
export function RackCapacity() {
  return (
    <section
      id="ru-capacity"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="capacity-heading"
    >
      <h2 id="capacity-heading" className="font-serif text-3xl font-semibold sm:text-4xl">
        Betriebsparameter
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        Nicht pro Einheit einzeln, sondern das, was über das ganze Rack hinweg
        wiederkehrt — die eigentlichen Fähigkeiten stecken im Betrieb, nicht in einer
        einzelnen Einheit.
      </p>

      <div className="rack-metal mt-8 rounded-sm border border-border p-6">
        <dl className="divide-y divide-border">
          {CROSS_CUTTING_SKILLS.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              className="grid grid-cols-1 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-6"
            >
              <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground-muted">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 6px var(--accent)" }}
                  aria-hidden="true"
                />
                {group.category}
              </dt>
              <dd className="text-sm leading-relaxed text-foreground">
                {group.items.join(" · ")}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
