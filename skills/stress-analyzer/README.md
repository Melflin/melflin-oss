# Stress Pattern Analyzer

*Analysiert Kalender, Arbeitszeiten und zeigt Stress-Level über Zeit als ASCII-Chart*

## Was macht dieser Skill?

Der Stress Pattern Analyzer hilft dir, deine Stress-Level objektiv zu verstehen. Er sammelt Daten aus deinem Apple Calendar, berücksichtigt deine Arbeitszeiten und zeigt dir in einem übersichtlichen ASCII-Chart, wie sich dein Stress über die Woche entwickelt.

## Features

- ✅ **Calendar-Integration** - Nutzt accli für Apple Calendar
- ✅ **Stress-Score Algorithmus** - Bewertet Termindichte, Arbeitszeit, Benachrichtigungen
- ✅ **ASCII-Chart Visualisierung** - Klare Darstellung direkt im Terminal
- ✅ **Wochenübersicht** - Sieh deine Stress-Muster auf einen Blick
- ✅ **Konfigurierbar** - Passe Parameter an deine Situation an

## Installation

```bash
# Über ClawdHub (sobald veröffentlicht)
clawdhub install melflin/stress-analyzer

# Oder direkt
npm install -g melflin-stress-analyzer
```

## Usage

### Analyse starten

```bash
# Basis-Analyse
melflin-stress-analyzer analyze

# Mit eigenen Parametern
melflin-stress-analyzer analyze --days 14 --work-hours 9 --notifications 50
```

### Wochenübersicht

```bash
melflin-stress-analyzer week
```

### Konfiguration

```bash
# Standard-Arbeitsstunden setzen
melflin-stress-analyzer config --set-work-hours 8

# Geschätzte Benachrichtigungen/Tag setzen
melflin-stress-analyzer config --set-notifications 30
```

## Stress-Score Erklärung

Der Stress-Score (0-100) setzt sich aus vier Faktoren zusammen:

| Faktor | Max Punkte | Beschreibung |
|--------|-----------|--------------|
| Termindichte | 40 | Events pro Tag im Kalender |
| Arbeitszeit | 30 | Überschreitung von 8h/Tag |
| Benachrichtigungen | 20 | Geschätzte Anzahl/Tag |
| Kontinuität | 10 | Keine Pausen zwischen Events |

### Bewertung

| Score | Level | Emoji |
|-------|-------|-------|
| 0-25 | Entspannt | 🟢 |
| 26-50 | Moderat | 🟡 |
| 51-75 | Belastet | 🟠 |
| 76-100 | Kritisch | 🔴 |

## Beispiel-Output

```
📊 Stress Pattern Analyzer

╔════════════════════════════════╗
║  Aktueller Stress-Score: 052   ║
║  🟡 Moderat                    ║
╠════════════════════════════════╣
║  Events (7 Tage): 24           ║
║  Work Hours/Tag: 8.5           ║
║  Notifications/Tag: 45         ║
╚════════════════════════════════╝

📈 Trend (letzte 7 Tage):
100 │
 90 │
 80 │
 70 │              ●
 60 │        ●     │
 50 │   ●     │     │
 40 │   │     │     │
 30 │   │     │     │
 20 │   │     │     │
 10 │   │     │     │
  0 └─────────────────────
     1  2  3  4  5  6  7
```

## Anforderungen

- macOS
- Node.js 18+
- [accli](https://www.npmjs.com/package/@joargp/accli) für Calendar-Zugriff

## Weiterführend

- [PLAN.md](./PLAN.md) - Entwicklungskonzept
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking

## Lizenz

MIT License

---

*Teil des Melflin OSS Projekts*
