"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "@/components/contact-form";

const PORT_COUNT = 8;
const OPEN_PORT = 5;

// Ersetzt die klassische Kontakt-Section: ein Patch-Panel mit einem freien
// Port. Klick "klinkt" das Kontaktformular ein (Slide-Reveal), statt es
// permanent offen als Standardformular zu zeigen.
export function PatchPanel() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="patch-panel"
      className="scroll-mt-24 border-t border-border py-16"
      aria-labelledby="patch-panel-heading"
    >
      <h2 id="patch-panel-heading" className="font-serif text-3xl font-semibold sm:text-4xl">
        Patch-Panel
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        Ein Port ist frei. Kurze Einordnung des Anliegens genügt — Rückmeldung erfolgt zeitnah.
      </p>

      <div className="rack-metal mt-8 max-w-xl rounded-sm border border-border p-6">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: PORT_COUNT }, (_, i) => {
            const isOpenPort = i === OPEN_PORT;
            return (
              <button
                key={i}
                type="button"
                disabled={!isOpenPort}
                onClick={() => setOpen(true)}
                aria-label={isOpenPort ? "Verbindung herstellen" : `Port ${i + 1} belegt`}
                className={`flex h-11 w-11 items-center justify-center rounded-sm border transition-colors ${
                  isOpenPort
                    ? "border-accent-dim bg-background hover:border-accent"
                    : "border-border bg-surface-raised"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full ${isOpenPort ? "bg-accent" : "bg-border"}`}
                  style={isOpenPort ? { boxShadow: "0 0 8px var(--accent)" } : undefined}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          Port {OPEN_PORT + 1} frei — restliche Ports belegt
        </p>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 border-t border-border pt-6">
                <ContactForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 rounded bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Verbindung herstellen →
          </button>
        )}
      </div>
    </section>
  );
}
