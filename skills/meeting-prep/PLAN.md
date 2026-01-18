# Meeting Prep Assistant - Detailed Plan 📅

**Priority:** #2 (Week 3)  
**Timeline:** Feb 2 - Feb 8 (1 week)  
**Status:** 🚧 Planning

---

## 🎯 Problem Statement

**Current Situation:**
- Stefan has calendar entries but often joins meetings without context
- Past emails, previous meeting notes, and relevant documents are scattered
- "What was that project about?" happens mid-meeting
- No proactive briefing before meetings

**Pain Point:**
- Wasted time in first 5 minutes of meetings (re-orienting)
- Missing context from emails or past interactions
- Forgetting action items from previous meetings

---

## 💡 Solution: Auto-Briefing Generator

**What it does:**
1. **Pull upcoming meetings** (from calendar, 2h before)
2. **Gather context:**
   - Past meeting notes (from calendar notes)
   - Related emails (from calendar attendees/description)
   - Project notes (from Obsidian/Notion)
   - Action items from previous meetings
3. **Generate AI briefing:**
   - Meeting purpose & agenda
   - Key people involved
   - Relevant background
   - Previous action items
   - Suggested talking points
4. **Deliver via preferred channel:**
   - Telegram notification
   - Apple Reminders
   - Obsidian note

---

## 🏗️ Architecture

### **Components:**

1. **Calendar Fetcher** (`fetch.js`)
   - Uses Apple Calendar CLI (`cal` or AppleScript)
   - Pulls meetings for next 2-24 hours
   - Extracts: title, attendees, description, location, time

2. **Context Aggregator** (`aggregate.js`)
   - Search emails for meeting keywords (via m365 CLI or Apple Mail)
   - Pull past meeting notes (from calendar or Obsidian)
   - Find related project notes (from Obsidian vault)
   - Gather action items from previous meetings

3. **Briefing Generator** (`brief.js`)
   - AI-powered summary of all gathered context
   - Format: structured briefing (2-3 paragraphs)
   - Include: agenda, people, background, action items

4. **Deliverer** (`deliver.js`)
   - Send to Telegram
   - Create Apple Reminder
   - Create Obsidian note
   - All channels configurable

5. **Scheduler** (`schedule.js`)
   - Cron job to run 2h before meetings
   - Check calendar every hour
   - Trigger briefing if meeting < 2h away

### **Data Flow:**

```
Calendar (2h before meeting)
    ↓
Calendar Fetcher → Meeting details
    ↓
Context Aggregator → Emails + Past Notes + Action Items
    ↓
Briefing Generator → AI Summary
    ↓
Deliverer → Telegram / Reminder / Obsidian
```

---

## 📋 Example Output

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

📎 Attachments:
   - budget-proposal-v2.pdf (in email)
   - timeline-review.xlsx (shared drive)

⏰ Generated: 2h before meeting
```

---

## 🛠️ Implementation Plan

### **Day 1: Setup & Calendar Fetch**
- [ ] Create skill folder structure
- [ ] Test Apple Calendar access (`cal` or AppleScript)
- [ ] Build `fetch.js` to pull upcoming meetings
- [ ] Output format: JSON with meeting details

### **Day 2: Context Aggregation**
- [ ] Build `aggregate.js`
- [ ] Email search (m365 CLI or Apple ] Past meeting notes lookup
- [ Mail)
- [ ] Action items extraction

### **Day 3: Briefing Generator**
- [ ] Build `brief.js`
- [ ] AI prompt for context summarization
- [ ] Format as structured briefing
- [ ] Test with real meeting data

### **Day 4: Delivery Channels**
- [ ] Build `deliver.js`
- [ ] Telegram integration
- [ ] Apple Reminder creation
- [ ] Obsidian note creation

### **Day 5: Scheduler & Polish**
- [ ] Build `schedule.js` (cron wrapper)
- [ ] Error handling (no meeting? no context?)
- [ ] Configuration (which channels? timing?)
- [ ] Testing with real meetings

### **Day 6-7: Polish & Publish**
- [ ] Comprehensive README
- [ ] Examples and screenshots
- [ ] Publish to GitHub
- [ ] Submit to ClawdHub

---

## ✅ Success Criteria

**Must Have:**
- Fetches calendar for next 24h
- Generates briefing in <30 seconds
- Briefing accuracy >80% (relevant context)
- Delivers to at least one channel

**Nice to Have:**
- Multiple delivery channels (Telegram + Reminder)
- Proactive scheduling (auto-runs)
- Customizable briefing format

---

## 🚧 Risks & Mitigations

**Risk 1: No calendar access**
*Mitigation:* Use AppleScript fallback, require manual calendar permission

**Risk 2: No relevant context found**
*Mitigation:* Generate partial briefing with available info, flag "limited context"

**Risk 3: Meeting too soon (<2h)**
*Mitigation:* Run on-demand with `--now` flag, not just scheduled

**Risk 4: AI fails**
*Mitigation:* Fallback to simple template-based briefing

---

## 📚 Dependencies

- **Calendar:** Apple Calendar (via `cal` or AppleScript)
- **Emails:** m365 CLI or Apple Mail (if accessible)
- **Notes:** Obsidian vault (if path provided)
- **Delivery:** Telegram, Apple Reminders, or local file
- **AI:** Claude/Minimax for summarization

---

## 🔄 Future Iterations (v2)

- Multi-calendar support (work + personal)
- Recurring meeting pattern recognition
- Meeting transcription → summary
- Action item tracking across meetings
- Integration with Slack/Teams

---

**Status:** Ready to start  
**Next Step:** Day 1 - Setup & Calendar Fetch (build fetch.js)

---

**Created:** 2026-01-18  
**Updated:** 2026-01-18
