import Link from "next/link";
import { LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} zntx.de</span>
        <nav className="flex gap-4">
          <a href="#contact" className="hover:text-accent">
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
