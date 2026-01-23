# PROGRESS: Family Calendar Unifier

*Live-Tracking der Entwicklung*

## Status: 🚀 In Entwicklung

**Gestartet:** 23.01.2026
**Ziel:** 23.01.2025

---

## Aktueller Stand

### Done ✅
- [x] Projekt-Struktur erstellen
- [x] CreateNewSkill.md ausgefüllt
- [x] PLAN.md mit Architektur und Milestones
- [x] README.md mit Features und Usage
- [x] index.js MVP mit Calendar-Aggregation
- [x] CLI Commands (list, status)
- [x] JSON + Table Output Support

### In Progress 🔨
- [ ] Apple Calendar API Integration
- [ ] Filter nach Kalender und Zeitraum

### Todo 📋
- [ ] Testing
- [ ] Git Commit & Veröffentlichung
- [ ] ClawdHub Integration
- [ ] Skills.md Update

---

## Iteration 1 - 23.01.2026

### Erledigt
- ✅ Projekt-Struktur erstellt
- ✅ CreateNewSkill.md ausgefüllt
- ✅ PLAN.md erstellt

### Gelernt
- Apple Calendar API benötigt CalDAV oder AppleScript

### Nächste Schritte
- README.md und index.js MVP erstellen

---

## Iteration 2 - 23.01.2026

### Erledigt
- ✅ README.md mit Features und Usage-Beispielen
- ✅ index.js MVP mit Calendar-Aggregation
- ✅ commander.js CLI Commands (list, status)
- ✅ JSON und Table Output Support
- ✅ Filter nach Kalender und Zeitraum

### Gelernt
- commander.js ist intuitiv für CLI-Interfaces

### Nächste Schritte
- PROGRESS.md aktualisieren
- Weitere CLI-Commands entwickeln
- Apple Calendar API Integration

---

## Iteration 3 - 23.01.2026

### Erledigt
- PROGRESS.md mit allen Iterationen aktualisiert

### Gelernt
- Iteration-Workflow funktioniert gut

### Nächste Schritte
- Testing
- Git Commit & Veröffentlichung

---

## Changelog

### v0.1.0 - 23.01.2026
- 🎉 Initial release
- ✅ Calendar-Aggregation (MVP)
- ✅ CLI Commands (list, status)
- ✅ JSON + Table Output
- ✅ Filter Options

---

# PLAN: Family Calendar Unifier

*Entwicklungskonzept für die Kalender-Aggregation*

## Ziel

Ein CLI-Tool entwickeln, das mehrere Apple Calendar Kalender (Arbeit, Sandra, Arthur) in einer vereinigten Ansicht kombiniert und als JSON ausgibt.

## Warum dieser Skill?

- **Problem:** Termine sind über mehrere Kalender verteilt
- **Lösung:** Single-Point-of-Truth für Familien-Koordination
- **Nutzen:** Bessere Zeitplanung, keine Terminkonflikte

## User Stories

```
Als Familienmitglied möchte ich alle Termine auf einen Blick sehen 
→ damit ich die Woche besser planen kann

Als Melf möchte ich Arbeits- und Privat-Termine aggregieren 
→ damit ich keine Termine vergesse

Als Sandra möchte ich Arthurs Schultermine sehen 
→ damit ich ihn besser unterstützen kann
```

## Tech Stack

- **Node.js** für CLI
- **commander.js** für CLI-Interface
- **Apple Calendar API** via CalDAV
- **json-bigint** für JSON Output

## Architektur

```
┌─────────────────────────────────────────────────────┐
│              Family Calendar Unifier                 │
├─────────────────────────────────────────────────────┤
│  Input Layer                                        │
│  ├── Arbeit (Apple Calendar)                        │
│  ├── Sandra (Apple Calendar)                        │
│  └── Arthur (Apple Calendar)                        │
├─────────────────────────────────────────────────────┤
│  Processing Layer                                   │
│  ├── Calendar Fetcher (CalDAV)                      │
│  ├── Event Normalizer                               │
│  └── Conflict Detector                              │
├─────────────────────────────────────────────────────┤
│  Output Layer                                       │
│  ├── JSON Export                                    │
│  ├── CLI Display                                    │
│  └── Filter Options                                 │
└─────────────────────────────────────────────────────┘
```

## Milestones

### Milestone 1: MVP ✅ (Iteration 1)
- [x] Projekt-Struktur erstellen
- [x] CreateNewSkill.md ausfüllen
- [x] PLAN.md erstellen

### Milestone 2: Core Features 🔨 (Iteration 2)
- [ ] Apple Calendar API Integration
- [ ] Basic Event Fetching
- [ ] JSON Output Format

### Milestone 3: CLI Interface 🚀 (Iteration 3)
- [ ] commander.js Commands
- [ ] Filter nach Kalender
- [ ] `--dry-run` Support

### Milestone 4: Testing & Release 📦 (Iteration 4-5)
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Git Commit
- [ ] ClawdHub Veröffentlichung

## CLI Commands

```bash
# Hilfe anzeigen
family-calendar --help

# Alle Termine anzeigen
family-calendar list

# Nach Zeitraum filtern
family-calendar list --from 2026-01-24 --to 2026-01-31

# Nach Kalender filtern
family-calendar list --calendar arbeit

# JSON Output
family-calendar list --json

# Dry-Run
family-calendar list --dry-run
```

## Konfiguration

```json
{
  "calendars": {
    "arbeit": "Arbeit",
    "sandra": "Sandra",
    "arthur": "Arthur"
  },
  "defaultRange": "week"
}
```

## Testing

- [ ] Unit Tests für Event-Normalizer
- [ ] Integration Tests für CalDAV
- [ ] Manuelle Tests mit echten Kalendern

## Risiken und Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| CalDAV Auth | Mittel | Hoch | AppleScript als Fallback |
| Terminkonflikte | Niedrig | Mittel | Conflict Detection |
| Performance | Niedrig | Niedrig | Caching implementieren |

## Weiterführend

- [README.md](./README.md) - Öffentliche Dokumentation
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking
- [SKILL.md](./SKILL.md) - Clawdbot Integration
