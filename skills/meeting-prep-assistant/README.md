# Meeting Prep Assistant 📅

**Auto-generated briefing for upcoming meetings**

## Usage

```bash
node index.js [--hours=24] [--format=brief|detailed|json]
```

## Features

- Fetch upcoming meetings from Apple Calendar
- Gather context (emails, notes, past meetings)
- Generate AI-powered briefing
- Proactive notifications (2h before meeting)

## Architecture

- `fetch.js` - Calendar integration
- `analyze.js` - Context aggregation  
- `execute.js` - Briefing generation
- `index.js` - CLI entrypoint
