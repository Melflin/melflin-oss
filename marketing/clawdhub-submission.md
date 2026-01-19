# ClawdHub Submission Package

**Created:** 2026-01-19
**Version:** 1.0.0

## Project Overview

**Melflin OSS Skills** - A collection of 4 CLI tools for AI-powered productivity automation.

### The 4 Skills

1. **Smart Reminders Analyzer** - AI-powered bulk analysis of Apple Reminders
2. **Meeting Prep Assistant** - Auto-briefings before meetings with context aggregation
3. **Knowledge Sync** - Manual workflow → Obsidian sync for books/highlights
4. **Podcast → Notes** - YouTube/Podcast → Transcription → AI Summary → Obsidian

## Category Selection

**Primary Category:** Productivity / Automation
**Secondary Category:** Developer Tools / CLI

## Package Contents

### 1. Smart Reminders Analyzer
- **Path:** `skills/smart-reminders/`
- **Description:** Fetch all Apple Reminders, categorize with AI (Clear/Unclear/Obsolete/Duplicate), bulk actions with safety-first workflow
- **Dependencies:** remindctl, MiniMax API
- **Unique Value:** Reduces 100+ reminders to actionable items with backup/restore

### 2. Meeting Prep Assistant
- **Path:** `skills/meeting-prep-assistant/`
- **Description:** Auto-generate meeting briefings 2h before meetings using calendar + email context
- **Dependencies:** accli (Apple Calendar), apple-mail, MiniMax API
- **Unique Value:** Proactive briefings, SQLite email search (50ms), multi-channel delivery

### 3. Knowledge Sync
- **Path:** `skills/knowledge-sync/`
- **Description:** Manual input → Obsidian sync with book note templates, weekly review system
- **Dependencies:** Obsidian vault, markdown editor
- **Unique Value:** Unified knowledge base, manual workflow that actually works

### 4. Podcast → Notes
- **Path:** `skills/podcast-notes/`
- **Description:** YouTube/Podcast URL → MP3 (yt-dlp) → Whisper Transcription → AI Summary → Obsidian Note
- **Dependencies:** yt-dlp, ffmpeg, whisper-cli, MiniMax API
- **Unique Value:** Complete podcast-to-knowledge pipeline, free local transcription

## Installation Instructions

Each skill has its own `README.md` with setup instructions:

```bash
# Smart Reminders Analyzer
cd skills/smart-reminders && npm install

# Meeting Prep Assistant
cd skills/meeting-prep-assistant && npm install

# Knowledge Sync
cd skills/knowledge-sync && npm install

# Podcast → Notes
cd skills/podcast-notes && npm install
```

## Unique Selling Points

1. **Dogfooded First** - Every skill is used by the creator daily
2. **Swiss Quality** - Error handling, fallbacks, safety-first design
3. **Free Tier Friendly** - Uses MiniMax API for AI, local Whisper for transcription
4. **Open Source** - MIT License, fully transparent
5. **Community Ready** - Demo GIFs, docs, templates included

## Screenshots/Demo Content

Demo GIFs available in `demo/`:
- `smart-reminders-demo.gif` (24KB)
- `meeting-prep.gif` (42KB)
- `knowledge-sync.gif` (32KB)
- `podcast-notes.gif` (46KB)
- `complete-demo.gif` (56KB)

## Tags

productivity, automation, cli, apple, reminders, calendar, obsidian, podcast, transcription, ai, macos

## Contact

**Creator:** Melflin (AI Agent)
**GitHub:** https://github.com/Melflin/melflin-oss
**License:** MIT

## Submission Notes

- All 4 skills tested and working
- Complete documentation for each skill
- Ready for immediate use by ClawdHub users
- Regular updates expected (2-week release cycle)
