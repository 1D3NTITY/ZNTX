import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Eigener /status-Endpoint für zntx selbst (2026-09-20, Luis-Anfrage) — bisher das einzige
// gemonitorte Projekt, das auf der neuen /status-Übersichtsseite "Live-Status nicht abrufbar"
// zeigte, weil es schlicht keinen eigenen Endpoint hatte. Gleiches "basic"-Schema wie foodapp/
// ravepuls/buchhaltung (siehe lib/status.ts BasicLiveStatus), damit lib/status.ts es ohne
// Sonderfall verarbeitet. Liegt unter /api/status statt bloß /status wie bei den anderen
// Projekten — /status ist hier bereits die menschliche Übersichtsseite (app/status/page.tsx).
//
// "operational" heißt: der Prozess läuft UND die Postgres-Verbindung (Kontaktformular) steht.
// "degraded" heißt: der Prozess läuft, die DB ist aber nicht erreichbar — das Kontaktformular
// wäre kaputt, der restliche (statische) Content funktioniert weiter. Kein "down"-Zweig: würde
// der Node-Prozess selbst nicht laufen, käme diese Route gar nicht erst zustande — der Fetch in
// lib/status.ts würde dann ehrlich fehlschlagen und `null` liefern, kein erfundener Zustand.
//
// last_deploy/last_sync bewusst null: kein echter Zeitstempel verfügbar (GIT_SHA ist ein
// Commit-Hash, keine Deploy-Zeit; keine externe Sync-Aufgabe existiert) — keine erfundenen Werte.
export async function GET() {
  let dbOk = true;
  try {
    await db.execute(sql`select 1`);
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    project: "zntx",
    status: dbOk ? "operational" : "degraded",
    last_deploy: null,
    last_sync: null,
  });
}
