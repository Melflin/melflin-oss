# CreateNewSkill.md - Template für neue Skills

## Skill Name
**Activity Suggestor for Kids** - Schlägt Aktivitäten für Kinder basierend auf Alter, Interessen, Wetter und Zeit vor.

## Zweck
Arthur (7 Jahre) soll automatisch passende Aktivitäten vorgeschlagen bekommen, die altersgerecht, wetterabhängig und interessenbasiert sind.

## Zielgruppe
- Primär: Arthur (7 Jahre)
- Sekundär: Eltern, die Aktivitäten für Kinder suchen

## Funktionale Anforderungen

### Must-Have
- [ ] Activity Database mit altersgerechten Aktivitäten
- [ ] Wetter-API Integration (indoor/outdoor Empfehlungen)
- [ ] CLI Interface mit "Vorschlag für heute" Command
- [ ] Filter nach Alter, Interessen, Dauer, Kosten

### Should-Have
- [ ] Favoriten-System
- [ ] Aktivitäts-History
- [ ] Mehrsprachigkeit (DE/EN)

### Could-Have
- [ ] Location-basierte Vorschläge
- [ ] Integration mit Kalender
- [ ] Zufallsgenerator für Überraschungen

## Technische Anforderungen
- Node.js / JavaScript
- Wetter-API (Open-Meteo kostenlos)
- CLI Interface
- JSON-basierte Activity Database

## Dateien
- `index.js` - Hauptanwendung
- `activities.json` - Aktivitätsdatenbank
- `weather.js` - Wetter-Integration
- `cli.js` - CLI Interface
- `README.md` - Dokumentation
- `SKILL.md` - Skill-Definition

## Referenzen
- Bestehende Skills: `skills/ms365/`, `skills/reminders/`
