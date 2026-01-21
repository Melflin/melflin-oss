# 📦 Installation Guide

Installation der Melflin OSS Skills für Clawdbot.

---

## Voraussetzungen

### System

- **macOS** 12+ (Monterey oder neuer)
- **Node.js** 18+ (empfohlen: 20 LTS)
- **Git** 2.0+

```bash
# Node.js prüfen
node --version

# Git prüfen
git --version
```

### Clawdbot

- Clawdbot installiert und konfiguriert
- `clawdhub` CLI verfügbar

```bash
# Clawdbot Version
clawdbot --version

# clawdhub Hilfe
clawdhub --help
```

---

## Schnellinstallation (alle Skills)

```bash
# Alle Skills auf einmal installieren
clawdhub install melflin/smart-reminders
clawdhub install melflin/meeting-prep-assistant
clawdhub install melflin/knowledge-sync
clawdhub install melflin/podcast-notes

# Oder mit einem Befehl
for skill in smart-reminders meeting-prep-assistant knowledge-sync podcast-notes; do
  clawdhub install melflin/$skill
done
```

### Verify Installation

```bash
# Alle Skills anzeigen
clawdhub list | grep melflin

# Hilfe für jeden Skill
melflin-smart-reminders --help
melflin-meeting-prep --help
```

---

## Einzelne Skills installieren

### 🧠 Smart Reminders Analyzer

```bash
# Installieren
clawdhub install melflin/smart-reminders

# Prüfen
melflin-smart-reminders --help

# Erstmalige Analyse
melflin-smart-reminders --analyze
```

**Zusätzliche Abhängigkeiten:**
- [`remindctl`](https://github.com/steipete/remindctl) (optional, für bessere Reminder-Abfrage)

```bash
brew install steipete/tap/remindctl
```

---

### 📅 Meeting Prep Assistant

```bash
# Installieren
clawdhub install melflin/meeting-prep-assistant

# Prüfen
melflin-meeting-prep --help

# Briefing generieren
melflin-meeting-prep --hours=24
```

**Zusätzliche Abhängigkeiten:**
- [`accli`](https://github.com/clawdbot/clawdbot/tree/main/skills/accli) - Apple Calendar Integration
- [`apple-mail`](https://github.com/melflin/melflin/tree/main/skills/apple-mail) - Email Suche

```bash
clawdhub install clawdbot/accli
clawdhub install melflin/apple-mail
```

---

### 🔄 Knowledge Sync

```bash
# Installieren
clawdhub install melflin/knowledge-sync

# Prüfen
knowledge-sync --help

# Konfiguration
export OBSIDIAN_VAULT_PATH="/path/to/your/Obsidian/vault/03 Ressources/Bücher"

# Erstes Buch hinzufügen
knowledge-sync add --title "Test Book" --author "Test Author"
```

---

### 🎧 Podcast Notes

```bash
# Installieren (bald verfügbar)
clawdhub install melflin/podcast-notes

# Prüfen
podcast-notes --help
```

**Zusätzliche Abhängigkeiten:**
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) - Audio-Extraktion
- [`ffmpeg`](https://ffmpeg.org/) - Audio-Verarbeitung

```bash
brew install yt-dlp ffmpeg

# Optional: Whisper für lokale Transkription
pip install openai-whisper
```

---

## Konfiguration

### Umgebungsvariablen

```bash
# In ~/.zshrc oder ~/.bashrc hinzufügen

# Obsidian Vault Pfad (Knowledge Sync)
export OBSIDIAN_VAULT_PATH="/Users/deinname/Obsidian/Vault/03 Ressources/Bücher"

# MiniMax API Key (für AI Features)
export MINIMAX_API_KEY="dein-api-key"

# Default Output Format
export MELFlin_OUTPUT_FORMAT="markdown"
```

### Clawdbot Konfiguration

Skills werden automatisch in Clawdbot registriert. Keine zusätzliche Konfiguration nötig.

---

## Updates

### Einen Skill updaten

```bash
# Auf Updates prüfen
clawdhub update melflin/smart-reminders

# Update installieren
clawdhub update melflin/smart-reminders --force
```

### Alle Skills updaten

```bash
clawdhub update
```

---

## Troubleshooting

### "command not found"

```bash
# clawdhub neu installieren
npm install -g clawdbot

# Oder PATH setzen
export PATH="$PATH:$(which clawdhub)"
```

### "permission denied"

```bash
# Script ausführbar machen
chmod +x /path/to/skill/index.js

# Oder global
sudo chmod +x /usr/local/bin/melflin-*
```

### "node version too old"

```bash
# Node.js updaten mit nvm
nvm install 20
nvm use 20

# Oder mit Homebrew
brew upgrade node
```

### Skills werden nicht gefunden

```bash
# clawdhub Cache leeren
clawdhub clear

# Skills neu installieren
clawdhub install melflin/smart-reminders --force
```

---

## Deinstallation

```bash
# Einen Skill entfernen
clawdhub remove melflin/smart-reminders

# Oder manuell
rm -rf ~/.clawdbot/skills/melflin-smart-reminders
```

---

## Nächste Schritte

1. **Skills konfigurieren** → [Skills Seite](skills.md)
2. **Social Media** → [Twitter](marketing/twitter-stars.md), [LinkedIn](marketing/linkedin-stars.md)
3. **Dokumentation lesen** → [Skills READMEs](skills/)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/Melflin/melflin.github.io/issues)
- **Discord:** [Clawdbot Community](https://discord.gg/clawd)
- **Email:** support@melflin.ai

---

*Zuletzt aktualisiert: 2026-01-21*
