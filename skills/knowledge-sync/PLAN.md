# Knowledge Sync - Plan 🔄

**Priority:** #3  
**Timeline:** Week 4-5 (Feb 9 - Feb 22)  
**Status:** 🔍 Research Needed

---

## 🎯 Problem

Stefan's knowledge is fragmented:
- **Audible highlights** → locked in Audible app
- **Kindle notes** → separate from other notes
- **Readwise** → (if used?) another silo
- **Web clips** → (Pocket? Instapaper?) somewhere else

Result: Can't search across all knowledge. Insights lost.

---

## 💡 Solution

**Unified Knowledge Base:**
- Auto-sync highlights/notes from all sources
- Store in one place (Obsidian? Notion? Memory files?)
- Searchable, taggable, connected
- Daily sync (cron job)

---

## 🔍 Research Questions (Week 4)

**1. What tools does Stefan actually use?**
- [ ] Readwise? (for highlight aggregation)
- [ ] Kindle? (has highlights?)
- [ ] Audible? (has bookmarks/clips?)
- [ ] Pocket? Instapaper? (web articles)
- [ ] Apple Books? (highlights)

**2. Where should synced knowledge go?**
- [ ] Obsidian? (markdown files)
- [ ] Notion? (database)
- [ ] Memory files? (memory/*.md)
- [ ] Custom format?

**3. What format for synced highlights?**
```markdown
# Book Title - Author

## Highlight 1 (Location: X, Date: Y)
> "Quote from book..."

**My Note:** Personal reflection...

## Highlight 2
> "Another quote..."
```

---

## 🏗️ Proposed Architecture

**Integrations (Pick 2-3 for MVP):**

1. **Readwise → Obsidian**
   - API: Readwise Export API
   - Sync: Daily cron
   - Format: Markdown files per book

2. **Kindle → Obsidian**
   - Source: `My Clippings.txt` file (exported from Kindle)
   - Parser: Extract highlights by book
   - Format: Same as Readwise

3. **Audible → Notes**
   - API: Audible has no official API 😞
   - Workaround: Manual export? Or skip for MVP?

4. **Pocket → Obsidian**
   - API: Pocket API (if Stefan uses it)
   - Sync: Saved articles → markdown

**Data Flow:**
```
[Readwise API] ────┐
[Kindle Export] ───┼──→ [Parser] ──→ [Formatter] ──→ [Obsidian/Notion]
[Pocket API] ──────┘         ↓
                      (Dedupe/Merge)
```

---

## 🛠️ Implementation Plan

### **Week 4: Research & Prototype**
**Day 1-2: Discovery**
- [ ] Survey Stefan's tools (what does he actually use?)
- [ ] Test APIs (Readwise, Pocket, etc.)
- [ ] Design sync schema (how to structure data?)

**Day 3-5: Build First Integration**
- [ ] Pick easiest integration (probably Readwise)
- [ ] Build syncer (API → Obsidian/Notion)
- [ ] Test with Stefan's data

### **Week 5: Add More Integrations**
**Day 1-3: Second Integration**
- [ ] Add Kindle or Pocket sync
- [ ] Test combined sync (dedupe logic)

**Day 4-5: Polish**
- [ ] Error handling (API failures, rate limits)
- [ ] Scheduling (daily cron)
- [ ] Notifications (new highlights synced)

**Day 6-7: Publish**
- [ ] README with setup instructions
- [ ] GitHub publish
- [ ] ClawdHub submission

---

## ✅ Success Criteria

**Must Have:**
- At least 2 integrations working (e.g., Readwise + Kindle)
- Auto-sync runs daily without errors
- Stefan's highlights centralized in one searchable place

**Nice to Have:**
- Deduplication (same highlight from multiple sources)
- Tagging/categorization (auto-tag by topic)
- Full-text search (if using Obsidian)

---

## 🚧 Challenges

**Challenge 1: No official Audible API**  
*Mitigation:* Skip Audible for MVP, or manual export workflow

**Challenge 2: Rate limits on APIs**  
*Mitigation:* Incremental sync (only new highlights), respect rate limits

**Challenge 3: Stefan doesn't use these tools**  
*Mitigation:* Research first, confirm what he actually uses

---

## 📚 Dependencies

**To Research:**
- Readwise API docs (if Stefan uses it)
- Kindle export format (`.txt` parsing)
- Pocket API (if used)
- Obsidian file structure (if target)

---

**Next:** Research phase starts Week 4 (Feb 9)  
**First Question:** What highlight/reading tools does Stefan use?
