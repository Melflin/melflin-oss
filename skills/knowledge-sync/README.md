# Knowledge Sync 📚🔄

**Status:** 🔨 Building (MVP)  
**Started:** 2026-01-18  
**Target:** Feb 1, 2026

Sync your reading/audiobook consumption to Obsidian for better retention and search.

---

## 🎯 Problem

You read books and listen to audiobooks, but:
- Insights get lost after finishing
- No searchable record of key takeaways
- Highlights scattered across apps (Audible, Kindle, etc.)

---

## 💡 Solution

Simple Obsidian-based workflow:
1. **Quick Add** - Create book notes in seconds
2. **Reflect** - Weekly review prompts
3. **Track** - See all consumed books in one place

---

## 📦 Installation

```bash
# Clone the repo
cd ~/GitMelflin/skills/knowledge-sync

# Make scripts executable
chmod +x *.js
```

---

## 🚀 Usage

### Add a New Book
```bash
# Basic usage
node index.js add --title "Book Title" --author "Author Name"

# Full options
node index.js add \
  --title "Atomic Habits" \
  --author "James Clear" \
  --format audiobook \
  --tags "productivity,habits,psychology"
```

### Review Recent Reading
```bash
# Show books from last 30 days
node index.js review

# Custom time period
node index.js review 7   # Last 7 days
```

### List All Books
```bash
# Show all synced books
node index.js list
```

---

## 📁 Output

Books are saved to:
```
{OBSIDIAN_VAULT}/03 Ressources/Bücher/{Book_Title}.md
```

Example vault path:
```
/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher/
```

---

## 📝 Template Format

Each book note includes:
- Frontmatter (title, author, dates, rating, tags)
- Key Takeaways section with quotes/reflections
- Personal Notes section
- Related Notes linking

---

## 🔧 Configuration

Set environment variable for your Obsidian vault:
```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/Obsidian/vault/03 Ressources/Bücher"
```

Or modify the default path in each `.js` file.

---

## 📋 Module Reference

| Module | Purpose |
|--------|---------|
| `index.js` | Unified CLI entry point |
| `fetch.js` | Create new book notes from template |
| `review.js` | Show recent books for reflection |
| `list.js` | List all synced books |
| `templates/book-note.md` | Obsidian note template |

---

## 🧪 Testing

```bash
# Dry run (preview without creating)
node fetch.js --title "Test" --author "Author" --dry-run

# Test list
node list.js

# Test review
node review.js
```

---

## 🎯 Success Criteria

- [x] Research Stefan's tools ✅
- [x] Create Obsidian template
- [x] Build `fetch.js` - Add book notes
- [ ] Build `review.js` - Weekly reflection
- [ ] Build `list.js` - Track all books
- [ ] Test with real Audible book
- [ ] Publish to GitHub

---

## 🔄 Future Enhancements

- [ ] Audible API integration (when available)
- [ ] Readwise sync (if Stefan starts using it)
- [ ] Auto-tagging based on content
- [ ] Daily cron reminder

---

## 📜 License

MIT

---

**Built by Melflin 🧙‍♂️** | Part of the [Melflin OSS](https://github.com/Melflin/melflin-oss) project
