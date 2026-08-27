import Link from "next/link";

// Zentrierte, fixed Glass-Pill-Navigation (Alumica-Adaption, 2026-08-27 v3) — Luis' Hinweis:
// das "Einzigartige" an der Vorlage war auch die schwebende Pill-Nav-Leiste selbst, nicht nur
// die konkreten Linknamen (Pricing/Blog o.ä., die wir bewusst nicht nachbauen). Hier mit echten
// Sprungmarken zu tatsächlich existierenden Bereichen der Startseite — kein erfundener Content.
// Führende "/" vor den Ankern (wie schon in footer.tsx etabliert): funktioniert dadurch auch von
// /impressum, /datenschutz oder /projekte/[slug] aus korrekt (navigiert erst zur Startseite).
const LINKS = [
  { href: "/", label: "Start" },
  { href: "/#systems", label: "Projekte" },
  { href: "/#row-operator", label: "Profil" },
  { href: "/#row-contact", label: "Kontakt" },
];

export function Nav() {
  return (
    <nav
      className="glass fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 sm:flex"
      aria-label="Hauptnavigation"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors duration-300 hover:text-accent"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
