# Family Calendar Unifier

*CLI-Tool zur Aggregation mehrerer Apple Calendar Kalender in einer unified View*

## Was macht dieser Skill?

Family Calendar Unifier kombiniert Termine aus mehreren Apple Calendar Kalendern (Arbeit, Sandra, Arthur) in einer einzigen, übersichtlichen Ansicht. Perfekt für Familien-Koordination und Zeitplanung.

## Features

- ✅ **Multi-Calendar Aggregation** - Termine aus mehreren Kalendern sammeln
- ✅ **JSON Output** - Maschinenlesbar für Interoperabilität
- ✅ **CLI Interface** - Einfache Bedienung mit commander.js
- ✅ **Filter Options** - Nach Kalender, Zeitraum oder Keyword filtern
- ✅ **Dry-Run Support** - Testen ohne Änderungen

## Installation

```bash
# Lokal
cd /Users/melf/melflin/skills/family-calendar
npm install

# Oder über ClawdHub
clawdhub install melflin/family-calendar
```

## Usage

```bash
# Hilfe anzeigen
family-calendar --help

# Alle Termine anzeigen (kommende Woche)
family-calendar list

# Nach Zeitraum filtern
family-calendar list --from 2026-01-24 --to 2026-01-31

# Nach Kalender filtern
family-calendar list --calendar arbeit
family-calendar list --calendar sandra
family-calendar list --calendar arthur

# JSON Output für externe Tools
family-calendar list --json

# Nur Konflikte anzeigen
family-calendar list --conflicts

# Dry-Run (Test ohne Änderungen)
family-calendar list --dry-run
```

## Beispiele

```bash
# Familien-Termine für diese Woche
$ family-calendar list --calendar sandra --calendar arthur

# Arbeits-Termine mit JSON Output
$ family-calendar list --calendar arbeit --json | jq '.events[] | select(.title | contains("Meeting"))'

# Nächste 7 Tage
$ family-calendar list --days 7
```

## Anforderungen

- macOS
- Node.js v18+
- Apple Calendar App (mit Kalendern)

## Konfiguration

Erstelle `config.json` im Verzeichnis:

```json
{
  "calendars": {
    "arbeit": "Arbeit",
    "sandra": "Sandra",
    "arthur": "Arthur"
  },
  "defaultRange": "week",
  "outputFormat": "table"
}
```

## Weiterführend

- [PLAN.md](./PLAN.md) - Entwicklungskonzept
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking
- [SKILL.md](./SKILL.md) - Clawdbot Integration

## Lizenz

MIT License
