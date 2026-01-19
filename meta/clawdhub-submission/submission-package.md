# ClawdHub Submission Package
# Generated: 2026-01-19
# Status: Ready for Submission

================================================================================
# SKILL 1: Smart Reminders Analyzer
================================================================================

## Metadata
name: smart-reminders-analyzer
version: 1.0.0
category: productivity
tags: reminders, cleanup, ai, macos, apple
author: Melflin
github_url: https://github.com/Melfelf/Melflin/tree/master/skills/smart-reminders
license: MIT

## Description
AI-powered bulk analysis and cleanup for Apple Reminders. Clean up cluttered reminder lists in seconds, not weeks.

## Short Description
Smart AI assistant for Apple Reminders cleanup - analyzes, categorizes, and helps you delete vague/duplicate reminders.

## Features
- Smart Categorization (Clear/Unclear/Obsolete/Duplicates)
- Bulk Cleanup with Safety-First (Backup + Restore)
- Dry-Run Mode for safe preview
- Multiple Backends (remindctl / AppleScript)
- JSON Export for automation

## Installation
```bash
git clone https://github.com/Melfelf/Melflin.git
cd Melflin/skills/smart-reminders
node index.js --help
```

## Requirements
- macOS 12+
- Node.js 18+
- Apple Reminders app
- Optional: remindctl CLI

================================================================================
# SKILL 2: Meeting Prep Assistant
================================================================================

## Metadata
name: meeting-prep-assistant
version: 1.0.0
category: productivity
tags: calendar, meetings, ai, briefing, apple
author: Melflin
github_url: https://github.com/melflin/melflin-oss/tree/master/skills/meeting-prep-assistant
license: MIT

## Description
Auto-generated briefing for upcoming meetings - fetches calendar events, searches related emails, and generates AI summaries.

## Short Description
Never walk into a meeting unprepared - AI-powered briefings with email context and action items.

## Features
- Calendar Integration (Apple Calendar via accli)
- Email Context Search (~50ms SQLite)
- AI-Powered Summaries (MiniMax API)
- Proactive Notifications (cron-friendly)
- Multiple Output Formats (Brief/Detailed/JSON)

## Installation
```bash
cd skills/meeting-prep-assistant
chmod +x *.js
node index.js --help
```

## Requirements
- macOS with Apple Calendar.app
- accli skill installed
- apple-mail skill installed
- MiniMax API key (for AI summaries)

================================================================================
# SKILL 3: Knowledge Sync
================================================================================

## Metadata
name: knowledge-sync
version: 1.0.0
category: productivity
tags: notes, obsidian, books, learning, sync
author: Melflin
github_url: https://github.com/melflin/melflin-oss/tree/master/skills/knowledge-sync
license: MIT

## Description
Sync your reading and audiobook consumption to Obsidian for better retention and search. Track what you've read and reflect on key takeaways.

## Short Description
Obsidian-powered book tracking - quick add, weekly review, and unified library for all consumed books.

## Features
- Quick Add (create book notes in seconds)
- Weekly Review Prompts
- Track All Books (unified library)
- Obsidian Vault Integration
- Frontmatter Support (tags, ratings, dates)

## Installation
```bash
cd skills/knowledge-sync
chmod +x *.js
node index.js --help
```

## Requirements
- Obsidian vault
- Node.js 18+

================================================================================
# SKILL 4: Podcast → Notes
================================================================================

## Metadata
name: podcast-notes
version: 1.0.0
category: productivity
tags: podcast, transcription, ai, obsidian, audio
author: Melflin
github_url: https://github.com/melflin/melflin-oss/tree/master/skills/podcast-notes
license: MIT

## Description
Transform podcasts and YouTube videos into structured Obsidian notes with AI-powered transcription and insight extraction.

## Short Description
YouTube/Podcast → AI Transcription → Obsidian Note with key insights and auto-tagging.

## Features
- Audio Extraction (yt-dlp + ffmpeg)
- AI Transcription (Whisper CLI / OpenAI API)
- Key Insights (MiniMax API)
- Obsidian Integration
- Auto-Tagging (10 topic categories)

## Installation
```bash
cd skills/podcast-notes
chmod +x *.js
node index.js --help
```

## Requirements
- yt-dlp
- ffmpeg
- whisper-cli (optional, for free local transcription)
- Obsidian vault

================================================================================
# SUBMISSION CHECKLIST
================================================================================

For each skill, ensure:
- [x] README.md with installation instructions
- [x] Code files present and tested
- [x] GitHub URL verified
- [x] Category and tags assigned
- [x] Requirements documented

Ready for ClawdHub submission!
