import Link from "next/link";
import { LINKS, GITHUB_REPO } from "@/lib/content";

// Git-SHA-Provenance (2026-09-07, Recherche-Synthese: "Betrachter kann Live-Code 1:1 mit dem
// angezeigten Commit abgleichen" — stärkeres Beweismittel als eine bloße Behauptung). Kommt aus
// einem Docker-Build-Arg (siehe infra/docker-compose.yml), NEXT_PUBLIC_-Präfix macht es bewusst
// clientseitig sichtbar, kein Secret. Ohne gesetztes Arg (z.B. lokaler Dev-Server ohne Docker)
// bleibt es undefined — dann wird kein Link gerendert statt ein falscher/leerer Verweis.
const GIT_SHA = process.env.NEXT_PUBLIC_GIT_SHA;

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
        {/* text-foreground statt -muted (Accessibility-Audit 2026-09-03, ursprünglich wegen der
            inzwischen entfernten .crt-vignette, die Ecken abdunkelte): bleibt als generelle
            Sicherheitsmarge in der Bildschirmecke bestehen, auch ohne die Vignette selbst. */}
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground">
          <span>© {new Date().getFullYear()} zntx.de</span>
          {GIT_SHA && GIT_SHA !== "unknown" && (
            <a
              href={`${GITHUB_REPO}/commit/${GIT_SHA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-accent"
            >
              Build {GIT_SHA}
            </a>
          )}
        </span>
        <nav className="flex gap-4">
          <a href="#row-contact" className="hover:text-accent">
            Kontakt
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            LinkedIn
          </a>
          <Link href="/impressum" className="hover:text-accent">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-accent">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
