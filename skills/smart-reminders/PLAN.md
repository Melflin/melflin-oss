# Smart Reminders Analyzer - Detailed Plan 🧠

**Priority:** #1 (Quick Win)  
**Timeline:** Week 1-2 (Jan 18 - Feb 1)  
**Status:** 📝 Planning

---

## 🎯 Problem Statement

**Current Situation:**
- Stefan has 114 reminders in Apple Reminders
- Many are unclear (e.g., "test", "asfeda")
- Many are outdated (old deadlines, completed tasks)
- Many are duplicates (5 reminders about Withings)
- Manual "Reminder Challenge" is slow (1 reminder per session)

**Pain Point:**
- Takes weeks to manually clean 114 reminders
- Hard to spot patterns across all reminders
- Unclear reminders waste mental energy

---

## 💡 Solution: Bulk AI Analysis

**What it does:**
1. **Pull all reminders** (via `remindctl`)
2. **AI-powered categorization:**
   - ✅ **Clear & Actionable** (good as-is)
   - ⚠️ **Unclear** (too vague, needs clarification)
   - 🗑️ **Obsolete** (outdated deadlines, already done)
   - 🔄 **Duplicate** (multiple reminders for same thing)
3. **Auto-suggestions:**
   - Delete all unclear/obsolete reminders?
   - Merge duplicates into one concrete reminder?
   - Clarify vague reminders with AI-generated alternatives?
4. **Bulk actions:** Apply changes in one go (not one-by-one)

---

## 🏗️ Architecture

### **Components:**

1. **Reminder Fetcher** (`fetch.js`)
   - Uses existing `remindctl` CLI
   - Outputs JSON: `[{id, title, list, dueDate, notes}]`

2. **AI Analyzer** (`analyze.js`)
   - Takes all reminders
   - Categorizes each (Clear/Unclear/Obsolete/Duplicate)
   - Generates suggestions (delete/merge/clarify)
   - Returns analysis report

3. **Action Executor** (`execute.js`)
   - Takes user-approved actions
   - Uses `remindctl` to delete/update/create reminders
   - Logs all changes

4. **CLI Interface** (`index.js`)
   - Interactive mode: Shows suggestions, asks for confirmation
   - Batch mode: Apply all "safe" actions (e.g., delete obvious obsolete)

### **Data Flow:**

```
remindctl → fetch.js → analyze.js → CLI → execute.js → remindctl
             (JSON)      (Report)    (User)   (Actions)
```

---

## 🧪 Analysis Algorithm

### **Categorization Logic:**

**Unclear:**
- Title is gibberish (e.g., "asfeda", "asdf")
- Title is too short & vague (e.g., "test", "check")
- No context (no notes, no due date)
- Confidence: AI checks if title is actionable

**Obsolete:**
- Due date in past (>30 days ago)
- Title suggests completion (e.g., "buy X" but notes say "done")
- Reference to old events (e.g., "Meeting Q3 2025" in 2026)

**Duplicate:**
- Multiple reminders with similar titles
- Same topic mentioned (e.g., 5 reminders about "Withings")
- AI groups by semantic similarity

**Clear:**
- Has actionable title
- Has due date or list
- Not duplicate/obsolete/unclear

---

## 📋 Example Output

```
🧠 Smart Reminders Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
  Total: 114 reminders
  ✅ Clear: 67 (59%)
  ⚠️  Unclear: 23 (20%)
  🗑️ Obsolete: 18 (16%)
  🔄 Duplicates: 6 groups (13 reminders)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Unclear Reminders (23):
  1. "test" → Delete?
  2. "asfeda" → Delete?
  3. "check later" → Clarify to: "Check something specific"?
  ...

🗑️ Obsolete Reminders (18):
  1. "Meeting Q3 2025" (Due: 2025-09-15) → Delete?
  2. "Buy milk" (Notes: "done yesterday") → Delete?
  ...

🔄 Duplicate Groups (6):
  Group 1: Withings (5 reminders)
    - "Withings setup"
    - "Install Withings"
    - "Withings app"
    - "Withings skill"
    - "Check Withings integration"
    → Merge to: "Set up Withings integration (skill + app)"?
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recommended Actions:
  - Delete 41 reminders (23 unclear + 18 obsolete)
  - Merge 13 reminders → 6 clear reminders
  - Result: 114 → 66 reminders (42% reduction)

Apply all? [y/n]
```

---

## 🛠️ Implementation Plan

### **Day 1: Setup & Fetch**
- [ ] Create skill folder structure
- [ ] Test `remindctl` API (list, get details)
- [ ] Build `fetch.js` (pull all reminders to JSON)
- [ ] Test with Stefan's 114 reminders

### **Day 2: AI Analysis**
- [ ] Build categorization prompts (Clear/Unclear/Obsolete/Duplicate)
- [ ] Implement `analyze.js` (batch AI calls)
- [ ] Test categorization accuracy (manually check 20 reminders)

### **Day 3: Suggestions & Actions**
- [ ] Build suggestion generator (delete/merge/clarify)
- [ ] Implement `execute.js` (apply actions via remindctl)
- [ ] Add safety checks (no accidental deletes)

### **Day 4: CLI Interface**
- [ ] Build interactive CLI (show report, ask confirmation)
- [ ] Add batch mode (auto-apply safe actions)
- [ ] Add dry-run mode (show what would happen)

### **Day 5: Testing with Real Data**
- [ ] Run full analysis on Stefan's 114 reminders
- [ ] Review suggestions (are they accurate?)
- [ ] Apply actions (with Stefan's approval)
- [ ] Measure results (before/after reminder count)

### **Day 6-7: Polish & Publish**
- [ ] Write comprehensive README
- [ ] Add error handling (API failures, edge cases)
- [ ] Create examples (screenshots, sample output)
- [ ] Publish to GitHub
- [ ] Submit to ClawdHub

---

## ✅ Success Criteria

**Must Have:**
- Analyzes all reminders in <60 seconds
- Categorization accuracy >90% (manually verified)
- No false positives (doesn't suggest deleting important reminders)
- Stefan's reminders reduced by >30% (114 → <80)

**Nice to Have:**
- Merge suggestions are smart (actually related reminders)
- Clarification suggestions are helpful (better than originals)
- Works with other reminder lists (not just Stefan's)

---

## 🚧 Risks & Mitigations

**Risk 1: AI mis-categorizes important reminders**  
*Mitigation:* Always show suggestions before applying. Add "undo" feature.

**Risk 2: Duplicate detection is too aggressive**  
*Mitigation:* Use conservative similarity threshold. Show all grouped reminders for review.

**Risk 3: remindctl API limitations**  
*Mitigation:* Test edge cases early. Fallback to manual if API fails.

---

## 📚 Dependencies

- **remindctl:** Apple Reminders CLI (already installed)
- **AI Model:** Claude/Minimax for analysis
- **Node.js:** For CLI tool

---

## 🔄 Future Iterations (v2)

- Scheduled auto-cleanup (weekly reminder health check)
- Learning from user choices (remember what Stefan keeps/deletes)
- Integration with Reminder-Challenge system
- Export/import reminder backups

---

**Status:** Ready to start implementation  
**Next Step:** Day 1 - Setup & Fetch (build fetch.js)
