# Meeting Prep Assistant 📅

**Auto-generated briefing for upcoming meetings**

## Usage

```bash
cd /Users/melf/GitMelflin/skills/meeting-prep-assistant
node index.js [--hours=24] [--format=brief|detailed|json]
```

### Examples

```bash
# Briefings for next 24h
node index.js

# Next 48 hours, JSON output
node index.js --hours=48 --format=json

# Next week
node index.js --hours=168
```

## Features

- ✅ **Calendar Integration** - Fetches upcoming meetings from Apple Calendar via `accli`
- ✅ **Email Context** - Searches Apple Mail for related emails (SQLite-fast, ~50ms)
- 🔄 **AI Briefing** - Generates structured meeting briefs
- ⏳ **Proactive Notifications** - Coming soon (2h before meeting)

## Architecture

```
meeting-prep-assistant/
├── index.js      # CLI entrypoint with --hours and --format flags
├── fetch.js      # Apple Calendar integration via accli
├── analyze.js    # Context aggregation (Emails, Notes, Past Meetings)
├── execute.js    # Briefing generation
└── README.md     # This file
```

## Context Sources

| Source | Status | Description |
|--------|--------|-------------|
| Apple Calendar | ✅ Ready | Via accli CLI |
| Apple Mail | ✅ Ready | Fast SQLite search |
| Obsidian Notes | ⏳ Planned | Future integration |
| Past Meetings | ⏳ Planned | Calendar history lookup |

## Requirements

- macOS with Apple Calendar.app
- [accli](https://github.com/clawdbot/clawdbot/tree/main/skills/accli) skill installed
- [apple-mail](https://github.com/melflin/melflin/tree/main/skills/apple-mail) skill installed

## Output Example

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
- [ ] Agenda für Weekly Sync ansprechen

### 📝 Notizen
_Hier können deine Notizen während dem Meeting rein_
```

## Development

```bash
# Test with real calendar
node index.js --hours=24

# Debug mode (add this to index.js)
console.log('Meetings:', JSON.stringify(meetings, null, 2));
```

## Roadmap

- [x] Calendar integration (fetch.js)
- [x] Email search (analyze.js with apple-mail)
- [ ] AI-powered summary (context.emails → LLM → summary)
- [ ] Obsidian notes integration
- [ ] Proactive trigger (cron, 2h before)
- [ ] Telegram/WhatsApp notification delivery

---

*Part of the Melflin OSS Skills Collection*
