# Hobby Time Protector 🛡️

Automatisierte Kalender-Blockierung für Hobbys mit Fortschritts-Tracking.

## Features

- 📅 **Automatische Kalender-Blockierung** - Schützt deine Hobby-Zeit im Apple Calendar
- 📊 **Fortschritts-Tracking** - Verfolge km, Seiten, Stunden, etc.
- 🎯 **Hobby-Kategorien** - Flexible Konfiguration für verschiedene Hobbys
- ⏰ **Erinnerungen** - Benachrichtigungen vor Hobby-Zeit

## Installation

```bash
# Clone das Repository
git clone https://github.com/melflin/hobby-protector.git
cd hobby-protector

# Abhängigkeiten installieren
npm install
```

## Konfiguration

Bearbeite `config.json` für deine Hobbys:

```json
{
  "hobbies": [
    {
      "name": "Lesen",
      "category": "Kultur",
      "durationMinutes": 30,
      "calendarName": "Hobby Time",
      "reminderMinutesBefore": 15,
      "trackProgress": true,
      "progressUnit": "Seiten",
      "defaultProgress": 0
    },
    {
      "name": "Laufen",
      "category": "Sport",
      "durationMinutes": 45,
      "calendarName": "Hobby Time",
      "reminderMinutesBefore": 30,
      "trackProgress": true,
      "progressUnit": "km",
      "defaultProgress": 0
    }
  ],
  "defaultCalendar": "Hobby Time",
  "notificationSound": "default"
}
```

## Verwendung

### Kalender-Block erstellen

```bash
node index.js block --date 2026-01-25 --hobby "Lesen"
```

### Fortschritt eintragen

```bash
node index.js progress "Lesen" --value 50
```

### Status anzeigen

```bash
node index.js status
```

### Alle Hobbys für heute blockieren

```bash
node index.js today
```

## API-Referenz

### index.js Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `block --date DATUM --hobby NAME` | Blockiert Zeit für ein Hobby |
| `progress NAME --value WERT` | Trägt Fortschritt ein |
| `status` | Zeigt alle Fortschritte |
| `today` | Blockiert alle Hobbys für heute |

## Dateistruktur

```
hobby-protector/
├── README.md
├── index.js          # Main CLI
├── config.json       # Hobby-Konfiguration
├── progress.json     # Fortschritts-Daten
├── progress/         # Fortschritts-Logs
│   └── YYYY-MM-DD.md
└── SKILL.md          # Skill-Dokumentation
```

## Fortschritts-Tracking

Der Fortschritt wird in `progress.json` und täglichen Markdown-Dateien gespeichert:

```markdown
# Fortschritt - 2026-01-25

## Lesen
- **Heute**: 50 Seiten
- **Gesamt**: 1250 Seiten

## Laufen
- **Heute**: 5.2 km
- **Gesamt**: 156.8 km
```

## Requirements

- macOS (Apple Calendar Integration)
- Node.js 18+

## Lizenz

MIT

---

*Entwickelt für die Melflin Workspace 🧙‍♂️*
