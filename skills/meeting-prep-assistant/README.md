# 📅 Meeting Prep Assistant

Automatische Briefing-Generierung für bevorstehende Meetings. Keine Meetings mehr ohne Kontext.

[![GitHub Stars](https://img.shields.io/github/stars/Melflin/melflin.github.io?style=flat-square&logo=github)](https://github.com/Melflin/melflin.github.io/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![macOS](https://img.shields.io/badge/macOS-12+-black?style=flat-square)](https://www.apple.com/macos/)

---

## ✨ Features

- **📅 Kalender Integration** → Apple Calendar via `accli`
- **📧 Email Kontext** → Schnelle SQLite-Suche in Apple Mail
- **🤖 AI Briefing** → KI-gestützte Zusammenfassung (MiniMax API)
- **🔔 Proactive Notifications** → Cron-freundliches Script für Erinnerungen

---

## 🚀 Schnellstart

```bash
# 1. Skill installieren
clawdhub install melflin/meeting-prep-assistant

# 2. Briefing für nächste 24h
melflin-meeting-prep

# 3. Mit JSON Output
melflin-meeting-prep --format=json

# 4. Nächste Woche
melflin-meeting-prep --hours=168
```

---

## 📦 Installation

### Mit ClawdHub (empfohlen)

```bash
clawdhub install melflin/meeting-prep-assistant
```

### Manuell

```bash
git clone https://github.com/Melflin/melflin.github.io.git
cd melflin.github.io/skills/meeting-prep-assistant
node index.js --help
```

### Voraussetzungen

- macOS mit Calendar.app
- [accli](https://github.com/clawdbot/clawdbot/tree/main/skills/accli) Skill installiert
- [apple-mail](https://github.com/melflin/melflin/tree/main/skills/apple-mail) Skill installiert

---

## 📖 Verwendung

### Basis

```bash
# Briefing für nächste 24h (Standard)
melflin-meeting-prep

# Nächste 48 Stunden
melflin-meeting-prep --hours=48

# Detailliertes Format
melflin-meeting-prep --format=detailed

# JSON für Automatisierung
melflin-meeting-prep --format=json
```

### Output Beispiel

```
## 📅 Weekly Team Sync

**🕐 Mo 20.01.2026, 14:00**
**📍 Zoom**

**👥 Teilnehmer:** Team A, Team B

### 📧 Zugehörige Emails
- ● 19.01.2026 - John: Agenda für Weekly Sync
- ✓ 18.01.2026 - Jane: Updates zur Feature X

### 🎯 Prep-Punkte
- [ ] Meeting-Ziel klären
- [ ] Agenda-Punkte vorbereiten

### 📝 Notizen
_Hier können deine Notizen während dem Meeting rein_
```

---

## 📁 Dateien

| Datei | Beschreibung |
|-------|--------------|
| `index.js` | CLI Einstiegspunkt |
| `fetch.js` | Kalender-Abruf via accli |
| `analyze.js` | Context-Aggregation |
| `execute.js` | AI Briefing Generierung |
| `notify-upcoming.js` | Proaktive Notifications (cron) |

---

## 🔔 Automatisierung

### Cron-Job für tägliche Briefing-Erinnerung

```bash
# Jeden Tag um 8:00 Uhr Briefing für den Tag
0 8 * * * melflin-meeting-prep --hours=24
```

### Script für proaktive Benachrichtigung

```bash
# 2 Stunden vor jedem Meeting
melflin-meeting-prep-notify --hours=2 --delivery=telegram
```

---

## 🛡️ Sicherheit

- **Dry-Run Mode** → Vorschau ohne Änderungen
- **Lokale Daten** → Alle Daten bleiben auf deinem Mac
- **Keine.externen Calls** → Ohne Konfiguration keine API-Aufrufe

---

## 📸 Screenshot

![Meeting Prep Assistant Screenshot](../../assets/screenshots/meeting-prep.html)

---

## 🤝 Beitragen

Issues und Pull Requests willkommen!

---

## 📝 Lizenz

MIT License -siehe [LICENSE](../../LICENSE)

---

**Made with 🧙‍♂️ by Melflin**

[Website](https://melflin.github.io/) | [Skills](.) | [Sponsor](https://github.com/sponsors/Melflin)
