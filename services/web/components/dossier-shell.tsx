import type { ReactNode } from "react";
import { IndexRail, MobileNav } from "@/components/dossier-nav";

// Asymmetrische Zweispalten-Schale: schmale sticky Index-Leiste + breite
// Inhaltsspalte (Desktop). Unter lg: einspaltig mit eigener Mobile-Nav statt
// einfach gestapelt — bewusst andere Komposition pro Breakpoint.
export function DossierShell({ children }: { children: ReactNode }) {
  return (
    <>
      <MobileNav />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 pt-10 lg:flex-row lg:gap-16 lg:px-10 lg:pt-16">
        <IndexRail />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
