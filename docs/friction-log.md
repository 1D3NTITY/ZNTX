# Friction-Log — zntx
<!-- `- [ ] YYYY-MM-DD: Beschreibung [status:: offen|behoben]` -->

- [ ] 2026-09-10: `GITHUB_TOKEN`-Umgebungsvariable überschreibt die in `gh` gespeicherte
      Authentifizierung (fine-grained PAT ohne Repo-Erstellungs-/`workflow`-Scope-Recht) —
      `gh repo create` und jeder `git push`, der `.github/workflows/*` ändert, schlägt
      fehl, bis `unset GITHUB_TOKEN` vor dem jeweiligen Befehl steht. Nicht offensichtlich,
      da `gh auth status` beide Konten zeigt und man erst beim konkreten Fehlschlag merkt,
      welches Token tatsächlich aktiv ist. [status:: offen]
- [ ] 2026-09-08: Einfache `grep`-Prüfungen auf serverseitig gerenderten React-Text liefern
      falsche Negative — React trennt interpolierte Werte teils mit `<!-- -->`-HTML-
      Kommentaren (z.B. "Build<!-- -->abc123" statt "Build abc123"), ein naives
      `grep -o "Build [a-z0-9]*"` findet dann nichts, obwohl der Wert korrekt im DOM steht.
      Verifikation über echtes `innerText`/`textContent` (Playwright `page.evaluate`) statt
      Regex auf dem rohen HTML-String. [status:: behoben]
- [ ] 2026-10-10: GitHub-Actions-Cron für `scripts/uptime-check.ts` (`*/30 * * * *` in
      `.github/workflows/uptime.yml`) läuft in der Praxis nur alle ~4-8h statt alle 30 Min — die
      `chore(uptime): update history [skip ci]`-Commits der letzten ~3 Wochen zeigen das
      durchgängig (nur 4-7 Checks/Tag statt bis zu 48 möglichen). Mehr als die im
      Workflow-Kommentar erwarteten "vereinzelten" ausgelassenen Intervalle, drückt die
      Aussagekraft der 30-Tage-Uptime-%. Noch nicht untersucht, ob GitHub kurze Cron-Intervalle
      auf diesem Repo drosselt oder etwas anderes blockiert. [status:: offen]
