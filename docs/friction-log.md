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
