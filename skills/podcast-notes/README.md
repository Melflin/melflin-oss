# 🎧 Podcast Notes

Transformiert Podcasts und YouTube Videos in strukturierte Obsidian Notes mit AI-Transkription und Insight-Extraktion.

[![GitHub Stars](https://img.shields.io/github/stars/Melflin/melflin.github.io?style=flat-square&logo=github)](https://github.com/Melflin/melflin.github.io/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-📋_Geplant-yellow?style=flat-square)]()

---

## ✨ Features

- **🎙️ Audio Extraction** → YouTube, Spotify, Podcast URLs
- **🤖 AI Transcription** → Lokal (Whisper) oder Cloud
- **💡 Key Insights** → AI-gestützte Zusammenfassung
- **📝 Obsidian Integration** → Automatisch in Vault speichern
- **🏷️ Auto-Tagging** → Themen automatisch verschlagworten

---

## 🚀 Schnellstart

```bash
# Skill installieren (bald verfügbar)
clawdhub install melflin/podcast-notes

# YouTube Video verarbeiten
podcast-notes "https://www.youtube.com/watch?v=..."

# Dry run (nur Vorschau)
podcast-notes "https://youtube.com/..." --dry-run
```

---

## 📦 Installation

### Voraussetzungen

**Erforderlich:**
- `yt-dlp` → Audio-Extraktion
  ```bash
  brew install yt-dlp
  ```

- `ffmpeg` → Audio-Verarbeitung
  ```bash
  brew install ffmpeg
  ```

**Optional (Transkription):**
- `whisper-cli` → Lokale Transkription (kostenlos)
  ```bash
  pip install openai-whisper
  ```

---

## 📖 Verwendung

### Automatisch

```bash
# YouTube Video
podcast-notes "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Nur Vorschau
podcast-notes "https://youtube.com/..." --dry-run

# Mock (testen ohne Download)
podcast-notes "https://youtube.com/..." --mock
```

### Manuell

```bash
# Schritt 1: Audio laden
node fetch.js "https://youtube.com/watch?v=..." --output=/tmp/audio.mp3

# Schritt 2: Transkribieren & Analysieren
node analyze.js /tmp/audio.mp3 --json > /tmp/analysis.json

# Schritt 3: In Obsidian speichern
node execute.js /tmp/analysis.json --destination="~/Obsidian/Vault"
```

---

## 📁 Output Format

Notes werden gespeichert unter `{Obsidian_Vault}/Podcast Notes/` mit dieser Struktur:

```markdown
---
tags: podcast, podcast-notes
created: 2026-01-19
source: https://youtube.com/...
duration: ~60 min
---

# 🎧 Podcast Notes

## Quelle
- URL, Dauer, Datum

## Zusammenfassung
AI-generierte Zusammenfassung

## 🎯 Key Insights
1. Erster Insight
2. Zweiter Insight
...

## 📝 Vollständiges Transkript
[00:00] Einleitung
...

## 🏷️ Themen
- #topic1
- #topic2
```

---

## 🔧 Konfiguration

```bash
# Obsidian Vault Pfad
export OBSIDIAN_VAULT="~/Obsidian/DeinVault"
```

---

## 📋 Transkription Optionen

| Option | Pros | Cons |
|--------|------|------|
| whisper-cli | Gratis, lokal, privat | Langsamer |
| OpenAI Whisper API | Schnell, genau | Kosten |
| Deepgram | Sehr schnell | Bezahlt |

---

**[→ Screenshot anzeigen](../../screenshots/podcast-notes.html)**

---

## 🤝 Beitragen

Issues willkommen!

---

## 📝 Lizenz

MIT License

---

**Made with 🧙‍♂️ by Melflin**

[Website](https://melflin.github.io/) | [Skills](.) | [Sponsor](https://github.com/sponsors/Melflin)
