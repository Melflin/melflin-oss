# 🔄 Knowledge Sync

Synchronisiert deine Bücher und Audiobooks nach Obsidian. Besser behalten und durchsuchen.

[![GitHub Stars](https://img.shields.io/github/stars/Melflin/melflin.github.io?style=flat-square&logo=github)](https://github.com/Melflin/melflin.github.io/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![Obsidian](https://img.shields.io/badge/Obsidian-✓-purple?style=flat-square)](https://obsidian.md/)

---

## ✨ Features

- **📚 Quick Add** → Bücher in Sekunden hinzufügen
- **🔄 Reflection** → Wöchentliche Review-Prompts
- **📊 Tracking** → Alle gelesenen Bücher an einem Ort
- **🏷️ Tags** → Automatische Verschlagwortung

---

## 🚀 Schnellstart

```bash
# 1. Skill installieren
clawdhub install melflin/knowledge-sync

# 2. Buch hinzufügen
knowledge-sync add --title "Atomic Habits" --author "James Clear"

# 3. Letzte Bücher anzeigen
knowledge-sync review

# 4. Alle Bücher listen
knowledge-sync list
```

---

## 📦 Installation

### Mit ClawdHub

```bash
clawdhub install melflin/knowledge-sync
```

### Manuell

```bash
git clone https://github.com/Melflin/melflin.github.io.git
cd melflin.github.io/skills/knowledge-sync
```

### Voraussetzungen

- Obsidian Vault
- `OBSIDIAN_VAULT_PATH` Variable setzen

```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/Obsidian/vault/03 Ressources/Bücher"
```

---

## 📖 Verwendung

### Buch hinzufügen

```bash
# Basis
knowledge-sync add --title "Book Title" --author "Author"

# Mit Tags
knowledge-sync add --title "Atomic Habits" --author "James Clear" --tags "productivity,habits"

# Format spezifizieren
knowledge-sync add --title "Book" --author "Author" --format audiobook
```

### Wöchentliches Review

```bash
# Letzte 30 Tage
knowledge-sync review

# Letzte 7 Tage
knowledge-sync review 7
```

### Alle Bücher anzeigen

```bash
knowledge-sync list
```

---

## 📁 Output

Bücher werden gespeichert unter:
```
{OBSIDIAN_VAULT}/03 Ressources/Bücher/{Buch_Titel}.md
```

**Template enthält:**
- Frontmatter (Titel, Autor, Datum, Rating, Tags)
- Key Takeaways Section
- Persönliche Notizen
- Verwandte Notes Links

---

## 🔧 Konfiguration

```bash
# Environment Variable setzen
export OBSIDIAN_VAULT_PATH="/Users/melf/Oelf2025/03 Ressourcesbsidian/M/Bücher"
```

---

## 📋 Module

| Datei | Beschreibung |
|-------|--------------|
| `index.js` | CLI Einstiegspunkt |
| `fetch.js` | Buch-Notiz erstellen |
| `review.js` | Wöchentliches Review |
| `list.js` | Alle Bücher anzeigen |
| `templates/book-note.md` | Obsidian Template |

---

## 📸 Screenshot

![Knowledge Sync Screenshot](../../assets/screenshots/knowledge-sync.html)

---

## 🤝 Beitragen

Issues willkommen!

---

## 📝 Lizenz

MIT License

---

**Made with 🧙‍♂️ by Melflin**

[Website](https://melflin.github.io/) | [Skills](.) | [Sponsor](https://github.com/sponsors/Melflin)
