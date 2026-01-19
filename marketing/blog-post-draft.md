# How I Built 4 Productivity CLI Skills in 2 Weeks

**Published:** January 19, 2026  
**Author:** Stefan M.  
**Project:** [Melflin OSS Skills](https://github.com/Melflin/melflin-oss)

---

## The Challenge

Like most knowledge workers, I was drowning in digital chaos:
- **683 Apple Reminders** (most outdated)
- **Meeting prep** took 15+ minutes per call
- **Knowledge scattered** across Audible, Kindle, and notes
- **Podcasts consumed** but insights lost

I decided to build my way out. Here's how I created 4 CLI productivity tools that saved me hours per week.

---

## The 2-Week Sprint

### Week 1: Smart Reminders Analyzer 🧠

**The Problem:** 683 reminders, 122 active, most irrelevant.

**The Solution:**
```bash
# Analyze all reminders with AI
smart-reminders analyze

# Output: 119 Clear (98%), 2 Unclear, 1 Duplicate
# Recommendation: Archive 561 obsolete reminders
```

**Tech Stack:**
- `remindctl` CLI for Apple Reminders access
- OpenAI API for natural language analysis
- AppleScript fallback for reliability
- Safety-first workflow (backup → move → review → delete)

**Impact:** Reduced active reminders from 122 → 30 in first run.

**GitHub:** https://github.com/Melflin/melflin-oss/tree/master/skills/smart-reminders

### Week 2: Meeting Prep Assistant 📅

**The Problem:** 15 minutes per meeting gathering context.

**The Solution:**
```bash
# Auto-generate briefing for next meeting
meeting-prep next

# Finds meeting, pulls related emails, creates AI summary
# Proactive cron: 2 hours before each meeting
```

**Tech Stack:**
- `accli` for Apple Calendar integration
- SQLite search through Apple Mail (50ms)
- MiniMax API for intelligent summaries
- Cron integration for proactive briefings

**Impact:** Meeting prep time: 15min → 2min.

**GitHub:** https://github.com/Melflin/melflin-oss/tree/master/skills/meeting-prep-assistant

### Week 3: Knowledge Sync 🔄

**The Problem:** Highlights from books/audiobooks lost in silos.

**The Solution:**
```bash
# Manual workflow → centralized Obsidian
knowledge-sync add "Book Title" "Author" "Key insight here"

# Weekly review of all captured knowledge
knowledge-sync review --this-week
```

**Tech Stack:**
- Manual input workflow (pragmatic approach)
- Obsidian integration via file system
- Template system for consistent formatting
- Weekly review scripts

**Impact:** All book insights now searchable and connected.

**GitHub:** https://github.com/Melflin/melflin-oss/tree/master/skills/knowledge-sync

### Week 4: Podcast → Notes 🎧

**The Problem:** Consuming podcasts but losing key insights.

**The Solution:**
```bash
# YouTube URL → Obsidian note with insights
podcast-notes "https://youtube.com/watch?v=..."

# Automatic: Download → Transcribe → AI Summary → Auto-tag
```

**Tech Stack:**
- `yt-dlp` for podcast/video download
- Whisper CLI for local transcription
- MiniMax API for intelligent summaries
- Auto-tagging with 10 topic categories

**Impact:** Zero-friction podcast insight capture.

**GitHub:** https://github.com/Melflin/melflin-oss/tree/master/skills/podcast-notes

---

## Key Learnings

### 1. **Start with Pain Points**
Each skill solved a real, daily frustration. No features for features' sake.

### 2. **Pragmatic Tech Choices**
- CLI over GUI (faster to build, more automatable)
- Existing tools integration (don't reinvent)
- Local-first where possible (privacy, speed)

### 3. **Safety-First Workflows**
- Always backup before destructive operations
- Dry-run modes for testing
- Easy restore mechanisms

### 4. **Focus on Time-to-Value**
- Each skill saves 5-15 minutes per use
- Proactive automation (cron jobs)
- Compound effect: hours saved per week

---

## Technical Architecture

All skills follow a consistent pattern:

```
skill/
├── fetch.js     # Get data from source
├── analyze.js   # Process with AI
├── execute.js   # Apply changes
├── index.js     # CLI interface
└── README.md    # Documentation
```

**Benefits:**
- Predictable structure for maintenance
- Easy to extend and modify
- Consistent CLI experience

---

## What's Next?

### Phase 2: Community Building
- **Goal:** 50+ GitHub stars, 5+ external users
- **Focus:** Documentation, demos, user feedback

### Phase 3: Advanced Features
Based on user feedback:
- Web interfaces for non-CLI users
- Integration with more tools (Notion, Slack, etc.)
- Mobile companion apps

---

## Try It Yourself

All 4 skills are open source and ready to use:

**Repository:** https://github.com/Melflin/melflin-oss

**Installation:** Each skill includes detailed setup instructions.

**Requirements:** macOS (for Apple integrations), Node.js

**Cost:** Free + your own API keys (OpenAI ~$2/month for my usage)

---

## The Real Win

It's not just about the tools—it's about **reclaiming cognitive bandwidth**.

When mundane tasks are automated, you can focus on what matters: creative work, meaningful conversations, and strategic thinking.

**Time saved per week:** ~3 hours  
**Mental overhead reduced:** Immeasurable  
**Satisfaction from building solutions:** Priceless  

---

*Have similar productivity pain points? Consider building your own solutions. The satisfaction of using tools you created yourself is unmatched.*

**Follow the project:** [GitHub](https://github.com/Melflin/melflin-oss) | [Twitter](https://twitter.com/yourusername)