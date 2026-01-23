# PLAN: Work-Life Boundary

*Entwicklungskonzept für automatische "Arbeit aus" Uhrzeit*

## Ziel

Automatische Erkennung und Durchsetzung einer konfigurierbaren "Arbeit aus" Uhrzeit zum Schutz der Familien-Zeit. Der Skill sendet proaktive Benachrichtigungen und blockiert bei Bedarf Arbeits-Kalendereinträge nach der Boundary-Zeit.

## Warum dieser Skill?

- **Problem:** Arbeit kriecht oft in Familien-Zeit - keine klare Grenze
- **Lösung:** Automatische Erinnerungen + Kalender-Schutz
- **Alleinstellungsmerkmal:** Apple Calendar + Notification Center Integration
- **Wert:** Bessere Work-Life-Balance, geschützte Familien-Zeit

## User Stories

```
Als berufstätiger Familienmensch möchte ich eine konfigurierbare "Arbeit aus" Uhrzeit definieren,
damit ich automatisch an den Übergang zur Familien-Zeit erinnert werde.

Als Nutzer möchte ich, dass nach der Boundary-Zeit keine Arbeits-Kalendereinträge mehr geplant werden können,
damit meine Familien-Zeit geschützt ist.

Als Nutzer möchte ich vor der Boundary-Zeit eine Erinnerung erhalten,
damit ich rechtzeitig abschließen kann.
```

## Tech Stack

- Node.js für CLI
- Apple Calendar (via AppleScript/Calendars.app)
- Apple Notifications (via osascript)
- Optional: HomeKit für physische Signale (z.B. Licht)
- `node-cron` für zeitbasierte Checks

## Architektur

```
┌─────────────────┐
│  Config Store   │
│ (work-time.json)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Boundary Check  │────▶│ Notification    │
│ (cron, minütlich)│     │ Center          │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Calendar Scan   │────▶│ Block/Protect   │
│ (Apple Script)  │     │ Events          │
└─────────────────┘     └─────────────────┘
```

## Milestones

### Milestone 1: MVP
- [x] Projektstruktur erstellen
- [ ] Config-Datei für Boundary-Zeit
- [ ] Basis CLI mit Commander
- [ ] Benachrichtigung zur "Arbeit aus" Zeit
- [ ] Manuelle Status-Abfrage

### Milestone 2: Kalender-Integration
- [ ] Apple Calendar auslesen
- [ ] Arbeits-Kalender erkennen (basierend auf Calendarnamen)
- [ ] Automatische Blockierung von Terminen nach Boundary
- [ ] "Early Warning" Reminder (15 min vor Boundary)

### Milestone 3: Erweiterungen
- [ ] Familien-Kalender Priorisierung
- [ ] Statistiken (Wochenübersicht)
- [ ] HomeKit Integration (optionales Signal)
- [ ] Snooze-Funktion

## Testing

- [ ] Unit Tests für Zeit-Berechnungen
- [ ] Integrationstests mit Apple Calendar
- [ ] Notification Center Funktionalität
- [ ] Manuelle Tests mit echten Kalendern

## Risiken und Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Apple Calendar API nicht erreichbar | Mittel | Hoch | Fallback auf osascript |
| Notification Center blockiert | Niedrig | Mittel | Reminders als Backup |
| Konfiguration vergessen | Niedrig | Niedrig | Automatische Erinnerung bei Ersteinrichtung |

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

---

*Erstellt: 2026-01-23*
