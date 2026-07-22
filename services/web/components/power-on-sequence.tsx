"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { HERO, LINKS } from "@/lib/content";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const LED_COUNT = 8;

// Ersetzt Hero + Boot-Sequenz: keine getippten Terminal-Zeilen mehr, sondern
// ein einmaliges mechanisches Hochfahren (LEDs zünden gestaffelt), danach
// das Rack-Typenschild. Kein Dauerloop danach.
export function PowerOnSequence() {
  const [booted, setBooted] = useState(prefersReducedMotion);

  useEffect(() => {
    if (booted) return;
    const t = setTimeout(() => setBooted(true), LED_COUNT * 140 + 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative mx-auto flex w-full max-w-[1400px] flex-col justify-center gap-6 overflow-hidden px-6 pt-28 pb-16 lg:px-10 lg:pt-40 lg:pb-24">
      <div className="rack-vents rack-metal flex items-center gap-2 self-start rounded-sm border border-border px-4 py-3">
        {Array.from({ length: LED_COUNT }, (_, i) => (
          <span
            key={i}
            className="led h-2 w-2 rounded-full bg-accent"
            style={{
              boxShadow: "0 0 6px var(--accent)",
              animationDelay: `${i * 0.14}s`,
            }}
            aria-hidden="true"
          />
        ))}
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          Power
        </span>
      </div>

      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={booted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {HERO.kicker}
        </p>
        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          {HERO.headline}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
          {HERO.subline}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#patch-panel"
            className="rounded bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Verbindung herstellen →
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>
      </motion.div>
    </section>
  );
}
