"use client";

import { useRef, type PointerEvent } from "react";
import { motion } from "motion/react";

export type RackUnitField = { label: string; value: string };

export type RackUnitProps = {
  ruNumber: string;
  title: string;
  role: string;
  meta?: string;
  fields: RackUnitField[];
  note?: string;
  url?: string;
  status: "active" | "paper" | "archived";
  height?: "sm" | "md" | "lg";
  id?: string;
};

const STATUS_COLOR: Record<RackUnitProps["status"], string> = {
  active: "var(--status-active)",
  paper: "var(--led-warn)",
  archived: "var(--foreground-muted)",
};

const STATUS_LABEL: Record<RackUnitProps["status"], string> = {
  active: "ACTIVE",
  paper: "PAPER-TRADING",
  archived: "AUSSER BETRIEB",
};

const HEIGHT_PADDING: Record<NonNullable<RackUnitProps["height"]>, string> = {
  sm: "py-8",
  md: "py-10",
  lg: "py-14",
};

// Eine montierte Rack-Einheit — Typenschild + technisches Datenblatt statt
// Fließtext-Absätzen. Archivierte Einheiten sind sichtbar schräg montiert
// ("außer Betrieb"), keine reine Text-Kennzeichnung.
export function RackUnit({
  ruNumber,
  title,
  role,
  meta,
  fields,
  note,
  url,
  status,
  height = "md",
  id,
}: RackUnitProps) {
  const ref = useRef<HTMLElement>(null);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current!.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    ref.current!.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <motion.article
      ref={ref}
      id={id}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rack-metal spotlight relative flex gap-4 rounded-sm border border-border px-5 sm:px-8 ${HEIGHT_PADDING[height]} ${
        status === "archived" ? "-rotate-1 opacity-80" : ""
      }`}
    >
      {/* Nieten */}
      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" />
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" />
      <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" />
      <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" />

      <div className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-border pr-4 sm:w-16">
        <span
          className="led h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: STATUS_COLOR[status],
            boxShadow: `0 0 8px ${STATUS_COLOR[status]}`,
          }}
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          RU-{ruNumber}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            {title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            {STATUS_LABEL[status]}
            {meta ? ` · ${meta}` : ""}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">{role}</p>

        <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border pt-4 sm:grid-cols-[130px_1fr]">
          {fields.map((f) => (
            <div key={f.label} className="contents">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
                {f.label}
              </dt>
              <dd className="text-sm leading-relaxed text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>

        {note && (
          <p className="mt-4 border-l-2 pl-3 text-sm italic leading-relaxed text-foreground-muted" style={{ borderColor: "var(--led-warn)" }}>
            {note}
          </p>
        )}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            {url.replace("https://", "")} →
          </a>
        )}
      </div>
    </motion.article>
  );
}
