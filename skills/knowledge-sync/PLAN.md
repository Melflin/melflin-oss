# Knowledge Sync - Plan 🔄

**Priority:** #3  
**Timeline:** Week 1-2 (Jan 18 - Feb 1) - Early Start  
**Status:** 🔨 Building - Manual Workflow MVP

---

## 🎯 Problem

Stefan's knowledge is fragmented:
- ✅ **Audible** - Active user with extensive library
- ✅ **Obsidian** - Vault exists with minimal usage
- ❓ **Readwise/Kindle** - No evidence of usage
- ❓ **Pocket/Instapaper** - Not found

**Result:** No systematic highlight collection. Only 2 quote files in Obsidian from 2025.

---

## 💡 Solution (Revised)

**Simple Obsidian Workflow:**
1. **Quick Add** - CLI to create book notes from template
2. **Weekly Review** - Reminder to reflect on what was learned
3. **List/Track** - See all consumed books in one place

**Skip API integrations** for MVP - Stefan doesn't use Readwise/Kindle systematically.

---

## 📂 Module Structure

```
knowledge-sync/
├── index.js        # Unified CLI
├── fetch.js        # Add new book from template
├── review.js       # Show books from last 30 days
├── list.js         # List all synced books
├── templates/
│   └── book-note.md  # Obsidian template
└── README.md
```

---

## 🛠️ Usage

```bash
# Add a new book
node index.js add --title "Atomic Habits" --author "James Clear" --tags "productivity,habits"

# Review last 30 days
node index.js review

# List all books
node index.js list
```

---

## 📦 Dependencies

- Node.js 18+
- Obsidian vault at configured path

---

**Status:** Ready for testing ✅
