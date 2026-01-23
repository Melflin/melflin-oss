# Weekly Priority Visualizer - Screenshots

## CLI Help Output

```
╔══════════════════════════════════════════════════════════════╗
║ 🎯 Weekly Priority Visualizer                                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Zeigt deine Top 3 Prioritäten basierend auf Kalender,       ║
║  Reminders und Emails.                                       ║
║                                                              ║
║  Usage:                                                      ║
║    node index.js --week    Diese Woche anzeigen (Standard)   ║
║    node index.js --today   Heute anzeigen                    ║
║    node index.js --json    JSON Output                       ║
║    node index.js --help    Diese Hilfe anzeigen              ║
║                                                              ║
║  Options:                                                    ║
║    -w, --week     Weekly View (Standard)                     ║
║    -t, --today    Today's Priorities                         ║
║    -j, --json     Output als JSON                            ║
║    -v, --verbose  Verbose Output                             ║
║    -h, --help     Hilfe anzeigen                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Weekly View Output

```
╔══════════════════════════════════════════════════════════════╗
║ 📌 Top 3 Priorities (KW 4 • 2026)                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. 🎯 Projekt X Deadline                                    ║
║     📅 Calendar • Fr., 23. Jan. • Score: 20                  ║
║     └── Wichtiges Meilimum                                   ║
║                                                              ║
║  2. ✅ Email an Kunden beantworten                           ║
║     📅 Reminder • Fr., 23. Jan. • Score: 20                  ║
║     └── Dringend                                             ║
║                                                              ║
║  3. 📧 Projekt Update benötigt                               ║
║     📅 Email • Fr., 23. Jan. • Score: 16                     ║
║     └── Von: Manager                                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Today's View Output

```
╔══════════════════════════════════════════════════════════════╗
║ 📌 Today's Priorities (Fr., 23. Jan. • 2026)                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. 🎯 Projekt X Deadline                                    ║
║     📅 Calendar • Heute • Score: 75                          ║
║     └── Wichtiges Meilimum bis Ende der Woche                ║
║                                                              ║
║  2. ✅ Email an Kunden beantworten                           ║
║     📅 Reminder • Heute • Score: 60                          ║
║     └── Dringend                                             ║
║                                                              ║
║  3. 📧 Response needed                                       ║
║     📅 Email • Heute • Score: 45                             ║
║     └── Kundenanfrage bearbeiten                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## JSON Output

```json
[
  {
    "id": "1",
    "type": "calendar",
    "title": "Projekt X Deadline",
    "description": "Wichtiges Meilimum",
    "date": "2026-01-23T00:00:00.000Z",
    "score": 75,
    "source": "📅 Calendar"
  },
  {
    "id": "10",
    "type": "reminder",
    "title": "Email an Kunden beantworten",
    "description": "Dringend",
    "date": "2026-01-23T00:00:00.000Z",
    "score": 60,
    "source": "✅ Reminder"
  },
  {
    "id": "20",
    "type": "email",
    "title": "Projekt Update benötigt",
    "description": "Von: Manager",
    "date": "2026-01-23T00:00:00.000Z",
    "score": 45,
    "source": "📧 Email"
  }
]
```

---

*Generated: 2026-01-23*
