"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { HERO, LINKS } from "@/lib/content";
import { HeroScene } from "@/components/hero-scene";
import { BootSequence } from "@/components/boot-sequence";

export function Hero() {
  const [bootDone, setBootDone] = useState(false);

  return (
    <section className="relative mx-auto flex w-full max-w-[1400px] flex-col justify-center gap-6 overflow-hidden px-6 pt-28 pb-14 lg:px-10 lg:pt-40 lg:pb-20">
      <HeroScene />
      <div className="relative z-10 -m-6 flex flex-col gap-4 rounded-md bg-background/60 p-6 backdrop-blur-[2px] sm:w-fit">
        <BootSequence onDone={() => setBootDone(true)} />

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 8 }}
          animate={bootDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
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
              href="#contact"
              className="rounded bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
            >
              Kontakt aufnehmen →
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
      </div>
    </section>
  );
}
