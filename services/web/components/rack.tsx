"use client";

import { useState } from "react";
import { PROJECTS, BIO, type ProjectNode } from "@/lib/content";
import { RackUnit, type RackUnitProps } from "@/components/rack-unit";
import { RackOverview, RackOverviewMobile } from "@/components/rack-overview";
import { RackCapacity } from "@/components/rack-capacity";
import { PatchPanel } from "@/components/patch-panel";

const SERVER_LABEL: Record<"server-1" | "server-2", string> = {
  "server-1": "Server 1",
  "server-2": "Server 2",
};

function projectStatus(status: ProjectNode["status"]): RackUnitProps["status"] {
  if (status === "archived") return "archived";
  if (status === "paper-trading") return "paper";
  return "active";
}

function projectFields(p: ProjectNode) {
  return [
    { label: "Kontext", value: p.context },
    { label: "Beitrag", value: p.contribution },
    { label: "Herausforderung", value: p.challenge },
    { label: "Ergebnis", value: p.outcome },
    { label: "Stack", value: p.stack.join(" · ") },
  ];
}

function projectMeta(p: ProjectNode) {
  const parts = [];
  if (p.server) parts.push(SERVER_LABEL[p.server]);
  if (p.since) parts.push(p.status === "archived" ? p.since : `seit ${p.since}`);
  return parts.join(" · ");
}

// Höhe pro Einheit variiert bewusst (nicht alle gleich groß) — bricht die
// sonst identische Wiederholung. Erste, größte Einheit bekommt mehr
// visuelles Gewicht.
const HEIGHTS: RackUnitProps["height"][] = ["lg", "md", "md", "lg", "lg", "md"];

const OPERATOR_ID = "ru-operator";

export function Rack() {
  // Target-Lock: Klick auf eine Einheit fokussiert sie, alle anderen treten
  // zurück (Signature Moment #2). Nochmaliger Klick hebt den Fokus auf.
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function toggleFocus(id: string) {
    setFocusedId((current) => (current === id ? null : id));
  }

  return (
    <>
      <RackOverviewMobile />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 pt-10 lg:flex-row lg:gap-12 lg:px-10 lg:pt-16">
        <RackOverview />
        <main className="min-w-0 flex-1">
          <section
            className="flex flex-col gap-8 border-t border-border py-16"
            aria-label="Montierte Einheiten"
          >
            {PROJECTS.map((p, i) => {
              const unitId = `ru-${p.id}`;
              return (
                <RackUnit
                  key={p.id}
                  id={unitId}
                  ruNumber={String(i + 1).padStart(2, "0")}
                  title={p.name}
                  role={p.role}
                  meta={projectMeta(p)}
                  fields={projectFields(p)}
                  note={p.note}
                  url={p.url}
                  status={projectStatus(p.status)}
                  height={HEIGHTS[i] ?? "md"}
                  focused={focusedId === unitId}
                  dimmed={focusedId !== null && focusedId !== unitId}
                  onToggleFocus={() => toggleFocus(unitId)}
                />
              );
            })}

            <RackUnit
              id={OPERATOR_ID}
              ruNumber="08"
              title="Operator"
              role={BIO.heading}
              fields={[
                { label: "Brotjob", value: BIO.dayJob },
                { label: "Werdegang", value: BIO.throughline },
                { label: "Nebenbei", value: BIO.passion },
                { label: "Perspektive", value: BIO.trajectory },
              ]}
              note={BIO.note}
              status="active"
              height="lg"
              focused={focusedId === OPERATOR_ID}
              dimmed={focusedId !== null && focusedId !== OPERATOR_ID}
              onToggleFocus={() => toggleFocus(OPERATOR_ID)}
            />
          </section>

          <RackCapacity />
          <PatchPanel />
        </main>
      </div>
    </>
  );
}
