"use client";

import { motion, type Variants } from "motion/react";
import { BIO, CROSS_CUTTING_SKILLS, ROLE_FIT } from "@/lib/content";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Fasst das bisherige AboutPanel (BIO) und SkillsPanel (CROSS_CUTTING_SKILLS +
// ROLE_FIT) in einer Komponente zusammen — beides handelt von Luis als
// Operator/Person, nicht von einem einzelnen System, gehört im Live-Ops-
// Leitstand (Konzept A, 2026-07-24) daher in eine gemeinsame Dashboard-Zeile
// statt zwei getrennte Sections.
export function OperatorProfileBody() {
  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <motion.blockquote
        variants={item}
        className="max-w-2xl border-l-2 border-accent pl-5 font-serif text-xl leading-snug text-foreground sm:text-2xl"
      >
        {BIO.throughline}
      </motion.blockquote>

      <motion.div
        variants={item}
        className="mt-8 flex max-w-2xl flex-col gap-6 sm:flex-row sm:gap-10"
      >
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
      </motion.div>

      <motion.p
        variants={item}
        className="mt-6 max-w-2xl border-l-2 border-accent-dim pl-4 text-sm italic leading-relaxed text-foreground-muted"
      >
        {BIO.note}
      </motion.p>

      {/* Ehrlichkeits-Hinweis (Idee aus einem Lovable-Vergleichsentwurf, 2026-08-29, dort "Zur
          Ehrlichkeit" genannt) — bisher stand das nur klein auf /datenschutz, jetzt zusätzlich
          prominent im Profil selbst. Jede Projekt-Seite hat inzwischen zudem eine eigene
          "Was davon meine Arbeit ist"-Zeile (lib/content.ts myWork-Feld). */}
      <motion.div variants={item} className="mt-8 max-w-2xl rounded-md border border-border bg-surface p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Zur Ehrlichkeit
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Diese Website — Code, Design und der meiste Text — hat Claude (Anthropics
          KI-Coding-Agent) für mich geschrieben — aber gebaut haben wir es gemeinsam: eigene
          Konzepte, konkrete Referenzen und wiederholte, explizite Kurskorrekturen während der
          Entwicklung kamen von mir, nicht nur ein Abnicken am Ende. Genau diese Kombination aus
          echtem Infra-Betrieb und aktiver KI-Führung lässt sich nicht einfach nachmachen. Das
          steht hier bewusst offen, nicht nur zwischen den Zeilen. Die
          dargestellten Systeme, Daten und Zeiträume sind davon unberührt: sie beschreiben echte,
          selbst betriebene Infrastruktur, keine generierten Inhalte. Architektur-, Betriebs- und
          Sicherheitsentscheidungen liegen bei mir; jede Projekt-Seite nennt zusätzlich konkret,
          was davon meine eigene Arbeit ist.
        </p>
      </motion.div>

      <motion.dl variants={item} className="mt-10 divide-y divide-border border-y border-border">
        {CROSS_CUTTING_SKILLS.map((group) => (
          <div
            key={group.category}
            className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6"
          >
            <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {group.category}
            </dt>
            <dd className="text-sm leading-relaxed text-foreground">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </motion.dl>

      <motion.div variants={item} className="mt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Wofür geeignet
        </p>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[260px_1fr]">
          {ROLE_FIT.map((r) => (
            <div key={r.role} className="contents">
              <dt className="text-sm font-semibold text-foreground">{r.role}</dt>
              <dd className="text-sm leading-relaxed text-foreground-muted">{r.evidence}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </motion.div>
  );
}
