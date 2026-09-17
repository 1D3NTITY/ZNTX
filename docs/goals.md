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
- [ ] Git-committed Uptime-History (Actions-Workflow, alle 30 Min) läuft produktiv — nach ein
      paar Wochen echten Datenbestand prüfen (Retention/Aussagekraft der 30-Tage-Kennzahl).
- [ ] Kuma-Reachability-Signal (seit 2026-09-16 live, siehe `lib/kuma.ts`) — nach ein paar
      Actions-Läufen prüfen, ob die Erreichbarkeits-% plausibel aussehen (insbesondere
      `wardogs-community`/ZBLT, dessen Monitore erst seit kurzem aktiv laufen).
