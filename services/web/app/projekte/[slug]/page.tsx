import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PROJECTS, LINKS } from "@/lib/content";
import { formatProjectMeta } from "@/lib/labels";
import { getProjectStatuses } from "@/lib/status";
import { ProjectCaseStudyBody } from "@/components/project-case-study";

// Eigene Seite pro Projekt (2026-08-24) — ersetzt das Inline-Aufklappen im Grid auf der
// Startseite. Grund: Karten, die sich über die volle Grid-Breite öffnen, verschieben die
// Nachbarn (Reflow) — laut Recherche (uxpatterns.dev: "verify that accordions do not cause
// unnecessary reflows") ein bekanntes Verwirrungs-Problem, das Luis live genau so beobachtet
// hat. Eigene Seite hält das Grid stabil und macht jedes Projekt einzeln bei Google
// indexierbar/verlinkbar — bei diesem Content-Umfang (mehrere Absätze pro Projekt) laut
// Recherche (Smashing Magazine Modal-vs-Page-Entscheidungsbaum) ohnehin die passendere Wahl
// als ein Modal.
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return {};

  const title = `${project.name} — zntx`;
  return {
    title,
    description: project.context,
    alternates: {
      canonical: `/projekte/${project.id}`,
    },
    openGraph: {
      title,
      description: project.context,
      url: `https://zntx.de/projekte/${project.id}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) notFound();

  const statuses = await getProjectStatuses();
  const live = statuses[project.id] ?? null;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-0 lg:py-24">
      <Link
        href="/"
        className="inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        ← Zurück zur Übersicht
      </Link>

      <header className="mt-8 mb-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{
              backgroundColor: project.accentColor ?? "var(--foreground-muted)",
              boxShadow: project.accentColor ? `0 0 8px ${project.accentColor}` : "none",
            }}
          />
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.name}
          </h1>
        </div>
        <p className="mt-2 pl-6 font-mono text-xs uppercase tracking-widest text-foreground-muted">
          {formatProjectMeta(project)}
        </p>
        <p className="mt-3 max-w-xl pl-6 text-sm text-foreground-muted">{project.role}</p>
      </header>

      {project.screenshot && (
        <div className="mb-10">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={project.screenshot}
              alt={`Screenshot: ${project.name}`}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />
          </div>
          {project.screenshotCaption && (
            <p className="mt-2 text-xs text-foreground-muted">{project.screenshotCaption}</p>
          )}
        </div>
      )}

      <ProjectCaseStudyBody project={project} live={live} />

      {project.myWork && (
        <div className="mt-8 rounded-md border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Was davon meine Arbeit ist
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{project.myWork}</p>
        </div>
      )}

      <div className="mt-12 border-t border-border pt-8">
        <Link
          href="/#row-contact"
          className="inline-block rounded bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
        >
          Kontakt aufnehmen →
        </Link>
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 inline-block rounded border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:border-accent hover:text-accent"
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  );
}
