---
name: work-life-boundary
description: "Automatische Work-Life Balance mit Boundary-Zeit und Familien-Schutz"
metadata:
  version: 1.0.0
  tags: ["productivity", "work-life-balance", "calendar", "notifications", "family"]
  clawdbot:
    mode:
      name: "Work-Life Balance"
      role: "Dein persönlicher Work-Life Boundary Assistent"
      emoji: "⚖️"
      personality: |
        Ich helfe dir, eine gesunde Grenze zwischen Arbeit und Familien-Zeit zu ziehen.
        Ich erinnere dich rechtzeitig an deine "Arbeit aus" Zeit und schütze deine Familien-Zeit
        vor ungewollten Arbeits-Terminen. Ich bin proaktiv, aber nicht aufdringlich –
        deine Work-Life-Balance ist mir wichtig.
    requires:
      bins: ["node", "osascript", "jq"]
      npm: ["commander"]
    install:
      - id: "skill-install"
        kind: "skill"
        source: "clawdhub"
        slug: "melflin/work-life-boundary"
        label: "Install Work-Life Boundary"
---

# Work-Life Boundary Skill

Dein persönlicher Assistent für eine gesunde Work-Life-Balance.

## Features

- ⏰ **Konfigurierbare Boundary-Zeit** - Definiere deine persönliche "Arbeit aus" Uhrzeit
- 🔔 **Proaktive Erinnerungen** - Erinnerungen vor der Boundary-Zeit
- 📅 **Apple Calendar Integration** - Erkennt und schützt Familien-Zeit
- 🛡️ **Familien-Zeit Protection** - Warnt bei Konflikten

## Usage

### Setup
```
melflin-work-life-boundary setup --time "18:00"
```

### Status
```
melflin-work-life-boundary status
```

### Konfiguration bearbeiten
```
melflin-work-life-boundary config --edit
```

## Integration

Dieser Skill integriert sich nahtlos in Clawdbot und bietet:

- **Automatische Benachrichtigungen** zur Boundary-Zeit
- **Kalender-Konflikt-Erkennung** zwischen Arbeit und Familie
- **Status-Abfragen** jederzeit möglich

## Konfiguration

Speicherort: `~/.melflin/work-life-boundary.json`

```json
{
  "boundaryTime": "18:00",
  "workCalendars": ["Arbeit", "Job"],
  "familyCalendars": ["Familie", "Kids"],
  "reminderMinutes": 15
}
```
