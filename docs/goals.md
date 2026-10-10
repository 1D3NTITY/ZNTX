# Ziele — zntx
<!-- `- [ ] Text [status:: blockiert] [fällig:: YYYY-MM-DD]` — beides optional,
     ohne status:: = offen. Bei Statusänderung sofort pflegen, nicht sammeln. -->

- [x] Layout-/Spacing-Feinschliff — erledigt am 2026-09-16: Luis wollte einen systematischen
      Durchgang, Editorial-Redesign der Projekt-Detailseiten umgesetzt (Kontext/Beitrag/
      Herausforderung/Ergebnis als durchgehender Textfluss statt Box/Zitat-Mix) + Archiv auf
      einen einzigen Block konsolidiert (`status === "archived"` sticht jetzt `server`-Feld).
- [ ] Drohnen-Video ins Operator-Profil einbauen — Luis: "folgt noch", Platzierung/Umsetzung
      liegt bei der Implementierungs-Session, sobald das Material da ist.
- [x] Uncommittete Server-Kontext-Änderungen geklärt — erledigt am 2026-09-16: `.env.example`
      selbst committed (Platzhalter-Aufräumung). `.claude/hooks/guardrails.py`/`CLAUDE.md` waren
      bereits über einen anderen Weg committed (Commit 7fd8f4c, 2026-09-16), bevor diese Session
      dazu kam — kein Handlungsbedarf mehr.
- [ ] Git-committed Uptime-History (Actions-Workflow, alle 30 Min) läuft produktiv — Plausibilitätscheck
      2026-10-10: Retention funktioniert korrekt (ravepuls/buchhaltung/foodapp/matrix-chat/qntx halten
      exakt 30 Tages-Buckets, älteste Einträge rotieren sauber raus). ABER die tatsächliche
      Lauffrequenz liegt weit unter dem konfigurierten `*/30 * * * *`: die `chore(uptime)`-Commits
      liegen durchgängig ~4-8h auseinander statt 30 Min (nur 4-7 Checks/Tag statt bis zu 48) — mehr
      als die im Workflow-Kommentar erwarteten "vereinzelten" Lücken, das drückt die Aussagekraft der
      30-Tage-% deutlich (~8-10x weniger Samples als angenommen). Ursache offen, siehe friction-log.
- [x] Kuma-Reachability-Signal (seit 2026-09-16 live, siehe `lib/kuma.ts`) — Plausibilitätscheck
      2026-10-10, positiv: `wardogs-community`/ZBLT zeigt im fachlichen Status eine echte
      Degradation 2026-10-02 bis 2026-10-06 (Tagesquote sinkt bis auf 0% am 10-05, 25% am 10-06,
      danach volle Erholung), während das unabhängige Kuma-Signal für dieselben Monitore im selben
      Zeitraum durchgehend "up" bleibt (nur ein einzelner, monitor-übergreifend korrelierter Blip
      am 10-02, der auch qntx trifft). Genau das "erreichbar, aber fachlich kaputt"-Szenario, für
      das die beiden Signale bewusst getrennt wurden (siehe Kommentar in `lib/kuma.ts`) — keine
      dauerhaften 0%/100%-Werte ohne Erklärung, keine offenen Fragen mehr.
