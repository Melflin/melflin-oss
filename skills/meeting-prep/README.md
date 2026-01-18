# Meeting Prep Assistant 🤝📅

**AI-powered meeting preparation assistant.** Generates intelligent briefings from your calendar, emails, and notes — delivered before your meetings start.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey)

---

## ✨ Features

- **📅 Smart Calendar Fetch** — Pulls meetings from Apple Calendar for the next 24h
- **🔍 Context Aggregation** — Finds related emails, past notes, and action items
- **🧠 AI Briefings** — Generates structured meeting previews using AI
- **📱 Multi-Channel Delivery** — Telegram, Apple Reminders, Obsidian, or local file
- **⏰ Proactive Scheduling** — Auto-runs 2h before meetings via cron

---

## 🚀 Quick Start

```bash
cd /Users/melf/GitMelflin/skills/meeting-prep

# Test with dry-run (no actual delivery)
node index.js --dry-run

# Generate briefing for next meeting only
node index.js --calendar "Kalender" --hours 2

# Deliver to specific channels
node index.js --channels telegram,reminders

# Schedule for automatic runs (adds cron job)
node index.js --schedule
```

---

## 📖 Usage

### CLI Options

| Flag | Description | Example |
|------|-------------|---------|
| `--calendar` | Calendar name to fetch | `--calendar "Kalender"` |
| `--hours` | Lookahead window (hours) | `--hours 24` |
| `--channels` | Delivery channels | `--channels telegram,reminders` |
| `--dry-run` | Preview only, no delivery | `--dry-run` |
| `--schedule` | Setup auto-scheduler | `--schedule` |
| `--now` | Generate immediately | `--now` |

### Examples

```bash
# Preview all upcoming meetings
node index.js --dry-run

# Briefing for specific calendar, next 4 hours
node index.js --calendar "Work" --hours 4 --channels telegram

# Deliver to Apple Reminders only
node index.js --channels reminders --dry-run
```

---

## 📂 Architecture

```
meeting-prep/
├── index.js           # Unified CLI entrypoint
├── fetch.js           # Calendar fetcher (accli integration)
├── aggregate.js       # Context aggregator (emails, notes, actions)
├── brief.js           # AI briefing generator
├── deliver.js         # Multi-channel delivery
├── context.json       # Aggregated context (generated)
├── meetings.json      # Fetched meetings (generated)
├── briefings.json     # Generated briefings (generated)
├── outputs/           # Output files (generated)
├── PLAN.md            # Implementation plan
├── PROGRESS.md        # Development progress
└── README.md          # This file
```

### Data Flow

```
Calendar (accli)
    ↓
fetch.js → meetings.json
    ↓
aggregate.js → context.json (emails + notes + actions)
    ↓
brief.js → briefings.json (AI summary)
    ↓
deliver.js → Telegram / Reminder / Obsidian / File
```

---

## 🔧 Configuration

### Prerequisites

- **macOS** with Apple Calendar app
- **accli** skill installed (for calendar access)
- **Apple Mail** (optional, for email context)
- **Obsidian vault** (optional, for project notes)
- **Telegram** (optional, for notifications)

### Cron Setup (Auto-Run)

Add to your crontab for proactive briefings:

```bash
# Run every hour, generate briefings for meetings in next 2h
0 * * * * cd /Users/melf/GitMelflin/skills/meeting-prep && node index.js --calendar "Kalender" --hours 2 --channels telegram >> /tmp/meeting-prep.log 2>&1
```

Or use the built-in scheduler:

```bash
node index.js --schedule
```

---

## 📝 Example Briefing

```
📅 MEETING BRIEFING
━━━━━━━━━━━━━━━━━━━━

🏷️  Weekly Team Sync
📍 Zoom (link in calendar)
🕐 Today at 14:00 (in 2 hours)

👥 Attendees:
   - Stefan (you)
   - Sandra
   - Team members

📝 Agenda:
   - Project status update
   - Blockers discussion
   - Next sprint planning

📚 Context:
   - Last meeting (Jan 15): Completed Q4 review, started planning
   - Action items:
     • Stefan to send budget proposal ✓ Done
     • Sandra to review timeline
   - Related email thread: "Q1 Planning - Budget Questions"

💡 Suggested talking points:
   - Follow up on budget proposal feedback
   - Ask Sandra about timeline review status
   - Confirm sprint start date

⏰ Generated: 2h before meeting
```

---

## 🛠️ Development

### Run Individual Components

```bash
# Step 1: Fetch calendar
node fetch.js --calendar "Kalender" --from 2026-01-18 --to 2026-01-19

# Step 2: Aggregate context
node aggregate.js --prompt

# Step 3: Generate briefing
node brief.js --telegram

# Step 4: Deliver
node deliver.js --all --dry-run
```

### Test Suite

```bash
# Full pipeline test
npm test

# Individual component tests
node fetch.js --dry-run
node aggregate.js --dry-run
node brief.js --dry-run
node deliver.js --dry-run
```

---

## 📦 Publishing

### GitHub Release

```bash
# Create tag
git tag -a v1.0.0 -m "Meeting Prep Assistant v1.0.0"
git push origin v1.0.0

# Create GitHub release via GitHub CLI
gh release create v1.0.0 --title "Meeting Prep Assistant v1.0.0" --notes "Initial release" ./dist/*
```

### Submit to ClawdHub

```bash
# Navigate to skill directory
cd /Users/melf/GitMelflin/skills/meeting-prep

# Publish to ClawdHub
clawdhub publish
```

---

## 🐛 Troubleshooting

### No meetings found
- Check calendar name: `node fetch.js --list-calendars`
- Verify calendar has upcoming events
- Check date range: `--from` and `--to` flags

### No context found
- Email search requires Apple Mail access
- Obsidian notes require vault path in config
- Partial briefings work with limited context

### Delivery failures
- Telegram: Verify bot token and chat ID
- Reminders: Verify `remindctl` is working
- Check `--dry-run` output for errors

### AI generation fails
- Fallback to template-based briefing
- Check API keys and rate limits
- Retry with `--now` flag

---

## 📈 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Briefing generation time | <30s | ~15s |
| Context accuracy | >80% | TBD |
| Delivery success rate | >95% | TBD |
| User satisfaction | >4/5 | TBD |

---

## 🔄 Roadmap

- [ ] Multi-calendar support (work + personal)
- [ ] Recurring meeting pattern recognition
- [ ] Meeting transcription → summary
- [ ] Action item tracking across meetings
- [ ] Slack/Teams integration

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 👤 Author

**Melflin** - Wizard Assistant for Stefan

- GitHub: @melflin
- Built with ❤️ for better meeting prep

---

**Last Updated:** 2026-01-18  
**Version:** 1.0.0
