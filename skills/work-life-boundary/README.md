# Work-Life Boundary

*Automatische "Arbeit aus" Uhrzeit zum Schutz deiner Familien-Zeit*

## Was macht dieser Skill?

Work-Life Boundary hilft dir, eine klare Grenze zwischen Arbeit und Familien-Zeit zu ziehen. Der Skill überwacht deine konfigurierte "Arbeit aus" Zeit und sendet proaktive Erinnerungen, um rechtzeitiges Abschließen zu ermöglichen. Arbeits-Kalendereinträge nach der Boundary-Zeit werden automatisch erkannt und können blockiert werden.

## Features

- ⏰ **Konfigurierbare Boundary-Zeit** - Definiere deine persönliche "Arbeit aus" Uhrzeit
- 🔔 **Proaktive Erinnerungen** - 15 Minuten vor der Boundary-Zeit wirst du erinnert
- 📅 **Apple Calendar Integration** - Erkennt und schützt Familien-Zeit vor Arbeits-Terminen
- 🛡️ **Familien-Zeit Protection** - Blockiert automatisch Arbeits-Termine nach der Boundary
- ⏸️ **Snooze-Funktion** - Kurzfristige Verlängerung bei Bedarf
- 📊 **Wochenstatistik** - Überblick über deine Work-Life-Balance

## Installation

```bash
# Über ClawdHub
clawdhub install melflin/work-life-boundary

# Oder manuell
git clone https://github.com/Melflin/melflin-oss.git
cd melflin-oss/skills/work-life-boundary
npm install
```

## Usage

### Boundary-Zeit einrichten

```bash
melflin-work-life-boundary setup --time "18:00"
```

### Aktuellen Status anzeigen

```bash
melflin-work-life-boundary status
```

### Manuelle Erinnerung auslösen

```bash
melflin-work-life-boundary remind
```

### Konfiguration bearbeiten

```bash
melflin-work-life-boundary config --edit
```

### Alle Befehle anzeigen

```bash
melflin-work-life-boundary --help
```

## Konfiguration

Die Konfiguration wird in `~/.melflin/work-life-boundary.json` gespeichert:

```json
{
  "boundaryTime": "18:00",
  "workCalendars": ["Arbeit", "Job", "Professional"],
  "familyCalendars": ["Familie", "Kids", "Home"],
  "reminderMinutes": 15,
  "snoozeMinutes": 30,
  "notifications": true,
  "homekitEnabled": false
}
```

### Optionen

| Option | Beschreibung | Standard |
|--------|--------------|----------|
| `boundaryTime` | Deine "Arbeit aus" Zeit (HH:MM) | "18:00" |
| `workCalendars` | Kalender-Namen für Arbeit | ["Arbeit"] |
| `familyCalendars` | Kalender-Namen für Familie | ["Familie"] |
| `reminderMinutes` | Minuten vor Boundary für Erinnerung | 15 |
| `snoozeMinutes` | Minuten für Snooze-Funktion | 30 |
| `notifications` | Notification Center aktivieren | true |
| `homekitEnabled` | HomeKit Signale aktivieren | false |

## Anforderungen

- macOS
- Node.js 18+
- Apple Calendar App
- Notification Center Zugriff

## Weiterführend

- [PLAN.md](./PLAN.md) - Entwicklungskonzept
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking
- [SKILL.md](./SKILL.md) - Clawdbot Integration
