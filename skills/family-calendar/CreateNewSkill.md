# Family Calendar Unifier

*CLI-Tool zur Aggregation mehrerer Apple Calendar Kalender in einer unified View*

---

## 📋 Iterations-Plan

### Iteration 1 (jetzt) ✅
- [x] CreateNewSkill.md Template ausgefüllt
- [x] PLAN.md erstellt

### Iteration 2 (in 3 Min)
- [ ] README.md mit Features
- [ ] index.js MVP (Calendar-Aggregation)

### Iteration 3 (in 6 Min)
- [ ] PROGRESS.md
- [ ] CLI-Commands erweitern

### Iteration 4 (in 9 Min)
- [ ] Testing
- [ ] Git Commit & Veröffentlichung

### Iteration 5 (in 12 Min)
- [ ] Screenshots
- [ ] ClawdHub
- [ ] Abschluss

---

## Ziel

Einen kombinierten Kalender aus Arbeitskalender + Sandra + Arthur erstellen.

## User Stories

```
Als Familienmitglied möchte ich alle Termine auf einen Blick sehen damit ich die Woche besser planen kann
Als Melf möchte ich Arbeits- und Privat-Termine aggregieren damit ich keine Termine vergesse
```

## Tech Stack

- Node.js für CLI
- `commander.js` für CLI-Interface
- Apple Calendar API (CalDAV)
- JSON Output für Interoperabilität

## Architektur

```
[Apple Calendar] → [Calendar Aggregation] → [Unified JSON Output]
      ↓                    ↓
[Arbeit]             [CLI Interface]
[Sandra]             [Filter/Sort]
[Arthur]             [Display Options]
```

## Milestones

### Milestone 1: MVP
- [x] Verzeichnis-Struktur
- [ ] Calendar-Aggregation Logik
- [ ] Basic CLI Commands

### Milestone 2: Features
- [ ] Filter nach Kalender
- [ ] JSON Output
- [ ] `--dry-run` Support

### Milestone 3: Veröffentlichung
- [ ] Git Commit
- [ ] ClawdHub
- [ ] Skills.md Update
