# Activity Suggestor for Kids 👶

**Schlägt altersgerechte Aktivitäten für Kinder basierend auf Wetter, Interessen und verfügbarer Zeit vor.**

![Activity Suggestor](https://img.shields.io/badge/Node.js-v18+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 🎯 **Wetter-basierte Empfehlungen** - Nutzt Open-Meteo API für indoor/outdoor Vorschläge
- 👶 **Altersgerechte Filterung** - Passt Aktivitäten an das Alter an (1-12 Jahre)
- 🏷️ **Vielseitige Kategorien** - Outdoor, Indoor, Kreativ, Sport, Bildung
- 💰 **Kosten-Tracking** - Filter nach Budget
- ⏱️ **Zeit-Management** - Filter nach verfügbarer Zeit
- 🔍 **Suchfunktion** - Suche nach Stichwörtern
- 📱 **CLI Interface** - Einfache Bedienung im Terminal

## 🚀 Schnellstart

### Installation

```bash
cd /Users/melf/melflin/skills/kids-activity
npm install
```

### Verwendung

**Interaktiver Modus:**
```bash
node index.js
```

**Schneller Vorschlag (wetterbasiert):**
```bash
node index.js --quick
node index.js --quick --age 5
```

**Nur Indoor-Aktivitäten:**
```bash
node index.js --indoor --age 7
```

**Nach Stichwort suchen:**
```bash
node index.js --search Lego
node index.js --search "Fussball spielen"
```

**Alle Aktivitäten auflisten:**
```bash
node index.js --list
```

## 📋 Befehlsübersicht

| Befehl | Beschreibung |
|--------|--------------|
| `node index.js` | Interaktiver Modus |
| `node index.js --quick` | Schneller Vorschlag |
| `node index.js --quick --age 5` | Vorschlag für 5-Jährigen |
| `node index.js --indoor` | Nur Indoor |
| `node index.js --outdoor` | Nur Outdoor |
| `node index.js --search Lego` | Nach Lego suchen |
| `node index.js --list` | Alle anzeigen |
| `node index.js --help` | Hilfe anzeigen |

## 🌤️ Wetter-Integration

Der Activity Suggestor nutzt die kostenlose [Open-Meteo API](https://open-meteo.com/) für Echtzeit-Wetterdaten aus Zürich:

- **Gutes Wetter**: Outdoor-Aktivitäten werden priorisiert
- **Schlechtes Wetter**: Indoor-Aktivitäten werden empfohlen
- **Regen**: Basteln, Spiele, Bücher lesen
- **Sonne**: Spielplatz, Velo fahren, Fussball

## 📁 Projektstruktur

```
kids-activity/
├── activities.json    # Aktivitätsdatenbank
├── index.js          # Hauptanwendung & CLI
├── weather.js        # Wetter-API Integration
├── package.json      # npm Konfiguration
├── README.md         # Diese Datei
└── PROGRESS.md       # Entwicklungsfortschritt
```

## 🎯 Aktivitätskategorien

| Kategorie | Beschreibung |
|-----------|--------------|
| `outdoor` | Draussen-Aktivitäten |
| `indoor` | Drinnen-Aktivitäten |
| `creative` | Kreative Aktivitäten |
| `sports` | Sportliche Aktivitäten |
| `educational` | Lehrreiche Aktivitäten |

## 👶 Unterstützte Altersgruppen

- Kleinkind (1-3 Jahre)
- Kind (4-6 Jahre)
- Schulkind (7-9 Jahre)
- Pre-Teen (10-12 Jahre)

## 💰 Kostenbereiche

- 💚 Kostenlos
- 💛 Günstig (1-5 CHF)
- 💙 Mittel (5-15 CHF)

## 🔧 Entwicklung

### Neue Aktivität hinzufügen

Bearbeiten Sie `activities.json`:

```json
{
  "id": "custom-001",
  "name": "Neue Aktivität",
  "description": "Beschreibung der Aktivität",
  "category": "indoor",
  "subcategory": "creative",
  "age_min": 4,
  "age_max": 10,
  "duration_min": 30,
  "duration_max": 60,
  "participants_min": 1,
  "participants_max": 4,
  "weather": "any",
  "location": "indoor",
  "materials": ["Material1", "Material2"],
  "skills": ["Skill1", "Skill2"],
  "energy_level": "medium",
  "cost": 5,
  "tags": ["tag1", "tag2"]
}
```

### Wetter-Standort ändern

Bearbeiten Sie `weather.js`:

```javascript
const CUSTOM_LOCATION = {
  latitude: 48.1351,
  longitude: 11.5820  // München
};
```

## 📝 Lizenz

MIT License - Frei für private und kommerzielle Nutzung.

## 🤝 Mitwirkung

Verbesserungsvorschläge sind willkommen! Bitte Issues erstellen oder Pull Requests senden.

---

*Entwickelt für Arthur (7 Jahre) und alle Kinder, die tolle Aktivitäten suchen! 🎈*
