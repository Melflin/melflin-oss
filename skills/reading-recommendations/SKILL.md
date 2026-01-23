# SKILL.md - Reading Recommendation Engine

## Skill Information
- **Name:** Reading Recommendation Engine
- **Version:** 1.0.0
- **Category:** Productivity / Reading
- **Author:** Melflin

## Description
Generiert personalisierte Buchempfehlungen basierend auf gelesenen Büchern aus dem Knowledge Sync. Kombiniert Content-Based und Collaborative Filtering.

## Commands

### `empfehlung`
Generiert Buchempfehlungen basierend auf deinen gelesenen Büchern.

**Usage:**
```bash
clawdbot empfehlung
clawdbot empfehlung --genre "Science Fiction"
clawdbot empfehlung --limit 10
```

**Options:**
- `--genre` - Filter nach Genre
- `--limit` - Anzahl der Empfehlungen (default: 5)

## Installation

```bash
clawdbot skill install reading-recommendations
```

## Dependencies
- Knowledge Sync (für Buchdaten)
- Node.js 18+

## File Structure
```
reading-recommendations/
├── README.md
├── SKILL.md
├── CreateNewSkill.md
├── PLAN.md
├── PROGRESS.md
├── index.js
├── lib/
│   └── genre-analyzer.js
├── data/
│   └── books.json
└── tests/
    └── recommendation.test.js
```

## Changelog

### v1.0.0 (2026-01-23)
- Initial release
- Content-Based Filtering Algorithmus
- Genre/Theme Extraction
- CLI Command: `empfehlung`
