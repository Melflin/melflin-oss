# 🧠 Smart Reminders Analyzer

AI-gestützte Analyse und Bereinigung für Apple Reminders. Räume deine Reminder-Liste in Sekunden auf.

[![GitHub Stars](https://img.shields.io/github/stars/Melflin/melflin.github.io?style=flat-square&logo=github)](https://github.com/Melflin/melflin.github.io/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![macOS](https://img.shields.io/badge/macOS-12+-black?style=flat-square)](https://www.apple.com/macos/)

---

## ✨ Features

- **🔍 Smart Categorization** → AI klassifiziert Reminders als Klar, Unklar, Veraltet, Duplikat
- **🧹 Bulk Cleanup** → Lösche,合并 oder kläre mehrere Reminders gleichzeitig
- **🛡️ Safe Mode** → Dry-Run zeigt Änderungen vor Ausführung
- **💾 Auto-Backup** → Erstellt Backup vor Änderungen
- **📊 JSON Export** → Für Automatisierung

---

## 🚀 Schnellstart

```bash
# 1. Skill installieren
clawdhub install melflin/smart-reminders

# 2. Hilfe anzeigen
melflin-smart-reminders --help

# 3. Analyse durchführen
melflin-smart-reminders --analyze

# 4. Änderungen in Vorschau sehen (sicher)
melflin-smart-reminders --dry-run

# 5. Änderungen anwenden
melflin-smart-reminders --execute
```

---

## 📦 Installation

### Mit ClawdHub (empfohlen)

```bash
clawdhub install melflin/smart-reminders
```

### Manuell

```bash
# Repository klonen
git clone https://github.com/Melflin/melflin.github.io.git
cd melflin.github.io/skills/smart-reminders

# Direkt ausführen
node index.js --help
```

### Global verfügbar machen

```bash
# Symlink erstellen
ln -sf /path/to/skills/smart-reminders/index.js /usr/local/bin/smart-reminders

# Jetzt überall nutzen
smart-reminders --help
```

### Voraussetzungen

- macOS 12+ (Monterey)
- Node.js 18+
- Apple Reminders App
- Optional: [`remindctl`](https://github.com/steipete/remindctl)

```bash
brew install steipete/tap/remindctl
```

---

## 📖 Verwendung

### Interaktiver Modus

```bash
$ melflin-smart-reminders
🧠 Smart Reminders Analyzer

📥 Lade Reminders...
✅ 114 Reminders geladen

🔍 Analysiere...
📊 Zusammenfassung:
   ✅ Klar: 67 (59%)
   ⚠️  Unklar: 23 (20%)
   🗑️  Veraltet: 18 (16%)
   🔄 Duplikate: 13 (11%)

💡 Empfehlung: 41 Reminders löschen, 6 Duplikate zusammenführen
```

### Command Line Optionen

| Flag | Beschreibung |
|------|--------------|
| `--help, -h` | Hilfe anzeigen |
| `--analyze` | Nur Analyse, Bericht zeigen |
| `--dry-run` | Vorschau ohne Änderungen |
| `--execute` | Änderungen anwenden |
| `--batch` | Sichere Aktionen automatisch anwenden |
| `--json` | JSON Output für Scripts |
| `--mock` | Mock-Daten (keine echten Reminders) |

### Beispiel: Cleanup Workflow

```bash
# 1. Reminders analysieren
melflin-smart-reminders --analyze

# 2. Vorschau der Änderungen
melflin-smart-reminders --dry-run

# 3. Änderungen bestätigen und ausführen
melflin-smart-reminders --execute

# Oder sichere Aktionen automatisch anwenden
melflin-smart-reminders --batch
```

---

## 📊 Kategorisierung

### ✅ Klar (Clear)
- Actionbarer Titel mit Kontext
- Hat Fälligkeitsdatum oder Liste
- Nicht dupliziert oder veraltet

### ⚠️ Unklar (Unclear)
- Unverständlicher Text (z.B. "asfeda", "xyz123")
- Zu vage (z.B. "test", "check")
- Fehlender Kontext (keine Notizen, kein Datum)

### 🗑️ Veraltet (Obsolete)
- Fälligkeitsdatum > 30 Tage her
- Referenz zu alten Events
- Bereits erledigt aber nicht markiert

### 🔄 Duplikat (Duplicate)
- Ähnliche Titel (z.B. "Withings setup", "Install Withings")
- Gleiche Aufgabe mehrfach erwähnt
- Kann zu einem klaren Reminder zusammengeführt werden

---

## 🛡️ Sicherheit

1. **Dry-Run Mode** → Alle Änderungen in Vorschau
2. **Auto-Backup** → Zeitgestempeltes Backup vor Änderungen
3. **Bestätigung** → Interaktiver Modus fragt vor Aktionen

---

## 📁 Dateien

| Datei | Beschreibung |
|-------|--------------|
| `index.js` | CLI Einstiegspunkt |
| `fetch.js` | Reminder-Abruf |
| `analyze.js` | AI Analyse |
| `execute.js` | Aktionen ausführen |
| `reminders.json` | Gecachte Reminders |
| `analysis-report.json` | Analyse-Ergebnisse |
| `backups/` | Backup-Dateien |

---

## 📸 Screenshot

![Smart Reminders Analyzer Screenshot](../../assets/screenshots/smart-reminders.html)

---

## 🤝 Beitragen

Issues und Pull Requests willkommen!

```bash
# Development
npm install
npm test
```

---

## 📝 Lizenz

MIT License -siehe [LICENSE](../../LICENSE)

---

**Made with 🧙‍♂️ by Melflin**

[Website](https://melflin.github.io/) | [Skills](.) | [Sponsor](https://github.com/sponsors/Melflin)
