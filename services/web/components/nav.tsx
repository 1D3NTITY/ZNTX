"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Nav-Überarbeitung (2026-09-04, Luis-Feedback "die Navigation macht wenig Sinn, wenn alles
// jetzt eh unterteilt ist"): zwei objektive Bugs statt einer reinen Geschmacksfrage.
//
// 1. "Start" verlinkte auf "/" und war hart als `active: true` markiert — unabhängig vom
//    tatsächlichen Scroll-Stand. Nach dem ersten Scrollen war das schlicht eine falsche
//    "Du bist hier"-Aussage. Zusätzlich ist "Start" auf einer echten Single-Page redundant zum
//    Logo oben links (components/logo.tsx), das bereits nach "/" zurückführt — zwei Links mit
//    identischem Ziel. Entfernt statt künstlich am Leben gehalten.
// 2. Die Nav war komplett `hidden` unterhalb von `sm:` — mobile Besucher hatten überhaupt keine
//    Sprungnavigation, mussten für "Kontakt" die gesamte Seite durchscrollen. Jetzt sichtbar auf
//    allen Breiten; auf Mobile unten fixiert (kollidiert sonst mit dem Logo oben links), ab `sm:`
//    wie zuvor oben zentriert.
//
// Aktiver Zustand kommt jetzt aus der echten Scroll-Position über die drei Sektionen (#systems,
// #row-operator, #row-contact) statt aus einem hartkodierten Flag — Details/Sonderfälle direkt
// im Effect unten kommentiert (ein erster IntersectionObserver-Versuch scheiterte an
// benachbarten kurzen Sektionen, siehe dortige Kommentare).
const LINKS = [
  { href: "/#systems", label: "Projekte", id: "systems" },
  { href: "/#row-operator", label: "Profil", id: "row-operator" },
  { href: "/#row-contact", label: "Kontakt", id: "row-contact" },
];

export function Nav() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    // Erster Versuch war ein IntersectionObserver mit einem schmalen mittigen rootMargin-Band —
    // beim Verifizieren (Playwright-Scroll-Test) fiel auf, dass er bei benachbarten, kurzen
    // Sektionen (die beiden zugeklappten Akkordeon-Zeilen Profil/Kontakt liegen direkt
    // hintereinander) die falsche Sektion markierte: Scrollen zu Kontakt zeigte "Profil" als
    // aktiv. Stattdessen jetzt dieselbe simple, vorhersagbare Logik wie die meisten Scroll-Spy-
    // Implementierungen: aktiv ist die unterste Sektion, deren Anfang bereits über eine feste
    // Schwelle vom oberen Rand gescrollt ist.
    let frame = 0;
    let readinessRetries = 20;
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const tops = sections.map((el) => el.getBoundingClientRect().top);
        // Direkt nach dem Mount lieferten alle drei Sektionen top:0 (per Debug-Log verifiziert,
        // finaler Release-Check 2026-09-04) — Next 16 streamt die HTML-Antwort, das Layout dieser
        // weiter unten liegenden Sektionen war zu diesem Zeitpunkt schlicht noch nicht fertig.
        // Physikalisch unmöglich im echten Layout (drei untereinanderstehende Sektionen können
        // nie gleichzeitig bei y=0 stehen) — statt diesen unplausiblen Zustand zu committen
        // (führte dazu, dass "Kontakt" beim reinen Laden ganz oben fälschlich aktiv war), kurz
        // erneut versuchen. Ein echtes Scroll-Event ruft onScroll ohnehin jederzeit erneut auf.
        if (tops.every((t) => t === 0) && window.scrollY === 0 && readinessRetries > 0) {
          readinessRetries -= 1;
          onScroll();
          return;
        }
        // Sonderfall Dokumentenende: Profil- und Kontakt-Akkordeon (zugeklappt) plus Footer sind
        // zusammen kürzer als ein Viewport — bei höheren Bildschirmen ist das Scroll-Ende
        // erreicht, bevor beide Sektionen die Schwelle unten sauber nacheinander passieren
        // (gefunden beim finalen Release-Check, 2026-09-04: Kontakt wurde nie als aktiv markiert,
        // weil man den Seitenboden erreicht, während row-contact noch bei ~590px steht). Am Ende
        // der Seite gilt deshalb immer die letzte Sektion als aktiv, unabhängig vom Schwellenwert.
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) {
          setActiveId(sections[sections.length - 1].id);
          return;
        }
        const threshold = window.innerHeight * 0.3;
        let current = sections[0].id;
        sections.forEach((el, i) => {
          if (tops[i] <= threshold) current = el.id;
        });
        setActiveId(current);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      // Auf Mobile schwebt die Nav fest über scrollendem Inhalt statt über der ruhigeren
      // Desktop-Hero — beim Verifizieren (Screenshot) blieb das gemeinsame `.glass` (55%
      // Deckkraft) über dem dichten Terminal-Text darunter nicht lesbar genug: "PROJEKTE"
      // verschmolz sichtbar mit "Status-Abruf ...". Fix nur für den Mobile-Fall, mit `!` erzwungen
      // gegen `.glass`s eigene background-Deklaration — Desktop-Glass-Optik bleibt unverändert.
      className="glass fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit items-center gap-1 rounded-full px-2 py-1.5 max-sm:!bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] sm:inset-x-auto sm:left-1/2 sm:top-4 sm:bottom-auto sm:-translate-x-1/2"
      aria-label="Hauptnavigation"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={activeId === link.id ? "page" : undefined}
          className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors duration-300 hover:text-accent ${
            activeId === link.id ? "text-accent" : "text-foreground-muted"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
