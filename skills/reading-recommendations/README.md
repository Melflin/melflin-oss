# 📚 Reading Recommendation Engine

> Personalisierte Buchempfehlungen basierend auf deinen gelesenen Büchern

## Was ist das?

Der **Reading Recommendation Engine** Skill analysiert deine gelesenen Bücher aus dem Knowledge Sync und generiert personalisierte Empfehlungen. Er kombiniert:

- **Content-Based Filtering**: Findet ähnliche Bücher basierend auf Genre & Themen
- **Collaborative Filtering**: Schlägt Bücher vor, die Leser mit ähnlichem Geschmack mochten

## Installation

```bash
# Via Clawdbot
clawdbot skill install reading-recommendations
```

## Verwendung

### CLI Commands

```bash
# Empfehlungen generieren
clawdbot empfehlung

# Empfehlungen für spezifisches Genre
clawdbot empfehlung --genre "Science Fiction"

# Top 10 Empfehlungen
clawdbot empfehlung --limit 10

# Nur Content-Based Filtering
clawdbot empfehlung --content-only

# Nur Collaborative Filtering
clawdbot empfehlung --collaborative-only
```

### Output Beispiel

```
📚 Buchempfehlungen für dich:

1. "Dune" von Frank Herbert (⭐ 4.8)
   → Weil du "Foundation" von Asimov gelesen hast
   → Genre: Science Fiction, Theme: Space Opera

2. "Neuromancer" von William Gibson (⭐ 4.5)
   → Weil du "Snow Crash" gelesen hast
   → Genre: Cyberpunk, Theme: Technology

...
```

## Funktionsweise

### 1. Knowledge Sync Integration
Der Skill liest deine gelesenen Bücher aus:
- `~/melflin/data/knowledge-sync/books.json`
- Oder `.knowledge-sync/read-books/` Verzeichnis

### 2. Genre & Theme Extraction
- Vordefinierte Genre-Liste (20+ Genres)
- Keyword-basierte Themen-Extraktion
- User-Tag Unterstützung

### 3. Recommendation Algorithmus

```javascript
// Content-Based: Ähnlichkeit basierend auf Genres/Themen
similarity = Jaccard(genres_a, genres_b) * 0.6 + 
             Jaccard(themes_a, themes_b) * 0.4

// Collaborative: Ähnliche Leserprofile
user_similarity = 1 - PearsonCorrelation(ratings_vector_a, ratings_vector_b)

// Final Score
score = content_score * 0.5 + collaborative_score * 0.5
```

## Dateistruktur

```
reading-recommendations/
├── README.md
├── SKILL.md
├── CreateNewSkill.md
├── PLAN.md
├── PROGRESS.md
├── index.js              # Main entry point
├── lib/
│   ├── recommendation-engine.js
│   ├── knowledge-sync.js
│   ├── genre-analyzer.js
│   └── cli.js
├── data/
│   ├── genres.json       # Genre-Definitions
│   └── themes.json       # Theme-Keywords
└── tests/
    └── recommendation.test.js
```

## Konfiguration

Erstelle `config.json` für Anpassungen:

```json
{
  "knowledgeSyncPath": "~/melflin/.knowledge-sync",
  "defaultLimit": 5,
  "weightContentBased": 0.5,
  "weightCollaborative": 0.5,
  "excludedGenres": ["Textbook"],
  "minRating": 3.0
}
```

## Requirements

- Node.js 18+
- Knowledge Sync Skill (für Buchdaten)

## Lizenz

MIT License - Melflin OSS

## Autor

Melflin
